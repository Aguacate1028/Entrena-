import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// 1. OBTENER TODAS LAS CLASES
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('clases').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. OBTENER UNA CLASE POR ID (CON CÁLCULO DE CUPOS)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // A) Obtenemos los datos de la clase
        const { data: clase, error: errorClase } = await supabase
            .from('clases')
            .select('*')
            .eq('id', id)
            .single();

        if (errorClase) throw errorClase;

        // B) Contamos cuántos inscritos hay en esta clase
        const { count: inscritos, error: errorInsc } = await supabase
            .from('inscripciones')
            .select('*', { count: 'exact', head: true }) // head: true solo cuenta, no trae datos
            .eq('id_clase', id);
            
        if (errorInsc) throw errorInsc;

        // C) Calculamos disponibles
        const disponibles = clase.cupo - inscritos;

        // Devolvemos la clase combinada con el dato 'disponibles'
        res.json({ ...clase, disponibles });

    } catch (err) {
        console.error("Error buscando clase:", err.message);
        res.status(404).json({ error: "Clase no encontrada" });
    }
});

// 3. INSCRIBIR USUARIO (CON NOTIFICACIÓN AUTOMÁTICA)
router.post('/inscripciones', async (req, res) => {
    const { id_clase, id_usuario } = req.body;

    // 1. Validar que lleguen los datos
    if (!id_clase || !id_usuario) {
        return res.status(400).json({ message: "Faltan datos (id_clase o id_usuario)" });
    }

    try {
        // A) Intentamos obtener el nombre de la clase
        const { data: clase, error: errorClase } = await supabase
            .from('clases')
            .select('nombre, dia, horario')
            .eq('id', id_clase)
            .single();

        // Si falla la búsqueda, no detenemos todo, solo usamos valores por defecto
        const nombreClase = clase ? clase.nombre : 'Clase';
        const diaClase = clase ? clase.dia : '';
        const horarioClase = clase ? clase.horario : '';

        // B) Insertar inscripción
        const { data, error } = await supabase
            .from('inscripciones')
            .insert([{ id_clase, id_usuario }])
            .select();

        if (error) {
            if (error.code === '23505') return res.status(400).json({ message: "Ya estás inscrito en esta clase" });
            throw error;
        }

        // C) Crear notificación (Usando las variables seguras)
        await supabase.from('notificaciones').insert([{
            id_usuario: id_usuario,
            titulo: 'Inscripción Confirmada',
            mensaje: `Te has inscrito exitosamente a ${nombreClase} ${diaClase ? 'el ' + diaClase : ''} ${horarioClase ? 'a las ' + horarioClase : ''}.`,
            tipo: 'success',
            leido: false
        }]);

        res.json({ message: "Inscripción exitosa", data });

    } catch (err) {
        console.error("Error en inscripción:", err.message);
        res.status(500).json({ message: "Error al procesar inscripción" });
    }
});

// 4. VERIFICAR SI UN USUARIO ESTÁ INSCRITO
router.get('/:id_clase/inscrito/:id_usuario', async (req, res) => {
    const { id_clase, id_usuario } = req.params;
    try {
        const { data, error } = await supabase
            .from('inscripciones')
            .select('*')
            .eq('id_clase', id_clase)
            .eq('id_usuario', id_usuario)
            .maybeSingle(); // Retorna null si no existe, en vez de error

        if (error) throw error;
        // Devuelve true si encontró el registro, false si es null
        res.json({ inscrito: !!data }); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. CANCELAR INSCRIPCIÓN (CON NOTIFICACIÓN AUTOMÁTICA)
router.delete('/inscripciones/:id_clase/:id_usuario', async (req, res) => {
    const { id_clase, id_usuario } = req.params;
    try {
        // A) Obtenemos nombre de la clase antes de borrar (para el mensaje)
        const { data: clase } = await supabase
            .from('clases')
            .select('nombre')
            .eq('id', id_clase)
            .single();

        // B) Borramos la inscripción
        const { error } = await supabase
            .from('inscripciones')
            .delete()
            .eq('id_clase', id_clase)
            .eq('id_usuario', id_usuario);

        if (error) throw error;

        // C) CREAR NOTIFICACIÓN DE CANCELACIÓN
        await supabase.from('notificaciones').insert([{
            id_usuario: id_usuario,
            titulo: 'Inscripción Cancelada',
            mensaje: `Has liberado tu lugar en la clase de ${clase?.nombre || 'Gimnasio'}.`,
            tipo: 'warning',
            leido: false
        }]);

        res.json({ message: "Inscripción cancelada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ... (tus rutas GET 1 y 2 se mantienen igual)

// 6. CREAR CLASE (Solo Staff/Admin)
router.post('/', async (req, res) => {
    const { nombre, descripcion, horario, cupo, entrenador, dia_semana } = req.body;
    try {
        const { data, error } = await supabase
            .from('clases')
            .insert([{ nombre, descripcion, horario, cupo, entrenador, dia_semana }])
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 7. ACTUALIZAR CLASE
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const { data, error } = await supabase
            .from('clases')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 8. ELIMINAR CLASE
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('clases').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Clase eliminada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// OBTENER LISTA RÁPIDA DE ENTRENADORES PARA SELECTS
router.get('/entrenadores/lista', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('entrenadores')
            .select('id, nombre')
            .order('nombre', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;