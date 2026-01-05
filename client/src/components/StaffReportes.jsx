import React, { useState, useEffect } from 'react';
import { obtenerReportesRequest, responderReporteRequest, eliminarReporteRequest } from '../api/reportes';
import ConfirmModal from './ConfirmModal'; 
import ResponseModal from './ResponseModal'; 

import { CheckCircle2, Clock, Trash2, MessageSquare, User, AlertTriangle, FileText, RefreshCw, Send } from 'lucide-react';

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
        setLoading(true);
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
            setError("Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarReportes();
    }, []);

    // --- ACCIONES ---
    const openDeleteModal = (id) => { setSelectedId(id); setIsDeleteOpen(true); };
    const openResponseModal = (id) => { setSelectedId(id); setIsResponseOpen(true); };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;
        setActionLoading(true);
        try {
            await eliminarReporteRequest(selectedId);
            setIsDeleteOpen(false);
            await cargarReportes();
        } catch (error) { 
            alert("Error al eliminar"); 
        } finally { 
            setActionLoading(false); 
            setSelectedId(null); 
        }
    };

    const handleConfirmResponse = async (textoRespuesta) => {
        if (!selectedId) return;
        setActionLoading(true);
        try {
            await responderReporteRequest(selectedId, { respuesta_admin: textoRespuesta });
            setIsResponseOpen(false);
            await cargarReportes();
        } catch (error) { 
            alert("Error al responder"); 
        } finally { 
            setActionLoading(false); 
            setSelectedId(null); 
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            {/* Header con Botón de Recargar */}
            <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Centro de Reportes</h1>
                    <p className="text-gray-500 mt-1">Gestiona y responde a las incidencias de los usuarios.</p>
                </div>
                
                <button 
                    onClick={cargarReportes} 
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm hover:shadow-md font-bold text-sm"
                >
                    <RefreshCw size={18} className={`transition-transform duration-700 ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
                    Actualizar Lista
                </button>
            </div>

            {error && (
                <div className="max-w-6xl mx-auto bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-8 flex gap-3 items-center shadow-sm">
                    <div className="bg-red-100 p-2 rounded-full">
                        <AlertTriangle size={20}/> 
                    </div>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading && reportes.length === 0 ? (
                    // Skeleton Loading mejorado
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse h-64">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-20 bg-gray-100 rounded mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded mt-auto"></div>
                        </div>
                    ))
                ) : Array.isArray(reportes) && reportes.length > 0 ? (
                    reportes.map((rep) => (
                        <div key={rep.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group relative overflow-hidden">
                            
                            {/* Barra lateral de color según estado */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${rep.estado === 'Resuelto' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>

                            {/* --- HEADER DE LA TARJETA --- */}
                            <div className="p-5 pb-2 flex justify-between items-start pl-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <FileText size={18} />
                                    </div>
                                    <h3 className="font-bold text-gray-800">{rep.categoria}</h3>
                                </div>
                                
                                {rep.estado === 'Resuelto' ? (
                                    <span className="bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <CheckCircle2 size={12} className="text-green-600"/> Resuelto
                                    </span>
                                ) : (
                                    <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <Clock size={12} className="text-yellow-600"/> Pendiente
                                    </span>
                                )}
                            </div>

                            {/* --- CUERPO --- */}
                            <div className="px-6 py-3 flex-1">
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                                    {rep.descripcion}
                                </p>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
                                        <User size={12} className="text-gray-400"/> 
                                        <span className="text-xs font-mono text-gray-500 font-medium">ID: {rep.id_usuario}</span>
                                    </div>
                                </div>

                                {/* Sección de Respuesta Admin */}
                                {rep.respuesta_admin && (
                                    <div className="mt-2 relative">
                                        <div className="absolute -top-2 left-4 w-3 h-3 bg-blue-50 border-t border-l border-blue-100 transform rotate-45"></div>
                                        <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100">
                                            <p className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1">
                                                <MessageSquare size={12}/> Staff:
                                            </p>
                                            <p className="text-sm text-blue-900/80 italic">"{rep.respuesta_admin}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* --- FOOTER (ACCIONES) --- */}
                            <div className="p-4 px-6 border-t border-gray-50 bg-gray-50/30 flex gap-3 mt-auto">
                                {rep.estado !== 'Resuelto' && (
                                    <button 
                                        onClick={() => openResponseModal(rep.id)} 
                                        className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all transform active:scale-95 shadow-lg shadow-gray-200 flex justify-center items-center gap-2"
                                    >
                                        <Send size={14} /> Responder
                                    </button>
                                )}
                                
                                <button 
                                    onClick={() => openDeleteModal(rep.id)} 
                                    className={`
                                        p-2.5 rounded-xl border transition-colors flex items-center justify-center
                                        ${rep.estado === 'Resuelto' 
                                            ? 'w-full border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm gap-2' 
                                            : 'border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500'
                                        }
                                    `}
                                >
                                    <Trash2 size={18}/> {rep.estado === 'Resuelto' && "Eliminar Reporte"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center animate-fade-in">
                        <div className="bg-white p-6 rounded-full shadow-sm mb-4 border border-gray-100">
                            <CheckCircle2 size={48} className="text-green-400"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Todo en orden</h3>
                        <p className="text-gray-400">No hay reportes pendientes de revisión.</p>
                    </div>
                )}
            </div>

            <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} title="¿Eliminar reporte?" message="Esta acción no se puede deshacer." isLoading={actionLoading} />
            <ResponseModal isOpen={isResponseOpen} onClose={() => setIsResponseOpen(false)} onConfirm={handleConfirmResponse} isLoading={actionLoading} />
        </div>
    );
};

export default StaffReportes;