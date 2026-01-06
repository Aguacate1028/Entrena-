import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { obtenerLockersRequest } from '../api/usuarios';
import LockerModal from './StaffLockerModal'; 

const StaffLockers = () => {
    // Generamos 20 casilleros estáticos (o 60, según tu gym)
    const TOTAL_LOCKERS = 20;
    const [lockersData, setLockersData] = useState([]); 
    const [selectedLocker, setSelectedLocker] = useState(null); 
    const [loading, setLoading] = useState(true);

    const fetchLockers = async () => {
        setLoading(true);
        try {
            const data = await obtenerLockersRequest();
            setLockersData(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLockers();
    }, []);

    // Combinar grilla con datos de BD
    const getLockerStatus = (numero) => {
        const ocupante = lockersData.find(u => u.locker_id === numero && u.locker_activo === true);
        
        return {
            numero,
            ocupado: !!ocupante,
            usuario: ocupante || null 
        };
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900">Control de Casilleros</h1>
                        <p className="text-neutral-500">Gestión de ocupación y rentas</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-neutral-200 text-xs font-bold shadow-sm">
                            <div className="w-3 h-3 bg-white border-2 border-neutral-300 rounded-full"></div> Disponible
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-neutral-200 text-xs font-bold shadow-sm">
                            <div className="w-3 h-3 bg-neutral-800 rounded-full"></div> Ocupado
                        </div>
                    </div>
                </header>
                
                {loading ? (
                    <p className="text-center py-10">Cargando estado de casilleros...</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {Array.from({ length: TOTAL_LOCKERS }, (_, i) => {
                            const locker = getLockerStatus(i + 1);
                            return (
                                <button 
                                    key={locker.numero} 
                                    onClick={() => setSelectedLocker(locker)}
                                    className={`relative p-4 rounded-[20px] border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center aspect-square group
                                        ${locker.ocupado 
                                            ? 'bg-neutral-900 border-neutral-900 text-white' 
                                            : 'bg-white border-neutral-200 text-neutral-400 hover:border-purple-400 hover:text-purple-600'
                                        }`}
                                >
                                    <div className="mb-1">
                                        {locker.ocupado ? <Lock size={20} /> : <Unlock size={20} />}
                                    </div>
                                    
                                    <span className="text-xl font-black tracking-tighter">#{locker.numero}</span>

                                    {/* Muestra nombre y fecha en la tarjeta */}
                                    {locker.ocupado && locker.usuario && (
                                        <div className="mt-2 text-center w-full overflow-hidden">
                                            <p className="text-[10px] font-bold truncate px-1">
                                                {locker.usuario.nombre.split(' ')[0]}
                                            </p>
                                            <p className="text-[8px] opacity-70 mt-0.5">
                                                Vence: {new Date(locker.usuario.locker_fin).toLocaleDateString(undefined, {month:'numeric', day:'numeric'})}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Hover Effect */}
                                    {locker.ocupado && (
                                        <div className="absolute inset-0 bg-purple-600 rounded-[18px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center pointer-events-none">
                                            <span className="text-[10px] font-bold uppercase leading-tight text-white">
                                                Ver Detalles
                                            </span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {selectedLocker && (
                    <LockerModal 
                        locker={selectedLocker} 
                        onClose={() => setSelectedLocker(null)} 
                        onUpdate={fetchLockers} 
                    />
                )}

            </div>
        </div>
    );
};

export default StaffLockers;