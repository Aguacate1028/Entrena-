import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Eye, Phone, UserPlus } from 'lucide-react';
import { obtenerTodosSociosRequest, eliminarUsuarioRequest, obtenerDetalleUsuarioRequest } from '../api/usuarios'; 
import { useToast } from '../context/ToastContext';
import SocioModal from '../components/SocioModal';
import ConfirmModal from '../components/ConfirmModal';
import NuevoSocioModal from '../components/NuevoSocioModal';

const StaffSocios = () => {
    const { addToast } = useToast();
    
    // Estados de datos
    const [socios, setSocios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);

    // Estados de Modales
    const [selectedSocio, setSelectedSocio] = useState(null); // Para ver detalles
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    // Estados para borrar
    const [socioToDelete, setSocioToDelete] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Cargar datos
    const fetchSocios = async () => {
        setLoading(true);
        try {
            const data = await obtenerTodosSociosRequest();
            setSocios(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSocios();
    }, []);

    // 1. ABRIR DETALLES (FETCH COMPLETO)
    const handleOpenDetails = async (id) => {
        try {
            // Obtenemos toda la info del backend antes de abrir el modal
            const fullData = await obtenerDetalleUsuarioRequest(id);
            setSelectedSocio(fullData);
            setIsDetailsOpen(true);
        } catch (error) {
            addToast('Error al cargar detalles del socio', 'error');
        }
    };

    // 2. ELIMINAR SOCIO
    const handleDelete = async () => {
        if (!socioToDelete) return;
        try {
            await eliminarUsuarioRequest(socioToDelete);
            addToast('Socio eliminado correctamente', 'success');
            setSocios(socios.filter(s => s.id_usuario !== socioToDelete));
            setIsDeleteOpen(false);
        } catch (error) {
            addToast('No se pudo eliminar al socio', 'error');
        }
    };

    const filtrados = socios.filter(s => 
        s.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        s.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                
                {/* Header y Buscador */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Directorio de Socios</h1>
                        <p className="text-neutral-500 mt-1">Gestión integral de clientes</p>
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-3.5 text-neutral-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Buscar socio..." 
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setIsCreateOpen(true)}
                            className="p-3 bg-neutral-900 text-white rounded-2xl hover:bg-purple-600 transition-colors shadow-lg shadow-neutral-300 flex items-center gap-2 px-4"
                            title="Inscribir Nuevo Socio"
                        >
                            <UserPlus size={24} />
                            <span className="hidden md:inline font-bold">Nuevo</span>
                        </button>
                    </div>
                </div>

                {/* Grid de Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtrados.map(socio => (
                        <div key={socio.id_usuario} className="group bg-white rounded-[32px] p-6 border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            
                            {/* Barra decorativa estado */}
                            <div className={`absolute top-0 left-0 w-full h-1.5 ${
                                socio.estado_suscripcion === 'activa' ? 'bg-green-500' : 'bg-red-500'
                            }`} />

                            <div className="flex items-center gap-4 mb-6 mt-2">
                                {/* Avatar */}
                                <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-xl font-bold text-neutral-600 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                    {socio.foto_perfil ? (
                                        <img src={socio.foto_perfil} alt="" className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                        socio.nombre.charAt(0)
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-neutral-900 truncate">{socio.nombre}</h3>
                                    <p className="text-xs text-neutral-500 truncate">{socio.email}</p>
                                </div>
                            </div>

                            {/* Info Rápida */}
                            <div className="bg-neutral-50 rounded-xl p-4 mb-6 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-neutral-400 font-bold uppercase">Plan</span>
                                    <span className="font-bold text-neutral-800">{socio.membresia_tipo}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-neutral-400 font-bold uppercase">Vence</span>
                                    <span className={`font-bold ${new Date(socio.membresia_fin) < new Date() ? 'text-red-500' : 'text-neutral-800'}`}>
                                        {new Date(socio.membresia_fin).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleOpenDetails(socio.id_usuario)}
                                    className="flex-1 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Eye size={16} /> Ver Todo
                                </button>
                                
                                <a href={`tel:${socio.telefono}`} className="p-3 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                    <Phone size={18} />
                                </a>
                                
                                <button 
                                    onClick={() => { setSocioToDelete(socio.id_usuario); setIsDeleteOpen(true); }}
                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

                {/* MODALES */}
                {isDetailsOpen && (
                    <SocioModal 
                        socio={selectedSocio} 
                        onClose={() => setIsDetailsOpen(false)} 
                        onUpdate={fetchSocios} // Recarga la lista si editamos algo
                    />
                )}
                {isCreateOpen && (
                    <NuevoSocioModal 
                        onClose={() => setIsCreateOpen(false)}
                        onSuccess={fetchSocios} // Al terminar, recarga la lista automáticamente
                    />
                )}

                <ConfirmModal 
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    onConfirm={handleDelete}
                    title="¿Eliminar Socio?"
                    message="Esta acción borrará permanentemente al usuario y todo su historial. No se puede deshacer."
                />
            </div>
        </div>
    );
};

export default StaffSocios;