import React from 'react';
import { Clock, Users, ChevronRight, Heart } from 'lucide-react';

const ClassesSection = () => {
    const classes = [
        { title: "HIIT Intensivo", desc: "Entrenamiento de alta intensidad para quemar calorías", time: "45 min", capacity: "20 personas", level: "Alta", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80" },
        { title: "Spinning", desc: "Ciclismo indoor con música motivadora", time: "50 min", capacity: "15 personas", level: "Media", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80" },
        { title: "CrossFit", desc: "Entrenamiento funcional de alta intensidad", time: "60 min", capacity: "12 personas", level: "Alta", img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&q=80" },
        { title: "Yoga Flow", desc: "Flexibilidad, fuerza y equilibrio mental", time: "60 min", capacity: "25 personas", level: "Baja", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80" }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2">Nuestras Clases</h2>
                    <p className="text-3xl font-extrabold text-neutral-900">Descubre nuestra variedad de clases diseñadas para todos los niveles</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {classes.map((item, idx) => (
                        <div key={idx} className="group bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="relative h-48">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-neutral-400 hover:text-purple-500 transition-colors">
                                    <Heart size={18} />
                                </button>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-neutral-900 mb-2">{item.title}</h3>
                                <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{item.desc}</p>
                                <div className="flex items-center gap-4 text-neutral-400 text-xs mb-6 font-medium">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {item.time}</span>
                                    <span className="flex items-center gap-1"><Users size={14} /> {item.capacity}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        item.level === 'Alta' ? 'bg-red-50 text-red-500' : 
                                        item.level === 'Media' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
                                    }`}>{item.level}</span>
                                    <button className="text-purple-500 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                        Reservar <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClassesSection;