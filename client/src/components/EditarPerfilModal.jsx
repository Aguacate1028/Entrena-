import React, { useState } from 'react';
import { X, Save, Loader, User, AlertTriangle } from 'lucide-react';
import { actualizarPerfilRequest } from '../api/usuarios';
import { useToast } from '../context/ToastContext';

const EditarPerfilModal = ({ usuario, onClose, onUpdate }) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'salud', 'emergencia'

    const [formData, setFormData] = useState({
        nombre: usuario.nombre || '',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        fecha_nacimiento: usuario.fecha_nacimiento || '',
        tipo_sangre: usuario.tipo_sangre || '',
        contacto_emergencia_nombre: usuario.contacto_emergencia_nombre || '',
        contacto_emergencia_telefono: usuario.contacto_emergencia_telefono || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const actualizado = await actualizarPerfilRequest(usuario.id_usuario, formData);
            onUpdate(actualizado);
            addToast('Perfil actualizado correctamente', 'success');
            onClose();
        } catch (error) {
            addToast('Error al actualizar perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
                
                {/* HEADER */}
                <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-neutral-900">Editar Perfil</h2>
                        <p className="text-neutral-500 text-sm">Actualiza tu información personal</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                {/* TABS (Igual al diseño) */}
                <div className="px-6 pt-6 pb-2">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button 
                            onClick={() => setActiveTab('personal')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'personal' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            Personal
                        </button>
                        <button 
                            onClick={() => setActiveTab('salud')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'salud' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            Salud
                        </button>
                        <button 
                            onClick={() => setActiveTab('emergencia')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'emergencia' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            Emergencia
                        </button>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow">
                    
                    {/* --- TAB PERSONAL --- */}
                    {activeTab === 'personal' && (
                        <div className="space-y-5 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-gray-400" size={18}/>
                                    <input 
                                        type="text" 
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Teléfono</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Fecha Nacimiento</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                                        value={formData.fecha_nacimiento}
                                        onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Dirección</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                                    value={formData.direccion}
                                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                                />
                            </div>
                        </div>
                    )}

                    {/* --- TAB SALUD (IMC) --- */}
                    {activeTab === 'salud' && (
                        <div className="space-y-6 animate-fade-in">
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Sangre</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-lg"
                                        value={formData.tipo_sangre}
                                        onChange={(e) => setFormData({...formData, tipo_sangre: e.target.value})}
                                    >
                                        <option value="">--</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                            </div>
                    )}

                    {/* --- TAB EMERGENCIA --- */}
                    {activeTab === 'emergencia' && (
                        <div className="space-y-5 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Contacto de Emergencia</label>
                                <input 
                                    type="text" 
                                    placeholder="Nombre de familiar o amigo"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                                    value={formData.contacto_emergencia_nombre}
                                    onChange={(e) => setFormData({...formData, contacto_emergencia_nombre: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Teléfono de Emergencia</label>
                                <input 
                                    type="text" 
                                    placeholder="+52 ..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                                    value={formData.contacto_emergencia_telefono}
                                    onChange={(e) => setFormData({...formData, contacto_emergencia_telefono: e.target.value})}
                                />
                            </div>

                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start">
                                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                <p className="text-xs text-red-600 font-medium leading-relaxed">
                                    Importante: Esta información se utilizará únicamente en caso de emergencia médica dentro de las instalaciones. Asegúrate de que el número esté actualizado.
                                </p>
                            </div>
                        </div>
                    )}

                </form>

                {/* FOOTER BOTONES */}
                <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 rounded-xl font-bold text-neutral-600 hover:bg-neutral-50 border border-neutral-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-purple-200"
                    >
                        {loading ? <Loader className="animate-spin" /> : <><Save size={20} /> Guardar Cambios</>}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditarPerfilModal;