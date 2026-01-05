import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Check, X, Edit2 } from 'lucide-react';
// Asegúrate de importar actualizarMembresiaRequest
import { 
    obtenerMembresiasAdmin, 
    crearMembresiaRequest, 
    eliminarMembresiaRequest, 
    actualizarMembresiaRequest 
} from '../api/admin';
import { useToast } from '../context/ToastContext';

const AdminMembresias = () => {
    const { addToast } = useToast();
    const [membresias, setMembresias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Estado para edición
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Estado para formulario
    const initialForm = { nombre: '', precio: '', features: '' };
    const [form, setForm] = useState(initialForm);

    const cargar = () => obtenerMembresiasAdmin().then(setMembresias);
    useEffect(() => { cargar(); }, []);

    // --- ACCIONES ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convertimos el texto de características a Array
            const featuresArray = form.features.split(',').map(s => s.trim()).filter(s => s !== '');
            const dataToSend = { ...form, caracteristicas: featuresArray };

            if (editMode) {
                await actualizarMembresiaRequest(currentId, dataToSend);
                addToast('Membresía actualizada', 'success');
            } else {
                await crearMembresiaRequest(dataToSend);
                addToast('Membresía creada', 'success');
            }

            closeModal();
            cargar();
        } catch (error) { 
            addToast('Error al guardar', 'error'); 
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("¿Borrar esta membresía?")) return;
        try {
            await eliminarMembresiaRequest(id);
            addToast('Eliminada', 'success');
            cargar();
        } catch (error) { addToast('Error', 'error'); }
    };

    // --- GESTIÓN DEL MODAL ---

    const openCreate = () => {
        setEditMode(false);
        setForm(initialForm);
        setIsModalOpen(true);
    };

    const openEdit = (plan) => {
        setEditMode(true);
        setCurrentId(plan.id);
        // Convertimos el array de características de vuelta a string para el textarea
        setForm({
            nombre: plan.nombre,
            precio: plan.precio,
            features: plan.caracteristicas ? plan.caracteristicas.join(', ') : ''
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
                    <h1 className="text-3xl font-black text-gray-900">Planes y Membresías</h1>
                    <p className="text-gray-500">Configura los precios y beneficios.</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-black shadow-lg transition-transform hover:scale-105">
                    <Plus size={20} /> Nueva Membresía
                </button>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {membresias.map(plan => (
                    <div key={plan.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group">
                        
                        {/* Header Card */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600"><CreditCard size={24}/></div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(plan)} className="p-2 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-50 border border-gray-100 transition-colors">
                                    <Edit2 size={18}/>
                                </button>
                                <button onClick={() => handleDelete(plan.id)} className="p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 border border-gray-100 transition-colors">
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-gray-900">{plan.nombre}</h3>
                        <p className="text-3xl font-bold text-purple-600 mt-2">${plan.precio}<span className="text-sm text-gray-400 font-normal">/mes</span></p>
                        
                        <div className="mt-6 space-y-3">
                            {plan.caracteristicas?.map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check size={16} className="text-green-500 flex-shrink-0"/> {feat}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL (Reutilizable para Crear y Editar) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {editMode ? <Edit2 size={20} className="text-blue-600"/> : <Plus size={20} className="text-purple-600"/>}
                                {editMode ? 'Editar Plan' : 'Crear Nuevo Plan'}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} className="text-gray-400"/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Plan</label>
                                <input required className="w-full border rounded-xl p-3 bg-gray-50 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ej: Premium, Estudiante" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Precio Mensual ($)</label>
                                <input required type="number" className="w-full border rounded-xl p-3 bg-gray-50 outline-none focus:ring-2 focus:ring-purple-500" placeholder="0.00" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Características (Separadas por coma)</label>
                                <textarea required className="w-full border rounded-xl p-3 bg-gray-50 h-24 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ej: Acceso 24/7, Entrenador, Toallas..." value={form.features} onChange={e => setForm({...form, features: e.target.value})} />
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg transition-transform hover:scale-105">
                                    {editMode ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMembresias;