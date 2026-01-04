import { Router } from 'express';
import { supabase } from '../supabase.js'; 

const router = Router();

// 1. OBTENER NOTIFICACIONES DE UN USUARIO
router.get('/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const { data, error } = await supabase
            .from('notificaciones')
            .select('*')
            .eq('id_usuario', idUsuario)
            .order('fecha_creacion', { ascending: false })
            .limit(20);

        if (error) throw error;
        res.json(data);

    } catch (err) {
        console.error("Error obteniendo notificaciones:", err.message);
        res.status(500).json({ error: "Error al cargar notificaciones" });
    }
});

// 2. MARCAR UNA NOTIFICACIÓN COMO LEÍDA
router.put('/:id/leida', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('notificaciones')
            .update({ leido: true })
            .eq('id', id)
            .select(); // .select() devuelve el registro actualizado

        if (error) throw error;
        res.json(data);

    } catch (err) {
        console.error("Error marcando leída:", err.message);
        res.status(500).json({ error: "Error al actualizar notificación" });
    }
});

// 3. MARCAR TODAS COMO LEÍDAS
router.put('/marcar-todas', async (req, res) => {
    const { idUsuario } = req.body;

    try {
        const { data, error } = await supabase
            .from('notificaciones')
            .update({ leido: true })
            .eq('id_usuario', idUsuario)
            .select();

        if (error) throw error;
        res.json({ message: "Todas marcadas como leídas", data });

    } catch (err) {
        console.error("Error marcando todas:", err.message);
        res.status(500).json({ error: "Error al actualizar todas" });
    }
});

export default router;