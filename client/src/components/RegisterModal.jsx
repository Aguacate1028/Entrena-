import React, { useState } from 'react';
import { Mail, Lock, X, User, Calendar, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterModal = ({ onClose, onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState('socio');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) return setError('Las contraseñas no coinciden');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
    if (!birthDate) return setError('Selecciona tu fecha de nacimiento');

    setLoading(true);
    // Llamada al backend
    const res = await onRegister({ nombre: name, email, password, fecha_nacimiento: birthDate, rol: role });
    setLoading(false);

    if (res && res.success) {
        navigate('/'); 
        onClose(); 
    } else {
        setError(res?.error || "Error al registrarse");
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 bg-neutral-50 focus:bg-white transition-all";
  const labelClass = "block text-sm font-bold text-neutral-700 mb-2";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl scale-100 transition-transform">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-neutral-500" />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-neutral-900 mb-2">Crear cuenta</h2>
          <p className="text-neutral-500">
            Únete a la comunidad de <span className="text-purple-600 font-bold">entrena+</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Columna Izquierda */}
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Juan Pérez" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo123@dominio.com" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-purple-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Fecha de nacimiento</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={`${inputClass} text-neutral-600`} />
                </div>
              </div>
               <div>
                <label className={labelClass}>Tipo de cuenta</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  
                  <select 
                    value={role} 
                    disabled={true}
                    className={`${inputClass} appearance-none bg-neutral-200 cursor-not-allowed text-neutral-500`} /* Estilos para que se vea gris */
                  >
                    <option value="socio">Cliente</option>  
                  </select>
                  
                </div>
               </div>

              <div>
                <label className={labelClass}>Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input type={showConfirm ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-purple-600">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium text-center">{error}</div>}

          <button type="submit" disabled={loading} className="w-full py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-200 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creando cuenta...</> : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center pt-6 border-t border-neutral-100">
          <p className="text-neutral-600 text-sm">
            ¿Ya tienes cuenta? <button onClick={onSwitchToLogin} className="text-purple-600 hover:text-purple-800 font-black hover:underline">Inicia sesión</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;