import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// --- RUTAS GET (Para obtener los precios) ---

// Opción 1: Ruta raíz (http://localhost:5000/api/membresias)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('membresias')
            .select('*')
            .order('precio', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Error cargando membresias:", err.message);
        res.status(500).json({ error: "Error al cargar planes" });
    }
});

// Opción 2: Ruta específica (http://localhost:5000/api/membresias/planes)
// IMPORTANTE: Tu frontend parece estar usando esta ruta, por eso te daba error 404 al quitarla.
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

// --- RUTAS POST (Pagos y Gestión) ---

// Procesar Pago
router.post('/procesar', async (req, res) => {
    const { id_usuario, id_plan } = req.body;
    
    console.log(`[PAGO] Iniciando proceso para Usuario: ${id_usuario}, Plan ID: ${id_plan}`);

    try {
        // 1. Verificar plan
        const { data: plan, error: errorPlan } = await supabase
            .from('membresias')
            .select('nombre')
            .eq('id', id_plan)
            .single();

        if (errorPlan || !plan) {
            return res.status(404).json({ error: "El plan seleccionado no existe." });
        }

        // 2. Calcular fecha fin
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1);
        const fechaFinString = fechaFin.toISOString().split('T')[0];

        // 3. Actualizar usuario
        const { error: updateError } = await supabase
            .from('usuarios')
            .update({
                membresia_tipo: plan.nombre,
                membresia_fin: fechaFinString,
                estado_suscripcion: 'activa'
            })
            .eq('id_usuario', id_usuario);

        if (updateError) throw updateError;

        res.json({ message: "Pago exitoso", success: true });

    } catch (error) {
        console.error("[PAGO FATAL]", error);
        res.status(500).json({ error: error.message });
    }
});

// Gestionar (Cancelar/Pausar)
router.post('/gestionar', async (req, res) => {
    const { id_usuario, accion } = req.body;
    try {
        const estado = accion === 'cancelar' ? 'cancelada' : 'pausada';
        
        const updates = { estado_suscripcion: estado };
        
        // Si cancela, lo pasamos a "Sin Membresía"
        if (accion === 'cancelar') {
             updates.membresia_tipo = 'Sin Membresía'; 
             updates.membresia_fin = null;
        }

        const { error } = await supabase
            .from('usuarios')
            .update(updates)
            .eq('id_usuario', id_usuario);
        
        if (error) throw error;
        res.json({ message: `Suscripción ${estado}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;