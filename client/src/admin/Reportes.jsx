import React, { useState } from 'react';
import { Download, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

const Reportes = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Datos para gráfico de ingresos mensuales
  const revenueData = [
    { month: 'Ene', ingresos: 38000, gastos: 12000 },
    { month: 'Feb', ingresos: 41000, gastos: 13000 },
    { month: 'Mar', ingresos: 39000, gastos: 11500 },
    { month: 'Abr', ingresos: 43000, gastos: 14000 },
    { month: 'May', ingresos: 45280, gastos: 13500 },
    { month: 'Jun', ingresos: 47000, gastos: 14500 }
  ];

  // Datos para gráfico de membresías
  const membershipData = [
    { name: 'Básico', value: 450, color: '#a855f7' },
    { name: 'Premium', value: 620, color: '#8b5cf6' },
    { name: 'Elite', value: 164, color: '#7c3aed' }
  ];

  // Datos para asistencia semanal
  const attendanceData = [
    { day: 'Lun', asistencia: 180 },
    { day: 'Mar', asistencia: 165 },
    { day: 'Mié', asistencia: 190 },
    { day: 'Jue', asistencia: 175 },
    { day: 'Vie', asistencia: 195 },
    { day: 'Sáb', asistencia: 210 },
    { day: 'Dom', asistencia: 145 }
  ];

  const summaryCards = [
    { title: 'Ingresos Totales', value: '$272,280', change: '+18%', trend: 'up', period: 'últimos 6 meses' },
    { title: 'Nuevos Miembros', value: '284', change: '+24%', trend: 'up', period: 'este mes' },
    { title: 'Tasa de Cancelación', value: '3.2%', change: '-0.8%', trend: 'down', period: 'vs mes anterior' },
    { title: 'Asistencia Promedio', value: '180', change: '+12%', trend: 'up', period: 'por día' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['Semana', 'Mes', 'Año'].map((label, idx) => {
            const id = ['week', 'month', 'year'][idx];
            return (
              <button
                key={id}
                onClick={() => setSelectedPeriod(id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors rounded-[24px] p-6 shadow-sm border border-neutral-50 ${
                  selectedPeriod === id
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-white text-neutral-700 hover:bg-purple-50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 border border-neutral-100 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 shadow-md transition-all active:scale-95">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-50 transition-transform hover:scale-[1.02]">
            <div className="text-neutral-500 text-sm font-medium mb-1">{card.title}</div>
            <div className="text-3xl font-extrabold text-neutral-900 mb-2">{card.value}</div>
            <div className="flex items-center gap-2">
              {card.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-bold ${card.trend === 'up' ? 'text-green-500' : 'text-green-500'}`}>{card.change}</span>
              <span className="text-neutral-400 text-xs font-medium">{card.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ingresos vs Gastos */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-50">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">Ingresos vs Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b6b6bff', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b6b6bff', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8f4ff'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
              <Legend verticalAlign="bottom" height={36}/>
              <Bar dataKey="ingresos" fill="#a855f7" name="Ingresos" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" fill="#e5e7eb" name="Gastos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Membresías */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-50">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">Distribución de Membresías</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={membershipData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '12px'}} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {membershipData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-neutral-500 text-xs font-bold">{item.name}</span>
                </div>
                <div className="text-lg font-bold text-neutral-900">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tendencia de Asistencia Semanal */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-50 lg:col-span-2">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">Tendencia de Asistencia Semanal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 12}} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="asistencia"
                stroke="#a855f7"
                strokeWidth={4}
                name="Asistencia"
                dot={{ fill: '#a855f7', strokeWidth: 2, r: 5, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla Detallada */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-50 overflow-hidden">
        <h3 className="text-lg font-bold text-neutral-900 mb-6">Reporte Detallado por Categoría</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-neutral-50">
                <th className="pb-4 font-bold text-neutral-800 text-sm">Categoría</th>
                <th className="pb-4 font-bold text-neutral-800 text-sm text-right">Cantidad</th>
                <th className="pb-4 font-bold text-neutral-800 text-sm text-right">Ingresos</th>
                <th className="pb-4 font-bold text-neutral-800 text-sm text-right">Cambio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {[
                { category: 'Membresías', quantity: '1,234', revenue: '$35,280', change: '+12%', positive: true },
                { category: 'Clases Grupales', quantity: '456', revenue: '$6,840', change: '+8%', positive: true },
                { category: 'Entrenamiento Personal', quantity: '89', revenue: '$8,900', change: '+15%', positive: true },
                { category: 'Productos', quantity: '234', revenue: '$3,260', change: '-3%', positive: false }
              ].map((row, index) => (
                <tr key={index} className="hover:bg-purple-50 transition-colors group">
                  <td className="py-4 text-sm font-semibold text-neutral-700">{row.category}</td>
                  <td className="py-4 text-sm text-right text-neutral-600 font-medium">{row.quantity}</td>
                  <td className="py-4 text-sm text-right text-neutral-900 font-bold">{row.revenue}</td>
                  <td className={`py-4 text-sm text-right font-bold ${row.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {row.change}
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

export default Reportes;