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
          navigate('/DashboardSocio');
      } else {
          navigate('/DashboardAdmin'); 
      }
    } else {
      setError(result.error || 'Fallo en la autenticación simulada.');
    }
  };

  return (
    // Aplicamos fondo oscuro principal
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 sm:p-6">
      <div className="max-w-md w-full bg-dark-card p-8 rounded-2xl shadow-neon-lg space-y-8 border-2 border-neon-purple/50">
        <h2 className="text-4xl font-extrabold text-neon-green text-center tracking-wider">
            👋 Entrena+ Acceso
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input 
              id="email" type="email" required
              placeholder="Email (administrador: administrador@entrena.com)" 
              value={email} onChange={(e) => setEmail(e.target.value)} 
              // Estilos oscuros y neón para inputs
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-neon-purple focus:border-neon-purple sm:text-lg transition-colors"
            />
          </div>
          <div>
            <input 
              id="password" type="password" required
              placeholder="Contraseña (administrador: administrador)" 
              value={password} onChange={(e) => setPassword(e.target.value)} 
              // Estilos oscuros y neón para inputs
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-neon-purple focus:border-neon-purple sm:text-lg transition-colors"
            />
          </div>
          
          <button 
            type="submit"
            // Botón con color principal neón-purple
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-lg text-dark-bg bg-neon-green hover:bg-neon-green/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-green focus:ring-offset-dark-card transition-all duration-300 shadow-md hover:shadow-neon-lg"
          >
            Iniciar Sesión
          </button>
          
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>
        <small className="block text-center text-gray-400">
            Prueba con: **administrador@entrena.com / administrador** (Staff) o **dylan@mail.com / socio** (Cliente).
        </small>
        {/* Enlace para crear cuenta */}
        <div className="text-center">
             <a href="#" className="text-neon-purple hover:text-neon-green text-md font-medium transition-colors">
                ¿No tienes cuenta? Regístrate aquí
             </a>
        </div>
      </div>
    </div>
  );
};

export default Login;