import React, { useEffect, useState } from 'react';
import { Check, Star, Crown } from 'lucide-react';
import { obtenerMembresiasRequest } from '../api/membresias';

const Membresias = () => {
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPlanes = async () => {
            const data = await obtenerMembresiasRequest();
            setPlanes(data);
            setLoading(false);
        };
        cargarPlanes();
    }, []);

    return (
        <section className="py-24 bg-white min-h-screen" id="membresias">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-3">Planes y Precios</h2>
                    <h3 className="text-4xl font-black text-neutral-900 tracking-tight">Elige tu transformación</h3>
                    <p className="text-neutral-500 mt-4 max-w-xl mx-auto">Sin contratos forzosos. Cancela cuando quieras.</p>
                </div>

                {loading ? (
                    // --- SKELETON LOADING ---
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[500px] bg-neutral-50 rounded-[40px] border border-neutral-200 animate-pulse p-10">
                                <div className="h-8 bg-neutral-200 rounded w-1/2 mb-6"></div>
                                <div className="h-16 bg-neutral-200 rounded w-3/4 mb-8"></div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-neutral-200 rounded w-full"></div>
                                    <div className="h-4 bg-neutral-200 rounded w-full"></div>
                                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : planes.length > 0 ? (
                    // --- GRID DE PLANES ---
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {planes.map((plan) => (
                            <div 
                                key={plan.id} 
                                className={`relative p-10 rounded-[40px] border transition-all duration-500 group
                                    ${plan.popular 
                                        ? 'bg-neutral-900 text-white shadow-2xl shadow-purple-500/20 scale-105 border-purple-500 z-10' 
                                        : 'bg-white text-neutral-900 border-neutral-100 hover:border-purple-200 hover:shadow-xl'
                                    }`}
                            >
                                {/* Etiqueta de Popular */}
                                {plan.popular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                        <Crown size={14} fill="currentColor" /> Más Popular
                                    </div>
                                )}

                                <h3 className="text-xl font-bold mb-2">{plan.nombre}</h3>
                                <p className={`text-sm mb-6 ${plan.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                    Perfecto para empezar
                                </p>
                                
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-extrabold">${plan.precio}</span>
                                    <span className={`text-sm font-medium ${plan.popular ? 'text-neutral-400' : 'text-neutral-400'}`}>/mes</span>
                                </div>

                                <div className={`h-px w-full mb-8 ${plan.popular ? 'bg-white/10' : 'bg-neutral-100'}`}></div>

                                <ul className="space-y-4 mb-10">
                                    {plan.caracteristicas && plan.caracteristicas.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm font-medium leading-relaxed">
                                            <div className={`mt-0.5 p-0.5 rounded-full ${plan.popular ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600'}`}>
                                                <Check size={12} strokeWidth={4} /> 
                                            </div>
                                            <span className={plan.popular ? 'text-neutral-300' : 'text-neutral-600'}>{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 transform active:scale-95
                                    ${plan.popular 
                                        ? 'bg-purple-500 text-white hover:bg-purple-400 shadow-lg shadow-purple-500/40' 
                                        : 'bg-neutral-50 text-neutral-900 hover:bg-neutral-100 border border-neutral-200'
                                    }`}>
                                    Seleccionar {plan.nombre}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                        <p className="text-neutral-400">No hay planes disponibles en este momento.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Membresias;