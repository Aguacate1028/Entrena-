import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Loader2 } from 'lucide-react';

const ResponseModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const [responseText, setResponseText] = useState('');

    // Limpiar el texto cuando se abre o cierra el modal
    useEffect(() => {
        if (isOpen) {
            setResponseText('');
        }
    }, [isOpen]);

    // Si no está abierto, no renderizamos nada (o null)
    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!responseText.trim()) return; // Evitar enviar respuestas vacías
        onConfirm(responseText);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            {/* Contenedor del Modal */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <MessageSquare size={20} />
                        </div>
                        Responder al Usuario
                    </h3>
                    <button 
                        onClick={onClose} 
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Escribe tu respuesta:
                    </label>
                    <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        disabled={isLoading}
                        placeholder="Hola, hemos revisado tu caso y..."
                        className="w-full min-h-[150px] p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-gray-700 placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-400 mt-2 text-right">
                        Esta respuesta será visible para el usuario en su panel.
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-200/50 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !responseText.trim()}
                        className={`
                            px-6 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all
                            ${isLoading || !responseText.trim() 
                                ? 'bg-blue-300 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Enviar Respuesta
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResponseModal;