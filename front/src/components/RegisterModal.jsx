import React, { useState } from 'react';
import { Mail, Lock, X, User } from 'lucide-react';

// Propiedades: onClose (cerrar), onRegister (función de registro simulada), onSwitchToLogin (cambiar a login)
const RegisterModal = ({ onClose, onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (name && email && password) {
      // Llamar a la función de registro (que también simula el login)
      onRegister(name, email, password); 
      onClose(); // Cerrar el modal
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Max height y overflow para contenido largo */}
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Botón de Cerrar */}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre completo */}
          <div>
            <label htmlFor="name" className="block text-neutral-700 mb-2">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text" id="name" required
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="register-email" className="block text-neutral-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email" id="register-email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="register-password" className="block text-neutral-700 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="password" id="register-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label htmlFor="confirm-password" className="block text-neutral-700 mb-2">Confirmar contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="password" id="confirm-password" required
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Acepto términos */}
          <div className="flex items-start gap-2">
            <input type="checkbox" className="w-4 h-4 mt-1 text-purple-500 rounded focus:ring-purple-500 border-neutral-300" required />
            <span className="text-neutral-600 text-sm">
              Acepto los términos y condiciones y la política de privacidad
            </span>
          </div>

          {/* Botón Crear cuenta */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
          >
            Crear cuenta
          </button>
        </form>

        {/* Enlace a Iniciar Sesión */}
        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;