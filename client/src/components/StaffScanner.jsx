import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { CheckCircle, XCircle, Loader, RefreshCw, Keyboard, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { registrarAsistenciaRequest } from '../api/asistencias';

const StaffScanner = () => {
    const { addToast } = useToast();
    
    // Estados de lógica
    const [scanResult, setScanResult] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [message, setMessage] = useState('');

    // Estados para Entrada Manual
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualId, setManualId] = useState('');

    // --- MANEJO DE QR ---
    const handleScan = async (result, error) => {
        if (!!result && status === 'idle') {
            const userId = result?.text;
            if (!userId) return;
            procesarAsistencia(userId);
        }
    };

    // --- MANEJO MANUAL ---
    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!manualId.trim()) return;
        procesarAsistencia(manualId);
    };

    // --- LÓGICA COMÚN ---
    const procesarAsistencia = async (idUsuario) => {
        setStatus('processing');
        try {
            const data = await registrarAsistenciaRequest(idUsuario);

            setStatus('success');
            setScanResult({
                nombre: data.usuario.nombre,
                membresia_tipo: data.usuario.membresia_tipo,
                foto: data.usuario.foto_perfil
            });
            setMessage("Acceso Permitido");
            addToast(`Bienvenido ${data.usuario.nombre}`, 'success');
            
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Acceso Denegado');
            addToast(error.message, 'error');
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setStatus('idle');
        setMessage('');
        setManualId('');
        setShowManualInput(false); // Opcional: ocultar el input de nuevo al reiniciar
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
            <h1 className="text-white text-2xl font-bold mb-6">Control de Acceso</h1>

            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                
                {/* 1. ESTADO: ESPERANDO (Escáner + Opción Manual) */}
                {status === 'idle' && (
                    <div className="flex flex-col">
                        {/* A) CÁMARA */}
                        <div className="relative h-80 bg-black overflow-hidden">
                            <QrReader
                                onResult={handleScan}
                                constraints={{ facingMode: 'environment' }}
                                className="w-full h-full object-cover"
                                scanDelay={500}
                                videoContainerStyle={{ padding: 0, height: '100%', width: '100%' }}
                                videoStyle={{ height: '100%', width: '100%', objectFit: 'cover' }}
                            />
                            {/* Guía visual */}
                            <div className="absolute inset-0 border-[40px] border-neutral-900/60 flex items-center justify-center pointer-events-none">
                                <div className="w-56 h-56 border-4 border-purple-500 rounded-2xl opacity-60 animate-pulse relative">
                                    <div className="absolute top-0 left-0 w-3 h-3 bg-purple-400"></div>
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-purple-400"></div>
                                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-purple-400"></div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-purple-400"></div>
                                </div>
                            </div>
                        </div>

                        {/* B) SECCIÓN MANUAL (Toggle) */}
                        <div className="bg-neutral-50 border-t border-neutral-200 transition-all duration-300">
                            {/* Botón para mostrar/ocultar */}
                            <button 
                                onClick={() => setShowManualInput(!showManualInput)}
                                className="w-full p-4 flex items-center justify-between text-neutral-500 hover:text-purple-600 hover:bg-purple-50 transition-colors font-medium text-sm"
                            >
                                <span className="flex items-center gap-2">
                                    <Keyboard size={18} /> Entrada Manual (ID)
                                </span>
                                {showManualInput ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                            </button>

                            {/* Formulario Desplegable */}
                            {showManualInput && (
                                <div className="px-4 pb-6 animate-fade-in-down">
                                    <form onSubmit={handleManualSubmit} className="flex gap-2">
                                        <input 
                                            autoFocus
                                            type="number" // number para mostrar teclado numérico en móviles
                                            placeholder="Ingresa ID del socio..."
                                            className="flex-1 p-3 bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-neutral-900 font-bold"
                                            value={manualId}
                                            onChange={(e) => setManualId(e.target.value)}
                                        />
                                        <button 
                                            type="submit" 
                                            className="bg-neutral-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-colors"
                                        >
                                            Entrar
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. ESTADO: PROCESANDO */}
                {status === 'processing' && (
                    <div className="h-96 flex flex-col items-center justify-center space-y-4 p-8">
                        <Loader className="animate-spin text-purple-600" size={64} />
                        <p className="text-neutral-500 font-medium animate-pulse">Verificando en Base de Datos...</p>
                    </div>
                )}

                {/* 3. ESTADO: RESULTADO */}
                {(status === 'success' || status === 'error') && (
                    <div className={`h-96 flex flex-col items-center justify-center p-8 text-center animate-scale-up
                        ${status === 'success' ? 'bg-green-50' : 'bg-red-50'}`
                    }>
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg
                            ${status === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`
                        }>
                            {status === 'success' ? <CheckCircle size={48} /> : <XCircle size={48} />}
                        </div>
                        
                        <h2 className={`text-2xl font-black mb-2 ${status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                            {message}
                        </h2>

                        {scanResult && status === 'success' && (
                            <div className="bg-white p-4 rounded-xl shadow-sm w-full mb-6 border border-green-100 flex items-center gap-4 text-left">
                                {scanResult.foto ? (
                                    <img src={scanResult.foto} alt="Perfil" className="w-14 h-14 rounded-full object-cover bg-neutral-200 border-2 border-white shadow-sm" />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl border-2 border-white shadow-sm">
                                        {scanResult.nombre.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="text-lg font-bold text-neutral-800 leading-tight">{scanResult.nombre}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-md">
                                        {scanResult.membresia_tipo}
                                    </span>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={resetScanner}
                            className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
                        >
                            <RefreshCw size={20} /> Siguiente Acceso
                        </button>
                    </div>
                )}
            </div>
            
            <p className="text-neutral-500 text-xs mt-8 opacity-50 font-medium">Entrena+ Staff System</p>
        </div>
    );
};

export default StaffScanner;