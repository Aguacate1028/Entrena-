import React, { useState, useContext } from 'react';
import { Mail, Lock, X, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { recoverPasswordRequest } from '../api/auth'; 

const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ESTADOS NUEVOS PARA QUE FUNCIONE EL BOTÓN
  const [showPassword, setShowPassword] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false); // <--- ESTO ES EL INTERRUPTOR

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- LÓGICA DE INICIO DE SESIÓN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/'); 
        onClose();
      } else {
        setError(result.error || 'Credenciales incorrectas.');
      }
    } catch (err) {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE RECUPERACIÓN---
  const handleRecovery = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
        // Llama a tu backend para enviar el correo
        const result = await recoverPasswordRequest(email);
        
        if (result.success) {
            setSuccessMsg(`Correo enviado a ${email}. Revisa tu bandeja de entrada.`);
        } else {
            setError(result.error || "No se pudo enviar el correo.");
        }
    } catch (err) {
        setError("Ocurrió un error al intentar recuperar.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl scale-100 transition-transform">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-neutral-500" />
        </button>

        {/* --- INTERRUPTOR DE VISTAS --- */}
        {!isRecovering ? (
            // ================= VISTA 1: LOGIN NORMAL =================
            <>
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black text-neutral-900 mb-2"> Iniciar Sesión</h2>
                    <p className="text-neutral-500">Ingresa a tu cuenta de <span className="text-purple-600 font-bold">entrena+</span></p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)} 
                                placeholder="ejemplo123@dominio.com"
                                className="w-full pl-10 pr-4 py-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-neutral-50 focus:bg-white"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password} onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••"
                                className="w-full pl-10 pr-12 py-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-neutral-50 focus:bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-purple-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs sm:text-sm">
                        
                        {/* ---  EL BOTÓN QUE CAMBIA EL ESTADO --- */}
                        <button 
                            type="button"
                            onClick={() => setIsRecovering(true)} // <--- ESTO ACTIVA LA VISTA DE RECUPERACIÓN
                            className="text-purple-600 hover:text-purple-800 font-bold transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    {error && <div className="text-sm text-red-600 bg-red-50 py-3 px-4 rounded-xl border border-red-100 text-center">{error}</div>}
                    
                    <button 
                        type="submit" disabled={loading}
                        className="w-full py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-200 active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Entrando...</> : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm border-t border-neutral-100 pt-6">
                    <p className="text-neutral-500">
                        ¿Aún no eres miembro?{' '}
                        <button onClick={onSwitchToRegister} className="text-purple-600 hover:text-purple-800 font-black hover:underline">
                            Regístrate gratis
                        </button>
                    </p>
                </div>
            </>
        ) : (
            // ================= VISTA 2: RECUPERACIÓN DE CONTRASEÑA =================
            <>
                <button 
                    onClick={() => setIsRecovering(false)} // <--- BOTÓN PARA VOLVER AL LOGIN
                    className="mb-6 flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                >
                    <ArrowLeft size={18} /> Volver
                </button>

                <div className="mb-6 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 mb-2">Recuperar acceso</h2>
                    <p className="text-neutral-500 text-sm">
                        Ingresa tu correo y te enviaremos un enlace para recuperar tu cuenta.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleRecovery}>
                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)} 
                                placeholder="ejemplo123@dominio.com"
                                className="w-full pl-10 pr-4 py-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-neutral-50 focus:bg-white"
                            />
                        </div>
                    </div>

                    {successMsg && (
                        <div className="text-sm text-green-700 bg-green-50 py-3 px-4 rounded-xl border border-green-200 text-center">
                            {successMsg}
                        </div>
                    )}
                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 py-3 px-4 rounded-xl border border-red-100 text-center">
                            {error}
                        </div>
                    )}
                    
                    <button 
                        type="submit" disabled={loading}
                        className="w-full py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-200 active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2">
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</> : "Enviar enlace"}
                    </button>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;