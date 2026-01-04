import React, { useState } from 'react';
import { Lock, Unlock, UserPlus, Trash2 } from 'lucide-react';

const StaffLockers = () => {
    // Ejemplo de estado inicial de lockers
    const [lockers, setLockers] = useState(
        Array.from({ length: 20 }, (_, i) => ({
            numero: i + 1,
            ocupado: Math.random() > 0.5,
            socio: Math.random() > 0.5 ? 'Juan Pérez' : null
        }))
    );

    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-black text-neutral-900 mb-8">Control de Casilleros</h1>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {lockers.map(locker => (
                        <div key={locker.numero} 
                            className={`p-4 rounded-[24px] border-2 ${
                                locker.ocupado ? 'bg-white border-neutral-200' : 'bg-green-50 border-green-200'
                            }`}>
                            <span className="text-lg font-black">#{locker.numero}</span>
                            {locker.ocupado ? (
                                <div className="text-center">
                                    <p className="text-[10px] font-bold">{locker.socio_nombre}</p>
                                    {/* Mostramos fecha de vencimiento del locker */}
                                    <p className="text-[8px] text-red-400">Vence: {new Date(locker.locker_fin).toLocaleDateString()}</p>
                                </div>
                            ) : (
                                <button className="text-[10px] text-green-600 font-black uppercase">Asignar</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StaffLockers;