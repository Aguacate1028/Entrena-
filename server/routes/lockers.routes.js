import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

router.post('/rentar', async (req, res) => {
    const { id_usuario, meses } = req.body;
    try {
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + parseInt(meses));
        const num = Math.floor(Math.random() * 100) + 1;

        await supabase.from('usuarios').update({
            locker_activo: true,
            locker_fin: fechaFin.toISOString(),
            locker_id: num
        }).eq('id_usuario', id_usuario);

        await supabase.from('pagos').insert([{
            id_usuario: id_usuario,
            monto: 150 * parseInt(meses),
            concepto: `Renta Locker #${num}`,
            fecha: new Date().toISOString()
        }]);

        res.json({ success: true, locker_id: num });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

export default router;