import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

router.post('/registrar', async (req, res) => {
    const { id_usuario } = req.body;
    
    // Log para depuración en tu terminal de Node
    console.log("ID recibido en Backend:", id_usuario);

    try {
        if (!id_usuario) {
            return res.status(400).json({ success: false, message: "ID requerido" });
        }

        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('nombre, membresia_tipo, membresia_fin, estado_suscripcion, foto_perfil')
            .eq('id_usuario', id_usuario)
            .single();

        if (error || !usuario) {
            return res.status(404).json({ success: false, message: "Socio no encontrado" });
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Normalizamos hoy a medianoche
        
        const fechaFin = new Date(usuario.membresia_fin);
        
        let acceso = 'Acceso Permitido';
        let causa = '';

        // Validaciones de acceso
        if (usuario.estado_suscripcion !== 'activa') {
            acceso = 'Acceso Denegado';
            causa = 'Suscripción Inactiva';
        } else if (fechaFin < hoy) {
            acceso = 'Acceso Denegado';
            causa = 'Membresía Vencida';
        }

        // Registro en la tabla de asistencias
        await supabase.from('asistencias').insert([{
            id_usuario: id_usuario,
            estado: acceso,
            metodo: 'QR',
            fecha_hora: new Date().toISOString()
        }]);

        if (acceso === 'Acceso Permitido') {
            return res.json({ success: true, usuario });
        } else {
            return res.status(403).json({ success: false, message: causa, usuario });
        }
    } catch (err) {
        console.error("Error en server:", err);
        res.status(500).json({ success: false, message: "Error de servidor" });
    }
});

export default router;