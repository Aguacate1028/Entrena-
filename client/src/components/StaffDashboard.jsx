import { Users, QrCode, CreditCard, Lock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { obtenerStatsStaffRequest } from '../api/usuarios';

const StaffDashboard = () => {
const [realStats, setRealStats] = useState({ sociosActivos: 0, accesosHoy: 0, lockersOcupados: 0 });

useEffect(() => {
    obtenerStatsStaffRequest().then(data => setRealStats(data));
}, []);

    const stats = [
        { label: 'Socios Activos', value: realStats.sociosActivos, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Accesos hoy', value: realStats.accesosHoy, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Lockers ocupados', value: `${realStats.lockersOcupados}/60`, icon: Lock, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-neutral-900">Panel Operativo</h1>
                    <p className="text-neutral-500">Gestión de planta y atención al socio.</p>
                </header>

                {/* Grid de Estadísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-neutral-100">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-black text-neutral-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Acciones Rápidas */}
                <h3 className="text-xl font-bold mb-6 text-neutral-800">Acciones Prioritarias</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <ActionButton 
                        title="Escanear Acceso" 
                        desc="Registrar entrada de socio vía QR" 
                        icon={QrCode} 
                        onClick={() => navigate('/asistencias')} 
                        color="bg-purple-600"
                    />
                    <ActionButton 
                        title="Registrar Pago" 
                        desc="Cobro de mensualidades o productos" 
                        icon={CreditCard} 
                        onClick={() => navigate('/pagos')} 
                        color="bg-neutral-900"
                    />
                    <ActionButton 
                        title="Ver Socios" 
                        desc="Consultar estado de membresías" 
                        icon={Users} 
                        onClick={() => navigate('/socios')} 
                        color="bg-blue-600"
                    />
                </div>
            </div>
        </div>
    );
};

const ActionButton = ({ title, desc, icon: Icon, onClick, color }) => (
    <button onClick={onClick} className="flex items-center gap-5 p-6 bg-white rounded-[32px] border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group">
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