// src/components/SocioSidebar.jsx
import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SocioSidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Mi Perfil', path: '/perfil', icon: '👤' }, // Requisito: Perfil/Red Social
    { name: 'Clases', path: '/clases', icon: '🧘' }, // Requisito: Registrarse en clase
    { name: 'Progreso y Rutinas', path: '/progreso', icon: '🏋️' }, // Requisito: Registro Rutinas/Progreso/Crear Rutina
    { name: 'Cálculo IMC/Calorías', path: '/imc', icon: '🍎' }, // Requisito: Cálculo IMC/Calorías/Comidas
    { name: 'Pagos y Membresía', path: '/pagos', icon: '💳' }, // Requisito: Visualizar pagos
    { name: 'Guía y Ayuda', path: '/manual', icon: '📚' }, // Requisito: Guía de máquinas/Ayuda
  ];
  
  if (user?.rol !== 'Socio') {
      return null; 
  }

  const navClass = ({ isActive }) => 
    `flex items-center p-3 my-1 rounded-xl transition-colors duration-200 
     ${isActive 
       ? 'bg-neon-green/20 text-neon-purple font-bold border border-neon-green shadow-neon-sm' 
       : 'text-gray-300 hover:bg-gray-800 hover:text-neon-green'}`;

  return (
    <>
      {/* Botón de Hamburguesa para Móvil */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-dark-card text-neon-green border border-neon-green"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar (Escritorio y Móvil) */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:relative md:translate-x-0 w-64 bg-dark-card text-white p-6 flex flex-col 
                   min-h-screen shadow-2xl z-40 transition-transform duration-300 ease-in-out border-r border-gray-800`}
      >
        <h3 className="text-3xl font-extrabold mb-8 text-neon-green tracking-widest mt-4 md:mt-0">
          ENTRENA+
        </h3>
        
        <div className="mb-6 pb-4 border-b border-gray-700">
          <p className="text-md font-medium text-gray-200">Hola, **{user?.nombre || 'Socio'}**</p>
          <p className="text-sm text-neon-purple">Rol: **{user?.rol || 'Socio'}**</p>
        </div>
        
        <nav className="flex-grow">
          {menuItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={navClass}
              onClick={() => setIsOpen(false)} // Cerrar en móvil al navegar
            >
              <span className="mr-3 text-xl">{item.icon}</span> 
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <button 
          className="mt-4 w-full py-2 px-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200" 
          onClick={logout}
        >
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

export default SocioSidebar;