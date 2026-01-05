import React, { useState, useEffect } from 'react';
import { Users, DollarSign, AlertTriangle, Box, TrendingUp, TrendingDown, ArrowRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { obtenerDashboardData } from '../api/admin';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);

    useEffect(() => { 
        obtenerDashboardData().then(setStats).catch(console.error); 
    }, []);

    if (!stats) return <div className="p-10 text-center">Cargando Dashboard...</div>;
    const balance = stats.ingresos_mes - stats.gastos_salarios;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Panel General</h1>
                <p className="text-gray-500">Resumen operativo de Entrena+</p>
            </header>

            {/* KPI CARDS & ACCIONES RÁPIDAS */}
            {/* Nota: Ajusté el grid a lg:grid-cols-3 xl:grid-cols-5 para que quepan mejor los botones nuevos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                
                {/* 1. Socios */}
                <StatCard icon={Users} label="Socios Activos" value={stats.socios_activos} color="bg-blue-500" />
                
                {/* 2. Staff */}
                <StatCard icon={Users} label="Staff Activo" value={stats.staff_activos} color="bg-indigo-500" />
                
                {/* 3. Reportes */}
                <StatCard icon={AlertTriangle} label="Reportes Pendientes" value={stats.reportes_pendientes} color="bg-red-500" />
                
                {/* 4. BOTÓN INVENTARIO */}
                <div 
                    onClick={() => navigate('/admininventario')}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="p-4 rounded-xl text-white shadow-md bg-cyan-600 group-hover:scale-110 transition-transform">
                        <Box size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase">Inventario</p>
                        <p className="text-lg font-black text-gray-900">Gestionar</p>
                    </div>
                    <ArrowRight size={20} className="text-gray-300 group-hover:text-cyan-600 transition-colors"/>
                </div>

                {/* 5. BOTÓN MEMBRESÍAS (NUEVO) */}
                <div 
                    onClick={() => navigate('/adminmembresias')}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="p-4 rounded-xl text-white shadow-md bg-purple-600 group-hover:scale-110 transition-transform">
                        <CreditCard size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase">Membresías</p>
                        <p className="text-lg font-black text-gray-900">Planes</p>
                    </div>
                    <ArrowRight size={20} className="text-gray-300 group-hover:text-purple-600 transition-colors"/>
                </div>

            </div>

            {/* SECCIÓN FINANZAS */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-green-600"><TrendingUp size={20} /> <b>Ingresos Mes</b></div>
                    <p className="text-3xl font-black">${stats.ingresos_mes.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-red-500"><TrendingDown size={20} /> <b>Nómina (Salarios)</b></div>
                    <p className="text-3xl font-black text-red-500">-${stats.gastos_salarios.toLocaleString()}</p>
                </div>
                <div className="bg-neutral-900 text-white p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2 mb-2 text-gray-400"><DollarSign size={20} /> <b>Ganancia Neta</b></div>
                    <p className={`text-3xl font-black ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>${balance.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-4 rounded-xl text-white shadow-md ${color}`}><Icon size={24} /></div>
        <div>
            <p className="text-xs text-gray-500 font-bold uppercase">{label}</p>
            <p className="text-2xl font-black text-gray-900">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;