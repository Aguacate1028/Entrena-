import React, { useState } from 'react';
import { Search, Download, CheckCircle, Clock, XCircle, CreditCard, DollarSign } from 'lucide-react';

const Pagos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const payments = [
    { id: 'PAY-001', member: 'María López', email: 'maria@email.com', plan: 'Premium', amount: '$49.00', date: '2024-12-08', status: 'completed', method: 'Tarjeta de Crédito' },
    { id: 'PAY-002', member: 'Carlos Ruiz', email: 'carlos@email.com', plan: 'Básico', amount: '$29.00', date: '2024-12-08', status: 'completed', method: 'Débito' },
    { id: 'PAY-003', member: 'Ana Martínez', email: 'ana@email.com', plan: 'Elite', amount: '$79.00', date: '2024-12-07', status: 'pending', method: 'Transferencia' },
    { id: 'PAY-004', member: 'Pedro Sánchez', email: 'pedro@email.com', plan: 'Premium', amount: '$49.00', date: '2024-12-07', status: 'completed', method: 'Tarjeta de Crédito' },
    { id: 'PAY-005', member: 'Laura García', email: 'laura@email.com', plan: 'Básico', amount: '$29.00', date: '2024-12-06', status: 'failed', method: 'Tarjeta de Crédito' },
    { id: 'PAY-006', member: 'Juan Pérez', email: 'juan@email.com', plan: 'Premium', amount: '$49.00', date: '2024-12-06', status: 'completed', method: 'PayPal' },
    { id: 'PAY-007', member: 'Sofia Ramírez', email: 'sofia@email.com', plan: 'Elite', amount: '$79.00', date: '2024-12-05', status: 'completed', method: 'Tarjeta de Crédito' },
    { id: 'PAY-008', member: 'Diego Torres', email: 'diego@email.com', plan: 'Básico', amount: '$29.00', date: '2024-12-05', status: 'pending', method: 'Transferencia' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
            <CheckCircle className="w-4 h-4" /> Completado
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-bold">
            <Clock className="w-4 h-4" /> Pendiente
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
            <XCircle className="w-4 h-4" /> Fallido
          </span>
        );
      default: return null;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.member.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const summary = [
    { label: 'Total Recaudado', value: '$255.00', icon: DollarSign, bg: 'bg-green-100', color: 'text-green-600' },
    { label: 'Pagos Pendientes', value: '$108.00', icon: Clock, bg: 'bg-yellow-100', color: 'text-yellow-600' },
    { label: 'Transacciones Totales', value: '8', icon: CreditCard, bg: 'bg-purple-100', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summary.map((item, i) => (
          <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-50 transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-2">
              <div className={`${item.bg} p-3 rounded-xl`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="text-3xl font-bold text-neutral-900">{item.value}</div>
            </div>
            <div className="text-neutral-500 font-medium text-sm ml-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white border border-neutral-100 rounded-xl font-semibold text-neutral-700 outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completados</option>
              <option value="pending">Pendientes</option>
              <option value="failed">Fallidos</option>
            </select>
            <button className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 shadow-lg shadow-purple-100 transition-all active:scale-95">
              <Download className="w-5 h-5" /> Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-neutral-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50/50 border-b border-neutral-100 text-left">
              <tr>
                {['ID', 'Miembro', 'Plan', 'Método', 'Monto', 'Fecha', 'Estado', 'Acciones'].map((th) => (
                  <th key={th} className={`py-4 px-6 font-bold text-neutral-800 text-sm ${th === 'Monto' ? 'text-right' : ''} ${th === 'Acciones' ? 'text-center' : ''}`}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-purple-50 transition-colors group">
                  <td className="py-5 px-6 text-sm font-semibold text-neutral-600">{p.id}</td>
                  <td className="py-5 px-6">
                    <div className="font-bold text-neutral-900">{p.member}</div>
                    <div className="text-neutral-400 text-xs">{p.email}</div>
                  </td>
                  <td className="py-5 px-6 text-sm text-neutral-600">{p.plan}</td>
                  <td className="py-5 px-6 text-sm text-neutral-600">{p.method}</td>
                  <td className="py-5 px-6 text-right font-bold text-neutral-900">{p.amount}</td>
                  <td className="py-5 px-6 text-sm text-neutral-500">{p.date}</td>
                  <td className="py-5 px-6">{getStatusBadge(p.status)}</td>
                  <td className="py-5 px-6 text-center">
                    <button className="text-purple-500 font-bold text-sm hover:text-purple-700">Ver detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pagos;