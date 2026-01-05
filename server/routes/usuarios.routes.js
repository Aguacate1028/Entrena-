import { Router } from 'express';
import { supabase } from '../supabase.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// --- CONFIGURACIÓN DE PRECIOS (Backend) ---
const PRECIO_LOCKER_MENSUAL = 150;
const PRECIOS_MEMBRESIAS = {
    'Semanal': 200,
    'Mensual': 500,
    'Trimestral': 1350,
    'Anual': 4800,
    'Sin Membresía': 0
};

// 1. OBTENER PERFIL COMPLETO
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('*') 
            .eq('id_usuario', id)
            .single();

        if (error) throw error;

        const { data: objetivos } = await supabase.from('objetivos').select('*').eq('id_usuario', id);
        const { count: totalEntrenamientos } = await supabase.from('asistencias').select('*', { count: 'exact', head: true }).eq('id_usuario', id);
        const { data: fechasAsistencia } = await supabase.from('asistencias').select('fecha_hora').eq('id_usuario', id);
        
        const diasUnicos = new Set(fechasAsistencia.map(a => a.fecha_hora.split('T')[0]));
        
        const stats = {
            entrenamientos: totalEntrenamientos || 0,
            dias_activos: diasUnicos.size || 0,
            duracion_media: 60,
            calorias: (totalEntrenamientos || 0) * 350
        };

        res.json({ ...usuario, stats, objetivos: objetivos || [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. OBTENER CLASES
router.get('/:id/clases', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: inscripciones } = await supabase.from('inscripciones').select('id_clase').eq('id_usuario', id);
        if (!inscripciones || inscripciones.length === 0) return res.json([]);
        
        const idsClases = inscripciones.map(i => i.id_clase);
        const { data: clases } = await supabase.from('clases').select('*').in('id', idsClases);
        res.json(clases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. ACTUALIZAR PERFIL (Edición completa)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { 
        nombre, telefono, direccion, fecha_nacimiento,
        altura, peso, tipo_sangre, contacto_emergencia_nombre, contacto_emergencia_telefono,
        membresia_tipo, membresia_fin, estado_suscripcion, locker_id 
    } = req.body;

    try {
        let locker_activo = false;
        let idLockerFinal = null;

        if (locker_id && locker_id !== '' && locker_id !== '0') {
            locker_activo = true;
            idLockerFinal = parseInt(locker_id);
        }

        const updateData = { 
            nombre, telefono, direccion, fecha_nacimiento,
            altura, peso, tipo_sangre,
            contacto_emergencia_nombre, contacto_emergencia_telefono,
            membresia_tipo, membresia_fin, estado_suscripcion,
            locker_id: idLockerFinal,
            locker_activo: locker_activo
        };

        if (locker_activo && !req.body.locker_fin) {
             updateData.locker_fin = membresia_fin; 
        }

        const { data, error } = await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id_usuario', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. AGREGAR OBJETIVO
router.post('/objetivos', async (req, res) => {
    const { id_usuario, texto } = req.body;
    try {
        const { data, error } = await supabase.from('objetivos').insert([{ id_usuario, texto }]).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. ELIMINAR OBJETIVO
router.delete('/objetivos/:id', async (req, res) => {
    try {
        const { error } = await supabase.from('objetivos').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: "Eliminado" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 6. SUBIR FOTO
// En tu router.post('/:id/foto')
router.post('/:id/foto', upload.single('archivo'), async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No archivo" });

    try {
        const fileName = `avatar_${id}_${Date.now()}.png`;
        
        // 1. Intento de subida
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file.buffer, { 
                contentType: file.mimetype, 
                upsert: true 
            });

        if (uploadError) {
            console.error("Error subiendo a Storage:", uploadError); // Esto te dirá si es falta de permisos
            return res.status(500).json({ error: uploadError.message });
        }

        // 2. Obtener URL pública
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        const publicUrl = data.publicUrl;

        // 3. Actualizar base de datos
        const { error: dbError } = await supabase
            .from('usuarios')
            .update({ foto_perfil: publicUrl })
            .eq('id_usuario', id);

        if (dbError) throw dbError;

        res.json({ message: "Foto actualizada", url: publicUrl });
    } catch (err) {
        console.error("Error completo:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- STAFF ROUTES ---

// 8. OBTENER SOCIOS
router.get('/staff/socios', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id_usuario, nombre, email, telefono, membresia_tipo, membresia_fin, estado_suscripcion, foto_perfil')
            .eq('rol', 'socio')
            .order('nombre', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. OBTENER LOCKERS
router.get('/staff/lockers', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id_usuario, nombre, locker_id, locker_activo, locker_fin') 
            .not('locker_id', 'is', null)
            .order('locker_id', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// STATS DASHBOARD
router.get('/staff/stats', async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        const primerDiaMes = new Date();
        primerDiaMes.setDate(1);
        const fechaInicioMes = primerDiaMes.toISOString().split('T')[0];

        const { count: activos } = await supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('rol', 'socio').eq('estado_suscripcion', 'activa');
        const { count: accesosHoy } = await supabase.from('asistencias').select('*', { count: 'exact', head: true }).gte('fecha_hora', `${hoy}T00:00:00`).eq('estado', 'Acceso Permitido');
        const { count: lockers } = await supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('locker_activo', true);
        
        const { data: pagosData } = await supabase.from('pagos').select('monto').gte('fecha', fechaInicioMes);
        const totalGanancias = pagosData ? pagosData.reduce((acc, curr) => acc + Number(curr.monto), 0) : 0;

        res.json({ sociosActivos: activos || 0, accesosHoy: accesosHoy || 0, lockersOcupados: lockers || 0, gananciasMes: totalGanancias });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREAR USUARIO (Registro Público - Sin pago automático)
router.post('/crear', async (req, res) => {
    const { nombre, email, password, rol, fecha_nacimiento, telefono, membresia_tipo } = req.body;
    try {
        const { data, error } = await supabase.from('usuarios').insert([{ 
            nombre, email, password_hash: password, rol, fecha_nacimiento, telefono, 
            membresia_tipo, estado_suscripcion: 'activa', fecha_registro: new Date()
        }]).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ELIMINAR USUARIO
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await supabase.from('asistencias').delete().eq('id_usuario', id);
        await supabase.from('inscripciones').delete().eq('id_usuario', id);
        await supabase.from('pagos').delete().eq('id_usuario', id); // Borrar pagos también
        const { error } = await supabase.from('usuarios').delete().eq('id_usuario', id);
        if (error) throw error;
        res.json({ message: "Usuario eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DETALLE SOCIO (Modal)
router.get('/staff/detalle/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: usuario, error } = await supabase.from('usuarios').select('*').eq('id_usuario', id).single();
        if (error) throw error;
        const { data: historial } = await supabase.from('asistencias').select('*').eq('id_usuario', id).order('fecha_hora', { ascending: false }).limit(10);
        const { data: pagos } = await supabase.from('pagos').select('*').eq('id_usuario', id).order('fecha', { ascending: false }).limit(5);
        res.json({ ...usuario, historial: historial || [], pagos: pagos || [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- AQUÍ ESTÁ LA LÓGICA DE COBRO ---

// 1. CREAR SOCIO STAFF (INCLUYE PAGO AUTOMÁTICO)
router.post('/staff/crear', async (req, res) => {
    const { nombre, email, password, telefono, direccion, membresia_tipo, fecha_nacimiento } = req.body;

    try {
        const hoy = new Date();
        let fin = new Date();
        
        if (membresia_tipo === 'Mensual') fin.setMonth(fin.getMonth() + 1);
        else if (membresia_tipo === 'Trimestral') fin.setMonth(fin.getMonth() + 3);
        else if (membresia_tipo === 'Anual') fin.setFullYear(fin.getFullYear() + 1);
        else if (membresia_tipo === 'Semanal') fin.setDate(fin.getDate() + 7);

        // A) Insertar Usuario
        const { data: nuevoUsuario, error } = await supabase
            .from('usuarios')
            .insert([{
                nombre, email, password_hash: password, telefono, direccion, 
                rol: 'socio', membresia_tipo, membresia_fin: fin, 
                estado_suscripcion: 'activa', fecha_registro: new Date(), fecha_nacimiento 
            }])
            .select()
            .single();

        if (error) throw error;

        // B) REGISTRAR PAGO AUTOMÁTICAMENTE
        const montoPagar = PRECIOS_MEMBRESIAS[membresia_tipo] || 0;
        
        if (montoPagar > 0) {
            await supabase.from('pagos').insert([{
                id_usuario: nuevoUsuario.id_usuario,
                monto: montoPagar,
                fecha: new Date()
            }]);
        }

        res.json(nuevoUsuario);

    } catch (err) {
        console.error("Error creando socio:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. ASIGNAR LOCKER (INCLUYE PAGO AUTOMÁTICO)
router.post('/staff/lockers/asignar', async (req, res) => {
    const { id_usuario, locker_id, meses } = req.body;
    
    try {
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + parseInt(meses));

        const { data: ocupado } = await supabase.from('usuarios').select('id_usuario').eq('locker_id', locker_id).maybeSingle();
        if (ocupado && ocupado.id_usuario !== id_usuario) {
            return res.status(400).json({ error: `El casillero #${locker_id} ya está ocupado.` });
        }

        // A) Actualizar Usuario
        const { error } = await supabase
            .from('usuarios')
            .update({ locker_id, locker_activo: true, locker_fin: fechaFin })
            .eq('id_usuario', id_usuario);

        if (error) throw error;

        // B) REGISTRAR PAGO DE LOCKER
        const totalPagar = PRECIO_LOCKER_MENSUAL * parseInt(meses);
        
        await supabase.from('pagos').insert([{
            id_usuario: id_usuario,
            monto: totalPagar,
            fecha: new Date()
        }]);

        res.json({ message: "Casillero asignado y cobro registrado" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. LIBERAR LOCKER
router.post('/staff/lockers/liberar', async (req, res) => {
    const { id_usuario } = req.body;
    try {
        const { error } = await supabase
            .from('usuarios')
            .update({ locker_id: null, locker_activo: false, locker_fin: null })
            .eq('id_usuario', id_usuario);

        if (error) throw error;
        res.json({ message: "Casillero liberado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. OBTENER PAGOS (Historial de pagos)
router.get('/staff/pagos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pagos')
            // Unimos con la tabla usuarios para saber QUIÉN pagó
            .select('*, usuarios(nombre, email, foto_perfil)') 
            .order('fecha', { ascending: false }); // Más recientes primero

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;