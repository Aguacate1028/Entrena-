import React, { useState, useEffect } from 'react';
import { obtenerReportesAdmin } from '../api/admin';
import { 
    Eye, CheckCircle2, Clock, Search, Filter, 
    AlertCircle, MessageSquare, User, Calendar 
} from 'lucide-react';

const AdminReportes = () => {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('Todos'); // Todos, Pendiente, Resuelto
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        setLoading(true);
        obtenerReportesAdmin()
            .then(data => {
                if (Array.isArray(data)) {
                    setReportes(data);
                } else {
                    setReportes([]);
                }
            })
            .catch(err => {
                console.error("Error:", err);
                setReportes([]);
            })
            .finally(() => setLoading(false));
    };

    // --- LÓGICA DE FILTRADO ---
    const reportesFiltrados = reportes.filter(rep => {
        const matchEstado = filtroEstado === 'Todos' || rep.estado === filtroEstado;
        const matchTexto = rep.categoria?.toLowerCase().includes(busqueda.toLowerCase()) ||
                           rep.usuario_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                           rep.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
        return matchEstado && matchTexto;
    });

    // Función para formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return 'Fecha desconocida';
        return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Centro de Reportes</h1>
                    <p className="text-gray-500 mt-1">Gestiona las incidencias y feedback de los usuarios.</p>
                </div>
                
                {/* BUSCADOR */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar reporte..." 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* TABS DE FILTRO */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['Todos', 'Pendiente', 'Resuelto'].map((estado) => (
                    <button
                        key={estado}
                        onClick={() => setFiltroEstado(estado)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                            ${filtroEstado === estado 
                                ? 'bg-gray-900 text-white shadow-md' 
                                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {estado}
                        {estado === 'Pendiente' && (
                            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {reportes.filter(r => r.estado === 'Pendiente').length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* TABLA DE REPORTES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-400">Cargando reportes...</div>
                ) : reportesFiltrados.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                            <MessageSquare size={32}/>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No se encontraron reportes</h3>
                        <p className="text-gray-500 text-sm">No hay incidencias que coincidan con tu búsqueda.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="p-5">Usuario</th>
                                <th className="p-5">Asunto / Categoría</th>
                                <th className="p-5">Estado</th>
                                <th className="p-5">Fecha</th>
                                <th className="p-5 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reportesFiltrados.map(rep => (
                                <tr key={rep.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                                                {rep.usuario_nombre ? rep.usuario_nombre.charAt(0).toUpperCase() : <User size={16}/>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{rep.usuario_nombre || 'Usuario Eliminado'}</p>
                                                <p className="text-xs text-gray-400">ID: {rep.id_usuario || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded-md mr-2">
                                            {rep.categoria}
                                        </span>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1 max-w-xs">
                                            {rep.descripcion}
                                        </p>
                                    </td>
                                    <td className="p-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                                            ${rep.estado === 'Resuelto' 
                                                ? 'bg-green-50 text-green-700 border-green-100' 
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}
                                        >
                                            {rep.estado === 'Resuelto' ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                                            {rep.estado}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-500">
                                        {formatearFecha(rep.fecha_creacion)}
                                    </td>
                                    <td className="p-5 text-right">
                                        <button 
                                            onClick={() => setSelected(rep)} 
                                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                        >
                                            <Eye size={20}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL DETALLE */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up">
                        {/* Modal Header */}
                        <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                                    ${selected.estado === 'Resuelto' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {selected.estado === 'Resuelto' ? <CheckCircle2 size={24}/> : <AlertCircle size={24}/>}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">{selected.categoria}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Calendar size={14}/> {formatearFecha(selected.fecha_creacion)}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                                <div className="p-1 rounded-full hover:bg-gray-200 transition-colors">✕</div>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Sección Usuario */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                    {selected.usuario_nombre?.charAt(0) || <User/>}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Reportado por</p>
                                    <p className="text-sm font-bold text-gray-900">{selected.usuario_nombre}</p>
                                </div>
                            </div>

                            {/* Descripción del Problema */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Descripción del Reporte</h4>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 text-gray-700 text-sm leading-relaxed">
                                    "{selected.descripcion}"
                                </div>
                            </div>

                            {/* Respuesta del Staff (Si existe) */}
                            {selected.respuesta_admin ? (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <p className="text-xs font-bold text-blue-600 uppercase">
                                            Resolución por: {selected.staff_nombre || 'Administración'}
                                        </p>
                                    </div>
                                    <p className="text-blue-900 text-sm italic">
                                        "{selected.respuesta_admin}"
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-yellow-50 rounded-xl border border-yellow-100 border-dashed">
                                    <p className="text-yellow-700 text-sm font-medium">Este reporte aún no ha sido resuelto.</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button 
                                onClick={() => setSelected(null)} 
                                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
                            >
                                Cerrar Detalle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReportes;