import React from 'react';
import { Check, Star } from 'lucide-react';

const MembershipSection = () => {
    const plans = [
        { name: "Básico", price: "29", popular: false, features: ["Acceso al gimnasio 24/7", "Área de cardio y pesas", "Vestuarios y duchas", "App móvil entrena+"] },
        { name: "Premium", price: "49", popular: true, features: ["Todo lo del plan Básico", "Clases grupales ilimitadas", "2 sesiones de entrenamiento personal", "Evaluación física mensual", "Acceso a zona VIP"] },
        { name: "Elite", price: "79", popular: false, features: ["Todo lo del plan Premium", "Entrenador personal dedicado", "Plan de nutrición personalizado", "Masajes deportivos mensuales", "Prioridad en reservas"] }
    ];

    const testimonials = [
        { name: "Maria González", role: "Miembro desde 2023", text: "Entrena+ ha cambiado completamente mi vida. Los entrenadores son increíbles y el ambiente es muy motivador. ¡He perdido 15kg en 6 meses!", img: "👩‍🦰" },
        { name: "Carlos Ramírez", role: "Miembro desde 2022", text: "Las instalaciones son de primera y las clases grupales son muy divertidas. El mejor gimnasio donde he estado sin duda.", img: "👨‍🦱" },
        { name: "Ana Martínez", role: "Miembro desde 2024", text: "Acceso 24/7 es perfecto para mi horario. El personal siempre está dispuesto a ayudar y me siento como en casa.", img: "👩" }
    ];

    return (
        <section id="membership-section" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-2">Elige tu Plan</h2>
                    <p className="text-neutral-600">Selecciona la membresía que mejor se adapte a tus objetivos</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {plans.map((plan, i) => (
                        <div key={i} className={`p-10 rounded-[40px] border transition-all duration-500 ${plan.popular ? 'bg-purple-500 text-white shadow-2xl scale-105 border-transparent' : 'bg-white text-neutral-900 border-neutral-100 hover:border-purple-200'}`}>
                            <h3 className="text-xl font-bold mb-6">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-5xl font-extrabold">${plan.price}</span>
                                <span className={plan.popular ? 'text-purple-100' : 'text-neutral-400'}>/mes</span>
                            </div>
                            <button className={`w-full py-4 rounded-2xl font-bold text-sm mb-10 transition-colors ${plan.popular ? 'bg-white text-purple-600 hover:bg-neutral-100' : 'bg-purple-500 text-white hover:bg-purple-600'}`}>
                                Comenzar ahora
                            </button>
                            <ul className="space-y-4">
                                {plan.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm">
                                        <Check size={18} className={plan.popular ? 'text-purple-200' : 'text-purple-500'} /> {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Testimonios */}
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold text-neutral-900 mb-2">Lo que dicen nuestros miembros</h2>
                    <p className="text-neutral-500">Miles de personas han transformado sus vidas con entrena+</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-purple-500 text-purple-500" />)}
                            </div>
                            <p className="text-neutral-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-lg">{t.img}</div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-900">{t.name}</p>
                                    <p className="text-xs text-neutral-400">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MembershipSection;