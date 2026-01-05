import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Calendar, TrendingUp, CreditCard, User, Download } from 'lucide-react';
import { obtenerPagosStaffRequest } from '../api/usuarios';

const StaffPagos = () => {
    const [pagos, setPagos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPagos = async () => {
            try {
                const data = await obtenerPagosStaffRequest();
                setPagos(data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        cargarPagos();
    }, []);

    // Filtros de búsqueda (por nombre de socio o concepto de pago)
    const pagosFiltrados = pagos.filter(p => 
        (p.usuarios?.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.concepto || '').toLowerCase().includes(busqueda.toLowerCase())
    );

    // Cálculo del total mostrado
    const totalMostrado = pagosFiltrados.reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                
                {/* Header y KPIs */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Finanzas y Cobros</h1>
                        <p className="text-neutral-500 mt-1">Historial de transacciones del gimnasio.</p>
                    </div>
                    
                    <div className="bg-white px-6 py-3 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Ingresos Totales</p>
                            <p className="text-2xl font-black text-neutral-900">${totalMostrado.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Barra de Herramientas */}
                <div className="bg-white p-4 rounded-[24px] border border-neutral-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-3.5 text-neutral-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Buscar socio, membresía o locker..." 
                            className="w-full pl-12 pr-4 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium transition-all"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-sm font-bold hover:bg-neutral-50 transition-colors">
                        <Download size={18} /> Exportar CSV
                    </button>
                </div>

                {/* Tabla de Pagos */}
                <div className="bg-white rounded-[32px] border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase border-b border-neutral-100">
                                    <th className="p-6 font-bold">Socio</th>
                                    <th className="p-6 font-bold">Concepto (Producto)</th>
                                    <th className="p-6 font-bold">Fecha</th>
                                    <th className="p-6 font-bold text-right">Monto</th>
                                    <th className="p-6 font-bold text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-neutral-400">Cargando historial...</td>
                                    </tr>
                                ) : pagosFiltrados.length > 0 ? (
                                    pagosFiltrados.map((pago) => (
                                        <tr key={pago.id} className="hover:bg-purple-50/30 transition-colors group">
                                            {/* Columna Socio */}
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    {pago.usuarios?.foto_perfil ? (
                                                        <img src={pago.usuarios.foto_perfil} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 font-bold border border-neutral-200">
                                                            {pago.usuarios?.nombre?.charAt(0) || <User size={18}/>}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-neutral-900 text-sm">
                                                            {pago.usuarios?.nombre || <span className="text-red-400 italic">Usuario Eliminado</span>}
                                                        </p>
                                                        <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
                                                            ID: {pago.id_usuario}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Columna Concepto */}
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <span className={`p-2.5 rounded-xl ${
                                                        pago.concepto?.toLowerCase().includes('locker') 
                                                            ? 'bg-blue-100 text-blue-600' 
                                                            : 'bg-purple-100 text-purple-600'
                                                    }`}>
                                                        {pago.concepto?.toLowerCase().includes('locker') ? <CreditCard size={18}/> : <DollarSign size={18}/>}
                                                    </span>
                                                    <span className="font-medium text-neutral-700 text-sm">
                                                        {pago.concepto || 'Pago General'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Columna Fecha */}
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
                                                    <Calendar size={16} className="text-neutral-400"/>
                                                    {new Date(pago.fecha).toLocaleDateString('es-MX', { 
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </div>
                                            </td>

                                            {/* Columna Monto */}
                                            <td className="p-6 text-right">
                                                <span className="font-black text-neutral-900 text-lg tracking-tight">
                                                    ${parseFloat(pago.monto).toLocaleString()}
                                                </span>
                                            </td>

                                            {/* Columna Estado */}
                                            <td className="p-6 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-700 border border-green-200">
                                                    Pagado
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-40">
                                                <div className="bg-neutral-100 p-4 rounded-full mb-3">
                                                    <CreditCard size={32} className="text-neutral-400"/>
                                                </div>
                                                <p className="text-lg font-bold text-neutral-500">No se encontraron pagos</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffPagos;