import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, MapPin, CreditCard, Save, Calendar } from 'lucide-react'; // Agregamos Calendar
import { crearSocioRequest } from '../api/usuarios';
import { useToast } from '../context/ToastContext';

const NuevoSocioModal = ({ onClose, onSuccess }) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        direccion: '',
        fecha_nacimiento: '', // <--- CAMPO NUEVO
        membresia_tipo: 'Mensual'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación básica
        if(!formData.fecha_nacimiento) {
            addToast('La fecha de nacimiento es obligatoria', 'error');
            return;
        }

        setLoading(true);
        try {
            await crearSocioRequest(formData);
            addToast('¡Socio registrado exitosamente!', 'success');
            onSuccess(); 
            onClose();
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 bg-neutral-900 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Inscribir Nuevo Socio</h2>
                        <p className="text-neutral-400 text-sm">Registro rápido en mostrador</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto bg-neutral-50 flex-1">
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* Datos Personales */}
                        <div className="col-span-2 md:col-span-1 space-y-4">
                            <h3 className="font-bold text-neutral-800 text-sm uppercase mb-2">Datos Personales</h3>
                            <Input label="Nombre Completo" name="nombre" icon={User} required value={formData.nombre} onChange={handleChange} />
                            
                            {/* CAMPO DE FECHA DE NACIMIENTO AGREGADO */}
                            <Input label="Fecha Nacimiento" name="fecha_nacimiento" type="date" icon={Calendar} required value={formData.fecha_nacimiento} onChange={handleChange} />
                            
                            <Input label="Teléfono" name="telefono" icon={Phone} value={formData.telefono} onChange={handleChange} />
                        </div>

                        {/* Datos de Cuenta */}
                        <div className="col-span-2 md:col-span-1 space-y-4">
                            <h3 className="font-bold text-neutral-800 text-sm uppercase mb-2">Cuenta y Acceso</h3>
                            <Input label="Correo Electrónico" name="email" type="email" icon={Mail} required value={formData.email} onChange={handleChange} />
                            <Input label="Contraseña Temporal" name="password" type="password" icon={Lock} required value={formData.password} onChange={handleChange} />
                            <Input label="Dirección" name="direccion" icon={MapPin} value={formData.direccion} onChange={handleChange} />
                        </div>

                        {/* Membresía (Ancho completo) */}
                        <div className="col-span-2 pt-4 border-t border-neutral-200">
                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Plan Inicial</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3.5 text-purple-600" size={20} />
                                <select 
                                    name="membresia_tipo"
                                    value={formData.membresia_tipo}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-purple-100 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none font-bold text-neutral-800 appearance-none"
                                >
                                    <option value="Mensual">Plan Mensual (1 Mes)</option>
                                    <option value="Trimestral">Plan Trimestral (3 Meses)</option>
                                    <option value="Anual">Plan Anual (1 Año)</option>
                                    <option value="Semanal">Pase Semanal (7 Días)</option>
                                </select>
                            </div>
                            <p className="text-xs text-neutral-400 mt-2 ml-1">
                                * La fecha de vencimiento se calculará automáticamente a partir de hoy.
                            </p>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-neutral-100 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors shadow-lg hover:shadow-purple-500/30"
                    >
                        <Save size={18} /> {loading ? 'Registrando...' : 'Confirmar Inscripción'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente Input Reutilizable
const Input = ({ label, icon: Icon, required, ...props }) => (
    <div>
        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1 ml-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-3.5 text-neutral-400" size={18} />}
            <input 
                {...props}
                className={`w-full p-3 ${Icon ? 'pl-10' : ''} bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium`}
            />
        </div>
    </div>
);

export default NuevoSocioModal;