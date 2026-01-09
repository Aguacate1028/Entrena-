import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Users, Dumbbell, Loader2 } from 'lucide-react';
import { crearClaseRequest, actualizarClaseRequest, obtenerListaEntrenadoresRequest } from '../api/clases';
import { useToast } from '../context/ToastContext';

const FormularioClaseModal = ({ isOpen, onClose, claseEditando, onRefresh }) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [listaEntrenadores, setListaEntrenadores] = useState([]); // Definida correctamente
    
    const [formData, setFormData] = useState({
        nombre: '', 
        descripcion: '', 
        horario: '', 
        cupo: 20, 
        entrenador: '', 
        dia_semana: 'Lunes'
    });

    // 1. Cargar la lista de entrenadores desde la DB
    useEffect(() => {
        const cargarEntrenadores = async () => {
            try {
                const data = await obtenerListaEntrenadoresRequest();
                setListaEntrenadores(data || []);
            } catch (error) {
                console.error("Error al cargar entrenadores:", error);
            }
        };
        if (isOpen) cargarEntrenadores();
    }, [isOpen]);

    // 2. Sincronizar el formulario cuando se va a editar una clase
    useEffect(() => {
        if (claseEditando) {
            setFormData({
                nombre: claseEditando.nombre || '',
                descripcion: claseEditando.descripcion || '',
                horario: claseEditando.horario || '',
                cupo: claseEditando.cupo || 20,
                entrenador: claseEditando.entrenador || '',
                dia_semana: claseEditando.dia_semana || 'Lunes'
            });
        } else {
            // Resetear si es una creación nueva
            setFormData({ 
                nombre: '', 
                descripcion: '', 
                horario: '', 
                cupo: 20, 
                entrenador: '', 
                dia_semana: 'Lunes' 
            });
        }
    }, [claseEditando, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.entrenador) return addToast('Selecciona un entrenador', 'warning');

        setLoading(true);
        try {
            if (claseEditando) {
                await actualizarClaseRequest(claseEditando.id, formData);
                addToast('Clase actualizada correctamente', 'success');
            } else {
                await crearClaseRequest(formData);
                addToast('Nueva clase creada con éxito', 'success');
            }
            onRefresh(); 
            onClose();   
        } catch (error) {
            addToast('Error al procesar la solicitud', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-neutral-900 p-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-black">{claseEditando ? 'Editar Clase' : 'Crear Nueva Clase'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400 block mb-1">Nombre del Entrenamiento</label>
                            <input required type="text" className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-purple-500" 
                                value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-neutral-400 block mb-1">Entrenador</label>
                            <select 
                                required 
                                className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none font-bold text-sm"
                                value={formData.entrenador} 
                                onChange={(e) => setFormData({...formData, entrenador: e.target.value})}
                            >
                                <option value="">Seleccionar...</option>
                                {listaEntrenadores.map(ent => (
                                    <option key={ent.id} value={ent.nombre}>{ent.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-neutral-400 block mb-1">Día de la semana</label>
                            <select 
                                className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none font-bold"
                                value={formData.dia_semana}
                                onChange={(e) => setFormData({...formData, dia_semana: e.target.value})}
                            >
                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-neutral-400 block mb-1">Horario</label>
                            <input required type="time" className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none font-bold" 
                                value={formData.horario} onChange={(e) => setFormData({...formData, horario: e.target.value})} />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-neutral-400 block mb-1">Cupo Máximo</label>
                            <input required type="number" className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none font-bold" 
                                value={formData.cupo} onChange={(e) => setFormData({...formData, cupo: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-lg">
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
                        {claseEditando ? 'Guardar Cambios' : 'Publicar Clase'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioClaseModal;