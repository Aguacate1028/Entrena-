import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp 
} from 'lucide-react';

const VistaGeneral = () => {
  const stats = [
    { 
      label: 'Miembros Activos', 
      value: '1,234', 
      change: '+12%', 
      icon: Users, 
      textColor: 'text-purple-600', 
      bg: 'bg-purple-100' 
    },
    { 
      label: 'Ingresos del Mes', 
      value: '$45,280', 
      change: '+8%', 
      icon: DollarSign, 
      textColor: 'text-green-600', 
      bg: 'bg-green-100' 
    },
    { 
      label: 'Asistencia Hoy', 
      value: '156', 
      change: '+5%', 
      icon: Calendar, 
      textColor: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      label: 'Tasa de Retención', 
      value: '94%', 
      change: '+2%', 
      icon: TrendingUp, 
      textColor: 'text-orange-600', 
      bg: 'bg-orange-100' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Panel de Vista General</h1>
          <p className="text-neutral-500">Resumen de tu gimnasio</p>
        </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                {/* Icono de color */}
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                {/* Dato en negrita a un lado del icono */}
                <div className="text-3xl font-bold text-neutral-900">{stat.value}</div>
              </div>
              {/* Porcentaje de cambio */}
              <span className="text-green-600 font-bold text-sm self-start mt-1">{stat.change}</span>
            </div>
            {/* Texto claro debajo */}
            <div className="text-neutral-500 font-medium text-sm ml-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-100">
          <h3 className="text-xl font-bold text-neutral-900 mb-6">Actividad Reciente</h3>
          <div className="space-y-6">
            {[
              { user: 'María López', action: 'Check-in realizado', time: 'Hace 5 min' },
              { user: 'Carlos Ruiz', action: 'Pago procesado - Plan Premium', time: 'Hace 15 min' },
              { user: 'Ana Martínez', action: 'Clase reservada - Yoga Flow', time: 'Hace 30 min' },
              { user: 'Pedro Sánchez', action: 'Nuevo miembro registrado', time: 'Hace 1 hora' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-neutral-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-neutral-900">{activity.user}</div>
                  <div className="text-neutral-600 text-sm">{activity.action}</div>
                  <div className="text-neutral-400 text-xs mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Classes */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-100">
          <h3 className="text-xl font-bold text-neutral-900 mb-6">Clases Populares</h3>
          <div className="space-y-6">
            {[
              { name: 'CrossFit', participants: 45, capacity: 50, percentage: 90 },
              { name: 'HIIT Intensivo', participants: 38, capacity: 40, percentage: 95 },
              { name: 'Yoga Flow', participants: 32, capacity: 40, percentage: 80 },
              { name: 'Spinning', participants: 28, capacity: 30, percentage: 93 }
            ].map((classItem, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-neutral-800">{classItem.name}</span>
                  <span className="text-neutral-500 text-sm">
                    {classItem.participants}/{classItem.capacity}
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2.5">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${classItem.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaGeneral;