import { ArrowRight, Calendar, TrendingUp } from 'lucide-react';

const HeroSection = () => {
    
    // URL de imagen de fondo (adaptada del mock)
    const BACKGROUND_URL = "https://images.unsplash.com/photo-1750698544894-1f012e37e5e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwd29ya291dHxlbnwxfHx8fDE3NjUzMzI3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

    return (
        // Sección con fondo oscuro y texto blanco
        <section className="relative bg-neutral-900 text-white overflow-hidden">
            
            {/* Imagen de Fondo y Overlay Oscuro */}
            <div className="absolute inset-0">
                <img
                    src={BACKGROUND_URL}
                    alt="Gimnasio"
                    className="w-full h-full object-cover opacity-40"
                />
                {/* Degradado para hacer legible el texto */}
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/70 to-transparent"></div>
            </div>

            {/* Contenido principal */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="max-w-2xl">
                    
                    {/* Título y Mensaje Promocional */}
                    <h1 className="text-white mb-6 text-5xl font-extrabold leading-tight">
                        Transforma tu cuerpo,<br />
                        Supera tus límites
                    </h1>
                    
                    <p className="text-xl text-neutral-300 mb-8">
                        Únete a entrena+ y descubre el mejor gimnasio de la ciudad. Clases grupales, entrenadores personales y equipamiento de última generación.
                    </p>

                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Botón principal: Reserva tu clase (Morado) */}
                        <button className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold shadow-lg">
                            Reserva tu clase
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        
                        {/* Botón secundario: Ver planes (Gris/Blanco transparente) */}
                        <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20 font-semibold">
                            Ver planes
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;