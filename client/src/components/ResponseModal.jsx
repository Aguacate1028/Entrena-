import React, { useState, useEffect } from 'react';
import { obtenerReportesRequest, responderReporteRequest, eliminarReporteRequest } from '../api/reportes';
import { supabase } from '../supabase';
import ConfirmModal from './ConfirmModal'; 
import ResponseModal from './ResponseModal'; 
import { CheckCircle2, Clock, Trash2, MessageSquare, User, AlertTriangle, FileText } from 'lucide-react';

const StaffReportes = () => {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados para Modales
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isResponseOpen, setIsResponseOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const cargarReportes = async () => {
        try {
            const data = await obtenerReportesRequest();
            if (Array.isArray(data)) {
                setReportes(data);
                setError(null);
            } else {
                setReportes([]);
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Error de conexión al cargar reportes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarReportes();
        const channel = supabase
            .channel('tabla-reportes-staff')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reportes' }, () => {
                cargarReportes(); 
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // --- ELIMINAR ---
    const openDeleteModal = (id) => {
        setSelectedId(id);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;
        setActionLoading(true);
        try {
            await eliminarReporteRequest(selectedId);
            setIsDeleteOpen(false); // La lista se actualiza sola por el realtime de Supabase
        } catch (error) {
            alert("Error al eliminar");
        } finally {
            setActionLoading(false);
            setSelectedId(null);
        }
    };

    // --- RESPONDER ---
    const openResponseModal = (id) => {
        setSelectedId(id);
        setIsResponseOpen(true);
    };

    const handleConfirmResponse = async (textoRespuesta) => {
        if (!selectedId) return;
        setActionLoading(true);
        try {
            // Enviamos 'respuesta_admin' que es como se llama en tu tabla
            await responderReporteRequest(selectedId, { respuesta_admin: textoRespuesta });
            setIsResponseOpen(false);
        } catch (error) {
            alert("Error al responder");
        } finally {
            setActionLoading(false);
            setSelectedId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            {/* Header de página */}
            <div className="max-w-6xl mx-auto mb-10">
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">Centro de Reportes</h1>
                <p className="text-gray-500 mt-2 text-lg">Revisa y da solución a las incidencias de los usuarios.</p>
            </div>

            {/* Mensaje de Error */}
            {error && (
                <div className="max-w-6xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle size={20} />
                    {error}
                </div>
            )}

            {/* Grid de Reportes */}
            <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400">Cargando incidencias...</div>
                ) : Array.isArray(reportes) && reportes.length > 0 ? (
                    reportes.map((rep) => (
                        <div key={rep.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group">
                            
                            {/* Card Header: Categoría y Estado */}
                            <div className="p-5 pb-0 flex justify-between items-start">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <FileText size={18} />
                                    </span>
                                    {/* Mapeo: rep.categoria */}
                                    <h3 className="font-bold text-lg text-gray-800">{rep.categoria}</h3>
                                </div>
                                
                                {/* Mapeo: rep.estado */}
                                {rep.estado === 'Resuelto' ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                        <CheckCircle2 size={12} /> Resuelto
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                        <Clock size={12} /> Pendiente
                                    </span>
                                )}
                            </div>

                            {/* Card Body: Descripción */}
                            <div className="px-5 py-4 flex-1">
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {rep.descripcion}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded-lg w-fit">
                                    <User size={14} />
                                    {/* Mapeo: rep.id_usuario */}
                                    <span>Usuario ID: <span className="font-mono font-medium text-gray-600">{rep.id_usuario}</span></span>
                                </div>

                                {/* Mapeo: rep.respuesta_admin */}
                                {rep.respuesta_admin && (
                                    <div className="mt-4 bg-blue-50/50 border border-blue-100 rounded-xl p-3 animate-fade-in">
                                        <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                                            <MessageSquare size={12} /> Respuesta Administrativa:
                                        </p>
                                        <p className="text-sm text-blue-900/80 italic">"{rep.respuesta_admin}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer: Botones */}
                            <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/30 rounded-b-2xl">
                                {rep.estado !== 'Resuelto' && (
                                    <button 
                                        onClick={() => openResponseModal(rep.id)}
                                        className="flex-1 bg-neutral-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all transform active:scale-95 flex justify-center items-center gap-2 shadow-lg shadow-neutral-900/10"
                                    >
                                        <MessageSquare size={16} /> Responder
                                    </button>
                                )}
                                <button 
                                    onClick={() => openDeleteModal(rep.id)}
                                    className={`py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors ${rep.estado === 'Resuelto' ? 'w-full flex justify-center gap-2 items-center text-red-500 font-bold border-red-100 bg-red-50' : 'text-gray-400'}`}
                                >
                                    <Trash2 size={18} /> {rep.estado === 'Resuelto' && "Eliminar Reporte"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-white border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="text-gray-300" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">¡Todo limpio!</h3>
                        <p className="text-gray-500 mt-2">No hay reportes pendientes de revisión en este momento.</p>
                    </div>
                )}
            </div>

            {/* MODALES */}
            <ConfirmModal 
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar reporte?"
                message="Esta acción borrará el reporte de la base de datos permanentemente. ¿Estás seguro?"
                isLoading={actionLoading}
            />

            <ResponseModal 
                isOpen={isResponseOpen}
                onClose={() => setIsResponseOpen(false)}
                onConfirm={handleConfirmResponse}
                isLoading={actionLoading}
            />
        </div>
    );
};

export default StaffReportes;