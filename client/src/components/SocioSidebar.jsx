// src/components/SocioSidebar.jsx
import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SocioSidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Inicializar el navegador

  const menuItems = [
    { name: 'Dashboard', path: '/socio/dashboard', icon: '🏠' },
    { name: 'Mi Perfil', path: '/socio/perfil', icon: '👤' }, 
    { name: 'Clases', path: '/socio/clases', icon: '🧘' }, 
    { name: 'Progreso y Rutinas', path: '/socio/progreso', icon: '🏋️' }, 
    { name: 'Cálculo IMC/Calorías', path: '/socio/imc', icon: '🍎' }, 
    { name: 'Pagos y Membresía', path: '/socio/clases', icon: '💳' }, 
    { name: 'Guía y Ayuda', path: '/socio/manual', icon: '📚' }, 
  ];
  
  if (user?.rol !== 'socio') {
      return null; 
  }

  // Función para cerrar sesión y redirigir
  const handleLogout = () => {
    logout(); // Limpia el estado y el localStorage
    navigate('/', { replace: true }); // Redirige a la raíz (Home.jsx)
  };

  const navClass = ({ isActive }) => 
    `flex items-center p-3 my-1 rounded-xl transition-colors duration-200 
     ${isActive 
       // Reemplazo: bg-neon-green/20 -> bg-green-400/20. text-neon-purple -> text-blue-400. border-neon-green -> border-green-400. shadow-neon-sm -> shadow-md
       ? 'bg-green-400/20 text-blue-400 font-bold border border-green-400 shadow-md' 
       // Reemplazo: hover:text-neon-green -> hover:text-green-400
       : 'text-gray-300 hover:bg-gray-700 hover:text-green-400'}`;

  return (
    <>
      {/* Botón de Hamburguesa para Móvil */}
      {/* Reemplazo: bg-dark-card -> bg-gray-800. text-neon-green -> text-green-400. border-neon-green -> border-green-400 */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-green-400 border border-green-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar (Escritorio y Móvil) */}
      {/* Reemplazo: bg-dark-card -> bg-gray-800 */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:relative md:translate-x-0 w-64 bg-gray-800 text-white p-6 flex flex-col 
                   min-h-screen shadow-2xl z-40 transition-transform duration-300 ease-in-out border-r border-gray-700`}
      >
        {/* Reemplazo: text-neon-green -> text-green-400 */}
        <h3 className="text-3xl font-extrabold mb-8 text-green-400 tracking-widest mt-4 md:mt-0">
          ENTRENA+
        </h3>
        
        <div className="mb-6 pb-4 border-b border-gray-700">
          <p className="text-md font-medium text-gray-200">Hola, **{user?.nombre || 'socio'}**</p>
          {/* Reemplazo: text-neon-purple -> text-blue-400 */}
          <p className="text-sm text-blue-400">Rol: **{user?.rol || 'socio'}**</p>
        </div>
        
        <nav className="flex-grow">
          {menuItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={navClass}
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-3 text-xl">{item.icon}</span> 
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <button 
          className="mt-4 w-full py-2 px-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200" 
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

export default SocioSidebar;