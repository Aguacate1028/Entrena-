import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ChevronRight, Activity, Zap, Loader, Star } from 'lucide-react';
import GuiaModal from '../components/GuiaModal'; 
import ContratarEntrenadorModal from '../components/ContratarEntrenadorModal'; 
import { obtenerMaquinasRequest } from '../api/guia'; 

const categories = ["Todas", "Cardio", "Pecho", "Espalda", "Piernas", "Hombros", "Brazos", "Abdomen"];

const Guia = () => {
    const [maquinas, setMaquinas] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // ESTADO PARA EL MODAL DE ENTRENADOR
    const [showTrainerModal, setShowTrainerModal] = useState(false);

    useEffect(() => {
        const fetchMaquinas = async () => {
            const data = await obtenerMaquinasRequest();
            setMaquinas(data);
            setLoading(false);
        };
        fetchMaquinas();
    }, []);

    const filteredMachines = maquinas.filter(machine => {
        const matchesCategory = selectedCategory === "Todas" || machine.categoria === selectedCategory;
        const matchesSearch = machine.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Guía de <span className="text-purple-600 bg-purple-50 px-2 rounded-lg">Máquinas</span></h1>
                        <p className="text-neutral-500 text-lg max-w-2xl">
                            Aprende a usar correctamente cada máquina del gimnasio.
                        </p>
                    </div>
                </div>

                {/* --- BANNER PARA CONTRATAR ENTRENADOR (NUEVO) --- */}
                <div className="bg-neutral-900 rounded-[32px] p-8 mb-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-neutral-900/20">
                    <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                            <Star size={12} fill="currentColor" /> Servicio Premium
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">¿Necesitas una rutina personalizada?</h2>
                        <p className="text-neutral-400">Contrata a uno de nuestros entrenadores expertos y obtén un plan diseñado 100% para ti.</p>
                    </div>
                    
                    <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
                        <button 
                            onClick={() => setShowTrainerModal(true)}
                            className="w-full md:w-auto bg-white text-neutral-900 px-8 py-4 rounded-2xl font-bold hover:bg-purple-600  transition-colors flex items-center justify-center gap-2 shadow-lg"
                        > Contratar Entrenador
                        </button>
                    </div>

                    {/* Decoración Fondo */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full"></div>
                    <Activity className="absolute -right-6 -bottom-6 text-white/5 rotate-12" size={200} />
                </div>

                {/* Buscador y Filtros (Igual que antes) */}
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-neutral-100 mb-10">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Buscar máquina o músculo..." 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2
                                    ${selectedCategory === cat 
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {cat === 'Todas' ? <Zap size={14}/> : <Activity size={14}/>}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CONTENIDO */}
                {loading ? (
                    <div className="text-center py-20">
                        <Loader className="animate-spin text-purple-600 mx-auto mb-4" size={40} />
                        <p className="text-gray-400">Cargando guía...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMachines.map(machine => (
                            <div key={machine.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                        <DumbbellIcon size={28} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
                                        ${machine.nivel === 'Principiante' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {machine.nivel}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-neutral-900 mb-2">{machine.nombre}</h3>
                                <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-grow">{machine.descripcion}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {machine.musculos?.slice(0, 2).map((m, i) => (
                                        <span key={i} className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-xs font-bold border border-gray-200">
                                            {m}
                                        </span>
                                    ))}
                                    {machine.musculos?.length > 2 && <span className="text-xs text-gray-400 py-1">+ {machine.musculos.length - 2}</span>}
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                        <span className="flex items-center gap-1"><Activity size={12}/> {machine.series} series</span>
                                        <span>{machine.reps?.replace(' reps','')}</span>
                                    </div>
                                </div>
                                
                                <button onClick={() => setSelectedMachine(machine)}
                                    className="mt-4 w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                                    Ver Guía Completa <ChevronRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredMachines.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-neutral-400 font-medium">No se encontraron máquinas con ese filtro.</p>
                    </div>
                )}

            </div>

            {/* MODAL MAQUINA */}
            {selectedMachine && (
                <GuiaModal 
                    maquina={selectedMachine} 
                    onClose={() => setSelectedMachine(null)} 
                />
            )}

            {/* MODAL ENTRENADOR (NUEVO) */}
            {showTrainerModal && (
                <ContratarEntrenadorModal 
                    onClose={() => setShowTrainerModal(false)}
                />
            )}
        </div>
    );
};

const DumbbellIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" /><path d="M6 4v2a6 6 0 0 0 12 0V4" /></svg>
);

export default Guia;