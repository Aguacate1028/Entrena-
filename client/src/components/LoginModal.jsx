import React, { useState, useContext } from 'react';
import { Mail, Lock, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Propiedades: onClose (cerrar), onSwitchToRegister (cambiar a registro)
const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      // Redirección basada en los roles EXACTOS de tu BD
      if (result.rol === 'administrador' || result.rol === 'staff') {
          navigate('/DashboardAdmin');
      } else if (result.rol === 'socio') { 
          navigate('/socio/dashboard');
      }
      onClose(); 
    } else {
      setError(result.error || 'Fallo en la autenticación.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
        
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-neutral-500" />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Iniciar sesión</h2>
          <p className="text-neutral-600">
            Bienvenido de vuelta a entrena<span className="text-purple-500">+</span>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-neutral-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                id="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)} 
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-neutral-700 mb-2">Contraseña</label>
            <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
               <input
                id="password" type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Recordarme y Olvidé Contraseña */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500 border-neutral-300" />
              <span className="text-neutral-600">Recordarme</span>
            </label>
            <a href="#" className="text-purple-500 hover:text-purple-600">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          
          {/* Botón Iniciar Sesión */}
          <button 
            type="submit"
            className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlace a Registrarse */}
        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;