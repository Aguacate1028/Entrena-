import React, { useContext } from 'react';
import { 
    ArrowRight, Calendar, TrendingUp, Award, Users, 
    Heart, Clock, Flame, Bike, Dumbbell, Star, Check,
    Bell, MessageSquare, Megaphone, PlusCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const HomePage = ({ onRegisterClick }) => {
    const { isAuthenticated, user } = useContext(AuthContext);

    // --- SUB-COMPONENTES INTERNOS ---

    const HeroOrAnnouncements = () => {
        if (isAuthenticated) {
            // DISEÑO: TABLÓN DE ANUNCIOS (CUANDO HAY SESIÓN)
            const anuncios = [
                { id: 1, tag: 'Evento', title: 'Torneo de Bench Press', desc: 'Inscríbete este sábado en recepción.', date: 'Hoy', icon: Trophy },
                { id: 2, tag: 'Clase', title: 'Nueva clase de HIIT', desc: 'A partir del lunes a las 7:00 AM.', date: 'Mañana', icon: Flame },
                { id: 3, tag: 'Mantenimiento', title: 'Zona de Cardio', desc: 'Cerrada por 2 horas el viernes.', date: '20 Dic', icon: Settings }
            ];

            return (
                <section className="bg-neutral-900 py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-12 items-start">
                            {/* Bienvenida y Stats */}
                            <div className="lg:w-1/3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6 animate-pulse">
                                    ¡Hola de vuelta, {user?.nombre}! 👋
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-8">Tu Actividad</h1>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                                        <div className="p-3 bg-purple-500 rounded-xl"><Calendar className="text-white" /></div>
                                        <div><p className="text-2xl font-bold text-white">12</p><p className="text-xs text-neutral-400 uppercase font-bold">Clases este mes</p></div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                                        <div className="p-3 bg-blue-500 rounded-xl"><TrendingUp className="text-white" /></div>
                                        <div><p className="text-2xl font-bold text-white">+15%</p><p className="text-xs text-neutral-400 uppercase font-bold">Progreso mensual</p></div>
                                    </div>
                                </div>
                            </div>

                            {/* El Tablón de Anuncios Real */}
                            <div className="lg:w-2/3 w-full">
                                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            <Megaphone className="text-purple-500" /> Tablón de Anuncios
                                        </h2>
                                        <button className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest">Ver todo</button>
                                    </div>
                                    <div className="space-y-4">
                                        {anuncios.map((anuncio) => (
                                            <div key={anuncio.id} className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 p-5 rounded-2xl transition-all cursor-pointer">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex gap-4">
                                                        <div className="p-3 bg-neutral-800 rounded-xl text-purple-500 group-hover:scale-110 transition-transform"><Megaphone size={20} /></div>
                                                        <div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">{anuncio.tag}</span>
                                                            <h3 className="text-lg font-bold text-white">{anuncio.title}</h3>
                                                            <p className="text-neutral-400 text-sm">{anuncio.desc}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-neutral-500 font-bold">{anuncio.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <PlusCircle size={20} /> Crear Publicación
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            );
        }

        // DISEÑO: HERO TRADICIONAL (CUANDO NO HAY SESIÓN)
        return (
            <section className="relative bg-neutral-900 text-white overflow-hidden min-h-[80vh] flex items-center">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1080&q=80" alt="Gym" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/70 to-transparent"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                            Transforma tu cuerpo,<br /><span className="text-purple-500">Supera tus límites</span>
                        </h1>
                        <p className="text-xl text-neutral-300 mb-10 leading-relaxed">Únete a entrena+ y descubre el mejor gimnasio de la ciudad. Equipamiento de última generación y clases grupales.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={onRegisterClick} className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all font-bold shadow-lg shadow-purple-500/20 active:scale-95">
                                Únete ahora <ArrowRight size={20} />
                            </button>
                            <button onClick={() => document.getElementById('membership-section').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-xl border border-white/10 font-bold hover:bg-white/10 transition-all">
                                Ver planes
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const Stats = () => {
        const stats = [
            { icon: Users, value: '5,000+', label: 'Miembros activos' },
            { icon: Award, value: '50+', label: 'Clases semanales' },
            { icon: Clock, value: '24/7', label: 'Acceso' },
            { icon: Heart, value: '98%', label: 'Satisfacción' }
        ];
        return (
            <section className="py-16 bg-white border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center group">
                            <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <s.icon className="text-purple-500 w-8 h-8" />
                            </div>
                            <div className="text-3xl font-bold text-neutral-900 mb-1">{s.value}</div>
                            <div className="text-sm text-neutral-500 font-bold uppercase tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const Classes = () => {
        const items = [
            { name: 'HIIT Intensivo', icon: Flame, img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80' },
            { name: 'Spinning', icon: Bike, img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
            { name: 'CrossFit', icon: Dumbbell, img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80' },
            { name: 'Yoga Flow', icon: Heart, img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80' }
        ];
        return (
            <section id="clases" className="py-24 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Nuestras Clases</h2>
                        <p className="text-neutral-500">Descubre variedad diseñada para todos los niveles.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {items.map((c, i) => (
                            <div key={i} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-neutral-100">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-xl text-purple-500"><c.icon size={20} /></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-neutral-900 mb-4">{c.name}</h3>
                                    <button className="w-full py-3 bg-neutral-50 hover:bg-purple-500 hover:text-white text-purple-500 font-bold rounded-xl transition-colors text-sm">Reservar Clase</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const Membership = () => {
        const plans = [
            { name: "Básico", price: "29", popular: false, features: ["Acceso 24/7", "Pesas", "Duchas"] },
            { name: "Premium", price: "49", popular: true, features: ["Clases Ilimitadas", "2 Sesiones Pro", "Zona VIP"] },
            { name: "Elite", price: "79", popular: false, features: ["Nutrición", "Masajes", "Prioridad"] }
        ];
        return (
            <section id="membership-section" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-16">Elige tu Plan</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, i) => (
                            <div key={i} className={`p-10 rounded-[40px] border transition-all ${plan.popular ? 'bg-purple-500 text-white shadow-2xl scale-105 border-transparent' : 'bg-white text-neutral-900 border-neutral-100'}`}>
                                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                                <div className="text-5xl font-black mb-8">${plan.price} <span className="text-sm font-normal">/mes</span></div>
                                <ul className="space-y-4 mb-10">
                                    {plan.features.map((f, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm"> <Check size={16} /> {f}</li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 rounded-2xl font-bold ${plan.popular ? 'bg-white text-purple-600' : 'bg-purple-500 text-white'}`}>Seleccionar</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const Footer = () => (
        <footer className="bg-white border-t border-neutral-200 py-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-neutral-500">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-500 p-2 rounded-lg"><Dumbbell className="text-white w-5 h-5" /></div>
                    <span className="text-xl font-bold text-neutral-900">entrena<span className="text-purple-500">+</span></span>
                </div>
                <p className="text-sm font-bold">© 2025 Entrena+. Supera tus límites.</p>
            </div>
        </footer>
    );

    // --- RENDERIZADO FINAL ---
    return (
        <div className="bg-white min-h-screen">
            <HeroOrAnnouncements />
            <Stats />
            <Classes />
            <Membership />
            <Footer />
        </div>
    );
};

// Íconos adicionales para el tablón
const Trophy = (props) => <Award {...props} />;
const Settings = (props) => <Clock {...props} />;

export default HomePage;