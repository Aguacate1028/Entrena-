import React, { useEffect, useState, useContext } from 'react';
import { Check, Crown, CreditCard, AlertTriangle, XCircle, PauseCircle, Lock, Key } from 'lucide-react'; // <--- Agregué iconos Lock y Key
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoginModal from '../components/LoginModal'; 
import ConfirmModal from '../components/ConfirmModal'; 
import LockerModal from '../components/LockerModal'; 

// API
import { obtenerPerfilRequest } from '../api/usuarios'; 
import { cancelarLockerRequest } from '../api/lockers'; 
import { 
    obtenerMembresiasRequest, 
    procesarPagoRequest, 
    gestionarSuscripcionRequest 
} from '../api/membresias';

const Membresias = () => {
    // 1. CONTEXTOS
    const { user, isAuthenticated } = useContext(AuthContext);
    const { addToast } = useToast();

    // 2. ESTADOS
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [datosUsuario, setDatosUsuario] = useState(null);

    // Estados de Modales
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showLockerModal, setShowLockerModal] = useState(false); 
    
    // Estado para ConfirmModal
    const [confirmData, setConfirmData] = useState({ isOpen: false, action: null, title: '', message: '' });

    // Estado de selección
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [processing, setProcessing] = useState(false);

    // 3. CARGA INICIAL
    useEffect(() => {
        const iniciarDatos = async () => {
            const planesData = await obtenerMembresiasRequest();
            setPlanes(planesData || []);
            
            if (isAuthenticated && user) {
                await recargarUsuario();
            }
            setLoading(false);
        };
        iniciarDatos();
    }, [isAuthenticated, user]);

    const recargarUsuario = async () => {
        if (!user) return;
        const id = user.id_usuario || user.id;
        const data = await obtenerPerfilRequest(id);
        setDatosUsuario(data); 
    };

    // 4. MANEJADORES

    const handleSelectPlan = (plan) => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }
        
        if (datosUsuario?.membresia_tipo === plan.nombre && datosUsuario?.estado_suscripcion === 'activa') {
            addToast('Ya disfrutas de este plan', 'info');
            return;
        }

        setSelectedPlan(plan);
        setShowPaymentModal(true);
    };

    const handlePayment = async () => {
        if (!datosUsuario || !selectedPlan) return;
        setProcessing(true);
        try {
            // Esta función debe enviar los datos al endpoint /procesar corregido anteriormente
            await procesarPagoRequest({
                id_usuario: datosUsuario.id_usuario,
                id_plan: selectedPlan.id
            });

            addToast(`¡Bienvenido al plan ${selectedPlan.nombre}! El pago ha sido registrado.`, 'success');
            setShowPaymentModal(false);
            await recargarUsuario(); // Refresca los datos locales del usuario
        } catch (error) {
            addToast(error.message || 'Error al procesar pago', 'error');
        } finally {
            setProcessing(false);
        }
    };

    // Preparar el modal de confirmación 
    const solicitarGestion = (accion) => {
        let config = {};

        // Configuración según la acción
        if (accion === 'cancelar') {
            config = { title: '¿Cancelar suscripción?', msg: 'Perderás tus beneficios Premium al final del periodo.' };
        } else if (accion === 'pausar') {
            config = { title: '¿Pausar suscripción?', msg: 'Tu cuenta se congelará temporalmente. No se te cobrará.' };
        } else if (accion === 'cancelar_locker') { 
            config = { title: '¿Liberar Locker?', msg: 'Dejarás de tener acceso a tu casillero asignado inmediatamente.' };
        }

        setConfirmData({
            isOpen: true,
            action: accion,
            title: config.title,
            message: config.msg
        });
    };

    // Ejecutar la acción confirmada
    const confirmarGestion = async () => {
        if (!confirmData.action) return;
        setProcessing(true);
        try {
            // A) GESTIÓN DE LOCKER
            if (confirmData.action === 'cancelar_locker') {
                await cancelarLockerRequest(datosUsuario.id_usuario);
                addToast('Locker liberado correctamente', 'success');
            } 
            // B) GESTIÓN DE MEMBRESÍA
            else {
                await gestionarSuscripcionRequest({ 
                    id_usuario: datosUsuario.id_usuario, 
                    accion: confirmData.action 
                });
                addToast(`Suscripción ${confirmData.action === 'cancelar' ? 'cancelada' : 'pausada'} correctamente`, 'success');
            }
            
            await recargarUsuario();
            setConfirmData({ ...confirmData, isOpen: false }); 

        } catch (error) {
            addToast(error.message || 'Error al gestionar', 'error');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className="py-24 bg-white min-h-screen" id="membresias">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Membresías y <span className="text-purple-600  px-2 rounded-lg">Precios</span></h1>
                    <p className="text-neutral-500 mt-4 max-w-xl mx-auto">Sin contratos forzosos. Cancela cuando quieras.</p>
                </div>

                {/* ==============================================
                    PANEL DE MEMBRESÍA ACTUAL
                   ============================================== */}
                    {datosUsuario?.membresia_tipo && 
                    datosUsuario.membresia_tipo !== 'Sin Membresía' && 
                    datosUsuario.estado_suscripcion !== 'cancelada' && (
                    <div className="mb-8 bg-purple-50 border border-purple-100 p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in shadow-sm">
                        <div>
                            <h4 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                                <Crown size={20} className="text-purple-600"/> Tu Plan Actual: {datosUsuario.membresia_tipo}
                            </h4>
                            <p className="text-purple-700/70 text-sm mt-1">
                                Estado: <span className={`font-bold uppercase ${datosUsuario.estado_suscripcion === 'activa' ? 'text-green-600' : 'text-orange-500'}`}>{datosUsuario.estado_suscripcion}</span>
                                {datosUsuario.membresia_fin && ` • Vence: ${new Date(datosUsuario.membresia_fin).toLocaleDateString()}`}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {datosUsuario.estado_suscripcion === 'activa' && (
                                <button onClick={() => solicitarGestion('pausar')} className="px-5 py-2.5 bg-white border border-purple-200 text-purple-700 rounded-xl font-bold text-sm hover:bg-purple-100 transition-colors flex items-center gap-2">
                                    <PauseCircle size={16}/> Pausar
                                </button>
                            )}
                            <button onClick={() => solicitarGestion('cancelar')} className="px-5 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center gap-2">
                                <XCircle size={16}/> Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* ==============================================
                    PANEL DE LOCKER 
                   ============================================== */}
                {datosUsuario && (
                    datosUsuario.locker_activo ? (
                        // A) TIENE LOCKER: MOSTRAR DETALLES Y BOTÓN CANCELAR
                        <div className="mb-16 bg-neutral-900 text-white p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-neutral-900/20 animate-fade-in relative overflow-hidden">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Key size={28} className="text-yellow-400"/>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                        Locker #{datosUsuario.locker_id}
                                    </h4>
                                    <p className="text-neutral-400 text-sm mt-1">
                                        Vence el: <span className="text-white font-bold">{new Date(datosUsuario.locker_fin).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <button 
                                    onClick={() => solicitarGestion('cancelar_locker')} 
                                    className="px-6 py-3 bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    <XCircle size={18}/> Liberar Locker
                                </button>
                            </div>
                            {/* Decoración fondo */}
                            <Lock className="absolute -right-6 -bottom-6 text-white/5 rotate-12" size={150} />
                        </div>
                    ) : (
                        // B) NO TIENE LOCKER: MOSTRAR BANNER DE RENTA
                        <div className="mb-16 bg-gradient-to-br from-neutral-500 to-purple-300 p-6 border-2 border-neutral-200 p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4 hover:border-purple-300 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                    <Lock size={26} className="text-gray-400 group-hover:text-purple-600"/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900">¿Necesitas guardar tus cosas?</h4>
                                    <p className="text-sm text-neutral-700">Renta un locker personal desde $150/mes.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    if (!isAuthenticated) setShowLoginModal(true);
                                    else setShowLockerModal(true);
                                }} 
                                className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold text-sm hover:bg-purple-600 transition-all shadow-lg"
                            >
                                Rentar Locker
                            </button>
                        </div>
                    )
                )}

                {/* --- GRID DE PLANES --- */}
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {[1, 2, 3].map((i) => <div key={i} className="h-[500px] bg-neutral-50 rounded-[40px] border border-neutral-200 animate-pulse p-10"></div>)}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {planes.map((plan) => {
                            const esPlanActual = datosUsuario?.membresia_tipo === plan.nombre && datosUsuario?.estado_suscripcion !== 'cancelada';

                            return (
                                <div key={plan.id} className={`relative p-10 rounded-[40px] border transition-all duration-500 group ${plan.popular ? 'bg-neutral-900 text-white shadow-2xl shadow-purple-500/20 scale-105 border-purple-500 z-10' : 'bg-white text-neutral-900 border-neutral-100 hover:border-purple-200 hover:shadow-xl'}`}>
                                    {plan.popular && (
                                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                            <Crown size={14} fill="currentColor" /> Más Popular
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold mb-2">{plan.nombre}</h3>
                                    <div className="flex items-baseline gap-1 mb-8"><span className="text-5xl font-extrabold">${plan.precio}</span><span className="text-sm font-medium opacity-60">/mes</span></div>
                                    <div className={`h-px w-full mb-8 ${plan.popular ? 'bg-white/10' : 'bg-neutral-100'}`}></div>

                                    <ul className="space-y-4 mb-10">
                                        {plan.caracteristicas && plan.caracteristicas.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm font-medium leading-relaxed">
                                                <div className={`mt-0.5 p-0.5 rounded-full ${plan.popular ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600'}`}><Check size={12} strokeWidth={4} /></div>
                                                <span className={plan.popular ? 'text-neutral-300' : 'text-neutral-600'}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button 
                                        onClick={() => handleSelectPlan(plan)}
                                        disabled={esPlanActual}
                                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 transform active:scale-95
                                            ${esPlanActual 
                                                ? 'bg-green-500 text-white cursor-default hover:bg-green-500' 
                                                : plan.popular ? 'bg-purple-500 text-white hover:bg-purple-400 shadow-lg' : 'bg-neutral-50 text-neutral-900 hover:bg-neutral-100 border border-neutral-200'
                                            }`}
                                    >
                                        {esPlanActual ? 'Plan Actual' : `Seleccionar ${plan.nombre}`}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

            {/* Modal de Pago Membresía */}
            {showPaymentModal && selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-scale-up">
                        <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
                        <div className="text-center mb-8"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><CreditCard size={32}/></div><h3 className="text-2xl font-bold text-neutral-900">Finalizar Compra</h3><p className="text-neutral-500 mt-2">Plan: <span className="font-bold text-purple-600">{selectedPlan.nombre}</span></p></div>
                        <div className="space-y-4 mb-8"><div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center"><span className="text-sm font-bold text-neutral-600">Total:</span><span className="text-xl font-black text-neutral-900">${selectedPlan.precio}</span></div><div className="p-4 border border-neutral-200 rounded-xl bg-gray-50"><p className="text-xs text-neutral-400 mb-2 font-bold uppercase">Tarjeta de prueba</p><p className="text-neutral-800 font-mono tracking-wider">•••• 4242</p></div></div>
                        <button onClick={handlePayment} disabled={processing} className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-2">{processing ? 'Procesando...' : `Pagar Ahora`}</button>
                        <p className="text-center text-xs text-neutral-400 mt-4 flex items-center justify-center gap-1"><AlertTriangle size={12}/> Pagos seguros</p>
                    </div>
                </div>
            )}

            {/* MODAL DE RENTA DE LOCKER (NUEVO) */}
            {showLockerModal && (
                <LockerModal 
                    onClose={() => setShowLockerModal(false)} 
                    onSuccess={recargarUsuario} // Para actualizar la UI tras pagar
                />
            )}

            {/* Modal de Confirmación (Gestión Membresía + Locker) */}
            <ConfirmModal 
                isOpen={confirmData.isOpen}
                onClose={() => setConfirmData({ ...confirmData, isOpen: false })}
                onConfirm={confirmarGestion}
                title={confirmData.title}
                message={confirmData.message}
                isLoading={processing}
            />
        </section>
    );
};

export default Membresias;