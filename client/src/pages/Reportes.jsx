import React, { useState, useEffect, useContext } from 'react';
import { AlertTriangle, PenTool, Droplets, HelpCircle, Send, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { crearReporteRequest, obtenerMisReportesRequest } from '../api/reportes';

const categorias = [
    { id: 'Maquinaria', icon: PenTool, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'Limpieza', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'Baños', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'Otros', icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const Reportes = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Formulario
    const [categoria, setCategoria] = useState('Maquinaria');
    const [prioridad, setPrioridad] = useState('Baja');
    const [descripcion, setDescripcion] = useState('');

    // Cargar historial
    useEffect(() => {
        if (user) loadHistorial();
    }, [user]);

    const loadHistorial = async () => {
        try {
            const data = await obtenerMisReportesRequest(user.id_usuario || user.id);
            setHistorial(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!descripcion.trim()) return addToast('Describe el problema', 'warning');

        setSending(true);
        try {
            await crearReporteRequest({
                id_usuario: user.id_usuario || user.id,
                categoria,
                descripcion,
                prioridad
            });
            addToast('Reporte enviado. Gracias por ayudarnos a mejorar.', 'success');
            setDescripcion('');
            loadHistorial(); // Refrescar lista
        } catch (error) {
            addToast('Error al enviar reporte', 'error');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Centro de <span className="text-purple-600">Reportes</span></h1>
                    <p className="text-neutral-500 mt-2">¿Algo no funciona? Avísanos para solucionarlo rápido.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    
                    {/* --- COLUMNA 1: FORMULARIO --- */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-neutral-100 h-fit">
                        <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                            <AlertTriangle className="text-yellow-500"/> Nuevo Reporte
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Selector de Categoría */}
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase mb-3 block">Categoría</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {categorias.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategoria(cat.id)}
                                            className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all
                                                ${categoria === cat.id 
                                                    ? `border-purple-500 bg-purple-50 ring-1 ring-purple-500` 
                                                    : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-full ${cat.bg} ${cat.color}`}>
                                                <cat.icon size={18}/>
                                            </div>
                                            <span className={`text-sm font-bold ${categoria === cat.id ? 'text-purple-900' : 'text-gray-600'}`}>{cat.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Prioridad */}
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase mb-3 block">Prioridad</label>
                                <div className="flex gap-2">
                                    {['Baja', 'Media', 'Alta'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPrioridad(p)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors
                                                ${prioridad === p 
                                                    ? (p === 'Alta' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-neutral-900 text-white border-neutral-900')
                                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase mb-3 block">Detalles del problema</label>
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Ej: La máquina de poleas hace un ruido extraño..."
                                    className="w-full bg-gray-50 border-none rounded-xl p-4 h-32 resize-none focus:ring-2 focus:ring-purple-100"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={sending}
                                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                            >
                                {sending ? <Loader size={20} className="animate-spin"/> : <><Send size={20}/> Enviar Reporte</>}
                            </button>
                        </form>
                    </div>

                    {/* --- COLUMNA 2: HISTORIAL --- */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-xl px-2 flex items-center gap-2 text-neutral-700">
                            <Clock size={20}/> Tus Reportes Recientes
                        </h3>

                        {loading ? (
                            <div className="text-center py-10"><Loader className="animate-spin mx-auto text-purple-600"/></div>
                        ) : historial.length === 0 ? (
                            <div className="bg-white p-8 rounded-3xl text-center border border-dashed border-gray-300">
                                <p className="text-gray-400">No tienes reportes activos.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                {historial.map((reporte) => (
                                    <div key={reporte.id} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                                        {/* Estado Badge */}
                                        <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider
                                            ${reporte.estado === 'Resuelto' ? 'bg-green-100 text-green-700' : 
                                              reporte.estado === 'En Revisión' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {reporte.estado}
                                        </div>

                                        <div className="flex items-start gap-4 mb-3">
                                            <div className={`mt-1 p-2 rounded-lg bg-gray-50 text-gray-500`}>
                                                <AlertTriangle size={18}/>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-neutral-900">{reporte.categoria}</h4>
                                                <p className="text-xs text-neutral-400">{new Date(reporte.fecha_creacion).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <p className="text-neutral-600 text-sm bg-gray-50 p-3 rounded-lg mb-2">
                                            "{reporte.descripcion}"
                                        </p>

                                        {reporte.respuesta_admin && (
                                            <div className="mt-3 pl-3 border-l-2 border-purple-200">
                                                <p className="text-xs font-bold text-purple-600 mb-1">Respuesta del Staff:</p>
                                                <p className="text-sm text-neutral-600">{reporte.respuesta_admin}</p>
                                            </div>
                                        )}

                                        {reporte.estado === 'Resuelto' && (
                                            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-green-600">
                                                <CheckCircle size={14}/> Problema solucionado
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Reportes;