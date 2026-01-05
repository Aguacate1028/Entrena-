import React, { useEffect, useState, useContext } from 'react';
import { Megaphone, Calendar, AlertTriangle, Info, BadgeInfo, Clock, Plus, X, Trash2 } from 'lucide-react';
import { obtenerAnunciosRequest, crearAnuncioRequest, eliminarAnuncioRequest } from '../api/anuncios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal'; // Asegúrate de que la ruta sea correcta

const Anuncios = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const { addToast } = useToast();
    
    // Estados de datos
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados de Modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Estados para el Modal de Confirmación (Eliminar)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [anuncioToDelete, setAnuncioToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Estado para el formulario de crear
    const [nuevoAnuncio, setNuevoAnuncio] = useState({
        titulo: '',
        contenido: '',
        tipo: 'Aviso'
    });

    // Permisos: Staff o Admin
    const canCreate = isAuthenticated && (user?.rol === 'staff' || user?.rol === 'administrador');

    const cargarDatos = async () => {
        try {
            const datos = await obtenerAnunciosRequest();
            setAnuncios(datos);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // --- MANEJO DE CREACIÓN ---
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await crearAnuncioRequest(nuevoAnuncio);
            addToast('Anuncio publicado correctamente', 'success');
            setIsCreateModalOpen(false);
            setNuevoAnuncio({ titulo: '', contenido: '', tipo: 'Aviso' });
            cargarDatos(); 
        } catch (error) {
            addToast('Error al publicar anuncio', 'error');
        }
    };

    // --- MANEJO DE ELIMINACIÓN CON MODAL ---
    const openDeleteModal = (id) => {
        setAnuncioToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!anuncioToDelete) return;
        setIsDeleting(true);
        try {
            await eliminarAnuncioRequest(anuncioToDelete);
            addToast('Anuncio eliminado correctamente', 'success');
            // Actualizamos la lista localmente para no recargar
            setAnuncios(prev => prev.filter(a => a.id !== anuncioToDelete));
            setIsDeleteModalOpen(false);
        } catch (error) {
            addToast('Error al eliminar el anuncio', 'error');
        } finally {
            setIsDeleting(false);
            setAnuncioToDelete(null);
        }
    };

    // Configuración de estilos visuales
    const getTypeConfig = (tipo) => {
        switch(tipo) {
            case 'Mantenimiento': 
                return { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100', badge: 'bg-orange-50 text-orange-700 border-orange-200' };
            case 'Evento': 
                return { icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100', badge: 'bg-purple-50 text-purple-700 border-purple-200' };
            case 'Aviso': 
                return { icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-100', badge: 'bg-blue-50 text-blue-700 border-blue-200' };
            default: 
                return { icon: Info, color: 'text-neutral-600', bg: 'bg-neutral-100', badge: 'bg-neutral-50 text-neutral-700 border-neutral-200' };
        }
    };

    return (
        <section id="anuncios" className="py-10 bg-white border-b border-neutral-100">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Cabecera */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-200 rotate-3">
                            <BadgeInfo className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Anuncios</h2>
                            <p className="text-neutral-500 font-medium">Novedades importantes del gimnasio</p>
                        </div>
                    </div>

                    {/* Botón Nuevo Anuncio (Solo Staff/Admin) */}
                    {canCreate && (
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold transition-all hover:bg-purple-700 transition-colors shadow-lg shadow-neutral-200"
                        >
                            <Plus size={20} /> Nuevo Anuncio
                        </button>
                    )}
                </div>

                {/* Grid de Anuncios */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-sm h-64 animate-pulse">
                                <div className="w-8 h-8 bg-neutral-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-neutral-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : anuncios && anuncios.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {anuncios.map((item) => {
                            const config = getTypeConfig(item.tipo || 'General');
                            const Icon = config.icon;
                            // Usamos item.id o item.id_anuncio dependiendo de tu base de datos
                            const itemId = item.id || item.id_anuncio; 

                            return (
                                <div key={itemId} className="group relative bg-white border border-neutral-200 rounded-[32px] p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    
                                    {/* Cabecera de la Tarjeta */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-3 rounded-2xl ${config.bg}`}>
                                            <Icon className={`w-6 h-6 ${config.color}`} />
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.badge}`}>
                                                {item.tipo}
                                            </span>
                                            
                                            {/* Botón Eliminar (Solo Staff/Admin) */}
                                            {canCreate && (
                                                <button 
                                                    onClick={() => openDeleteModal(itemId)}
                                                    className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                    title="Eliminar anuncio"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-purple-600 transition-colors">{item.titulo}</h3>
                                    <p className="text-neutral-500 text-sm leading-relaxed line-clamp-4">{item.contenido}</p>
                                    
                                    {/* Footer Tarjeta */}
                                    <div className="mt-6 pt-6 border-t border-neutral-100 text-xs font-bold text-neutral-400 flex items-center gap-2">
                                        <Clock size={14}/> 
                                        {new Date(item.fecha || item.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-neutral-50 rounded-[40px] border border-dashed border-neutral-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Info className="w-8 h-8 text-neutral-300" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-1">Todo está tranquilo</h3>
                        <p className="text-neutral-500 text-sm">No hay anuncios nuevos por el momento.</p>
                    </div>
                )}
            </div>

            {/* MODAL 1: CREAR ANUNCIO */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-neutral-900">Crear Nuevo Anuncio</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                                <X size={24} className="text-neutral-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Título</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full p-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Ej: Mantenimiento de alberca"
                                    value={nuevoAnuncio.titulo}
                                    onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, titulo: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Tipo</label>
                                <select 
                                    className="w-full p-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500"
                                    value={nuevoAnuncio.tipo}
                                    onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, tipo: e.target.value})}
                                >
                                    <option value="Aviso">Aviso General</option>
                                    <option value="Evento">Evento</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Contenido</label>
                                <textarea 
                                    required
                                    rows="4"
                                    className="w-full p-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Escribe los detalles aquí..."
                                    value={nuevoAnuncio.contenido}
                                    onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, contenido: e.target.value})}
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
                                Publicar Anuncio
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: CONFIRMAR ELIMINACIÓN */}
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="¿Eliminar Anuncio?"
                message="Esta acción no se puede deshacer. El anuncio desaparecerá para todos los usuarios."
                isLoading={isDeleting}
            />
        </section>
    );
};

export default Anuncios;