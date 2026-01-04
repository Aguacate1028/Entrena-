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
// GET: Obtener planes (Para mostrarlos en el frontend)
router.get('/planes', async (req, res) => {
    const { data, error } = await supabase.from('membresias').select('*').order('precio', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST: Procesar Pago
router.post('/procesar', async (req, res) => {
    const { id_usuario, id_plan } = req.body;
    
    console.log(`[PAGO] Iniciando proceso para Usuario: ${id_usuario}, Plan ID: ${id_plan}`);

    try {
        // 1. Obtener detalles del plan seleccionado
        const { data: plan, error: errorPlan } = await supabase
            .from('membresias')
            .select('nombre')
            .eq('id', id_plan)
            .single();

        if (errorPlan || !plan) {
            console.error("[PAGO ERROR] No se encontró el plan:", errorPlan);
            return res.status(404).json({ error: "El plan seleccionado no existe." });
        }

        console.log(`[PAGO] Plan encontrado: ${plan.nombre}`);

        // 2. Calcular fecha de fin (1 mes después)
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1);
        const fechaFinString = fechaFin.toISOString().split('T')[0];

        // 3. Actualizar usuario
        const { data: updateData, error: updateError } = await supabase
            .from('usuarios')
            .update({
                membresia_tipo: plan.nombre,
                membresia_fin: fechaFinString,
                estado_suscripcion: 'activa'
            })
            .eq('id_usuario', id_usuario)
            .select();

        if (updateError) {
            console.error("[PAGO ERROR] Falló la actualización de usuario:", updateError);
            throw updateError;
        }

        console.log("[PAGO] Usuario actualizado exitosamente:", updateData);
        res.json({ message: "Pago exitoso", success: true });

    } catch (error) {
        console.error("[PAGO FATAL]", error);
        res.status(500).json({ error: error.message });
    }
});

// POST: Gestionar (Cancelar/Pausar)
router.post('/gestionar', async (req, res) => {
    const { id_usuario, accion } = req.body;
    try {
        const estado = accion === 'cancelar' ? 'cancelada' : 'pausada';
        
        // Si cancela, quitamos el tipo de membresía, si pausa, lo mantenemos pero cambiamos estado
        const updates = { estado_suscripcion: estado };
        if (accion === 'cancelar') {
             updates.membresia_tipo = 'Gratis';
        }

        const { error } = await supabase.from('usuarios').update(updates).eq('id_usuario', id_usuario);
        
        if (error) throw error;
        res.json({ message: `Suscripción ${estado}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;