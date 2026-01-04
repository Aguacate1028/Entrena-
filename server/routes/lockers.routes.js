import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// RENTAR LOCKER
router.post('/rentar', async (req, res) => {
    const { id_usuario, meses } = req.body; // meses: 1, 3, 6, 12

    try {
        // Calcular fecha de vencimiento
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + parseInt(meses));

        // Asignar un número de locker al azar (1 al 100)
        // En un sistema real, buscarías uno disponible en una tabla 'lockers'
        const lockerNumero = Math.floor(Math.random() * 100) + 1;

        const { error } = await supabase.from('usuarios').update({
            locker_activo: true,
            locker_fin: fechaFin,
            locker_id: lockerNumero
        }).eq('id_usuario', id_usuario);

        if (error) throw error;

        res.json({ success: true, locker_id: lockerNumero, vencimiento: fechaFin });
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