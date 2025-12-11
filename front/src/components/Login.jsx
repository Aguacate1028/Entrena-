// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
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
      if (result.rol === 'administrador') {
          navigate('/DashboardAdmin');
      } else if (result.rol === 'Socio') { 
          navigate('/socio/dashboard');
      } else { 
          navigate('/DashboardAdmin'); 
      }
    } else {
      setError(result.error || 'Fallo en la autenticación simulada.');
    }
  };

  return (
    // Reemplazo: bg-dark-bg -> bg-gray-900
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 sm:p-6">
      {/* Reemplazo: bg-dark-card -> bg-gray-800. shadow-neon-lg -> shadow-xl. border-neon-purple/50 -> border-blue-400/50 */}
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl space-y-8 border-2 border-blue-400/50">
        {/* Reemplazo: text-neon-green -> text-green-400 */}
        <h2 className="text-4xl font-extrabold text-green-400 text-center tracking-wider">
            👋 Entrena+ Acceso
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input 
              id="email" type="email" required
              placeholder="Email (administrador: administrador@entrena.com)" 
              value={email} onChange={(e) => setEmail(e.target.value)} 
              // Reemplazo: focus:ring-neon-purple -> focus:ring-blue-400. focus:border-neon-purple -> focus:border-blue-400
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-lg transition-colors"
            />
          </div>
          <div>
            <input 
              id="password" type="password" required
              placeholder="Contraseña (administrador: administrador)" 
              value={password} onChange={(e) => setPassword(e.target.value)} 
              // Reemplazo: focus:ring-neon-purple -> focus:ring-blue-400. focus:border-neon-purple -> focus:border-blue-400
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-lg transition-colors"
            />
          </div>
          
          <button 
            type="submit"
            // Reemplazo: text-dark-bg -> text-gray-900. bg-neon-green -> bg-green-400. focus:ring-neon-green -> focus:ring-green-400. focus:ring-offset-dark-card -> focus:ring-offset-gray-800. shadow-neon-lg -> shadow-xl
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-lg text-gray-900 bg-green-400 hover:bg-green-400/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 focus:ring-offset-gray-800 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Iniciar Sesión
          </button>
          
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>
        <small className="block text-center text-gray-400">
            Prueba con: **administrador@entrena.com / administrador** (Staff) o **dylan@mail.com / socio** (Cliente).
        </small>
        <div className="text-center">
             {/* Reemplazo: text-neon-purple -> text-blue-400. hover:text-neon-green -> hover:text-green-400 */}
             <a href="#" className="text-blue-400 hover:text-green-400 text-md font-medium transition-colors">
                ¿No tienes cuenta? Regístrate aquí
             </a>
        </div>
      </div>
    </div>
  );
};

export default Login;