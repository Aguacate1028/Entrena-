import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// El frontend busca /api/membresias/planes
router.get('/planes', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('membresias')
            .select('*')
            .order('precio', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/procesar', async (req, res) => {
    const { id_usuario, id_plan } = req.body;
    try {
        const { data: plan } = await supabase.from('membresias').select('nombre, precio').eq('id', id_plan).single();
        if (!plan) return res.status(404).json({ error: "Plan no encontrado" });

        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1);
        
        await supabase.from('usuarios').update({
            membresia_tipo: plan.nombre,
            membresia_fin: fechaFin.toISOString().split('T')[0],
            estado_suscripcion: 'activa'
        }).eq('id_usuario', id_usuario);

        await supabase.from('pagos').insert([{
            id_usuario: id_usuario,
            monto: plan.precio,
            concepto: `Compra membresía: ${plan.nombre}`,
            fecha: new Date().toISOString()
        }]);

        res.json({ message: "Pago registrado", success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/gestionar', async (req, res) => {
    const { id_usuario, accion } = req.body;
    try {
        const estado = accion === 'cancelar' ? 'cancelada' : 'pausada';
        const updates = { estado_suscripcion: estado };
        if (accion === 'cancelar') {
            updates.membresia_tipo = 'Sin Membresía'; 
            updates.membresia_fin = null;
        }
        await supabase.from('usuarios').update(updates).eq('id_usuario', id_usuario);
        res.json({ message: `Suscripción ${estado}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;