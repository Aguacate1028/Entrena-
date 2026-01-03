import { ArrowRight, Calendar } from 'lucide-react';
import Clases from '../components/Clases';

const Home = ({ user }) => { 
    
    const BACKGROUND_URL = "https://www.staywithstylescottsdale.com/wp-content/uploads/2024/03/Featured-Image-Scottsdale-Gyms-1024x512.jpg";

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative bg-neutral-900 text-white min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
            {/* FONDO */}
            <div className="absolute inset-0">
                <img
                    src={BACKGROUND_URL}
                    alt="Gimnasio Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent"></div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-2xl animate-fade-in-up">
                    
                    {user && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6">
                            ¡Hola de nuevo, {user.nombre}! 👋
                        </div>
                    )}

                    <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                        Transforma tu cuerpo,<br />
                        <span className="text-purple-500">Supera tus límites</span>
                    </h1>
                    
                    <p className="text-xl text-neutral-300 mb-10 leading-relaxed max-w-lg">
                        Únete a entrena+ y descubre el mejor gimnasio de la ciudad. Equipamiento de última generación y comunidad inigualable.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => scrollToSection('membresias')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all font-bold shadow-lg shadow-purple-500/20 active:scale-95 cursor-pointer"
                        >
                            Comenzar ahora <ArrowRight size={20} />
                        </button>
                        
                        <button 
                            onClick={() => scrollToSection('clases')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-xl border border-white/10 font-bold hover:bg-white/10 transition-all cursor-pointer"
                        >
                            Ver clases <Calendar size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>   
    );
};

export default Home;