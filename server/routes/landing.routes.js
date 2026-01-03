import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

router.get('/stats', async (req, res) => {
    try {
        // 1. Contar usuarios registrados (Miembros Activos)
        const { count: totalUsuarios, error: errorUsers } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true });

        // 2. Contar clases disponibles (Clases Semanales)
        const { count: totalClases, error: errorClases } = await supabase
            .from('clases')
            .select('*', { count: 'exact', head: true });

        if (errorUsers || errorClases) throw new Error("Error consultando BD");

        res.json({
            miembros: totalUsuarios || 0,
            clases: totalClases || 0,
            acceso: "24/7", 
            satisfaccion: "98%" 
        });

    } catch (err) {
        console.error("Error stats landing:", err.message);
        res.status(500).json({ error: "Error al obtener estadísticas" });
    }
});

export default router;