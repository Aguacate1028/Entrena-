import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// Obtener todas las máquinas
router.get('/maquinas', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('maquinas')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;