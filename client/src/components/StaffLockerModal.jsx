import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Save, Trash2, Search, CheckCircle, DollarSign, CreditCard } from 'lucide-react';
import { asignarLockerRequest, liberarLockerRequest, obtenerTodosSociosRequest } from '../api/usuarios';
import { useToast } from '../context/ToastContext';
import ConfirmModal from './ConfirmModal';

const LockerModal = ({ locker, onClose, onUpdate }) => {
    const { addToast } = useToast();
    
    // CONFIGURACIÓN: Precio mensual del locker
    const PRECIO_MENSUAL = 150; 

    // Estados para ASIGNACIÓN
    const [socios, setSocios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [selectedSocio, setSelectedSocio] = useState(null);
    const [meses, setMeses] = useState(1);
    const [loading, setLoading] = useState(false);

    // Estado para el Modal de Confirmación (Liberar)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (!locker.ocupado) {
            obtenerTodosSociosRequest().then(setSocios);
        }
    }, [locker]);

    const sociosFiltrados = socios.filter(s => 
        s.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // CÁLCULO DEL TOTAL
    const totalPagar = PRECIO_MENSUAL * parseInt(meses);

    // 1. ASIGNAR LOCKER
    const handleAsignar = async () => {
        if (!selectedSocio) return addToast('Selecciona un socio primero', 'error');
        
        setLoading(true);
        try {
            await asignarLockerRequest({
                id_usuario: selectedSocio.id_usuario,
                locker_id: locker.numero,
                meses: meses
            });
            addToast(`Casillero asignado. Cobrar: $${totalPagar}`, 'success');
            onUpdate();
            onClose();
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // 2. BOTÓN "LIBERAR"
    const handleLiberarClick = () => setIsConfirmOpen(true);

    // 3. CONFIRMAR LIBERACIÓN
    const executeLiberar = async () => {
        setLoading(true);
        try {
            await liberarLockerRequest(locker.usuario.id_usuario); 
            addToast('Casillero liberado correctamente', 'success');
            onUpdate();
            onClose();
        } catch (error) {
            addToast('Error al liberar el casillero', 'error');
        } finally {
            setLoading(false);
            setIsConfirmOpen(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden">
                    
                    {/* HEADER */}
                    <div className="p-6 bg-neutral-900 text-white flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Casillero #{locker.numero}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 bg-neutral-50">
                        {locker.ocupado ? (
                            // --- VISTA: LOCKER OCUPADO (Igual que antes) ---
                            <div className="space-y-6">
                                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm text-center">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-600 font-bold text-2xl border-4 border-white shadow-sm">
                                        {locker.usuario.nombre.charAt(0)}
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900">{locker.usuario.nombre}</h3>
                                    <p className="text-neutral-500 text-sm">Socio Activo</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between p-3 bg-white rounded-xl border border-neutral-200">
                                        <span className="text-neutral-500 font-medium">Vencimiento</span>
                                        <span className="font-bold text-red-500">
                                            {new Date(locker.usuario.locker_fin).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-white rounded-xl border border-neutral-200">
                                        <span className="text-neutral-500 font-medium">Estado</span>
                                        <span className="font-bold text-green-600 flex items-center gap-1">
                                            <CheckCircle size={16}/> Ocupado
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleLiberarClick} 
                                    className="w-full py-3 bg-white border-2 border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Trash2 size={20} /> Liberar Casillero
                                </button>
                            </div>
                        ) : (
                            // --- VISTA: ASIGNAR (RENTAR) ---
                            <div className="space-y-4">
                                {/* BUSCADOR DE SOCIO */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Buscar Socio</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 text-neutral-400" size={18} />
                                        <input 
                                            type="text" 
                                            placeholder="Nombre del socio..." 
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                        />
                                    </div>
                                    {/* Lista desplegable */}
                                    {busqueda && (
                                        <div className="mt-2 max-h-40 overflow-y-auto bg-white border border-neutral-200 rounded-xl shadow-lg z-10 relative">
                                            {sociosFiltrados.length > 0 ? sociosFiltrados.map(s => (
                                                <div 
                                                    key={s.id_usuario} 
                                                    onClick={() => { setSelectedSocio(s); setBusqueda(''); }}
                                                    className="p-3 hover:bg-purple-50 cursor-pointer text-sm font-medium border-b border-neutral-50 last:border-0 transition-colors"
                                                >
                                                    {s.nombre}
                                                </div>
                                            )) : (
                                                <div className="p-3 text-sm text-neutral-400 text-center">No se encontraron socios</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Socio Seleccionado */}
                                {selectedSocio && (
                                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex justify-between items-center animate-fade-in-up">
                                        <span className="font-bold text-purple-900 flex items-center gap-2">
                                            <User size={16}/> {selectedSocio.nombre}
                                        </span>
                                        <button onClick={() => setSelectedSocio(null)} className="p-1 hover:bg-purple-100 rounded-full transition-colors">
                                            <X size={16} className="text-purple-400"/>
                                        </button>
                                    </div>
                                )}

                                {/* SELECTOR DE TIEMPO */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Duración Renta</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-neutral-400" size={18}/>
                                        <select 
                                            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-neutral-200 font-bold focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                                            value={meses}
                                            onChange={(e) => setMeses(e.target.value)}
                                        >
                                            <option value="1">1 Mes</option>
                                            <option value="3">3 Meses</option>
                                            <option value="6">6 Meses</option>
                                            <option value="12">1 Año</option>
                                        </select>
                                    </div>
                                </div>

                                {/* --- NUEVA SECCIÓN: RESUMEN DE PAGO --- */}
                                <div className="bg-neutral-100 p-4 rounded-2xl border border-neutral-200 mt-2">
                                    <div className="flex justify-between items-center text-sm text-neutral-500 mb-1">
                                        <span>Costo Mensual</span>
                                        <span>${PRECIO_MENSUAL}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-neutral-500 mb-2 border-b border-neutral-200 pb-2">
                                        <span>Meses seleccionados</span>
                                        <span>x {meses}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-neutral-800 flex items-center gap-2">
                                            <CreditCard size={18} /> Total a Pagar
                                        </span>
                                        <span className="text-2xl font-black text-purple-600">
                                            ${totalPagar}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleAsignar}
                                    disabled={!selectedSocio || loading}
                                    className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-2"
                                >
                                    <DollarSign size={20} /> {loading ? 'Procesando...' : 'Confirmar Renta y Pago'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={executeLiberar}
                title="¿Liberar Casillero?"
                message={`Estás a punto de liberar el casillero #${locker.numero}. Esta acción eliminará la asignación del socio actual.`}
                isLoading={loading}
            />
        </>
    );
};

export default LockerModal;