import React, { useState, useMemo } from 'react';
import { 
  Lock, Unlock, Search, Filter, MapPin, 
  Maximize, Package, CheckCircle, AlertCircle, 
  X, Save, User, Clock, Activity
} from 'lucide-react';

const Casilleros = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [selectedLocker, setSelectedLocker] = useState(null);

  // Simulación de datos basada en tus capturas
  const initialLockers = useMemo(() => {
    const data = [];
    const locations = [
      { id: 'floor1', label: 'Planta Baja', count: 30, start: 1 },
      { id: 'floor2', label: 'Primer Piso', count: 30, start: 31 },
      { id: 'men', label: 'Vestuario Hombres', count: 20, start: 61 }
    ];

    locations.forEach(loc => {
      for (let i = 0; i < loc.count; i++) {
        const num = loc.start + i;
        data.push({
          id: `l-${num}`,
          number: num,
          location: loc.id,
          locationLabel: loc.label,
          size: num % 3 === 0 ? 'Grande' : 'Mediano',
          status: num % 7 === 0 ? 'maintenance' : (num % 3 === 0 ? 'occupied' : 'available'),
          price: '€20/mes',
          assignedTo: num % 3 === 0 ? 'Usuario Demo' : null
        });
      }
    });
    return data;
  }, []);

  const stats = [
    { label: 'Total Casilleros', value: 120, icon: Lock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Disponibles', value: 82, icon: Unlock, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Ocupados', value: 38, icon: Lock, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Tasa de Ocupación', value: '32%', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'occupied': return 'bg-red-500 text-white border-red-600';
      case 'maintenance': return 'bg-yellow-500 text-white border-yellow-600';
      default: return 'bg-green-500 text-white border-green-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto py-8">
      {/* Header y Stats */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Gestión de Casilleros</h1>
        <p className="text-neutral-500 text-sm">Administra y asigna casilleros a los miembros</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
            </div>
            <div className={`${stat.bg} p-3 rounded-2xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar y Filtros */}
      <div className="bg-white p-4 rounded-[24px] border border-neutral-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por número o usuario..."
              className="w-full pl-12 pr-4 py-2.5 bg-neutral-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-4 py-2.5 bg-neutral-50 rounded-xl text-sm font-bold text-neutral-600 outline-none"
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="all">Todas las ubicaciones</option>
              <option value="floor1">Planta Baja</option>
              <option value="floor2">Primer Piso</option>
            </select>
            <button className="px-6 py-2.5 bg-neutral-100 text-neutral-600 rounded-xl font-bold text-sm hover:bg-neutral-200">Limpiar</button>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 pt-2 border-t border-neutral-50">
          {[
            { c: 'bg-green-500', l: 'Disponible' },
            { c: 'bg-red-500', l: 'Ocupado' },
            { c: 'bg-yellow-500', l: 'Mantenimiento' },
            { c: 'bg-purple-500', l: 'Pequeño' },
            { c: 'bg-blue-500', l: 'Mediano' },
            { c: 'bg-orange-500', l: 'Grande' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${item.c}`}></div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-tighter">{item.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de Casilleros por Ubicación */}
      {['floor1', 'floor2', 'men'].map(locId => {
        const locLockers = initialLockers.filter(l => l.location === locId);
        const label = locLockers[0]?.locationLabel;
        
        return (
          <div key={locId} className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                🏢 {label}
              </h2>
              <span className="px-3 py-1 bg-neutral-50 rounded-lg text-xs font-bold text-neutral-400">{locLockers.length} casilleros</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
              {locLockers.map(locker => (
                <button
                  key={locker.id}
                  onClick={() => setSelectedLocker(locker)}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all hover:scale-110 shadow-sm ${getStatusStyles(locker.status)}`}
                >
                  <span className="text-xs font-black">{locker.number}</span>
                  {locker.status === 'occupied' && <Lock size={10} className="mt-1 opacity-80" />}
                  {locker.status === 'maintenance' && <AlertCircle size={10} className="mt-1 opacity-80" />}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Modal de Detalle */}
      {selectedLocker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedLocker(null)} className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-600">
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <Lock size={24} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">Casillero #{selectedLocker.number}</h3>
            </div>

            <div className="flex justify-center mb-8">
              <span className={`px-6 py-2 rounded-xl text-lg font-bold uppercase tracking-widest border-2 ${
                selectedLocker.status === 'available' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {selectedLocker.status === 'available' ? 'Disponible' : 'Ocupado'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { i: MapPin, l: 'Ubicación', v: selectedLocker.locationLabel },
                { i: Maximize, l: 'Tamaño', v: `${selectedLocker.size} (50x60cm)` },
                { i: Package, l: 'Precio Mensual', v: selectedLocker.price },
                { i: Lock, l: 'Número', v: `#${selectedLocker.number}` }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-neutral-50 rounded-[20px] space-y-1">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <item.i size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.l}</span>
                  </div>
                  <p className="text-sm font-bold text-neutral-800">{item.v}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full py-4 bg-purple-500 text-white rounded-2xl font-black text-sm hover:bg-purple-600 shadow-lg shadow-purple-100 transition-all flex items-center justify-center gap-2">
                <User size={18} /> Asignar Casillero
              </button>
              <div className="flex gap-3">
                <button className="flex-1 py-3 border border-orange-100 text-orange-500 rounded-2xl font-bold text-xs hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                  <AlertCircle size={16} /> Mantenimiento
                </button>
                <button onClick={() => setSelectedLocker(null)} className="px-6 py-3 border border-neutral-100 text-neutral-500 rounded-2xl font-bold text-xs hover:bg-neutral-50">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Casilleros;