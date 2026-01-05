import { Router } from 'express';
import { supabase } from '../supabase.js'; 

const router = Router();

// ==========================================
// RUTAS PARA EL USUARIO (APP)
// ==========================================

// 1. CREAR REPORTE
router.post('/', async (req, res) => {
    const { id_usuario, categoria, descripcion, prioridad } = req.body;
    try {
        const { data, error } = await supabase
            .from('reportes')
            .insert([{ id_usuario, categoria, descripcion, prioridad }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. OBTENER MIS REPORTES (Historial del usuario)
// IMPORTANTE: Le cambié la ruta a '/usuario/:id' para que sea específica
router.get('/usuario/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const { data, error } = await supabase
            .from('reportes')
            .select('*')
            .eq('id_usuario', id_usuario)
            .order('fecha_creacion', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ==========================================
// RUTAS PARA EL STAFF (PANEL WEB) - ¡ESTAS FALTABAN!
// ==========================================

// 3. OBTENER TODOS LOS REPORTES (Para que el Staff vea la lista)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reportes')
            .select('*')
            .order('fecha_creacion', { ascending: false }); // Ordenar por fecha

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. RESPONDER REPORTE (Staff)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { respuesta_admin } = req.body; // Recibimos la respuesta del admin

    try {
        const { data, error } = await supabase
            .from('reportes')
            .update({ 
                estado: 'Resuelto', 
                respuesta_admin: respuesta_admin 
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        // Opcional: Crear notificación al usuario de que le respondieron
        if(data && data.length > 0) {
             await supabase.from('notificaciones').insert({
                id_usuario: data[0].id_usuario,
                titulo: 'Reporte Actualizado',
                mensaje: `El staff respondió a tu reporte de ${data[0].categoria}.`,
                tipo: 'success',
                leido: false
            });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. ELIMINAR REPORTE (Staff)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('reportes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: "Reporte eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;