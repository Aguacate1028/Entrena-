import { Users, Award, Clock, Heart } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: '5,000+',
      label: 'Miembros activos',
      color: 'text-purple-500',
      bg: 'bg-purple-100'
    },
    {
      icon: Award,
      value: '50+',
      label: 'Clases semanales',
      color: 'text-purple-500',
      bg: 'bg-purple-100'
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Acceso al gimnasio',
      color: 'text-purple-500',
      bg: 'bg-purple-100'
    },
    {
      icon: Heart,
      value: '98%',
      label: 'Satisfacción',
      color: 'text-purple-500',
      bg: 'bg-purple-100'
    }
  ];

  return (
    // Sección de fondo blanco
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                {/* Contenedor circular con color de acento */}
                <div className={`${stat.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                {/* Valores */}
                <div className="text-3xl text-neutral-900 mb-1 font-bold">{stat.value}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;