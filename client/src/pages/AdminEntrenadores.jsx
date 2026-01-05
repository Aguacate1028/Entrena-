import React, { useState, useEffect } from 'react';
import { UserPlus, Dumbbell, Phone, DollarSign, X, Trophy, Calendar, Edit2, Trash2 } from 'lucide-react';
import { 
    obtenerEntrenadoresAdmin, 
    agregarEntrenadorDirecto, 
    actualizarEntrenadorRequest, 
    eliminarEntrenadorRequest 
} from '../api/admin';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal'; // Asegúrate de que la ruta sea correcta

const AdminEntrenadores = () => {
    const { addToast } = useToast();
    const [entrenadores, setEntrenadores] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Estados para Edición
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Estados para Eliminación (ConfirmModal)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const initialForm = { 
        nombre: '', telefono: '', salario: '', 
        fecha_nacimiento: '', 
        especialidad: 'Musculación', experiencia: 'Junior'
    };

    const [form, setForm] = useState(initialForm);

    const loadData = () => obtenerEntrenadoresAdmin().then(setEntrenadores).catch(console.error);
    useEffect(() => { loadData(); }, []);

    // Helper para calcular edad
    const calcularEdad = (fecha) => {
        if (!fecha) return 'N/A';
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    // --- ACCIONES DE FORMULARIO (CREAR/EDITAR) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editMode) {
                await actualizarEntrenadorRequest(currentId, form);
                addToast('Entrenador actualizado', 'success');
            } else {
                await agregarEntrenadorDirecto(form);
                addToast('Entrenador agregado', 'success');
            }
            closeModal();
            loadData();
        } catch (error) {
            addToast('Error al guardar', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- ACCIONES DE ELIMINACIÓN ---
    
    // 1. Abrir modal de confirmación
    const openDeleteModal = (id) => {
        setIdToDelete(id);
        setIsDeleteOpen(true);
    };

    // 2. Ejecutar eliminación (se pasa al ConfirmModal)
    const handleConfirmDelete = async () => {
        if (!idToDelete) return;
        setLoading(true); // Usamos el mismo estado de loading para el botón del modal
        try {
            await eliminarEntrenadorRequest(idToDelete);
            addToast('Eliminado correctamente', 'success');
            loadData();
            setIsDeleteOpen(false); // Cerrar modal
            setIdToDelete(null);
        } catch (error) {
            addToast('Error al eliminar', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- GESTIÓN DE MODALES ---
    const openCreate = () => {
        setEditMode(false);
        setForm(initialForm);
        setIsModalOpen(true);
    };

    const openEdit = (ent) => {
        setEditMode(true);
        setCurrentId(ent.id || ent.id_entrenador);
        setForm({
            nombre: ent.nombre,
            telefono: ent.telefono,
            salario: ent.salario,
            fecha_nacimiento: ent.fecha_nacimiento, 
            especialidad: ent.especialidad,
            experiencia: ent.experiencia
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setForm(initialForm);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Equipo de Entrenadores</h1>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-black shadow-lg transition-transform hover:scale-105">
                    <UserPlus size={20} /> Nuevo Entrenador
                </button>
            </header>

            {/* GRID DE TARJETAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {entrenadores.map(ent => (
                    <div key={ent.id || ent.id_entrenador} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group relative">
                        
                        {/* Botones Flotantes de Acción */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button onClick={() => openEdit(ent)} className="p-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-colors">
                                <Edit2 size={16}/>
                            </button>
                            {/* Ahora llama a openDeleteModal en lugar de ejecutar directo */}
                            <button onClick={() => openDeleteModal(ent.id || ent.id_entrenador)} className="p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-colors">
                                <Trash2 size={16}/>
                            </button>
                        </div>

                        {/* Encabezado Colorido */}
                        <div className={`h-24 ${ent.especialidad?.includes('Yoga') ? 'bg-teal-100' : 'bg-purple-100'} relative`}>
                            <div className="absolute -bottom-8 left-6">
                                <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center">
                                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                                        {ent.nombre?.charAt(0).toUpperCase() || 'E'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 px-6 pb-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-gray-900 truncate">{ent.nombre}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Phone size={12}/> {ent.telefono || 'Sin teléfono'}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {/* Edad Calculada */}
                                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                                    <div className="bg-white p-1.5 rounded-lg shadow-sm text-blue-500"><Calendar size={16}/></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Edad</p>
                                        <p className="text-sm font-bold text-gray-800">{calcularEdad(ent.fecha_nacimiento)} años</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                                    <div className="bg-white p-1.5 rounded-lg shadow-sm text-purple-600"><Dumbbell size={16}/></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Especialidad</p>
                                        <p className="text-sm font-bold text-gray-800">{ent.especialidad}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="bg-white p-1.5 rounded-lg shadow-sm text-green-600"><DollarSign size={16}/></div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Salario</p>
                                        <p className="text-sm font-bold text-gray-800">${ent.salario}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE REGISTRO / EDICIÓN */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {editMode ? <Edit2 size={20}/> : <UserPlus size={20}/>} 
                                {editMode ? 'Editar Entrenador' : 'Nuevo Entrenador'}
                            </h2>
                            <button onClick={closeModal} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 gap-4 max-h-[80vh] overflow-y-auto">
                            
                            <input required placeholder="Nombre Completo" className="border rounded-xl p-3 bg-gray-50 outline-none focus:ring-2 focus:ring-purple-500" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
                            
                            <input required type="tel" placeholder="Teléfono" className="border rounded-xl p-3 bg-gray-50 outline-none focus:ring-2 focus:ring-purple-500" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
                            
                            <div className="grid grid-cols-1 gap-1">
                                <label className="text-xs font-bold text-gray-500 ml-1">Fecha de Nacimiento</label>
                                <input required type="date" className="border rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-purple-500 w-full" value={form.fecha_nacimiento} onChange={e => setForm({...form, fecha_nacimiento: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-1 gap-1">
                                <label className="text-xs font-bold text-gray-500 ml-1">Salario ($)</label>
                                <input required type="number" className="border rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-purple-500" value={form.salario} onChange={e => setForm({...form, salario: e.target.value})} />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 ml-1">Especialidad</label>
                                <select className="w-full border rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-purple-500" value={form.especialidad} onChange={e => setForm({...form, especialidad: e.target.value})}>
                                    <option>Musculación</option><option>CrossFit</option><option>Yoga</option><option>Boxeo</option><option>Zumba</option><option>Hipertrofia</option><option>Pérdida de Peso</option><option>Powerlifting</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-500 ml-1">Experiencia</label>
                                <select className="w-full border rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-purple-500" value={form.experiencia} onChange={e => setForm({...form, experiencia: e.target.value})}>
                                    <option>Junior (0-2 años)</option><option>Intermedio (3-5 años)</option><option>Senior (6-9 años)</option><option>Master (10+ años)</option>
                                </select>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-6 border-t mt-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" disabled={loading} className="px-6 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg disabled:opacity-50 transition-all">
                                    {loading ? 'Guardando...' : (editMode ? 'Actualizar' : 'Guardar')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
            <ConfirmModal 
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar Entrenador?"
                message="Esta acción no se puede deshacer. El entrenador será eliminado permanentemente de la base de datos."
                isLoading={loading}
            />
        </div>
    );
};

export default AdminEntrenadores;