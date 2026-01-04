import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Al cargar, Supabase detecta el hash en la URL y loguea al usuario temporalmente
    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setMsg({ type: 'info', text: 'Ingresa tu nueva contraseña para recuperar el acceso.' });
            }
        });
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        if (password.length < 6) {
            setMsg({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            setMsg({ type: 'error', text: 'Error al actualizar: ' + error.message });
        } else {
            setMsg({ type: 'success', text: '¡Contraseña actualizada! Redirigiendo...' });
            setTimeout(() => navigate('/'), 3000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900">Nueva Contraseña</h2>
                    <p className="text-neutral-500 text-sm mt-2">Crea una contraseña segura para tu cuenta.</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nueva contraseña"
                            className="w-full pl-10 pr-12 py-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-purple-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {msg.text && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                            msg.type === 'error' ? 'bg-red-50 text-red-700' : 
                            msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                            {msg.type === 'error' ? <AlertTriangle size={18}/> : <CheckCircle size={18}/>}
                            {msg.text}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold shadow-lg shadow-purple-200 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Actualizando...' : 'Confirmar cambio'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;