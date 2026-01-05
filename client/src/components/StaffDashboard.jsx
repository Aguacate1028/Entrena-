import React, { useState, useEffect } from 'react';
import { Users, QrCode, Lock, Activity, DollarSign, FileText } from 'lucide-react'; // Agregamos FileText para el icono
import { useNavigate } from 'react-router-dom';
import { obtenerStatsStaffRequest } from '../api/usuarios';

const StaffDashboard = () => {
    const [realStats, setRealStats] = useState({ 
        sociosActivos: 0, 
        accesosHoy: 0, 
        lockersOcupados: 0, 
        gananciasMes: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        obtenerStatsStaffRequest()
            .then(data => {
                if(data) setRealStats(data);
            })
            .catch(err => console.error("Error cargando stats:", err));
    }, []);

    const stats = [
        { label: 'Socios Activos', value: realStats.sociosActivos, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Accesos hoy', value: realStats.accesosHoy, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Lockers ocupados', value: `${realStats.lockersOcupados}/20`, icon: Lock, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Ganancias Mes', value: `$${realStats.gananciasMes}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-neutral-900">Panel Operativo</h1>
                    <p className="text-neutral-500">Gestión de planta y atención al socio.</p>
                </header>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-black text-neutral-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <h3 className="text-xl font-bold mb-6 text-neutral-800">Acciones Prioritarias</h3>
                
                {/* --- AQUÍ ESTÁN LOS BOTONES DE ACCIÓN --- */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ActionButton 
                        title="Escanear Acceso" 
                        desc="Registrar entrada QR" 
                        icon={QrCode} 
                        onClick={() => navigate('/staffscanner')} 
                        color="bg-purple-600"
                    />
                    <ActionButton 
                        title="Control Casilleros" 
                        desc="Gestionar ocupación" 
                        icon={Lock} 
                        onClick={() => navigate('/stafflockers')} 
                        color="bg-neutral-900"
                    />
                    <ActionButton 
                        title="Ver Socios" 
                        desc="Directorio de clientes" 
                        icon={Users} 
                        onClick={() => navigate('/staffsocios')} 
                        color="bg-blue-600"
                    />
                    {/* --- NUEVO BOTÓN PARA REPORTES --- */}
                    <ActionButton 
                        title="Ver Reportes" 
                        desc="Incidencias y mantenimiento" 
                        icon={FileText} 
                        onClick={() => navigate('/staffreportes')} 
                        color="bg-orange-500"
                    />
                </div>
            </div>
        </div>
    );
};

const ActionButton = ({ title, desc, icon: Icon, onClick, color }) => (
    <button onClick={onClick} className="flex items-center gap-5 p-6 bg-white rounded-[32px] border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group cursor-pointer h-full">
        <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}>
            <Icon size={28} />
        </div>
        <div>
            <h4 className="font-bold text-neutral-900 group-hover:text-purple-600 transition-colors">{title}</h4>
            <p className="text-sm text-neutral-500">{desc}</p>
        </div>
    </button>
);

export default StaffDashboard;