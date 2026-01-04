import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

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
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. OBTENER MIS REPORTES
router.get('/:id_usuario', async (req, res) => {
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

export default router;