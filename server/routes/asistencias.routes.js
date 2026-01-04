import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// REGISTRAR ASISTENCIA (SCANEADO)
router.post('/registrar', async (req, res) => {
    const { id_usuario } = req.body;

    try {
        // 1. Verificar si el usuario existe y tiene membresía activa
        const { data: usuario, error: errorUser } = await supabase
            .from('usuarios')
            .select('nombre, membresia_tipo, membresia_fin')
            .eq('id_usuario', id_usuario)
            .single();

        if (errorUser || !usuario) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        // 2. Validar si la membresía venció
        const hoy = new Date();
        const finMembresia = new Date(usuario.membresia_fin);
        const acceso = finMembresia >= hoy ? 'Acceso Permitido' : 'Membresía Vencida';

        // 3. Registrar en la tabla asistencias
        const { error: errorInsert } = await supabase
            .from('asistencias')
            .insert([{
                id_usuario,
                estado: acceso
            }]);

        if (errorInsert) throw errorInsert;

        // 4. Responder al Frontend
        if (acceso === 'Acceso Permitido') {
            res.json({ success: true, message: `Bienvenido, ${usuario.nombre}`, usuario });
        } else {
            res.status(403).json({ success: false, message: "Membresía Vencida", usuario });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
});

// OBTENER HISTORIAL (Opcional, para reportes)
router.get('/', async (req, res) => {
    const { data } = await supabase.from('asistencias').select('*, usuarios(nombre)').order('fecha_hora', { ascending: false });
    res.json(data);
});

export default router;