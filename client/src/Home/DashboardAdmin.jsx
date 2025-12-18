import React, { useState } from 'react';
import { BarChart3, FileText, CreditCard, QrCode } from 'lucide-react';
import VistaGeneral from '../admin/VistaGeneral';
import Reportes from '../admin/Reportes';
import Pagos from '../admin/Pagos';
import Asistencias from '../admin/Asistencias';

const DashboardAdmin = () => {
  const [seccionActiva, setSeccionActiva] = useState('general');

  const pestañas = [
    { id: 'general', label: 'Vista General', icon: BarChart3 },
    { id: 'reportes', label: 'Reportes', icon: FileText },
    { id: 'pagos', label: 'Pagos', icon: CreditCard },
    { id: 'asistencias', label: 'Asistencias', icon: QrCode }
  ];

  const renderContent = () => {
    switch (seccionActiva) {
      case 'general': return <VistaGeneral />;
      case 'reportes': return <Reportes />;
      case 'pagos': return <Pagos />;
      case 'asistencias': return <Asistencias />;
      default: return <VistaGeneral />;
    }
  };

  const activeIndex = pestañas.findIndex(t => t.id === seccionActiva);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Panel de Administración</h1>
          <p className="text-neutral-500">Gestiona tu gimnasio desde un solo lugar</p>
        </div>

        {/* Tabs de Admin con Iconos e Indicador Deslizante */}
        <div className="relative flex bg-white p-1 rounded-2xl shadow-sm border border-neutral-100 w-fit mb-10 overflow-hidden">
          <div 
            className="absolute top-1 bottom-1 left-1 bg-purple-500 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-purple-200"
            style={{ 
              width: 'calc(25% - 2px)', 
              transform: `translateX(${activeIndex * 100}%)`,
              zIndex: 0 
            }}
          />

          {pestañas.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSeccionActiva(tab.id)}
              className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors duration-300 min-w-[150px] ${
                seccionActiva === tab.id ? 'text-white' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;