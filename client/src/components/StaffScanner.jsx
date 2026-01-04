import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { registrarAsistenciaRequest } from '../api/asistencias'; // <--- IMPORTACIÓN NUEVA

const StaffScanner = () => {
    const { addToast } = useToast();
    
    const [scanResult, setScanResult] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [message, setMessage] = useState('');

    const handleScan = async (result, error) => {
        if (!!result && status === 'idle') {
            const userId = result?.text;
            if (!userId) return;

            procesarAsistencia(userId);
        }
        // Ignoramos errores de lectura continua de la cámara
    };

    const procesarAsistencia = async (idUsuario) => {
        setStatus('processing');
        try {
            // La API debe realizar un INSERT en public.asistencias
            // Campos: id_usuario, fecha_hora (default now), metodo: 'QR', estado: 'Acceso Permitido'
            const data = await registrarAsistenciaRequest(idUsuario);

            // Al recibir éxito, mostramos los datos reales del socio desde la tabla public.usuarios
            setStatus('success');
            setScanResult({
                nombre: data.usuario.nombre,
                membresia_tipo: data.usuario.membresia_tipo // Mapeado a la columna 'membresia_tipo'
            });
            setMessage("Acceso Permitido");
            addToast('Asistencia registrada correctamente', 'success');
            
        } catch (error) {
            setStatus('error');
            // El error puede venir de la validación de 'estado_suscripcion' o 'membresia_fin' en la DB
            setMessage(error.message || 'Error al validar membresía');
            addToast(error.message, 'error');
        }
    };
    const resetScanner = () => {
        setScanResult(null);
        setStatus('idle');
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
            <h1 className="text-white text-2xl font-bold mb-6">Control de Acceso</h1>

            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                
                {/* PANTALLA DE CÁMARA */}
                {status === 'idle' && (
                    <div className="relative">
                        <QrReader
                            onResult={handleScan}
                            constraints={{ facingMode: 'environment' }}
                            className="w-full h-full object-cover"
                            scanDelay={500}
                        />
                        <div className="absolute inset-0 border-[40px] border-neutral-900/50 flex items-center justify-center">
                            <div className="w-64 h-64 border-4 border-purple-500 rounded-2xl opacity-50 animate-pulse"></div>
                        </div>
                        <p className="absolute bottom-4 left-0 right-0 text-center text-white font-bold text-shadow">
                            Escanea el QR del socio
                        </p>
                    </div>
                )}

                {/* PANTALLA DE CARGA */}
                {status === 'processing' && (
                    <div className="h-96 flex flex-col items-center justify-center space-y-4">
                        <Loader className="animate-spin text-purple-600" size={64} />
                        <p className="text-neutral-500 font-medium">Verificando membresía...</p>
                    </div>
                )}

                {/* PANTALLA DE RESULTADO */}
                {(status === 'success' || status === 'error') && (
                    <div className={`h-96 flex flex-col items-center justify-center p-8 text-center animate-fade-in
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

                        {scanResult && (
                            <div className="bg-white p-4 rounded-xl shadow-sm w-full mb-6">
                                <p className="text-neutral-500 text-sm">Socio</p>
                                <p className="text-xl font-bold text-neutral-800">{scanResult.nombre}</p>
                                <p className="text-xs text-neutral-400 mt-1">{scanResult.membresia_tipo}</p>
                            </div>
                        )}

                        <button 
                            onClick={resetScanner}
                            className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                        >
                            <RefreshCw size={20} /> Escanear Siguiente
                        </button>
                    </div>
                )}
            </div>
            
            <p className="text-neutral-500 text-sm mt-8">Sistema de Gestión Entrena+</p>
        </div>
    );
};

export default StaffScanner;