import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();


// 1. Obtener máquinas con conteo de personas en fila
router.get('/maquinas', async (req, res) => {
    try {
        const { data: maquinas, error: mError } = await supabase.from('maquinas').select('*');
        if (mError) throw mError;

        const { data: filas, error: fError } = await supabase
            .from('fila_maquinas')
            .select('*')
            .neq('estado', 'finalizado');
        if (fError) throw fError;

        const maquinasProcesadas = maquinas.map(m => {
            const filaActual = filas.filter(f => f.id_maquina === m.id);
            return {
                ...m,
                personasEnFila: filaActual.filter(f => f.estado === 'esperando').length,
                estaOcupada: filaActual.some(f => f.estado === 'usando'),
                usuarioActual: filaActual.find(f => f.estado === 'usando')?.id_usuario
            };
        });

        res.json(maquinasProcesadas);
    } catch (err) {
        console.error(err);
        res.status(500).json([]); // Devolver array vacío en error
    }
});

// 2. Obtener mi turno activo y calcular posición
router.get('/mi-turno/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { data: turno, error } = await supabase
            .from('fila_maquinas')
            .select('*, maquinas(nombre)')
            .eq('id_usuario', userId)
            .neq('estado', 'finalizado')
            .maybeSingle();

        if (!turno) return res.json(null);

        let miPosicion = 0;
        if (turno.estado === 'esperando') {
            const { count } = await supabase
                .from('fila_maquinas')
                .select('*', { count: 'exact', head: true })
                .eq('id_maquina', turno.id_maquina)
                .eq('estado', 'esperando')
                .lt('id', turno.id); // ID menor = llegó antes
            miPosicion = (count || 0) + 1;
        }

        res.json({
            ...turno,
            posicion: miPosicion,
            maquinaNombre: turno.maquinas?.nombre || 'Máquina'
        });
    } catch (err) {
        res.status(500).json(null);
    }
});

// 3. UNIRSE A LA FILA
router.post('/fila', async (req, res) => {
    const { id_maquina, id_usuario, estado } = req.body;
    try {
        const { error } = await supabase
            .from('fila_maquinas')
            .insert([{ id_maquina, id_usuario, estado, posicion: 0 }]);
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error al unirse a la fila" });
    }
});

// 4. FINALIZAR TURNO (Y pasar al siguiente)
router.post('/fila/finalizar', async (req, res) => {
    const { id_turno, id_maquina } = req.body;
    try {
        // A. Finalizar mi turno
        await supabase.from('fila_maquinas').update({ estado: 'finalizado' }).eq('id', id_turno);

        // B. Buscar al siguiente en la fila
        const { data: siguiente } = await supabase
            .from('fila_maquinas')
            .select('id')
            .eq('id_maquina', id_maquina)
            .eq('estado', 'esperando')
            .order('id', { ascending: true }) // El ID más bajo llegó primero
            .limit(1)
            .maybeSingle();

        // C. Si hay alguien, activar su turno
        if (siguiente) {
            await supabase.from('fila_maquinas').update({ estado: 'usando' }).eq('id', siguiente.id);
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error al finalizar turno" });
    }
});

// 5. ABANDONAR FILA (Cancelar)
router.delete('/fila/:id', async (req, res) => {
    try {
        await supabase.from('fila_maquinas').delete().eq('id', req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error al salir de la fila" });
    }
});

export default router;