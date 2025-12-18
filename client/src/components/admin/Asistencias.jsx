import React, { useState } from 'react';
import { 
  QrCode, UserCheck, Clock, Calendar, 
  Download, Search, CheckCircle2 
} from 'lucide-react';
import QRCode from 'qrcode';

const Asistencias = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [memberIdInput, setMemberIdInput] = useState('MEM-001');

  // Generar código QR para registro
  const generateQRCode = async (id) => {
    try {
      const url = await QRCode.toDataURL(id, {
        width: 300,
        margin: 2,
        color: { dark: '#a855f7', light: '#ffffff' }
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('Error generando QR:', err);
    }
  };

  const attendanceRecords = [
    { id: 1, member: 'María López', memberId: 'MEM-001', checkIn: '08:30', checkOut: '10:15', duration: '1h 45m', status: 'completed' },
    { id: 2, member: 'Carlos Ruiz', memberId: 'MEM-002', checkIn: '09:00', checkOut: '10:30', duration: '1h 30m', status: 'completed' },
    { id: 3, member: 'Ana Martínez', memberId: 'MEM-003', checkIn: '10:15', checkOut: '-', duration: '-', status: 'active' },
    { id: 4, member: 'Pedro Sánchez', memberId: 'MEM-004', checkIn: '11:00', checkOut: '-', duration: '-', status: 'active' },
    { id: 5, member: 'Laura García', memberId: 'MEM-005', checkIn: '07:00', checkOut: '08:45', duration: '1h 45m', status: 'completed' },
    { id: 6, member: 'Juan Pérez', memberId: 'MEM-006', checkIn: '06:30', checkOut: '08:00', duration: '1h 30m', status: 'completed' },
    { id: 7, member: 'Sofia Ramírez', memberId: 'MEM-007', checkIn: '12:00', checkOut: '-', duration: '-', status: 'active' },
    { id: 8, member: 'Diego Torres', memberId: 'MEM-008', checkIn: '14:30', checkOut: '16:00', duration: '1h 30m', status: 'completed' }
  ];

  const filteredRecords = attendanceRecords.filter(record =>
    record.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Miembros Activos Ahora', value: '3', icon: UserCheck, bg: 'bg-green-100', color: 'text-green-600', pulse: true },
    { label: 'Visitas Completadas Hoy', value: '5', icon: CheckCircle2, bg: 'bg-purple-100', color: 'text-purple-600' },
    { label: 'Total de Asistencias', value: '8', icon: Calendar, bg: 'bg-blue-100', color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Resumen de Asistencias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-neutral-900">{stat.value}</div>
              </div>
              {stat.pulse && <div className="bg-green-500 w-2.5 h-2.5 rounded-full animate-pulse"></div>}
            </div>
            <div className="text-neutral-500 font-medium text-sm ml-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* QR Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Panel Escanear QR */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-[24px] p-8 text-white shadow-lg shadow-purple-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-white/20 p-4 rounded-2xl">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Escanear QR</h3>
              <p className="text-purple-100 text-sm">Registra entrada/salida de miembros</p>
            </div>
          </div>
          <button 
            onClick={() => setShowQRScanner(!showQRScanner)}
            className="w-full py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
          >
            <QrCode size={20} />
            {showQRScanner ? 'Cerrar Escáner' : 'Abrir Escáner QR'}
          </button>
          
          {showQRScanner && (
            <div className="mt-6 bg-neutral-900 rounded-2xl aspect-video flex items-center justify-center border-4 border-white/10 relative overflow-hidden">
               <div className="absolute inset-0 border-2 border-purple-400 opacity-50 animate-pulse m-8"></div>
               <p className="text-purple-400 text-sm font-bold animate-bounce text-center">Buscando código QR...</p>
            </div>
          )}
        </div>

        {/* Panel Generar QR */}
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-neutral-50">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-100 p-3 rounded-xl">
              <QrCode className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Generar QR Miembro</h3>
              <p className="text-neutral-500 text-sm">Crea código QR personal</p>
            </div>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={memberIdInput}
              onChange={(e) => setMemberIdInput(e.target.value)}
              placeholder="ID del Miembro (MEM-001)"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button 
              onClick={() => generateQRCode(memberIdInput)}
              className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all"
            >
              Generar Código QR
            </button>
            {qrCodeUrl && (
              <div className="mt-4 p-4 border-2 border-dashed border-purple-100 rounded-2xl flex flex-col items-center animate-in zoom-in-95">
                <img src={qrCodeUrl} alt="QR" className="w-32 h-32 mb-4" />
                <button className="flex items-center gap-2 text-purple-600 font-bold text-sm hover:underline">
                  <Download size={16} /> Descargar Imagen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de Registros */}
      <div className="bg-white rounded-[24px] shadow-sm border border-neutral-50 overflow-hidden">
        <div className="p-6 border-b border-neutral-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-neutral-900">Registros de Asistencia</h3>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Buscar miembro..." 
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <input type="date" value={selectedDate} className="px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-bold" />
            <button className="p-2 bg-purple-500 text-white rounded-lg"><Download size={18} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50/50 text-neutral-700 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Miembro</th>
                <th className="px-6 py-4 text-center">ID</th>
                <th className="px-6 py-4 text-center">Entrada</th>
                <th className="px-6 py-4 text-center">Salida</th>
                <th className="px-6 py-4 text-center">Duración</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 text-sm">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-purple-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-neutral-900">{r.member}</td>
                  <td className="px-6 py-4 text-center font-semibold text-neutral-500">{r.memberId}</td>
                  <td className="px-6 py-4 text-center"><div className="flex items-center justify-center gap-1.5"><Clock size={14}/> {r.checkIn}</div></td>
                  <td className="px-6 py-4 text-center font-medium">{r.checkOut}</td>
                  <td className="px-6 py-4 text-center font-medium">{r.duration}</td>
                  <td className="px-6 py-4">
                    {r.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-600 rounded-full font-bold text-[11px]">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> En gimnasio
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full font-bold text-[11px]">
                        Completado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfica Horaria */}
      <div className="bg-white rounded-[24px] p-8 shadow-sm border border-neutral-50">
        <h3 className="text-lg font-bold text-neutral-900 mb-8">Distribución de Asistencia por Hora</h3>
        <div className="grid grid-cols-12 gap-3 h-48 items-end">
          {Array.from({ length: 24 }, (_, i) => {
            const h = (Math.sin(i / 3) + 1.2) * 40; // Simulación de curva de afluencia
            return (
              <div key={i} className="group relative flex flex-col items-center">
                <div className="w-full bg-neutral-50 rounded-t-lg h-32 flex items-end relative overflow-hidden">
                  <div 
                    className="w-full bg-purple-500 rounded-t-lg transition-all duration-700 hover:bg-purple-600 cursor-help"
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 mt-2">{i}h</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Asistencias;