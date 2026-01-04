import React, { useEffect, useState } from 'react';
import { Flame, ArrowRight, Zap } from 'lucide-react';
import { obtenerClasesRequest } from '../api/clases';
import ClaseDetalleModal from './ClaseDetalleModal'; 

const Clases = ({ isLoggedIn, onOpenLogin }) => {
    const [clasesData, setClasesData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedClassId, setSelectedClassId] = useState(null);

    useEffect(() => {
        const cargarClases = async () => {
            const data = await obtenerClasesRequest();
            setClasesData(data);
            setLoading(false);
        };
        cargarClases();
    }, []);

    // Manejar Click
    const handleReservarClick = (claseId) => {
        if (isLoggedIn) {
            // AHORA: Abrimos el modal guardando el ID en el estado
            setSelectedClassId(claseId);
        } else {
            if (onOpenLogin) onOpenLogin();
        }
    };

    const getImage = (nombreClase) => {
        const nombre = nombreClase?.toLowerCase() || '';
        if (nombre.includes('yoga')) return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80';
        if (nombre.includes('crossfit') || nombre.includes('hiit')) return 'https://www.crossfit.com/wp-content/uploads/2024/06/28104219/2024-Crossfit-Double-Under-Workout-Workout-Of-The-Day-768x432.jpg';
        if (nombre.includes('box')) return 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80';
        if (nombre.includes('spin') || nombre.includes('ciclo')) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80';
        if (nombre.includes('pilates')) return'https://bswh-p-001.sitecorecontenthub.cloud/api/public/content/0e2f5cc2f8484314928480979db82295?v=9452ef71';
        if (nombre.includes('zumba')) return 'https://www.arthritis.org//getmedia/22ed138c-e58f-4647-92bd-009f174f5207/zumba_dance-based_fitness_600x400.jpg';
        return 'https://static.vecteezy.com/system/resources/previews/001/822/345/non_2x/a-cartoon-character-set-of-exercise-man-using-dumbbell-and-doing-push-ups-free-vector.jpg';
    };

    return (
        <section id="clases" className="py-24 bg-neutral-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-black text-neutral-900 tracking-tight">
                        Nuestras <span className="text-purple-600">Clases</span>
                    </h2>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-medium">
                        Descubre tu potencial con nuestros entrenamientos.
                    </p>
                </div>

                {/* GRID DE CLASES */}
                {!loading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {clasesData.map((clase) => (
                            <div key={clase.id} className="group bg-white rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border border-neutral-100 hover:-translate-y-2 flex flex-col h-full">
                               <div className="h-56 overflow-hidden relative">
                                    <img 
                                        src={getImage(clase.nombre)} 
                                        alt={clase.nombre} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                    
                                    {/* Icono Flama (Intensidad) */}
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 p-2 rounded-xl text-white shadow-lg">
                                        <Flame size={20} className="fill-orange-500 text-orange-500" />
                                    </div>
                                </div>
                                
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{clase.nombre}</h3>
                                    {/* ... info ... */}
                                    <div className="mt-auto"> {/* Empuja el botón al fondo */}
                                        <button 
                                            onClick={() => handleReservarClick(clase.id)}
                                            className="w-full py-3.5 bg-neutral-900 text-white font-bold rounded-xl transition-all hover:bg-purple-600 active:scale-95 flex items-center justify-center gap-2 group/btn cursor-pointer"
                                        >
                                            Ver Detalles
                                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RENDERIZADO DEL MODAL (Si hay un ID seleccionado) */}
            {selectedClassId && (
                <ClaseDetalleModal 
                    claseId={selectedClassId} 
                    onClose={() => setSelectedClassId(null)} // Función para cerrar (limpia el estado)
                />
            )}

        </section>
    );
};

export default Clases;