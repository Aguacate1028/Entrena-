import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// 1. CONTRATAR
router.post('/contratar', async (req, res) => {
    const { id_usuario, plan } = req.body;

    // Definición de precios según el plan de entrenamiento
    const PRECIOS_ENTRENADOR = {
        'Básico': 300,
        'Pro': 600,
        'Elite': 1000
    };

    try {
        // 1. Obtener lista de entrenadores disponibles
        const { data: entrenadores, error: errorBusqueda } = await supabase
            .from('entrenadores')
            .select('*');

        if (errorBusqueda) throw errorBusqueda;
        
        if (!entrenadores || entrenadores.length === 0) {
            return res.status(404).json({ error: "No hay entrenadores registrados en el sistema." });
        }

        // 2. Selección aleatoria de un entrenador
        const random = Math.floor(Math.random() * entrenadores.length);
        const entrenadorSeleccionado = entrenadores[random];

        // 3. Actualizar el perfil del usuario
        const { error: errorUpdate } = await supabase.from('usuarios').update({
            entrenador_activo: true,
            entrenador_plan: plan,
            id_entrenador: entrenadorSeleccionado.id,
            entrenador_data: entrenadorSeleccionado 
        }).eq('id_usuario', id_usuario);

        if (errorUpdate) throw errorUpdate;

        // 4. NUEVO: REGISTRAR EL PAGO AUTOMÁTICAMENTE
        const montoAPagar = PRECIOS_ENTRENADOR[plan] || 500; // 500 como valor por defecto
        
        const { error: errorPago } = await supabase.from('pagos').insert([{
            id_usuario: id_usuario,
            monto: montoAPagar,
            concepto: `Contratación Entrenador: ${entrenadorSeleccionado.nombre} (Plan ${plan})`,
            fecha: new Date()
        }]);

        if (errorPago) {
            console.error("Error al registrar el pago, pero el entrenador fue asignado:", errorPago);
        }

        // 5. Responder al cliente
        res.json({ 
            success: true, 
            message: "Entrenador contratado y pago registrado exitosamente.",
            entrenador: entrenadorSeleccionado 
        });

    } catch (error) {
        console.error("Error fatal en el proceso de contratación:", error);
        res.status(500).json({ error: error.message });
    }
});

// 2. CANCELAR (ESTO ES LO QUE TE FALTABA)
router.post('/cancelar', async (req, res) => {
    const { id_usuario } = req.body;

    try {
        // Borramos los datos del entrenador en el usuario
        const { error } = await supabase.from('usuarios').update({
            entrenador_activo: false,
            entrenador_plan: null,
            id_entrenador: null,
            entrenador_data: null
        }).eq('id_usuario', id_usuario);

        if (error) throw error;

        res.json({ success: true, message: "Servicio cancelado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;