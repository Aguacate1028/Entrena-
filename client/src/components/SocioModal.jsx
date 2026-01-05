import React, { useState, useEffect } from 'react';
import { X, User, Activity, CreditCard, Clock, Save, Phone, MapPin, HeartPulse, AlertTriangle, FileText } from 'lucide-react';
import { actualizarUsuarioRequest } from '../api/usuarios';
import { useToast } from '../context/ToastContext';

const SocioModal = ({ socio, onClose, onUpdate }) => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('perfil');
    const [formData, setFormData] = useState(socio);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData(socio);
    }, [socio]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await actualizarUsuarioRequest(socio.id_usuario, formData);
            addToast('Datos actualizados correctamente', 'success');
            onUpdate(); // Recargar la lista en StaffSocios
            onClose();
        } catch (error) {
            addToast('Error al guardar cambios', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!socio) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                
                {/* Header */}
                <div className="p-6 bg-neutral-900 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-2xl font-bold border-4 border-neutral-800">
                            {formData.nombre?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{formData.nombre}</h2>
                            <p className="text-neutral-400 text-sm">{formData.email}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                formData.estado_suscripcion === 'activa' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                                {formData.estado_suscripcion}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Navegación (Tabs) */}
                <div className="flex border-b border-neutral-200 px-6 gap-6 shrink-0 bg-white overflow-x-auto">
                    {['perfil', 'salud', 'membresia', 'historial'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 text-sm font-bold uppercase tracking-wide border-b-2 transition-all whitespace-nowrap ${
                                activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-neutral-400 hover:text-neutral-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Contenido Scrollable */}
                <div className="p-8 overflow-y-auto flex-1 bg-neutral-50">
                    
                    {/* TAB: PERFIL */}
                    {activeTab === 'perfil' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField label="Nombre Completo" name="nombre" value={formData.nombre} onChange={handleChange} icon={User} />
                            <InputField label="Email" name="email" value={formData.email} onChange={handleChange} icon={FileText} />
                            <InputField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} icon={Phone} />
                            <InputField label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} icon={MapPin} />
                            <InputField label="Fecha Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} icon={Clock} />
                        </div>
                    )}

                    {/* TAB: SALUD */}
                    {activeTab === 'salud' && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                <InputField label="Altura (cm)" name="altura" type="number" value={formData.altura} onChange={handleChange} icon={Activity} />
                                <InputField label="Peso (kg)" name="peso" type="number" value={formData.peso} onChange={handleChange} icon={Activity} />
                                <InputField label="Tipo de Sangre" name="tipo_sangre" value={formData.tipo_sangre} onChange={handleChange} icon={HeartPulse} />
                            </div>
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                                <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                    <AlertTriangle size={18}/> Contacto de Emergencia
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputField label="Nombre Contacto" name="contacto_emergencia_nombre" value={formData.contacto_emergencia_nombre} onChange={handleChange} />
                                    <InputField label="Teléfono Contacto" name="contacto_emergencia_telefono" value={formData.contacto_emergencia_telefono} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: MEMBRESÍA */}
                    {activeTab === 'membresia' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Tipo Plan</label>
                                <select 
                                    name="membresia_tipo" 
                                    value={formData.membresia_tipo} 
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-purple-500 bg-white"
                                >
                                    <option value="Mensual">Mensual</option>
                                    <option value="Trimestral">Trimestral</option>
                                    <option value="Anual">Anual</option>
                                    <option value="Sin Membresía">Sin Membresía</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Estado</label>
                                <select 
                                    name="estado_suscripcion" 
                                    value={formData.estado_suscripcion} 
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-purple-500 bg-white"
                                >
                                    <option value="activa">Activa</option>
                                    <option value="inactiva">Inactiva</option>
                                    <option value="vencida">Vencida</option>
                                </select>
                            </div>
                            <InputField label="Vencimiento" name="membresia_fin" type="date" value={formData.membresia_fin} onChange={handleChange} icon={CreditCard} />
                            <InputField label="ID Locker Asignado" name="locker_id" type="number" value={formData.locker_id} onChange={handleChange} icon={Clock} />
                        </div>
                    )}

                    {/* TAB: HISTORIAL */}
                    {activeTab === 'historial' && (
                        <div>
                             <h3 className="font-bold text-lg mb-4 text-neutral-800">Últimos Accesos</h3>
                             <div className="space-y-3">
                                {socio.historial && socio.historial.length > 0 ? (
                                    socio.historial.map((h) => (
                                        <div key={h.id} className="flex justify-between items-center p-4 bg-white rounded-xl border border-neutral-200">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2.5 h-2.5 rounded-full ${h.estado === 'Acceso Permitido' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <div>
                                                    <p className="font-bold text-neutral-800 text-sm">{h.metodo || 'QR'}</p>
                                                    <span className={`text-xs ${h.estado === 'Acceso Permitido' ? 'text-green-600' : 'text-red-500'}`}>{h.estado}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-neutral-500 font-medium">
                                                {new Date(h.fecha_hora).toLocaleString('es-MX')}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-white rounded-xl border border-dashed border-neutral-300">
                                        <p className="text-neutral-400 italic text-sm">No hay registros recientes.</p>
                                    </div>
                                )}
                             </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white border-t border-neutral-100 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors shadow-lg"
                    >
                        <Save size={18} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente auxiliar para inputs
const InputField = ({ label, name, value, onChange, type = "text", icon: Icon }) => (
    <div>
        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-3.5 text-neutral-400" size={18} />}
            <input 
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                className={`w-full p-3 ${Icon ? 'pl-10' : ''} bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium text-neutral-800`}
            />
        </div>
    </div>
);

export default SocioModal;