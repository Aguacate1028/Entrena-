import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Users, ArrowUpRight, CreditCard, 
  Wallet, Landmark, Clock, Download, Loader2 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { obtenerPagosRequest } from '../api/finanzas';

const Finanzas = () => {
  const [metrics, setMetrics] = useState({ total: 0, count: 0, pending: 0 });
  const [chartData, setChartData] = useState([]);
  const [methodData, setMethodData] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const pagos = await obtenerPagosRequest();
      
      if (pagos && pagos.length > 0) {
        // 1. Procesar Ingresos y Pendientes
        const total = pagos.filter(p => p.estado_pago === 'Completado').reduce((acc, p) => acc + Number(p.monto), 0);
        const pending = pagos.filter(p => p.estado_pago === 'Pendiente').reduce((acc, p) => acc + Number(p.monto), 0);
        
        // 2. Procesar Métodos de Pago para Gráfica Circular
        const metodos = {
          Tarjeta: pagos.filter(p => p.metodo_pago === 'Tarjeta').length,
          Efectivo: pagos.filter(p => p.metodo_pago === 'Efectivo').length,
          Transferencia: pagos.filter(p => p.metodo_pago === 'Transferencia').length,
        };

        setMethodData([
          { name: 'Tarjeta', value: metodos.Tarjeta, color: '#9333ea' },
          { name: 'Efectivo', value: metodos.Efectivo, color: '#22c55e' },
          { name: 'Transfer', value: metodos.Transferencia, color: '#3b82f6' },
        ]);

        // 3. Simular Historial para Gráfica de Área
        setChartData([
          { name: 'Ago', total: 500 }, { name: 'Sep', total: 700 },
          { name: 'Oct', total: 900 }, { name: 'Nov', total: 850 },
          { name: 'Dic', total: 1100 }, { name: 'Ene', total: total }
        ]);

        setMetrics({ total, count: pagos.length, pending });
        setRecentPayments(pagos.slice(0, 6));
      }
    } catch (error) {
      console.error("Error al cargar finanzas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-purple-600" size={40} />
        <p className="font-bold text-neutral-500">Analizando balance general...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Panel <span className="text-purple-600">Financiero</span></h1>
            <p className="text-neutral-500 font-medium">Resumen de transacciones y rentabilidad del mes.</p>
          </div>
          <button className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-black transition-all">
            <Download size={18}/> Descargar Reporte
          </button>
        </header>

        {/* MÉTRICAS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard label="Caja Total" value={`$${metrics.total}`} icon={DollarSign} color="purple" trend="+15%" />
          <MetricCard label="Pagos por Cobrar" value={`$${metrics.pending}`} icon={Clock} color="orange" trend="Pendientes" />
          <MetricCard label="Operaciones" value={metrics.count} icon={ArrowUpRight} color="green" trend="Mensual" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GRÁFICA DE INGRESOS */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-neutral-100">
            <h3 className="text-xl font-bold text-neutral-800 mb-8">Flujo de Ingresos</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="total" stroke="#a855f7" strokeWidth={4} fill="url(#colorGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MÉTODOS DE PAGO */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-neutral-100 flex flex-col items-center">
            <h3 className="text-xl font-bold text-neutral-800 mb-6 w-full text-center">Distribución de Pagos</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={methodData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                    {methodData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-3 mt-6">
              {methodData.map((m, i) => (
                <div key={i} className="flex justify-between items-center text-sm font-bold">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: m.color}}/> <span className="text-neutral-500 uppercase">{m.name}</span></div>
                  <span className="text-neutral-900">{m.value} ops.</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABLA DE ÚLTIMOS PAGOS */}
        <div className="mt-8 bg-white rounded-[40px] shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 border-b border-neutral-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-neutral-800">Transacciones Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Socio</th>
                  <th className="px-8 py-4">Concepto</th>
                  <th className="px-8 py-4">Método</th>
                  <th className="px-8 py-4">Estado</th>
                  <th className="px-8 py-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {recentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-neutral-800 text-sm">{p.usuarios?.nombre}</td>
                    <td className="px-8 py-5 text-neutral-500 text-sm">{p.concepto}</td>
                    <td className="px-8 py-5">
                       <span className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                          {p.metodo_pago === 'Tarjeta' ? <CreditCard size={14}/> : p.metodo_pago === 'Efectivo' ? <Wallet size={14}/> : <Landmark size={14}/>}
                          {p.metodo_pago}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${p.estado_pago === 'Completado' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        {p.estado_pago}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-neutral-900">${p.monto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon: Icon, color, trend }) => {
  const styles = {
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };
  return (
    <div className={`p-8 rounded-[40px] border-2 shadow-sm transition-transform hover:scale-105 ${styles[color]}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-white rounded-3xl shadow-sm"><Icon size={28}/></div>
        <span className="text-[10px] font-black uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full">{trend}</span>
      </div>
      <p className="text-[11px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
};

export default Finanzas;