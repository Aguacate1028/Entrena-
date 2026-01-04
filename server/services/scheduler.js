import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { supabase } from '../supabase.js';

// --- CONFIGURACIÓN DEL CORREO ---
// NOTA: Para Gmail, necesitas generar una "Contraseña de Aplicación" en tu cuenta de Google.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tu_correo@gmail.com', // <--- PON TU CORREO AQUÍ
        pass: 'tu_contraseña_de_aplicacion' // <--- PON TU PASSWORD AQUÍ
    }
});

const enviarCorreo = async (email, asunto, texto) => {
    try {
        await transporter.sendMail({
            from: '"Entrena+ Gym" <no-reply@entrenaplus.com>',
            to: email,
            subject: asunto,
            html: `<div style="font-family: sans-serif; padding: 20px;">
                    <h1 style="color: #7c3aed;">Entrena+</h1>
                    <h3>${asunto}</h3>
                    <p>${texto}</p>
                    <hr/>
                    <p style="font-size: 12px; color: gray;">Si ya renovaste, ignora este mensaje.</p>
                   </div>`
        });
        console.log(`[EMAIL] Enviado a ${email}`);
    } catch (error) {
        console.error(`[EMAIL ERROR] No se pudo enviar a ${email}:`, error);
    }
};

const crearNotificacionInterna = async (idUsuario, titulo, mensaje) => {
    await supabase.from('notificaciones').insert([{
        id_usuario: idUsuario,
        titulo: titulo,
        mensaje: mensaje,
        leida: false
    }]);
};

// --- TAREA PROGRAMADA (CRON JOB) ---
// Se ejecuta todos los días a las 9:00 AM ('0 9 * * *')
export const iniciarScheduler = () => {
    console.log('[SCHEDULER] Sistema de recordatorios iniciado...');
    
    cron.schedule('0 9 * * *', async () => {
        console.log('[SCHEDULER] Verificando vencimientos...');
        const hoy = new Date();
        const diasAviso = 3; // Avisar 3 días antes
        
        // Calcular fecha objetivo (Hoy + 3 días)
        const fechaObjetivo = new Date();
        fechaObjetivo.setDate(hoy.getDate() + diasAviso);
        const fechaStr = fechaObjetivo.toISOString().split('T')[0]; // YYYY-MM-DD

        try {
            // 1. BUSCAR MEMBRESÍAS POR VENCER
            const { data: usuariosMembresia } = await supabase
                .from('usuarios')
                .select('*')
                .eq('membresia_fin', fechaStr);

            if (usuariosMembresia) {
                for (const u of usuariosMembresia) {
                    const msg = `Hola ${u.nombre}, tu plan ${u.membresia_tipo} vence el ${u.membresia_fin}. ¡Renueva hoy para no perder acceso!`;
                    
                    // Enviar Email
                    await enviarCorreo(u.email, '⚠️ Tu membresía está por vencer', msg);
                    // Crear Notificación en App
                    await crearNotificacionInterna(u.id_usuario, 'Renovación de Membresía', msg);
                }
            }

            // 2. BUSCAR LOCKERS POR VENCER
            const { data: usuariosLocker } = await supabase
                .from('usuarios')
                .select('*')
                .eq('locker_activo', true)
                .eq('locker_fin', fechaStr);

            if (usuariosLocker) {
                for (const u of usuariosLocker) {
                    const msg = `Hola ${u.nombre}, tu renta del locker #${u.locker_id} vence pronto.`;
                    
                    await enviarCorreo(u.email, '🔐 Tu locker vence en 3 días', msg);
                    await crearNotificacionInterna(u.id_usuario, 'Vencimiento de Locker', msg);
                }
            }

        } catch (error) {
            console.error('[SCHEDULER ERROR]', error);
        }
    });
};