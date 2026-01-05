import React, { useState, useContext } from 'react';
import { X, Lock, CreditCard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { rentarLockerRequest } from '../api/lockers'; 

const LockerModal = ({ onClose, onSuccess }) => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [meses, setMeses] = useState(1);
    const [loading, setLoading] = useState(false);

    const precioPorMes = 150; // Precio base
    const total = precioPorMes * meses;

    const handlePago = async () => {
        setLoading(true);
        try {
            // Usamos la función de la API
            await rentarLockerRequest(user.id_usuario || user.id, meses);
            
            addToast('¡Locker rentado exitosamente!', 'success');
            if (onSuccess) onSuccess(); // Recargar datos del usuario
            onClose();
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative animate-scale-up">
                
                {/* Header */}
                <div className="bg-neutral-900 p-6 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <X size={20} />
                    </button>
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock size={32} className="text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Rentar Locker</h2>
                    <p className="text-neutral-400 text-sm">Guarda tus cosas con seguridad</p>
                </div>

                {/* Body */}
                <div className="p-8">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Duración de la renta:</label>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[1, 3, 6].map((m) => (
                            <button 
                                key={m}
                                onClick={() => setMeses(m)}
                                className={`py-3 rounded-xl border-2 font-bold transition-all ${meses === m ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500 hover:border-purple-200'}`}
                            >
                                {m} Mes{m > 1 ? 'es' : ''}
                            </button>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-6 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Total a Pagar</p>
                            <p className="text-2xl font-black text-neutral-900">${total}</p>
                        </div>
                        <CreditCard className="text-gray-400" />
                    </div>

                    <button 
                        onClick={handlePago}
                        disabled={loading}
                        className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                    >
                        {loading ? 'Procesando...' : `Pagar $${total}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LockerModal;