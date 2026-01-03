import React, { useEffect, useState } from 'react';
import { Users, Award, Clock, Heart } from 'lucide-react';
import { obtenerStatsPublicas } from '../api/landing';

const Informacion = () => {
    // Estado inicial con valores en 0
    const [stats, setStats] = useState({
        miembros: 0,
        clases: 0,
        acceso: '24/7',
        satisfaccion: '98%'
    });

    useEffect(() => {
        const cargarStats = async () => {
            const data = await obtenerStatsPublicas();
            setStats(data);
        };
        cargarStats();
    }, []);

    return (
        <section className="py-24 bg-white border-b border-neutral-100">
             <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-neutral-900">Sobre Entrena+</h2>
                    <p className="text-neutral-500 mt-4">Comprometidos con tu salud y resultados desde 2025.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {/* STAT 1: MIEMBROS REALES */}
                    <div className="text-center group">
                        <div className="bg-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
                            <Users className="text-purple-500 w-8 h-8" />
                        </div>
                        <div className="text-4xl font-black text-neutral-900 mb-2">
                            {/* Mostramos el dato dinámico */}
                            {stats.miembros}
                        </div>
                        <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Miembros Registrados</div>
                    </div>

                    {/* STAT 2: CLASES REALES */}
                    <div className="text-center group">
                        <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:-rotate-6 transition-transform duration-300">
                            <Award className="text-blue-500 w-8 h-8" />
                        </div>
                        <div className="text-4xl font-black text-neutral-900 mb-2">
                             {stats.clases}+
                        </div>
                        <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Clases Disponibles</div>
                    </div>

                    {/* STAT 3: ACCESO (Configurable desde backend) */}
                    <div className="text-center group">
                        <div className="bg-green-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
                            <Clock className="text-green-500 w-8 h-8" />
                        </div>
                        <div className="text-4xl font-black text-neutral-900 mb-2">
                            {stats.acceso}
                        </div>
                        <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Horario</div>
                    </div>

                    {/* STAT 4: SATISFACCIÓN */}
                    <div className="text-center group">
                        <div className="bg-red-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:-rotate-6 transition-transform duration-300">
                            <Heart className="text-red-500 w-8 h-8" />
                        </div>
                        <div className="text-4xl font-black text-neutral-900 mb-2">
                            {stats.satisfaccion}
                        </div>
                        <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Satisfacción</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Informacion;