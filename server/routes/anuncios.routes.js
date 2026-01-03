import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

router.get('/', async (req, res) => { 
    try {
        const { data, error } = await supabase
            .from('anuncios')
            .select('*')
            .eq('activo', true)
            .order('fecha', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Error anuncios:", err.message);
        res.status(500).json({ error: "Error al cargar anuncios" });
    }
});

export default router;