import React, { useEffect, useState, useContext } from 'react';
import { Flame, ArrowRight, Plus, Edit2, Trash2, Loader2, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { obtenerClasesRequest, eliminarClaseRequest } from '../api/clases';
import ClaseDetalleModal from './ClaseDetalleModal'; 
import FormularioClaseModal from './FormularioClaseModal';

const Clases = ({ isLoggedIn, onOpenLogin }) => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    const [clasesData, setClasesData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedClassId, setSelectedClassId] = useState(null); 
    const [isFormModalOpen, setIsFormModalOpen] = useState(false); 
    const [claseParaEditar, setClaseParaEditar] = useState(null);

    const isStaff = user?.rol === 'staff' || user?.rol === 'administrador';

    const cargarClases = async () => {
        setLoading(true);
        try {
            const data = await obtenerClasesRequest();
            setClasesData(data || []);
        } catch (error) {
            addToast("Error al cargar las clases", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarClases();
    }, []);

    const handleCrearNueva = () => {
        setClaseParaEditar(null);
        setIsFormModalOpen(true);
    };

    const handleEditar = (e, clase) => {
        e.stopPropagation(); 
        setClaseParaEditar(clase);
        setIsFormModalOpen(true);
    };

    const handleEliminar = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("¿Estás seguro de eliminar esta clase?")) return;
        try {
            await eliminarClaseRequest(id);
            addToast("Clase eliminada correctamente", "success");
            cargarClases();
        } catch (error) {
            addToast("No se pudo eliminar la clase", "error");
        }
    };

    const handleReservarClick = (claseId) => {
        if (isLoggedIn) {
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
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                    <h2 className="text-4xl font-black text-neutral-900 tracking-tight">Nuestras <span className="text-purple-600">Clases</span></h2>
                    {isStaff && (
                        <button onClick={handleCrearNueva} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg">
                            <Plus size={20} /> Crear Nueva Clase
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={48} /></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {clasesData.map((clase) => (
                            <div key={clase.id} className="group bg-white rounded-[32px] overflow-hidden border border-neutral-100 flex flex-col h-full relative hover:shadow-2xl transition-all">
                                {isStaff && (
                                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                                        <button onClick={(e) => handleEditar(e, clase)} className="p-2.5 bg-white/90 backdrop-blur rounded-xl text-blue-600 shadow-lg"><Edit2 size={16} /></button>
                                        <button onClick={(e) => handleEliminar(e, clase.id)} className="p-2.5 bg-white/90 backdrop-blur rounded-xl text-red-600 shadow-lg"><Trash2 size={16} /></button>
                                    </div>
                                )}
                                <div className="h-56 overflow-hidden"><img src={getImage(clase.nombre)} className="w-full h-full object-cover" alt={clase.nombre} /></div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{clase.nombre}</h3>
                                    <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{clase.descripcion}</p>
                                    <div className="mt-auto">
                                        <button onClick={() => handleReservarClick(clase.id)} className="w-full py-3.5 bg-neutral-900 text-white font-bold rounded-xl hover:bg-purple-600 flex items-center justify-center gap-2 transition-all">Ver Detalles <ArrowRight size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {selectedClassId && <ClaseDetalleModal claseId={selectedClassId} onClose={() => setSelectedClassId(null)} />}
            
            {/* ESTE ES EL MODAL QUE CAUSABA EL ERROR: Ahora tiene las props correctas */}
            <FormularioClaseModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)} 
                claseEditando={claseParaEditar} 
                onRefresh={cargarClases} 
            />
        </section>
    );
};

export default Clases;