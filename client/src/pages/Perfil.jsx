import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
    Mail, Phone, MapPin, Calendar, Edit2, 
    Flame, Clock, Target, Dumbbell, Zap, Plus, Trash2,
    Activity, Ruler, Weight, AlertTriangle, Camera, Droplet, // <-- Importamos Droplet para sangre
    Lock // <-- Importamos Lock para el estado inactivo
} from 'lucide-react';
import ClaseDetalleModal from '../components/ClaseDetalleModal'; 
import EditarPerfilModal from '../components/EditarPerfilModal'; 
import QRCode from "react-qr-code"; 
import { useToast } from '../context/ToastContext'; 

import { 
    obtenerPerfilRequest, 
    obtenerMisClasesRequest, 
    agregarObjetivoRequest, 
    eliminarObjetivoRequest,
    subirFotoPerfilRequest
} from '../api/usuarios';

const Perfil = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    
    const [perfil, setPerfil] = useState(null);
    const [misClases, setMisClases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal'); 
    
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newGoal, setNewGoal] = useState('');
    const [uploadingPhoto, setUploadingPhoto] = useState(false); 

    useEffect(() => {
        if (!user) return;
        cargarDatos();
    }, [user]);

    const cargarDatos = async () => {
    try {
        const userId = user.id_usuario || user.id;
        const dataPerfil = await obtenerPerfilRequest(userId);
        
        // Si el servidor falla (Error 500), dataPerfil será null
        if (!dataPerfil) {
            console.error("No se pudo obtener el perfil del servidor.");
            setLoading(false);
            return; // Evita que se ejecute el resto y rompa el componente
        }

        const dataClases = await obtenerMisClasesRequest(userId);
        setPerfil(dataPerfil);
        setMisClases(dataClases || []);
    } catch (error) {
        console.error("Error crítico en cargarDatos:", error);
    } finally {
        setLoading(false);
    }
};

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingPhoto(true);
        try {
            const data = await subirFotoPerfilRequest(perfil.id_usuario, file);
            setPerfil(prev => ({ ...prev, foto_perfil: data.url }));
            addToast('Foto actualizada correctamente', 'success');
        } catch (error) {
            addToast('Error al subir la foto', 'error');
        } finally {
            setUploadingPhoto(false);
        }
    };

