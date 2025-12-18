import { Flame, Bike, Dumbbell, Heart, Clock, Users } from 'lucide-react';
const ImageWithFallback = ({ src, alt, className }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    onError={(e) => { 
      // Imagen de respaldo genérica si falla la carga
      e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'; 
    }}
  />
);

const ClassesSection = () => {
  const classes = [
    {
      id: 1,
      name: 'HIIT Intensivo',
      description: 'Entrenamiento de alta intensidad para quemar calorías',
      duration: '45 min',
      capacity: '20 personas',
      difficulty: 'Alta',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      icon: Flame,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 2,
      name: 'Spinning',
      description: 'Ciclismo indoor con música motivadora',
      duration: '50 min',
      capacity: '15 personas',
      difficulty: 'Media',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      icon: Bike,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 3,
      name: 'CrossFit',
      description: 'Entrenamiento funcional de alta intensidad',
      duration: '60 min',
      capacity: '12 personas',
      difficulty: 'Alta',
      image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
      icon: Dumbbell,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      name: 'Yoga Flow',
      description: 'Flexibilidad, fuerza y equilibrio mental',
      duration: '60 min',
      capacity: '25 personas',
      difficulty: 'Baja',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      icon: Heart,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <section id="clases" className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Nuestras Clases</h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Descubre nuestra variedad de clases diseñadas para todos los niveles
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((classItem) => {
            const Icon = classItem.icon;
            return (
              <div
                key={classItem.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={classItem.image}
                    alt={classItem.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 right-4 ${classItem.bgColor} p-3 rounded-full`}>
                    <Icon className={`w-5 h-5 ${classItem.color}`} />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{classItem.name}</h3>
                  <p className="text-neutral-600 mb-4 text-sm line-clamp-2">{classItem.description}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Clock className="w-4 h-4" />
                      <span>{classItem.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Users className="w-4 h-4" />
                      <span>{classItem.capacity}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className={`px-3 py-1 ${classItem.bgColor} ${classItem.color} rounded-full text-xs font-bold uppercase`}>
                      {classItem.difficulty}
                    </span>
                    <button className="text-purple-500 hover:text-purple-600 font-bold text-sm flex items-center gap-1 transition-gap hover:gap-2">
                      Reservar →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;