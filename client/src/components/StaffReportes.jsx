import React, { useState, useEffect } from 'react';
import { obtenerReportesRequest, responderReporteRequest, eliminarReporteRequest } from '../api/reportes';
// CORRECCIÓN 1: Importación correcta (asumiendo que supabase.js está en src)
import { supabase } from '../supabase'; 
import ConfirmModal from './ConfirmModal'; 
import ResponseModal from './ResponseModal'; 
import { CheckCircle2, Clock, Trash2, MessageSquare, User, AlertTriangle, FileText } from 'lucide-react';

const StaffReportes = () => {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
            setError("Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarReportes();
        const channel = supabase
            .channel('tabla-reportes-admin-fix')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reportes' }, () => {
                cargarReportes(); 
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
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
        } catch (error) { alert("Error al eliminar"); } 
        finally { setActionLoading(false); setSelectedId(null); }
    };

    const handleConfirmResponse = async (textoRespuesta) => {
        if (!selectedId) return;
        setActionLoading(true);
        try {
            // CORRECCIÓN 2: Enviamos 'respuesta_admin' que es lo que pide tu base de datos
            await responderReporteRequest(selectedId, { respuesta_admin: textoRespuesta });
            setIsResponseOpen(false);
        } catch (error) { alert("Error al responder"); } 
        finally { setActionLoading(false); setSelectedId(null); }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <h1 className="text-3xl font-black text-gray-800 mb-8">Centro de Reportes</h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 flex gap-2 items-center">
                    <AlertTriangle/> {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p className="text-gray-400 col-span-full text-center">Cargando...</p>
                ) : Array.isArray(reportes) && reportes.length > 0 ? (
                    reportes.map((rep) => (
                        <div key={rep.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                    <FileText size={18} className="text-blue-500"/>
                                    {rep.categoria}
                                </h3>
                                {rep.estado === 'Resuelto' ? (
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={12}/> Resuelto
                                    </span>
                                ) : (
                                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <Clock size={12}/> Pendiente
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                <p className="text-gray-600 text-sm mb-4">{rep.descripcion}</p>
                                <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded w-fit flex gap-1 items-center">
                                    <User size={12}/> ID Usuario: {rep.id_usuario}
                                </p>
                                
                                {/* CORRECCIÓN 3: Leemos 'respuesta_admin' para mostrarla */}
                                {rep.respuesta_admin && (
                                    <div className="mt-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                                        <p className="text-xs font-bold text-blue-700 mb-1">Respuesta Admin:</p>
                                        <p className="text-sm text-blue-900 italic">"{rep.respuesta_admin}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t flex gap-2">
                                {rep.estado !== 'Resuelto' && (
                                    <button onClick={() => openResponseModal(rep.id)} className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800">
                                        Responder
                                    </button>
                                )}
                                <button onClick={() => openDeleteModal(rep.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={20}/>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        <CheckCircle2 size={48} className="mx-auto mb-2 text-gray-300"/>
                        <p>No hay reportes pendientes.</p>
                    </div>
                )}
            </div>

            <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} title="¿Eliminar?" message="Se borrará permanentemente." isLoading={actionLoading} />
            <ResponseModal isOpen={isResponseOpen} onClose={() => setIsResponseOpen(false)} onConfirm={handleConfirmResponse} isLoading={actionLoading} />
        </div>
    );
};

export default StaffReportes;