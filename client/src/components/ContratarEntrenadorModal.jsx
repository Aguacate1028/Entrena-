import React, { useState, useContext } from 'react';
import { X, Check, Star, User, Zap, Shield, CreditCard, MessageCircle, ArrowLeft, Loader } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { contratarEntrenadorRequest } from '../api/entrenadores';

const ContratarEntrenadorModal = ({ onClose }) => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    
    const [step, setStep] = useState('seleccion'); // 'seleccion' | 'pago' | 'exito'
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [entrenador, setEntrenador] = useState(null);

    // 1. Elegir Plan
    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setStep('pago');
    };

    // 2. Procesar Pago
    const handlePayment = async () => {
        setLoading(true);
        try {
            const data = await contratarEntrenadorRequest(user.id_usuario || user.id, selectedPlan.name);
            setEntrenador(data.entrenador); // Aquí guardamos al entrenador que asignó el backend
            addToast('¡Pago exitoso! Entrenador asignado.', 'success');
            setStep('exito');
        } catch (error) {
            addToast('Error en el pago', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 3. Abrir WhatsApp
    const handleMessage = () => {
        if (!entrenador) return;
        const msg = `Hola ${entrenador.nombre}, acabo de contratar el plan ${selectedPlan.name} en Entrena+. Me gustaría comenzar mi evaluación.`;
        const url = `https://wa.me/${entrenador.telefono}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-scale-up border border-neutral-100">
                
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        {step === 'pago' && (
                            <button onClick={() => setStep('seleccion')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            {step !== 'exito' && (
                                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                    <Star size={12} fill="currentColor" /> Servicio Premium
                                </div>
                            )}
                            <h2 className="text-2xl font-black text-neutral-900 leading-tight">
                                {step === 'seleccion' && 'Entrenamiento Personalizado'}
                                {step === 'pago' && 'Finalizar Contratación'}
                                {step === 'exito' && '¡Todo listo!'}
                            </h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                    
                    {/* --- VISTA 1: SELECCIÓN DE PLAN --- */}
                    {step === 'seleccion' && (
                        <>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <BenefitCard icon={User} title="100% Personalizado" desc="Rutinas diseñadas para ti." />
                                <BenefitCard icon={Shield} title="Corrección Técnica" desc="Evita lesiones." />
                                <BenefitCard icon={Zap} title="Motivación" desc="Seguimiento diario." />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Plan Mensual */}
                                <div className="border border-gray-200 rounded-3xl p-6 hover:border-purple-200 transition-colors cursor-pointer group" onClick={() => handleSelectPlan({ name: 'Mensual', price: 500 })}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-lg font-bold text-neutral-900">Plan Mensual</h4>
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-purple-500"></div>
                                    </div>
                                    <div className="mb-6"><span className="text-4xl font-black text-neutral-900">$500</span><span className="text-neutral-400">/mes</span></div>
                                    <ul className="space-y-3"><Feature text="Rutina mensual" /><Feature text="Chat 24h" /></ul>
                                </div>

                                {/* Plan Trimestral */}
                                <div className="bg-neutral-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl cursor-pointer group transform hover:scale-[1.02] transition-all" onClick={() => handleSelectPlan({ name: 'Trimestral', price: 1200 })}>
                                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Recomendado</div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-lg font-bold">Plan Transformación</h4>
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-500 group-hover:border-white"></div>
                                    </div>
                                    <div className="mb-6"><span className="text-4xl font-black">$1,200</span><span className="text-neutral-400">/trimestre</span></div>
                                    <ul className="space-y-3"><Feature text="Plan nutricional" light /><Feature text="Videollamada mensual" light /></ul>
                                </div>
                            </div>
                        </>
                    )}

                    {/* --- VISTA 2: PAGO --- */}
                    {step === 'pago' && selectedPlan && (
                        <div className="max-w-md mx-auto">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500 font-medium">Plan seleccionado</span>
                                    <span className="font-bold text-neutral-900">{selectedPlan.name}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="text-lg font-bold text-neutral-900">Total a pagar</span>
                                    <span className="text-2xl font-black text-purple-600">${selectedPlan.price}</span>
                                </div>
                            </div>

                            {/* Formulario Simulado */}
                            <div className="space-y-4 mb-8">
                                <div className="p-4 border border-neutral-200 rounded-xl flex items-center gap-4 bg-white">
                                    <CreditCard className="text-gray-400"/>
                                    <div className="flex-grow">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Número de Tarjeta</p>
                                        <p className="text-neutral-900 font-mono">•••• •••• •••• 4242</p>
                                    </div>
                                    <Check className="text-green-500" size={20}/>
                                </div>
                            </div>

                            <button onClick={handlePayment} disabled={loading} className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                                {loading ? <Loader className="animate-spin" /> : `Pagar $${selectedPlan.price}`}
                            </button>
                        </div>
                    )}

                    {/* --- VISTA 3: ÉXITO (CONTACTO) --- */}
                    {step === 'exito' && entrenador && (
                        <div className="text-center animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={40} className="text-green-600" strokeWidth={3} />
                            </div>
                            <h3 className="text-2xl font-black text-neutral-900 mb-2">¡Asignación Exitosa!</h3>
                            <p className="text-neutral-500 mb-8">Tu entrenador personal está listo para comenzar.</p>

                            {/* Tarjeta del Entrenador */}
                            <div className="bg-white border border-gray-200 rounded-3xl p-6 max-w-md mx-auto shadow-xl shadow-purple-500/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-2xl font-bold text-neutral-400">
                                        {entrenador.nombre.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-xl font-bold text-neutral-900">{entrenador.nombre}</h4>
                                        <p className="text-sm text-purple-600 font-bold">{entrenador.especialidad}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Experiencia</p>
                                        <p className="font-semibold text-neutral-800">{entrenador.experiencia}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Edad</p>
                                        <p className="font-semibold text-neutral-800">{entrenador.edad} años</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleMessage}
                                    className="w-full py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                                >
                                    <MessageCircle size={20} /> Enviar Mensaje por WhatsApp
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// Componentes auxiliares
const BenefitCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-gray-50 p-4 rounded-2xl">
        <Icon size={24} className="text-purple-600 mb-2"/>
        <h4 className="font-bold text-neutral-900 text-sm mb-1">{title}</h4>
        <p className="text-xs text-neutral-500 leading-tight">{desc}</p>
    </div>
);
const Feature = ({ text, light }) => (
    <li className={`flex gap-2 text-xs ${light ? 'text-neutral-300' : 'text-neutral-600'}`}>
        <Check size={14} className={light ? 'text-purple-300' : 'text-green-600'} /> {text}
    </li>
);

export default ContratarEntrenadorModal;