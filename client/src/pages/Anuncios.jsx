import React, { useEffect, useState } from 'react';
import { Megaphone, Calendar, AlertTriangle, Info, Bell, Clock, ArrowRight } from 'lucide-react';
import { obtenerAnunciosRequest } from '../api/anuncios';

const Anuncios = () => {
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            const datos = await obtenerAnunciosRequest();
            setAnuncios(datos);
            setLoading(false);
        };
        cargarDatos();
    }, []);

    // Configuración de estilos según el tipo de anuncio
    const getTypeConfig = (tipo) => {
        switch(tipo) {
            case 'Mantenimiento': 
                return { 
                    icon: AlertTriangle, 
                    color: 'text-orange-600', 
                    bg: 'bg-orange-100', 
                    border: 'border-orange-200',
                    badge: 'bg-orange-50 text-orange-700 border-orange-200'
                };
            case 'Evento': 
                return { 
                    icon: Calendar, 
                    color: 'text-purple-600', 
                    bg: 'bg-purple-100', 
                    border: 'border-purple-200',
                    badge: 'bg-purple-50 text-purple-700 border-purple-200'
                };
            case 'Aviso': 
                return { 
                    icon: Megaphone, 
                    color: 'text-blue-600', 
                    bg: 'bg-blue-100', 
                    border: 'border-blue-200',
                    badge: 'bg-blue-50 text-blue-700 border-blue-200'
                };
            default: 
                return { 
                    icon: Info, 
                    color: 'text-neutral-600', 
                    bg: 'bg-neutral-100', 
                    border: 'border-neutral-200',
                    badge: 'bg-neutral-50 text-neutral-700 border-neutral-200'
                };
        }
    };

    const formatDate = (fechaString) => {
        if(!fechaString) return '';
        return new Date(fechaString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    };

    return (
        <section id="anuncios" className="py-24 bg-white border-b border-neutral-100">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Cabecera de Sección */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-200 rotate-3">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Tablón de Anuncios</h2>
                            <p className="text-neutral-500 font-medium">Novedades importantes del gimnasio</p>
                        </div>
                    </div>
                </div>

                {/* Grid de Contenido */}
                {loading ? (
                    // SKELETON LOADING (Efecto de carga)
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-sm h-64 flex flex-col justify-between animate-pulse">
                                <div>
                                    <div className="w-8 h-8 bg-neutral-200 rounded-lg mb-4"></div>
                                    <div className="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-neutral-100 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-neutral-100 rounded w-2/3"></div>
                                </div>
                                <div className="h-4 bg-neutral-100 rounded w-1/4 mt-4"></div>
                            </div>
                        ))}
                    </div>
                ) : anuncios && anuncios.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {anuncios.map((item) => {
                            const config = getTypeConfig(item.tipo || 'General');
                            const Icon = config.icon;

                            return (
                                <div key={item.id} className="group relative bg-white border border-neutral-200 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-300 hover:-translate-y-1">
                                    {/* Cabecera de la Tarjeta */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-3 rounded-2xl transition-colors ${config.bg}`}>
                                            <Icon className={`w-6 h-6 ${config.color}`} />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.badge}`}>
                                            {item.tipo || 'General'}
                                        </span>
                                    </div>

                                    {/* Contenido */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-neutral-900 mb-3 leading-tight group-hover:text-purple-600 transition-colors">
                                            {item.titulo}
                                        </h3>
                                        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3">
                                            {item.contenido}
                                        </p>
                                    </div>

                                    {/* Footer de la Tarjeta */}
                                    <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                                        <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider">
                                            <Clock size={14} />
                                            {formatDate(item.fecha)}
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-purple-600">
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-neutral-50 rounded-[40px] border border-dashed border-neutral-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Info className="w-8 h-8 text-neutral-300" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-1">Todo está tranquilo</h3>
                        <p className="text-neutral-500 text-sm">No hay anuncios nuevos por el momento.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Anuncios;