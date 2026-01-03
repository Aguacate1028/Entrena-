import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('clases')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Error obteniendo clases:", err.message);
        res.status(500).json({ error: "Error al cargar las clases" });
    }
});

export default router;