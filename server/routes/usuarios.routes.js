import { Router } from 'express';
import { supabase } from '../supabase.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// 1. OBTENER PERFIL COMPLETO + ENTRENADORES + ESTADÍSTICAS
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // A) Datos del Usuario CON ENTRENADORES
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('*, entrenadores(*)') 
            .eq('id_usuario', id)
            .single();

        if (error) throw error;

        // B) Objetivos
        const { data: objetivos } = await supabase
            .from('objetivos')
            .select('*')
            .eq('id_usuario', id);

        // C) ESTADÍSTICAS
        const { count: totalEntrenamientos } = await supabase
            .from('asistencias')
            .select('*', { count: 'exact', head: true })
            .eq('id_usuario', id);

        const { data: fechasAsistencia } = await supabase
            .from('asistencias')
            .select('fecha_hora')
            .eq('id_usuario', id);
        
        const diasUnicos = new Set(fechasAsistencia.map(a => a.fecha_hora.split('T')[0]));
        const caloriasQuemadas = (totalEntrenamientos || 0) * 350;

        const stats = {
            entrenamientos: totalEntrenamientos || 0,
            dias_activos: diasUnicos.size || 0,
            duracion_media: 60,
            calorias: caloriasQuemadas
        };

        // Devolvemos todo junto
        res.json({ ...usuario, stats, objetivos: objetivos || [] });

    } catch (err) {
        console.error("Error obteniendo perfil:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. OBTENER CLASES INSCRITAS
router.get('/:id/clases', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: inscripciones } = await supabase
            .from('inscripciones')
            .select('id_clase')
            .eq('id_usuario', id);

        if (!inscripciones || inscripciones.length === 0) return res.json([]);

        const idsClases = inscripciones.map(i => i.id_clase);
        const { data: clases } = await supabase
            .from('clases')
            .select('*')
            .in('id', idsClases);

        res.json(clases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. ACTUALIZAR PERFIL 
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    // IMPORTANTE: Aquí deben estar TODOS los campos que quieres guardar
    const { 
        nombre, telefono, direccion, fecha_nacimiento,
        altura, peso, tipo_sangre,
        contacto_emergencia_nombre, contacto_emergencia_telefono 
    } = req.body;

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .update({ 
                nombre, telefono, direccion, fecha_nacimiento,
                altura, peso,tipo_sangre,
                contacto_emergencia_nombre, contacto_emergencia_telefono
            })
            .eq('id_usuario', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. AGREGAR OBJETIVO (POST)
router.post('/objetivos', async (req, res) => {
    const { id_usuario, texto } = req.body;
    try {
        const { data, error } = await supabase
            .from('objetivos')
            .insert([{ id_usuario, texto }])
            .select()
            .single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. ELIMINAR OBJETIVO (DELETE)
router.delete('/objetivos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('objetivos').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Eliminado" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 6. SUBIR FOTO DE PERFIL 
router.post('/:id/foto', upload.single('archivo'), async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No se subió ningún archivo" });

    try {
        // A) Subir archivo al Bucket 'avatars' de Supabase
        const fileName = `avatar_${id}_${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (uploadError) throw uploadError;

        // B) Obtener la URL pública
        const { data: { publicUrl } } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(fileName);

        // C) Guardar URL en la tabla usuarios
        const { error: dbError } = await supabase
            .from('usuarios')
            .update({ foto_perfil: publicUrl })
            .eq('id_usuario', id);

        if (dbError) throw dbError;

        res.json({ message: "Foto actualizada", url: publicUrl });

    } catch (err) {
        console.error("Error subiendo foto:", err);
        res.status(500).json({ error: err.message });
    }
});

// 7. OBTENER ESTADÍSTICAS PARA EL DASHBOARD DEL STAFF
router.get('/staff/stats', async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];

        // A) Socios Activos (con membresía no vencida)
        const { count: activos } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true })
            .eq('rol', 'socio')
            .gte('membresia_fin', hoy);

        // B) Accesos de hoy
        const { count: accesosHoy } = await supabase
            .from('asistencias')
            .select('*', { count: 'exact', head: true })
            .gte('fecha_hora', `${hoy}T00:00:00Z`)
            .eq('estado', 'Acceso Permitido');

        // C) Lockers ocupados
        const { count: lockers } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true })
            .eq('locker_activo', true);

        res.json({
            sociosActivos: activos || 0,
            accesosHoy: accesosHoy || 0,
            lockersOcupados: lockers || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. OBTENER TODOS LOS SOCIOS (Para StaffSocios.jsx)
router.get('/staff/socios', async (req, res) => {
    try {
        const { data: socios, error } = await supabase
            .from('usuarios')
            .select('id_usuario, nombre, email, telefono, membresia_tipo, membresia_fin, estado_suscripcion, foto_perfil')
            .eq('rol', 'socio')
            .order('nombre', { ascending: true });

        if (error) throw error;
        res.json(socios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. OBTENER ESTADO DE LOCKERS
router.get('/staff/lockers', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('nombre, locker_id, locker_activo, locker_fin')
            .not('locker_id', 'is', null)
            .order('locker_id', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
