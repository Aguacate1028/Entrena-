import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// RENTAR LOCKER
const PRECIO_LOCKER_MENSUAL = 150; // Consistencia con usuarios.routes.js

router.post('/rentar', async (req, res) => {
    const { id_usuario, meses } = req.body;
    try {
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + parseInt(meses));
        const lockerNumero = Math.floor(Math.random() * 100) + 1;

        // Actualizar usuario
        await supabase.from('usuarios').update({
            locker_activo: true,
            locker_fin: fechaFin,
            locker_id: lockerNumero
        }).eq('id_usuario', id_usuario);

        // REGISTRAR PAGO DEL LOCKER
        await supabase.from('pagos').insert([{
            id_usuario: id_usuario,
            monto: PRECIO_LOCKER_MENSUAL * parseInt(meses),
            concepto: `Renta Locker #${lockerNumero} (${meses} mes/es)`,
            fecha: new Date()
        }]);

        res.json({ success: true, locker_id: lockerNumero });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CANCELAR LOCKER
router.post('/cancelar', async (req, res) => {
    const { id_usuario } = req.body;
    try {
        const { error } = await supabase.from('usuarios').update({
            locker_activo: false,
            locker_fin: null,
            locker_id: null
        }).eq('id_usuario', id_usuario);

        if (error) throw error;
        res.json({ success: true, message: "Locker liberado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;