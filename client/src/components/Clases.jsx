import React, { useEffect, useState } from 'react';
import { Clock, Users, Flame, ArrowRight, Zap } from 'lucide-react';
import { obtenerClasesRequest } from '../api/clases';

const Clases = () => {
    const [clasesData, setClasesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarClases = async () => {
            const data = await obtenerClasesRequest();
            setClasesData(data);
            setLoading(false);
        };
        cargarClases();
    }, []);

 
    const getImage = (nombreClase) => {
        const nombre = nombreClase?.toLowerCase() || '';
        if (nombre.includes('yoga')) return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80';
        if (nombre.includes('crossfit') || nombre.includes('hiit')) return 'https://images.unsplash.com/photo-1517963879466-e9b5ce382569?w=800&q=80';
        if (nombre.includes('box')) return 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80';
        if (nombre.includes('spin') || nombre.includes('ciclo')) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80';
        // Imagen por defecto (Gym general)
        return 'https://images.unsplash.com/photo-1534258936925-c48947387e3b?w=800&q=80';
    };

    return (
        <section id="clases" className="py-24 bg-neutral-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CABECERA */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-black text-neutral-900 tracking-tight">
                        Nuestras <span className="text-purple-600">Clases</span>
                    </h2>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-medium">
                        Descubre tu potencial con nuestros entrenamientos diseñados para todos los niveles.
                    </p>
                </div>

                {loading ? (
                    // --- SKELETON LOADING ---
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-[32px] h-[400px] animate-pulse border border-neutral-200">
                                <div className="h-48 bg-neutral-200 rounded-t-[32px]"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-neutral-200 rounded w-full"></div>
                                    <div className="h-10 bg-neutral-200 rounded-xl mt-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : clasesData.length > 0 ? (
                    // --- GRID DE CLASES REAL ---
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {clasesData.map((clase) => (
                            <div key={clase.id} className="group bg-white rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border border-neutral-100 hover:-translate-y-2 flex flex-col h-full">
                                
                                {/* IMAGEN */}
                                <div className="h-56 overflow-hidden relative">
                                    <img 
                                        src={getImage(clase.nombre)} 
                                        alt={clase.nombre} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                    {/* Overlay gradiente */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                    
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 p-2 rounded-xl text-white shadow-lg">
                                        <Flame size={20} className="fill-orange-500 text-orange-500" />
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                                            Intensidad Alta
                                        </span>
                                    </div>
                                </div>
                                
                                {/* INFO */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-purple-600 transition-colors">
                                        {clase.nombre}
                                    </h3>
                                    <p className="text-neutral-500 text-sm mb-6 line-clamp-2 flex-grow">
                                        {clase.descripcion || 'Entrenamiento especializado para mejorar tu resistencia y fuerza.'}
                                    </p>
                                    
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded-lg">
                                            <Clock size={16} className="text-purple-500" />
                                            <span className="text-xs font-bold text-neutral-600">
                                                {clase.horario ? clase.horario.slice(0, 5) : '60 min'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded-lg">
                                            <Users size={16} className="text-blue-500" />
                                            <span className="text-xs font-bold text-neutral-600">
                                                {clase.cupo || 20} Cupos
                                            </span>
                                        </div>
                                    </div>

                                    <button className="w-full py-3.5 bg-neutral-900 text-white font-bold rounded-xl transition-all hover:bg-purple-600 active:scale-95 flex items-center justify-center gap-2 group/btn">
                                        Reservar Lugar
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // --- ESTADO VACÍO ---
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-neutral-300">
                        <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="text-purple-400 w-8 h-8" />
                        </div>
                        <p className="text-neutral-900 font-bold text-lg">No hay clases disponibles</p>
                        <p className="text-neutral-500 text-sm mt-1">Vuelve a consultar más tarde.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Clases;