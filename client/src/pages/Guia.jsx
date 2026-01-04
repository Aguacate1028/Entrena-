import React, { useState, useEffect, useContext } from 'react';
import { BookOpen, Search, ChevronRight, Activity, Zap, Loader, Star, UserPlus, Check, MessageCircle, XCircle } from 'lucide-react';
import GuiaModal from '../components/GuiaModal'; 
import ContratarEntrenadorModal from '../components/ContratarEntrenadorModal'; 
import ConfirmModal from '../components/ConfirmModal'; // <--- 1. IMPORTAR NUEVO MODAL
import { obtenerMaquinasRequest } from '../api/guia'; 
import { obtenerPerfilRequest } from '../api/usuarios'; 
import { cancelarEntrenadorRequest } from '../api/entrenadores'; 
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const categories = ["Todas", "Cardio", "Pecho", "Espalda", "Piernas", "Hombros", "Brazos", "Abdomen"];

const Guia = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const { addToast } = useToast();

    const [maquinas, setMaquinas] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [datosUsuario, setDatosUsuario] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Modales
    const [showTrainerModal, setShowTrainerModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // <--- ESTADO PARA EL MODAL
    const [canceling, setCanceling] = useState(false); // <--- ESTADO DE CARGA PARA CANCELAR

    // Cargar datos
    useEffect(() => {
        const cargarTodo = async () => {
            const dataMaquinas = await obtenerMaquinasRequest();
            setMaquinas(dataMaquinas);
            if (isAuthenticated && user) {
                await recargarUsuario();
            }
            setLoading(false);
        };
        cargarTodo();
    }, [isAuthenticated, user]);

    const recargarUsuario = async () => {
        if (!user) return;
        const id = user.id_usuario || user.id;
        const data = await obtenerPerfilRequest(id);
        setDatosUsuario(data);
    };

    // --- LÓGICA DE CANCELACIÓN ---

    // 1. Abrir Modal (Solo abre, no ejecuta nada aún)
    const handleClicCancelar = () => {
        setShowConfirmModal(true);
    };

    // 2. Ejecutar Acción (Se llama desde el modal)
    const procederCancelacion = async () => {
        setCanceling(true);
        try {
            await cancelarEntrenadorRequest(datosUsuario.id_usuario);
            addToast("Servicio cancelado correctamente", "success");
            await recargarUsuario(); 
            setShowConfirmModal(false); // Cerrar modal al terminar
        } catch (error) {
            addToast("Error al cancelar", "error");
        } finally {
            setCanceling(false);
        }
    };

    // WhatsApp
    const abrirWhatsApp = () => {
        if (!datosUsuario?.entrenador_data) return;
        const { telefono, nombre } = datosUsuario.entrenador_data;
        const msg = `Hola ${nombre}, soy ${datosUsuario.nombre}. Tengo dudas sobre mi rutina.`;
        window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(msg)}`, '_blank');
    };

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

                {/* --- LÓGICA DE VISTAS --- */}
                
                {datosUsuario?.entrenador_activo && datosUsuario?.entrenador_data ? (
                    
                    // VISTA: CON ENTRENADOR
                    <div className="bg-white rounded-[32px] p-8 mb-10 shadow-lg shadow-purple-500/5 border border-purple-100 flex flex-col md:flex-row gap-8 relative overflow-hidden animate-fade-in">
                        <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-6 flex-grow">
                            <div className="relative">
                                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center text-3xl font-bold text-neutral-400 border-4 border-white shadow-md">
                                    {datosUsuario.entrenador_data.nombre.charAt(0)}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1.5 rounded-full border-2 border-white">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                            </div>
                            
                            <div className="text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                    <Star size={10} fill="currentColor"/> Entrenador Asignado
                                </div>
                                <h2 className="text-2xl font-black text-neutral-900">{datosUsuario.entrenador_data.nombre}</h2>
                                <p className="text-neutral-500 font-medium">{datosUsuario.entrenador_data.especialidad}</p>
                                
                                <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start text-sm text-neutral-600">
                                    <span className="bg-gray-50 px-3 py-1 rounded-lg border border-gray-100"><b>Edad:</b> {datosUsuario.entrenador_data.edad} años</span>
                                    <span className="bg-gray-50 px-3 py-1 rounded-lg border border-gray-100"><b>Exp:</b> {datosUsuario.entrenador_data.experiencia}</span>
                                    <span className="bg-gray-50 px-3 py-1 rounded-lg border border-gray-100"><b>Plan:</b> {datosUsuario.entrenador_plan}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                            <button 
                                onClick={abrirWhatsApp}
                                className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={18} /> Contactar WhatsApp
                            </button>
                            <button 
                                onClick={handleClicCancelar} // <--- AHORA ABRE EL MODAL
                                className="w-full px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <XCircle size={18} /> Cancelar Servicio
                            </button>
                        </div>
                    </div>

                ) : (

                    // VISTA: SIN ENTRENADOR
                    <div className="bg-neutral-900 rounded-[32px] p-8 mb-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-neutral-900/20 animate-fade-in">
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
                                className="w-full md:w-auto bg-white text-neutral-900 px-8 py-4 rounded-2xl font-bold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                            > Contratar Entrenador
                            </button>
                        </div>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full"></div>
                        <Activity className="absolute -right-6 -bottom-6 text-white/5 rotate-12" size={200} />
                    </div>
                )}

                {/* Buscador */}
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
                            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === cat ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                {cat === 'Todas' ? <Zap size={14}/> : <Activity size={14}/>} {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Maquinas */}
                {loading ? (
                    <div className="text-center py-20"><Loader className="animate-spin text-purple-600 mx-auto mb-4" size={40} /><p className="text-gray-400">Cargando guía...</p></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMachines.map(machine => (
                            <div key={machine.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300"><DumbbellIcon size={28} /></div>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${machine.nivel === 'Principiante' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{machine.nivel}</span>
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-2">{machine.nombre}</h3>
                                <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-grow">{machine.descripcion}</p>
                                <button onClick={() => setSelectedMachine(machine)} className="mt-4 w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">Ver Guía Completa <ChevronRight size={16} /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- RENDERIZADO DE MODALES --- */}
            
            {/* 1. Modal Detalle Máquina */}
            {selectedMachine && <GuiaModal maquina={selectedMachine} onClose={() => setSelectedMachine(null)} />}
            
            {/* 2. Modal Contratar Entrenador */}
            {showTrainerModal && <ContratarEntrenadorModal onClose={() => { setShowTrainerModal(false); recargarUsuario(); }} />}
            
            {/* 3. Modal Confirmar Cancelación  */}
            <ConfirmModal 
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={procederCancelacion}
                title="¿Cancelar servicio?"
                message="Perderás a tu entrenador asignado y el historial de este plan. Esta acción no se puede deshacer."
                isLoading={canceling}
            />
        </div>
    );
};

const DumbbellIcon = ({ size }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" /><path d="M6 4v2a6 6 0 0 0 12 0V4" /></svg>);

export default Guia;