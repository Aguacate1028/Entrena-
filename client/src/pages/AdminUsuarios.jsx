import React, { useState, useEffect } from 'react';
import { obtenerUsuariosAdmin } from '../api/admin';
import { 
    Search, User, MapPin, Phone, Calendar, 
    CreditCard, Dumbbell, Key, Activity, X, 
    History, AlertTriangle, CheckCircle2 
} from 'lucide-react';

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // Para el modal
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerUsuariosAdmin()
            .then(data => setUsuarios(data || []))
            .catch(() => setUsuarios([]))
            .finally(() => setLoading(false));
    }, []);

    const filtrados = usuarios.filter(u => 
        u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
        u.email?.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Helpers de UI
    const getRolColor = (rol) => {
        switch(rol) {
            case 'administrador': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'entrenador': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'staff': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            {/* HEADER & STATS */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Directorio de Usuarios</h1>
                <p className="text-gray-500 mb-6">Gestiona socios, staff y administradores.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase">Total Usuarios</p>
                        <p className="text-2xl font-black text-gray-900">{usuarios.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase">Socios Activos</p>
                        <p className="text-2xl font-black text-green-600">
                            {usuarios.filter(u => u.estado_suscripcion === 'activa').length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase">Staff & administrador</p>
                        <p className="text-2xl font-black text-purple-600">
                            {usuarios.filter(u => u.rol !== 'socio').length}
                        </p>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o email..." 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" 
                        value={busqueda} 
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* TABLA PRINCIPAL */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-5">Usuario</th>
                                <th className="p-5">Rol</th>
                                <th className="p-5">Estado</th>
                                <th className="p-5">Membresía</th>
                                <th className="p-5 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="p-10 text-center text-gray-400">Cargando base de datos...</td></tr>
                            ) : filtrados.map(u => (
                                <tr key={u.id_usuario} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500 font-bold border border-gray-300">
                                                {u.foto_perfil ? <img src={u.foto_perfil} alt="avatar" className="w-full h-full object-cover"/> : u.nombre.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{u.nombre}</p>
                                                <p className="text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getRolColor(u.rol)} capitalize`}>
                                            {u.rol}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        {u.estado_suscripcion === 'activa' ? 
                                            <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs"><div className="w-2 h-2 rounded-full bg-green-500"></div> Activo</span> : 
                                            <span className="flex items-center gap-1.5 text-gray-400 font-bold text-xs"><div className="w-2 h-2 rounded-full bg-gray-400"></div> Inactivo</span>
                                        }
                                    </td>
                                    <td className="p-5 text-gray-600">
                                        {u.membresia_tipo}
                                    </td>
                                    <td className="p-5 text-right">
                                        <button 
                                            onClick={() => setSelectedUser(u)}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-black transition-transform hover:scale-105"
                                        >
                                            Ver Expediente
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL DETALLE DE USUARIO --- */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] animate-scale-up">
                        
                        {/* COLUMNA IZQUIERDA: RESUMEN */}
                        <div className="md:w-1/3 bg-gray-50 p-8 border-r border-gray-100 flex flex-col items-center text-center overflow-y-auto">
                            <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden mb-4">
                                {selectedUser.foto_perfil ? 
                                    <img src={selectedUser.foto_perfil} alt="profile" className="w-full h-full object-cover"/> : 
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 font-black bg-gray-100">{selectedUser.nombre.charAt(0)}</div>
                                }
                            </div>
                            <h2 className="text-xl font-black text-gray-900 leading-tight">{selectedUser.nombre}</h2>
                            <p className="text-sm text-gray-500 mb-4">{selectedUser.email}</p>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-bold mb-6 ${getRolColor(selectedUser.rol)}`}>
                                {selectedUser.rol.toUpperCase()}
                            </span>

                            <div className="w-full space-y-4 text-left">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Membresía</p>
                                    <div className="flex items-center gap-2 text-purple-600 font-bold">
                                        <CreditCard size={18}/> {selectedUser.membresia_tipo}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Vence: {formatDate(selectedUser.membresia_fin)}</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Locker Asignado</p>
                                    <div className="flex items-center gap-2 text-gray-700 font-bold">
                                        <Key size={18} className="text-orange-500"/> 
                                        {selectedUser.locker_activo ? `Locker #${selectedUser.locker_id}` : 'Ninguno'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: DETALLES */}
                        <div className="md:w-2/3 flex flex-col bg-white">
                            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="text-lg font-bold text-gray-900">Expediente Completo</h3>
                                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                            </div>
                            
                            <div className="p-8 overflow-y-auto flex-1 space-y-8">
                                {/* SECCIÓN 1: DATOS PERSONALES */}
                                <div>
                                    <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 pb-2 border-b">
                                        <User size={18} className="text-blue-500"/> Información Personal
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-400 font-bold text-xs uppercase">Teléfono</p>
                                            <p className="font-medium text-gray-700 flex gap-2"><Phone size={14}/> {selectedUser.telefono || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 font-bold text-xs uppercase">Fecha Nacimiento</p>
                                            <p className="font-medium text-gray-700 flex gap-2"><Calendar size={14}/> {formatDate(selectedUser.fecha_nacimiento)}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-gray-400 font-bold text-xs uppercase">Dirección</p>
                                            <p className="font-medium text-gray-700 flex gap-2"><MapPin size={14}/> {selectedUser.direccion || 'Sin dirección registrada'}</p>
                                        </div>
                                        <div className="col-span-2 bg-red-50 p-3 rounded-lg border border-red-100">
                                            <p className="text-red-500 font-bold text-xs uppercase flex items-center gap-1"><AlertTriangle size={12}/> Contacto Emergencia</p>
                                            <p className="font-bold text-gray-800 mt-1">
                                                {selectedUser.contacto_emergencia_nombre} 
                                                <span className="font-normal text-gray-600 ml-2">({selectedUser.contacto_emergencia_telefono || 'N/A'})</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 2: DATOS FÍSICOS & GYM */}
                                <div>
                                    <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 pb-2 border-b">
                                        <Activity size={18} className="text-green-500"/> Datos Deportivos
                                    </h4>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                                            <p className="text-xs text-gray-400 uppercase">Peso</p>
                                            <p className="font-bold text-gray-800">{selectedUser.peso || '-'} kg</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                                            <p className="text-xs text-gray-400 uppercase">Altura</p>
                                            <p className="font-bold text-gray-800">{selectedUser.altura || '-'} m</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                                            <p className="text-xs text-gray-400 uppercase">Sangre</p>
                                            <p className="font-bold text-gray-800">{selectedUser.tipo_sangre || '?'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                        <div className="bg-white p-2 rounded-full text-purple-600 shadow-sm"><Dumbbell size={18}/></div>
                                        <div>
                                            <p className="text-xs font-bold text-purple-400 uppercase">Entrenador Asignado</p>
                                            <p className="font-bold text-gray-800">{selectedUser.nombre_entrenador}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 3: HISTORIAL RECIENTE */}
                                <div>
                                    <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 pb-2 border-b">
                                        <History size={18} className="text-gray-500"/> Últimas Asistencias
                                    </h4>
                                    {selectedUser.ultimas_asistencias?.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedUser.ultimas_asistencias.map((asist, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                                    <span className="flex items-center gap-2 text-gray-600">
                                                        <CheckCircle2 size={14} className="text-green-500"/>
                                                        {new Date(asist.fecha_hora).toLocaleString()}
                                                    </span>
                                                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">{asist.metodo}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No hay registros recientes.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsuarios;