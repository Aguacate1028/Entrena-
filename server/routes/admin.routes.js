import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// --- DASHBOARD ---
router.get('/dashboard', async (req, res) => {
    try {
        const { count: socios } = await supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('rol', 'socio').eq('estado_suscripcion', 'activa');
        const { count: reportes } = await supabase.from('reportes').select('*', { count: 'exact', head: true }).neq('estado', 'Resuelto');

        const inicioMes = new Date(); inicioMes.setDate(1);
        const { data: pagos } = await supabase.from('pagos').select('monto').gte('fecha', inicioMes.toISOString());
        const ingresos = pagos?.reduce((acc, curr) => acc + Number(curr.monto), 0) || 0;

        const { data: treners } = await supabase.from('entrenadores').select('salario');
        const gastos = treners?.reduce((acc, curr) => acc + Number(curr.salario), 0) || 0;

        res.json({ socios_activos: socios || 0, staff_activos: treners?.length || 0, reportes_pendientes: reportes || 0, ingresos_mes: ingresos, gastos_salarios: gastos });
    } catch (err) { res.status(500).json({ error: "Error dashboard" }); }
});

router.get('/reporte-financiero', async (req, res) => {
    const { periodo } = req.query;
    let fechaInicio = new Date();
    
    // Lógica de fechas
    if (periodo === 'ultimo_trimestre') {
        fechaInicio.setMonth(fechaInicio.getMonth() - 3);
    } else if (periodo === 'anio_actual') {
        fechaInicio.setMonth(0, 1); // 1 de enero
    } else {
        fechaInicio.setDate(1); // 1 de este mes
    }

    try {
        const { data: pagos, error } = await supabase
            .from('pagos')
            .select('*, usuarios(nombre)')
            .gte('fecha', fechaInicio.toISOString())
            .order('fecha', { ascending: true });

        if (error) throw error;

        const total = pagos.reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
        
        // Generar chartData basado en los meses que tienen pagos
        const mesesLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const chartData = mesesLabels.map((m, index) => ({
            name: m,
            total: pagos
                .filter(p => new Date(p.fecha).getMonth() === index)
                .reduce((acc, p) => acc + Number(p.monto), 0)
        })).filter(m => {
            // Si es "este mes", solo mostramos el mes actual. Si es año, todos hasta hoy.
            const mesActual = new Date().getMonth();
            if (periodo === 'este_mes') return m.name === mesesLabels[mesActual];
            return true; 
        });

        res.json({
            metrics: { total, count: pagos.length },
            chartData,
            methodData: [
                { name: 'Membresías', value: pagos.filter(p => p.concepto?.toLowerCase().includes('membresía')).length, color: '#9333ea' },
                { name: 'Lockers', value: pagos.filter(p => p.concepto?.toLowerCase().includes('locker')).length, color: '#22c55e' },
                { name: 'Otros', value: pagos.filter(p => !p.concepto?.toLowerCase().includes('locker') && !p.concepto?.toLowerCase().includes('membresía')).length, color: '#3b82f6' }
            ],
            recentPayments: pagos.slice(-10).reverse()
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- REPORTES ---
router.get('/reportes', async (req, res) => {
    try {
        const { data } = await supabase.from('reportes').select('*, usuarios:id_usuario (nombre)').order('fecha_creacion', { ascending: false });
        const formateados = data.map(r => ({ ...r, usuario_nombre: r.usuarios?.nombre || 'Anónimo' }));
        res.json(formateados);
    } catch (err) { res.json([]); }
});

// --- ENTRENADORES ---
router.get('/entrenadores-list', async (req, res) => {
    try {
        const { data } = await supabase.from('entrenadores').select('*').order('nombre');
        res.json(data || []);
    } catch (err) { res.status(500).json([]); }
});

// --- DIRECTORIO DE USUARIOS COMPLETO ---
router.get('/usuarios', async (req, res) => {
    try {
        // Obtenemos usuarios y sus entrenadores asignados
        const { data, error } = await supabase
            .from('usuarios')
            .select(`
                *,
                entrenadores:id_entrenador ( nombre ),
                asistencias ( fecha_hora, metodo )
            `)
            .order('fecha_registro', { ascending: false });

        if (error) throw error;

        const formateados = data.map(u => ({ 
            ...u, 
            nombre_entrenador: u.entrenadores?.nombre || 'Sin asignar',
            // Tomamos las últimas 5 asistencias para el modal "Expediente"
            ultimas_asistencias: u.asistencias?.sort((a,b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)).slice(0, 5) || []
        }));

        res.json(formateados);
    } catch (err) { 
        res.status(500).json([]); 
    }
});

export default router;