import { ArrowRight, Calendar, TrendingUp, Award } from 'lucide-react';

const HeroSection = ({ isLoggedIn, userName, onRegisterClick }) => {
    
    const BACKGROUND_URL = "https://images.unsplash.com/photo-1750698544894-1f012e37e5e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwd29ya291dHxlbnwxfHx8fDE3NjUzMzI3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

    // Función para desplazamiento suave a la sección de planes
    const scrollToPlanes = () => {
        const section = document.getElementById('membership-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative bg-neutral-900 text-white overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src={BACKGROUND_URL}
                    alt="Gimnasio"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/70 to-transparent"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <div className="max-w-2xl">
                    
                    {/* Mensaje de Bienvenida condicional */}
                    {isLoggedIn && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            ¡Bienvenido de vuelta, {userName}!
                        </div>
                    )}
                    
                    <h1 className="text-white mb-6 text-5xl md:text-6xl font-extrabold leading-tight">
                        Transforma tu cuerpo,<br />
                        <span className="text-purple-500">Supera tus límites</span>
                    </h1>
                    
                    <p className="text-xl text-neutral-300 mb-10 leading-relaxed">
                        Únete a entrena+ y descubre el mejor gimnasio de la ciudad. Clases grupales, entrenadores personales y equipamiento de última generación.
                    </p>

                    {/* Botones de Acción Condicionales */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        {isLoggedIn ? (
                            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all font-bold shadow-lg shadow-purple-500/20 active:scale-95">
                                Reserva tu clase
                                <Calendar className="w-5 h-5" />
                            </button>
                        ) : (
                            <button 
                                onClick={onRegisterClick}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all font-bold shadow-lg shadow-purple-500/20 active:scale-95"
                            >
                                Únete ahora
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                        
                        <button 
                            onClick={scrollToPlanes}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-xl hover:bg-white/10 transition-all border border-white/10 font-bold active:scale-95"
                        >
                            Ver planes
                        </button>
                    </div>

                    {/* Zona de Estadísticas Rápidas (Solo si hay sesión) */}
                    {isLoggedIn && (
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-purple-400">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-2xl font-bold text-white">12</span>
                                </div>
                                <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Clases este mes</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-purple-400">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-2xl font-bold text-white">+15%</span>
                                </div>
                                <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Progreso mensual</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-purple-400">
                                    <Award className="w-4 h-4" />
                                    <span className="text-2xl font-bold text-white">4/6</span>
                                </div>
                                <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Logros alcanzados</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;