import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { MOCK_administrador_STATS, MOCK_SOCIOS_LIST } from '../mocks/mockData';
import { BarChart3, DollarSign, Users, Calendar, TrendingUp, CreditCard, QrCode, FileText, Clock, CheckCircle2, Search, Download, CheckCircle, XCircle } from 'lucide-react';

// Definición de tipos de vista (simulación basada en entrena+.txt)
const AdminView = ['overview', 'reports', 'payments', 'attendance'];

// --- Componentes Reemplazados (Implementación simple) ---

// Basado en PaymentsSection de entrena+.txt (Simplificado)
const PaymentsSection = () => {
    const payments = [
        { id: 'PAY-001', member: 'María López', plan: 'Premium', amount: '$49.00', date: '2024-12-08', status: 'completed', method: 'Tarjeta' },
        { id: 'PAY-003', member: 'Ana Martínez', plan: 'Elite', amount: '$79.00', date: '2024-12-07', status: 'pending', method: 'Transferencia' },
        { id: 'PAY-005', member: 'Laura García', plan: 'Básico', amount: '$29.00', date: '2024-12-06', status: 'failed', method: 'Tarjeta' },
    ];
    
    // Simulación de los resúmenes financieros (basado en entrena+.txt, 263-268)
    const totalRevenue = 157.00; 
    const pendingAmount = 79.00;
    const totalTransactions = payments.length;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="flex items-center gap-1 px-3 py-1 bg-green-400/20 text-green-400 rounded-full"><CheckCircle className="w-4 h-4" />Completado</span>;
            case 'pending':
                return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full"><Clock className="w-4 h-4" />Pendiente</span>;
            case 'failed':
                return <span className="flex items-center gap-1 px-3 py-1 bg-red-400/20 text-red-400 rounded-full"><XCircle className="w-4 h-4" />Fallido</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards (basado en entrena+.txt, 265) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-400/20 p-3 rounded-xl">
                            <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                    <div className="text-3xl text-white mb-1">${totalRevenue.toFixed(2)}</div>
                    <div className="text-gray-400">Total Recaudado</div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-400/20 p-3 rounded-xl">
                            <Clock className="w-6 h-6 text-yellow-400" />
                        </div>
                    </div>
                    <div className="text-3xl text-white mb-1">${pendingAmount.toFixed(2)}</div>
                    <div className="text-gray-400">Pagos Pendientes</div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-400/20 p-3 rounded-xl">
                            <CreditCard className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <div className="text-3xl text-white mb-1">{totalTransactions}</div>
                    <div className="text-gray-400">Transacciones Totales</div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700 border-b border-gray-600">
                            <tr>
                                <th className="text-left py-4 px-6 text-green-400">ID</th>
                                <th className="text-left py-4 px-6 text-green-400">Miembro</th>
                                <th className="text-left py-4 px-6 text-green-400">Plan</th>
                                <th className="text-right py-4 px-6 text-green-400">Monto</th>
                                <th className="text-left py-4 px-6 text-green-400">Estado</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-700 text-gray-200'>
                            {payments.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-700 transition-colors">
                                    <td className="py-4 px-6 text-white">{p.id}</td>
                                    <td className="py-4 px-6">{p.member}</td>
                                    <td className="py-4 px-6">{p.plan}</td>
                                    <td className="py-4 px-6 text-right text-white">{p.amount}</td>
                                    <td className="py-4 px-6">{getStatusBadge(p.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Basado en AttendanceSection de entrena+.txt (Simplificado)
const AttendanceSection = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Registro de Asistencia</h2>
            {/* Stats Cards (basado en entrena+.txt, 215) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-400/20 p-3 rounded-xl">
                            <Users className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="bg-green-400 w-3 h-3 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-3xl text-white mb-1">45</div>
                    <div className="text-gray-400">Miembros Activos Ahora</div>
                </div>
            </div>
            
            {/* QR Scanner Section (basado en entrena+.txt, 219) */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-2xl p-8 text-white border border-blue-400">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <QrCode className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl">Escanear QR</h3>
                            <p className="text-gray-300">Registra entrada/salida de miembros</p>
                        </div>
                    </div>
                    <button
                        className="w-full py-4 bg-blue-400 text-gray-900 rounded-xl hover:bg-blue-300 transition-colors flex items-center justify-center gap-2"
                    >
                        <QrCode className="w-6 h-6" />
                        Abrir Escáner QR
                    </button>
                </div>
                
                <div className="bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-700">
                    <h3 className="text-2xl text-white mb-6">Generar QR Miembro</h3>
                    <p className="text-gray-400">Funcionalidad en desarrollo para simular generación.</p>
                </div>
            </div>
        </div>
    );
};


const DashboardAdmin = () => {
  const [currentView, setCurrentView] = useState('overview');

  const stats = [
    { label: 'Miembros Activos', value: MOCK_SOCIOS_LIST.length, icon: Users, color: 'bg-green-400', lightColor: 'bg-green-400/20', textColor: 'text-green-400' },
    { label: 'Ingresos del Mes', value: '$125,000', icon: DollarSign, color: 'bg-blue-400', lightColor: 'bg-blue-400/20', textColor: 'text-blue-400' },
    { label: 'Asistencia Hoy', value: '156', icon: Calendar, color: 'bg-yellow-400', lightColor: 'bg-yellow-400/20', textColor: 'text-yellow-400' },
    { label: 'Tasa de Retención', value: '94%', icon: TrendingUp, color: 'bg-red-400', lightColor: 'bg-red-400/20', textColor: 'text-red-400' },
  ];
  
  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <>
            {/* Stats Grid (Adaptación del mock) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.lightColor} p-3 rounded-xl`}>
                        <Icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <span className="text-green-400 text-sm font-semibold">+12%</span>
                    </div>
                    <div className="text-3xl text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity and Charts (Implementación simple) */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700">
                    <h3 className="text-xl text-white mb-4">Actividad Reciente</h3>
                    <div className="h-40 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                        Lista de check-ins y pagos recientes.
                    </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700">
                    <h3 className="text-xl text-white mb-4">Afluencia por Hora</h3>
                    <div className="h-40 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                        Gráfica de barras de asistencia.
                    </div>
                </div>
            </div>
          </>
        );
      case 'reports':
        return <ReportsSection />; // Componente existente
      case 'payments':
        return <PaymentsSection />; // Componente definido arriba
      case 'attendance':
        return <AttendanceSection />; // Componente definido arriba
      default:
        return null;
    }
  };


  const TabButton = ({ view, label, icon: Icon }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors 
        ${currentView === view
          ? 'bg-blue-400 text-gray-900 font-semibold' // Pestaña activa (azul vibrante)
          : 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );


  return (
    // Reemplazo: bg-gray-900 (Fondo Oscuro)
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-white">Panel de Administración</h1>
          <p className="text-xl text-gray-400">
            Gestiona tu gimnasio desde un solo lugar
          </p>
        </div>

        {/* Navigation Tabs (Basado en entrena+.txt, 8-15) */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-700">
          <TabButton view="overview" label="Vista General" icon={BarChart3} />
          <TabButton view="reports" label="Reportes" icon={FileText} />
          <TabButton view="payments" label="Pagos" icon={CreditCard} />
          <TabButton view="attendance" label="Asistencias" icon={QrCode} />
        </div>

        {/* Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardAdmin;