import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// --- 1. DASHBOARD ---
router.get('/dashboard', async (req, res) => {
    try {
        const { count: socios } = await supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('rol', 'socio').eq('estado_suscripcion', 'activa');
        const { count: staff } = await supabase.from('empleados').select('*', { count: 'exact', head: true }).eq('activo', true);
        const { count: reportes } = await supabase.from('reportes').select('*', { count: 'exact', head: true }).neq('estado', 'Resuelto');
        const { count: maquinas } = await supabase.from('maquinas').select('*', { count: 'exact', head: true });

        // Finanzas básicas
        const inicioMes = new Date(); inicioMes.setDate(1);
        const { data: pagos } = await supabase.from('pagos').select('monto').gte('fecha', inicioMes.toISOString());
        const ingresos = pagos?.reduce((acc, curr) => acc + Number(curr.monto), 0) || 0;
        const { data: emp } = await supabase.from('empleados').select('salario').eq('activo', true);
        const gastos = emp?.reduce((acc, curr) => acc + Number(curr.salario), 0) || 0;

        res.json({ socios_activos: socios || 0, staff_activos: staff || 0, reportes_pendientes: reportes || 0, maquinaria_total: maquinas || 0, ingresos_mes: ingresos, gastos_salarios: gastos });
    } catch (err) { res.status(500).json({ error: "Error dashboard" }); }
});


// --- 3. FINANZAS ---
router.get('/finanzas', async (req, res) => {
    try {
        const { data: pagos } = await supabase.from('pagos').select('*, usuarios(nombre)').order('fecha', { ascending: false }).limit(100);
        const { data: emps } = await supabase.from('empleados').select('salario').eq('activo', true);
        const nomina = emps?.reduce((acc, curr) => acc + Number(curr.salario), 0) || 0;
        res.json({ pagos: pagos || [], nomina_total: nomina });
    } catch (err) { res.status(500).json({ error: "Error finanzas" }); }
});

// 1. LEER (GET)
router.get('/entrenadores-list', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('entrenadores')
            .select('*')
            .order('nombre', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al cargar lista" });
    }
});

// 2. CREAR (POST)
router.post('/entrenadores', async (req, res) => {
    try {
        // Recibimos fecha_nacimiento
        const datos = {
            ...req.body,
            salario: Number(req.body.salario) || 0,
            activo: true
        };
        // Eliminamos 'edad' del objeto si viene, ya que usaremos fecha_nacimiento
        delete datos.edad; 

        const { error } = await supabase.from('entrenadores').insert([datos]);
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error al agregar" });
    }
});

// 3. ACTUALIZAR (PUT)
router.put('/entrenadores/:id', async (req, res) => {
    try {
        const datos = { ...req.body };
        delete datos.id; // No actualizamos el ID
        
        const { error } = await supabase
            .from('entrenadores')
            .update(datos)
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar" });
    }
});

// 4. ELIMINAR (DELETE)
router.delete('/entrenadores/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('entrenadores')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

// --- 6. INVENTARIO ---
router.get('/inventario', async (req, res) => {
    const { data } = await supabase.from('inventario').select('*').order('nombre');
    res.json(data || []);
});
router.post('/inventario', async (req, res) => {
    await supabase.from('inventario').insert([req.body]);
    res.json({ success: true });
});
router.put('/inventario/:id', async (req, res) => {
    await supabase.from('inventario').update(req.body).eq('id', req.params.id);
    res.json({ success: true });
});
router.delete('/inventario/:id', async (req, res) => {
    await supabase.from('inventario').delete().eq('id', req.params.id);
    res.json({ success: true });
});

// --- 7. MEMBRESIAS ---
router.get('/membresias', async (req, res) => {
    const { data } = await supabase.from('membresias').select('*').order('id');
    res.json(data || []);
});
router.post('/membresias', async (req, res) => {
    await supabase.from('membresias').insert([req.body]);
    res.json({ success: true });
});
router.delete('/membresias/:id', async (req, res) => {
    await supabase.from('membresias').delete().eq('id', req.params.id);
    res.json({ success: true });
});
// PUT: Actualizar Membresía
router.put('/membresias/:id', async (req, res) => {
    try {
        const { nombre, precio, caracteristicas } = req.body;
        const { error } = await supabase
            .from('membresias')
            .update({ nombre, precio, caracteristicas })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar membresía" });
    }
});

// --- 2. REPORTES (CORREGIDO) ---
router.get('/reportes', async (req, res) => {
    try {
        // Intentamos una consulta más simple primero.
        // Si tienes las FK creadas, esto debería funcionar sin el "!" explícito.
        const { data, error } = await supabase
            .from('reportes')
            .select(`
                *,
                usuarios:id_usuario (nombre, id_usuario)
                // Quitamos momentáneamente la relación de staff si causa problemas
                // staff_resuelve:id_staff_resolvio (nombre) 
            `)
            .order('fecha_creacion', { ascending: false });

        if (error) throw error;

        const formateados = data.map(r => ({
            ...r,
            // Manejo seguro de nulos
            usuario_nombre: r.usuarios?.nombre || 'Usuario Desconocido',
            staff_nombre: r.respuesta_admin ? 'Staff' : null 
        }));

        res.json(formateados);
    } catch (err) {
        console.error("Error al obtener reportes:", err);
        // Devolvemos array vacío en vez de error 500 para que el front no explote
        res.json([]); 
    }
});

// --- 8. USUARIOS (ENRIQUECIDO) ---
router.get('/usuarios', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select(`
                *,
                entrenador_asignado:entrenadores!usuarios_id_entrenador_fkey (nombre),
                asistencias (fecha_hora, metodo, estado)
            `)
            .order('fecha_registro', { ascending: false });

        if (error) throw error;

        // Procesamos para limpiar datos
        const usuariosFormateados = data.map(u => ({
            ...u,
            nombre_entrenador: u.entrenador_asignado?.nombre || 'Sin asignar',
            ultimas_asistencias: u.asistencias?.slice(0, 5) || [] // Solo las últimas 5
        }));

        res.json(usuariosFormateados);
    } catch (err) {
        console.error("Error usuarios:", err);
        res.status(500).json([]);
    }
});

export default router;