import React, { useState, useEffect } from 'react';
import { 
  DollarSign, ArrowUpRight, CreditCard, 
  Wallet, Landmark, Clock, Download, Loader2, TrendingUp 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { obtenerReporteFinancieroRequest } from '../api/finanzas';

const Finanzas = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const report = await obtenerReporteFinancieroRequest();
    setData(report);
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
        <h2 className="text-xl font-bold text-neutral-700">Consolidando estados de cuenta...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header con Select de Período */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Reporte <span className="text-purple-600">Financiero</span></h1>
            </div>
            <p className="text-neutral-500 font-medium">Análisis de rentabilidad y flujo de efectivo del gimnasio.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <select className="bg-white border border-neutral-200 px-4 py-3 rounded-2xl font-bold text-sm shadow-sm focus:ring-2 focus:ring-purple-500 outline-none">
              <option>Este Mes</option>
              <option>Último Trimestre</option>
              <option>Año 2026</option>
            </select>
          </div>
        </header>

        {/* Métricas con diseño "Glassmorphism" suave */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard 
            label="Ingresos Totales" 
            value={`$${data.metrics.total.toLocaleString()}`} 
            icon={DollarSign} 
            color="purple" 
            sub="Corte al día de hoy"
          />
          <MetricCard 
            label="Ticket Promedio" 
            value={`$${(data.metrics.total / data.metrics.count).toFixed(2)}`} 
            icon={Landmark} 
            color="blue" 
            sub="Por cada transacción"
          />
          <MetricCard 
            label="Volumen Operativo" 
            value={`${data.metrics.count} pagos`} 
            icon={ArrowUpRight} 
            color="green" 
            sub="Transacciones liquidadas"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfica Principal de Rendimiento */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-neutral-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-neutral-800">Crecimiento Mensual</h3>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Actualizado hace un momento</span>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} 
                    itemStyle={{fontWeight: 'bold', color: '#9333ea'}}
                  />
                  <Area type="monotone" dataKey="total" stroke="#9333ea" strokeWidth={4} fill="url(#colorGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* KPI de Fuentes de Ingreso */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-neutral-100 flex flex-col">
            <h3 className="text-xl font-bold text-neutral-800 mb-2">Conceptos</h3>
            <p className="text-neutral-400 text-sm mb-6">¿De dónde viene tu dinero?</p>
            
            <div className="h-[220px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.methodData} innerRadius={70} outerRadius={90} paddingAngle={10} dataKey="value">
                    {data.methodData.map((entry, index) => <Cell key={index} fill={entry.color} cornerRadius={10} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {data.methodData.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: m.color}}/>
                    <span className="text-sm font-bold text-neutral-600">{m.name}</span>
                  </div>
                  <span className="font-black text-neutral-900">{m.value} ops.</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de Auditoría */}
        <div className="mt-8 bg-white rounded-[3rem] shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/30">
            <div>
              <h3 className="text-xl font-bold text-neutral-800">Libro Diario</h3>
              <p className="text-xs text-neutral-400 font-medium">Auditoría detallada de flujos de entrada</p>
            </div>
            <button className="text-sm font-bold text-purple-600 hover:underline">Ver todo el historial</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-10 py-5 text-left">Socio Beneficiario</th>
                  <th className="px-10 py-5 text-left">Glosa de Pago</th>
                  <th className="px-10 py-5 text-center">Fecha Valor</th>
                  <th className="px-10 py-5 text-right">Monto Neto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {data.recentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/80 transition-all group">
                    <td className="px-10 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                          {p.usuarios?.nombre?.charAt(0)}
                        </div>
                        <span className="font-bold text-neutral-800 text-sm">{p.usuarios?.nombre}</span>
                      </div>
                    </td>
                    <td className="px-10 py-5 text-neutral-500 text-sm font-medium">{p.concepto}</td>
                    <td className="px-10 py-5 text-center">
                      <span className="text-xs font-bold text-neutral-400">
                        {new Date(p.fecha).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-10 py-5 text-right">
                      <span className="font-black text-neutral-900 group-hover:text-purple-600 transition-colors">
                        ${Number(p.monto).toLocaleString()}
                      </span>
                    </td>
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

const MetricCard = ({ label, value, icon: Icon, color, sub }) => {
  const themes = {
    purple: 'border-purple-100 hover:border-purple-400',
    blue: 'border-blue-100 hover:border-blue-400',
    green: 'border-green-100 hover:border-green-400',
  };
  const iconThemes = {
    purple: 'bg-purple-600 text-white',
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
  };

  return (
    <div className={`p-8 bg-white rounded-[3rem] border-2 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 ${themes[color]}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl shadow-lg ${iconThemes[color]}`}><Icon size={24}/></div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">{label}</p>
      <p className="text-4xl font-black text-neutral-900 tracking-tighter mb-1">{value}</p>
      <p className="text-xs font-bold text-neutral-400">{sub}</p>
    </div>
  );
};

export default Finanzas;