// Lógica de membresía basada en tu esquema de BD
    const calcularDiasRestantes = () => {
        if (!perfil?.membresia_fin || perfil?.membresia_tipo === 'Sin Membresía') return 0;
        
        const fin = new Date(perfil.membresia_fin);
        const hoy = new Date();
        const diffTime = fin - hoy;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays > 0 ? diffDays : 0;
    };
    const diasRestantes = calcularDiasRestantes();
    const tieneMembresiaActiva = diasRestantes > 0 && perfil?.membresia_tipo !== 'Sin Membresía';

    const handleAddGoal = async (e) => {
        e.preventDefault();
        if (!newGoal.trim()) return;
        const nuevo = await agregarObjetivoRequest(perfil.id_usuario, newGoal);
        setPerfil(prev => ({ ...prev, objetivos: [...prev.objetivos, nuevo] }));
        setNewGoal('');
    };

    const handleDeleteGoal = async (idGoal) => {
        await eliminarObjetivoRequest(idGoal);
        setPerfil(prev => ({ 
            ...prev, 
            objetivos: prev.objetivos.filter(o => o.id !== idGoal) 
        }));
    };

    if (loading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-bold text-purple-600">Sincronizando con Entrena+...</div>;
    
    // Si llegamos aquí y no hay perfil, mostramos error amigable en lugar de crashear
    if (!perfil) return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
            <AlertTriangle size={50} className="text-orange-500 mb-4" />
            <h2 className="text-xl font-bold text-neutral-800">Error de conexión con el servidor</h2>
            <p className="text-neutral-500 mb-4 text-center">No pudimos obtener tus datos. Verifica que tu sesión siga activa.</p>
            <button onClick={() => window.location.reload()} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold">Reintentar</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            
            {/* --- HEADER --- */}
            <div className="bg-purple-600 pt-20 pb-24 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-1/4 -translate-y-1/4"><Dumbbell size={300} color="white" /></div>

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10">
                    
                    {/* AVATAR */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-400 flex items-center justify-center text-5xl font-bold text-white shadow-xl overflow-hidden relative">
                            {perfil.foto_perfil ? (
                                <img src={perfil.foto_perfil} alt="Perfil" className="w-full h-full object-cover object-top" />
                            ) : (
                                perfil.nombre?.charAt(0) || 'U'
                            )}
                            {uploadingPhoto && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-neutral-900 text-white p-2 rounded-full cursor-pointer hover:bg-purple-500 transition-colors shadow-lg border-2 border-white">
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            <Camera size={18} />
                        </label>
                    </div>
                    
                    {/* INFO HEADER + EMERGENCIA */}
                    <div className="flex-grow text-center md:text-left text-white">
                        <h1 className="text-3xl font-bold">{perfil.nombre}</h1>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                            {perfil.contacto_emergencia_nombre ? (
                                <>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-white">
                                        <AlertTriangle size={14} className="text-red-200" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-red-100">Contacto de Emergencia:</span>
                                        <span className="text-sm font-semibold">{perfil.contacto_emergencia_nombre}</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-white">
                                        <Phone size={14} className="text-purple-200" />
                                        <span className="text-sm font-mono">{perfil.contacto_emergencia_telefono}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-purple-200 text-sm italic">
                                    <AlertTriangle size={14} /> Sin contacto de emergencia configurado
                                </div>
                                
                            )}
                            
                        </div>
                    </div>

                    <button onClick={() => setShowEditModal(true)} className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all">
                        <Edit2 size={16} /> Editar Perfil
                    </button>
                </div>
            </div>

            {/* --- CONTENIDO --- */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* IZQUIERDA */}
                    <div className="space-y-8">
                        {/* Tarjeta Membresía & QR FIXED */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            {/* Cabecera dinámica de la tarjeta */}
                            <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs opacity-80 uppercase tracking-wider">Membresía</p>
                                        <p className="text-2xl font-bold">{perfil.membresia_tipo || 'Sin Membresía'}</p>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Vence en</span>
                                        <span className="font-bold">{diasRestantes} días</span>
                                    </div>
                                    {/* Barra de progreso: se va a 0 si no hay membresía activa */}
                                    <div className="h-2 bg-black/20 rounded-full">
                                        <div 
                                            className="h-full bg-white transition-all duration-1000 rounded-full" 
                                            style={{ width: `${tieneMembresiaActiva ? Math.min((diasRestantes / 30) * 100, 100) : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col items-center bg-white">
                                {/* Contenedor de QR o Candado */}
                                <div className={`border-4 p-4 rounded-3xl mb-4 bg-white shadow-inner flex items-center justify-center transition-all ${tieneMembresiaActiva ? 'border-purple-50' : 'border-red-50 bg-red-50/10'}`}>
                                    {tieneMembresiaActiva ? (
                                        <QRCode 
                                            value={perfil.id_usuario.toString()} 
                                            size={140} 
                                            fgColor="#581c87" 
                                            bgColor="#FFFFFF" 
                                        />
                                    ) : (
                                        <div className="w-[140px] h-[140px] flex flex-col items-center justify-center text-red-400 gap-2">
                                            <Lock size={64} strokeWidth={1.5} />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Acceso Denegado</span>
                                        </div>
                                    )}
                                </div>
                                
                                <p className="text-xs text-neutral-400 font-mono">ID: {perfil?.id_usuario || '---'}</p>
                                
                                {/* Aviso de renovación */}
                                {!tieneMembresiaActiva && (
                                    <p className="mt-4 text-xs text-red-500 font-bold bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
                                        Renueva tu membresía para entrar
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Objetivos */}
                        <div className="bg-white rounded-3xl shadow-lg p-6">
                            <h3 className="font-bold text-neutral-800 flex items-center gap-2 mb-4"><Target className="text-purple-500" size={20} /> Objetivos</h3>
                            <div className="space-y-3 mb-4">
                                {perfil.objetivos?.map(obj => (
                                    <div key={obj.id} className="flex justify-between items-center bg-purple-50 p-3 rounded-xl group">
                                        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-sm font-medium text-purple-900">{obj.texto}</span></div>
                                        <button onClick={() => handleDeleteGoal(obj.id)} className="text-purple-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleAddGoal} className="flex gap-2">
                                <input type="text" placeholder="Nuevo objetivo..." className="flex-grow bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} />
                                <button type="submit" className="bg-neutral-900 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors"><Plus size={18} /></button>
                            </form>
                        </div>
                    </div>

                    {/* DERECHA */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl p-2 shadow-sm flex gap-2">
                            <button onClick={() => setActiveTab('personal')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'personal' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-50'}`}>Información Personal</button>
                            <button onClick={() => setActiveTab('clases')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'clases' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-50'}`}>Mis Clases ({misClases.length})</button>
                        </div>

                        {activeTab === 'personal' && (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <StatCard icon={Dumbbell} label="Entrenamientos" value={perfil.stats?.entrenamientos || 0} color="text-purple-500" bg="bg-purple-50" />
                                    <StatCard icon={Calendar} label="Días activos" value={perfil.stats?.dias_activos || 0} color="text-orange-500" bg="bg-orange-50" />
                                    <StatCard icon={Clock} label="Duración media" value={`${perfil.stats?.duracion_media || 0} min`} color="text-blue-500" bg="bg-blue-50" />
                                    <StatCard icon={Flame} label="Calorías" value={perfil.stats?.calorias || 0} color="text-green-500" bg="bg-green-50" />
                                </div>

                                <div className="bg-white rounded-3xl shadow-lg p-8">
                                    <h3 className="font-bold text-lg mb-6 text-neutral-800">Datos Personales</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem label="Nombre" value={perfil.nombre} icon={Edit2} />
                                        <InfoItem label="Email" value={perfil.email} icon={Mail} />
                                        <InfoItem label="Teléfono" value={perfil.telefono || 'Sin registrar'} icon={Phone} />
                                        <InfoItem label="Cumpleaños" value={perfil.fecha_nacimiento || 'Sin registrar'} icon={Calendar} />
                                        <InfoItem label="Dirección" value={perfil.direccion || 'Sin registrar'} icon={MapPin} fullWidth />
                                    </div>
                                </div>

                                {/* SECCIÓN SALUD ACTUALIZADA */}
                                <div className="bg-white rounded-3xl shadow-lg p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-lg text-neutral-800 flex items-center gap-2"><Activity className="text-pink-500" size={20}/> Salud</h3>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <InfoItem label="Altura" value={perfil.altura ? `${perfil.altura} cm` : '--'} icon={Ruler} />
                                        <InfoItem label="Peso" value={perfil.peso ? `${perfil.peso} kg` : '--'} icon={Weight} />
                                        <InfoItem label="Tipo Sangre" value={perfil.tipo_sangre || '--'} icon={Droplet} />
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'clases' && (
                            /* ... Clases (sin cambios) ... */
                            <div className="space-y-4">
                                {misClases.length > 0 ? misClases.map(clase => (
                                    <div key={clase.id} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                                        <div className="bg-purple-50 rounded-xl p-4 text-center min-w-[100px]"><p className="text-xs font-bold text-purple-400 uppercase tracking-wide">{clase.dia}</p><p className="text-2xl font-black text-purple-900">{clase.horario?.slice(0,5)}</p></div>
                                        <div className="flex-grow text-center md:text-left"><h4 className="text-xl font-bold text-neutral-900">{clase.nombre}</h4><p className="text-sm text-neutral-500">{clase.entrenador || 'Staff'}</p><p className="text-xs text-green-600 font-bold mt-1 bg-green-50 inline-block px-2 py-1 rounded-md">Inscrito</p></div>
                                        <button onClick={() => setSelectedClassId(clase.id)} className="bg-neutral-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-purple-600 transition-colors w-full md:w-auto">Ver Detalles</button>
                                    </div>
                                )) : <div className="text-center p-10"><Zap className="mx-auto text-gray-300 mb-2"/><p className="text-gray-500">Sin inscripciones</p></div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALES */}
            {selectedClassId && <ClaseDetalleModal claseId={selectedClassId} onClose={() => { setSelectedClassId(null); cargarDatos(); }} />}
            {showEditModal && <EditarPerfilModal usuario={perfil} onClose={() => setShowEditModal(false)} onUpdate={(datosActualizados) => setPerfil({...perfil, ...datosActualizados})} />}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-50"><div className={`w-8 h-8 rounded-full ${bg} ${color} flex items-center justify-center mb-2`}><Icon size={16} /></div><p className="text-xs text-neutral-400 font-medium">{label}</p><p className={`text-xl font-black ${color.replace('text-', 'text-neutral-900')}`}>{typeof value === 'number' ? value.toLocaleString() : value}</p></div>
);
const InfoItem = ({ label, value, icon: Icon, fullWidth }) => (
    <div className={`bg-neutral-50 p-4 rounded-2xl border border-neutral-100 ${fullWidth ? 'md:col-span-2' : ''}`}><div className="flex items-center gap-2 mb-1"><Icon size={14} className="text-purple-500" /><span className="text-xs font-bold text-neutral-400 uppercase">{label}</span></div><p className="text-neutral-800 font-semibold">{value}</p></div>
);

export default Perfil;