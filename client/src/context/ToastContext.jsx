import React, { createContext, useState, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        // Auto-cerrar después de 3 segundos
        setTimeout(() => removeToast(id), 3000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Contenedor de Toasts (Fijo en la esquina) */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div 
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-fade-in-up min-w-[300px]
                            ${toast.type === 'success' ? 'bg-white border-green-500 text-green-700' : ''}
                            ${toast.type === 'error' ? 'bg-white border-red-500 text-red-700' : ''}
                            ${toast.type === 'info' ? 'bg-white border-blue-500 text-blue-700' : ''}
                        `}
                    >
                        {toast.type === 'success' && <CheckCircle size={20} className="text-green-500" />}
                        {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
                        {toast.type === 'info' && <Info size={20} className="text-blue-500" />}
                        
                        <p className="font-medium text-sm flex-grow">{toast.message}</p>
                        
                        <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};