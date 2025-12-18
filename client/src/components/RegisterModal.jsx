import React, { useState } from 'react';
import { Mail, Lock, X, User, Calendar, ShieldCheck } from 'lucide-react';

const RegisterModal = ({ onClose, onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState('socio');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!birthDate) {
      setError('Por favor, selecciona tu fecha de nacimiento');
      return;
    }

    if (name && email && password && birthDate && role) {
      // 1. Ejecutamos la lógica de registro
      onRegister(name, email, password, birthDate, role);
      // Redirección simple a Home para todos los usuarios
      navigate('/'); 
      onClose(); // Cierra el modal
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Aumentamos el max-w a 2xl para que quepan las dos columnas cómodamente */}
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-neutral-500" />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Crear cuenta</h2>
          <p className="text-neutral-600">
            Únete a entrena<span className="text-purple-500">+</span> hoy
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contenedor Grid para organizar a la derecha los campos faltantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Columna Izquierda */}
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-700 mb-2 font-medium">Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-2 font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-2 font-medium">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha (Campos adicionales para la BD) */}
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-700 mb-2 font-medium">Fecha de nacimiento</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-neutral-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-2 font-medium">Tipo de cuenta</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <select
                    value={role} onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white appearance-none"
                  >
                    <option value="cliente">Cliente (Socio)</option>  
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-2 font-medium">Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-start gap-2">
            <input type="checkbox" className="w-4 h-4 mt-1 text-purple-500 rounded border-neutral-300" required />
            <span className="text-neutral-600 text-sm">
              Acepto los términos y condiciones y la política de privacidad
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold shadow-lg shadow-purple-200"
          >
            Crear cuenta
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <button onClick={onSwitchToLogin} className="text-purple-500 hover:text-purple-600 font-medium">
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;