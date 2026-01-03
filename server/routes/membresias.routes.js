import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        // Ordenamos por precio para que aparezcan en orden lógico (barato -> caro)
        const { data, error } = await supabase
            .from('membresias')
            .select('*')
            .order('precio', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Error membresias:", err.message);
        res.status(500).json({ error: "Error al cargar membresías" });
    }
});

export default router;