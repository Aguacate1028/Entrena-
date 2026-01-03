import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

router.get('/stats', async (req, res) => {
    try {
        const { count: totalUsers } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true });

        const { data: pagos } = await supabase.from('pagos').select('monto');
        const ingresos = pagos?.reduce((acc, curr) => acc + Number(curr.monto), 0) || 0;

        res.json({
            success: true,
            stats: { miembros: totalUsers, ingresos: ingresos, asistenciaHoy: 0 }
        });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener estadísticas" });
    }
});

export default router;