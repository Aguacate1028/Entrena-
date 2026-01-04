import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-red-600" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-neutral-900 mb-2">{title}</h3>
                    <p className="text-neutral-500 mb-6">{message}</p>
                    
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-3 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                        >
                            {isLoading ? 'Procesando...' : 'Sí, confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;