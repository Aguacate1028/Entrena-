import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// REGISTRAR ASISTENCIA (SCANEADO)
router.post('/registrar', async (req, res) => {
    const { id_usuario } = req.body;

    try {
        // VALIDACIÓN DE SEGURIDAD: Asegurar que el ID sea un número
        if (!id_usuario || isNaN(id_usuario)) {
             return res.status(400).json({ success: false, message: "Código QR inválido (Debe ser numérico)" });
        }

        // 1. Verificar si el usuario existe
        const { data: usuario, error: errorUser } = await supabase
            .from('usuarios')
            .select('nombre, membresia_tipo, membresia_fin, estado_suscripcion, foto_perfil')
            .eq('id_usuario', id_usuario)
            .single();

        if (errorUser || !usuario) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        // 2. Lógica de Fechas (CORREGIDA)
        const hoy = new Date();
        const finMembresia = new Date(usuario.membresia_fin);
        
        // Ajustamos ambas fechas a las 00:00:00 para comparar solo el día, sin importar la hora
        hoy.setHours(0,0,0,0);
        finMembresia.setHours(0,0,0,0);
        
        // Validación: Debe tener membresía activa Y la fecha debe ser hoy o futura
        let acceso = 'Acceso Permitido';
        let causa = '';

        if (usuario.estado_suscripcion !== 'activa') {
            acceso = 'Acceso Denegado';
            causa = 'Membresía Inactiva/Cancelada';
        } else if (finMembresia < hoy) { // Si la fecha fin es MENOR a hoy
            acceso = 'Acceso Denegado';
            causa = 'Membresía Vencida';
        }

        // 3. Registrar en la tabla asistencias
        const { error: errorInsert } = await supabase
            .from('asistencias')
            .insert([{
                id_usuario: parseInt(id_usuario), // Aseguramos que se guarde como entero
                estado: acceso,
                metodo: 'QR',
                fecha_hora: new Date() // Guardamos la hora exacta del acceso
            }]);

        if (errorInsert) throw errorInsert;

        // 4. Responder al Frontend
        if (acceso === 'Acceso Permitido') {
            res.json({ success: true, message: `Bienvenido, ${usuario.nombre}`, usuario });
        } else {
            // Enviamos error 403 pero con datos del usuario para mostrar quién falló
            res.status(403).json({ success: false, message: causa, usuario });
        }

    } catch (err) {
        console.error("Error asistencia:", err);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
});

// OBTENER HISTORIAL (Opcional)
router.get('/', async (req, res) => {
    const { data } = await supabase.from('asistencias').select('*, usuarios(nombre)').order('fecha_hora', { ascending: false });
    res.json(data);
});

export default router;