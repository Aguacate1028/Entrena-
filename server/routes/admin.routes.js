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

// --- FINANZAS / REPORTES ---
router.get('/reporte-financiero', async (req, res) => {
    try {
        const { data: pagos, error } = await supabase.from('pagos').select('*, usuarios(nombre)').order('fecha', { ascending: false });
        if (error) throw error;

        const total = pagos.reduce((acc, p) => acc + Number(p.monto), 0);
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const chartData = meses.map((m, index) => ({
            name: m,
            total: pagos.filter(p => new Date(p.fecha).getMonth() === index).reduce((acc, p) => acc + Number(p.monto), 0)
        })).filter((m, i) => i <= new Date().getMonth());

        res.json({
            metrics: { total, count: pagos.length },
            chartData,
            methodData: [
                { name: 'Membresías', value: pagos.filter(p => p.concepto.toLowerCase().includes('membresía')).length, color: '#9333ea' },
                { name: 'Lockers', value: pagos.filter(p => p.concepto.toLowerCase().includes('locker')).length, color: '#22c55e' },
                { name: 'Otros', value: pagos.filter(p => !p.concepto.toLowerCase().includes('locker') && !p.concepto.toLowerCase().includes('membresía')).length, color: '#3b82f6' }
            ],
            recentPayments: pagos.slice(0, 10)
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
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

// --- USUARIOS ---
router.get('/usuarios', async (req, res) => {
    try {
        const { data } = await supabase.from('usuarios').select('*, entrenadores(nombre)').order('fecha_registro', { ascending: false });
        const formateados = data.map(u => ({ ...u, nombre_entrenador: u.entrenadores?.nombre || 'Sin asignar' }));
        res.json(formateados);
    } catch (err) { res.status(500).json([]); }
});

export default router;