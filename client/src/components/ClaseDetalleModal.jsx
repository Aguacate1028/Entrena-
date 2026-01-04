import React, { useEffect, useState, useContext } from 'react';
import { Clock, Users, User, Calendar, X, Loader, CheckCircle, XCircle } from 'lucide-react';
import { obtenerClasePorIdRequest, inscribirClaseRequest, verificarInscripcionRequest, cancelarInscripcionRequest } from '../api/clases';
import { AuthContext } from '../context/AuthContext'; 
import { useToast } from '../context/ToastContext'; 
import ConfirmModal from './ConfirmModal'; 
import { obtenerProximaFecha } from '../utils/dateUtils';

const ClaseDetalleModal = ({ claseId, onClose }) => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    const [clase, setClase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Estado para el modal de confirmación
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (!claseId) return;
            const data = await obtenerClasePorIdRequest(claseId);
            setClase(data);

            if (user && data) {
                const userId = user.id_usuario || user.id;
                const check = await verificarInscripcionRequest(claseId, userId);
                setIsEnrolled(check.inscrito);
            }
            setLoading(false);
        };
        init();
    }, [claseId, user]);

    // Lógica Inscripción
    const handleInscribirse = async () => {
        setActionLoading(true);
        try {
            const userId = user.id_usuario || user.id;
            await inscribirClaseRequest(claseId, userId);
            
            setIsEnrolled(true);
            setClase(prev => ({ ...prev, disponibles: prev.disponibles - 1 }));
            addToast('¡Te has inscrito correctamente!', 'success'); // Notificación bonita
        } catch (error) {
            addToast(error.message || 'Error al inscribirse', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Lógica Cancelación (Solo ejecuta la acción, el modal lo controla el botón)
    const confirmCancel = async () => {
        setActionLoading(true);
        try {
            const userId = user.id_usuario || user.id;
            await cancelarInscripcionRequest(claseId, userId);

            setIsEnrolled(false);
            setClase(prev => ({ ...prev, disponibles: prev.disponibles + 1 }));
            setShowConfirm(false); // Cerrar modal de confirmación
            addToast('Has cancelado tu asistencia', 'info');
        } catch (error) {
            addToast('No se pudo cancelar', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Helper imagen
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

    if (!claseId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            {/* Contenedor Modal */}
            <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col md:flex-row animate-scale-up">
                
                {/* Botón Cerrar (Flotante) */}
                <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all">
                    <X size={20} />
                </button>

                {loading ? (
                    <div className="w-full h-96 flex items-center justify-center">
                        <Loader className="animate-spin text-purple-600" size={40} />
                    </div>
                ) : (
                    <>
                        {/* COLUMNA IZQUIERDA: IMAGEN */}
                        <div className="w-full md:w-2/5 relative h-48 md:h-auto">
                            <img src={getImage(clase.nombre)} alt={clase.nombre} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <span className="bg-purple-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">Alta Intensidad</span>
                                <h2 className="text-3xl font-black">{clase.nombre}</h2>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: INFO Y ACCIONES */}
                        <div className="w-full md:w-3/5 p-8 overflow-y-auto">
                            
                            {/* Grid de Detalles */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1"><Clock size={12}/> HORARIO</p>
                                    <p className="font-bold text-gray-800">{clase.horario?.slice(0,5)} hrs</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1"><Calendar size={12}/> DÍA</p>
                                    <p className="font-bold text-gray-800 capitalize">
                                        {obtenerProximaFecha(clase.dia_semana)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1"><Users size={12}/> CUPOS</p>
                                    <p className={`font-bold ${clase.disponibles < 5 ? 'text-red-500' : 'text-gray-800'}`}>
                                        {clase.disponibles} Libres
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1"><User size={12} /> ENTRENADOR</p>
                                    <p className="font-bold text-gray-800"> {clase.entrenador}</p>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="mt-auto">
                                {!isEnrolled ? (
                                    <button 
                                        onClick={handleInscribirse}
                                        disabled={actionLoading || clase.disponibles === 0}
                                        className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading ? <Loader className="animate-spin" /> : 'Inscribirme'}
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                                            <CheckCircle size={16} /> Ya estás inscrito.
                                            <p>Puedes visualizar tus clases en tu perfil</p>
                                        </div>
                                        <button 
                                            onClick={() => setShowConfirm(true)} // Abrimos el modal de confirmación
                                            disabled={actionLoading}
                                            className="w-full py-3 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            {actionLoading ? <Loader className="animate-spin" /> : <><XCircle size={18}/> Cancelar Inscripción</>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal de Confirmación Anidado */}
            <ConfirmModal 
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmCancel}
                title={`¿Cancelar ${clase?.nombre}?`}
                message="Si cancelas ahora, liberarás tu cupo inmediatamente para otro usuario. Esta acción no se puede deshacer."
                isLoading={actionLoading}
            />
        </div>
    );
};

export default ClaseDetalleModal;