import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminSidebar = () => {
  const { logout, user } = useContext(AuthContext);

  const menuItems = [
    { name: 'Dashboard', path: '/DashboardAdmin', icon: '🏠' },
    { name: 'Gestión de Socios', path: '/GestionSocios', icon: '👤' },
    { name: 'Pagos y Membresías', path: '/Pagos', icon: '💰' },
    { name: 'Clases y Horarios', path: '/Clases', icon: '📅' },
    { name: 'Reportes', path: '/Reportes', icon: '📈' }, 
    { name: 'Mantenimiento', path: '/Mantenimiento', icon: '⚙️' },
    { name: 'Empleados', path: '/Empleados', icon: '👨‍💼' }, 
  ];
  
  if (user?.rol === 'Socio') {
      return null; 
  }

  return (
  
    <div className="hidden md:flex w-64 bg-gray-800 text-white p-6 flex-col min-h-screen shadow-2xl border-r border-gray-700">
   
      <h3 className="text-3xl font-extrabold mb-8 text-green-400 tracking-widest">
        ENTRENA+
      </h3>
      
      <div className="mb-6 pb-4 border-b border-gray-700">
        <p className="text-md font-medium text-gray-200">Hola, **{user?.nombre || 'Administrador'}**</p>
       
        <p className="text-sm text-blue-400">Rol: **{user?.rol || 'Administrador'}**</p>
      </div>
      
      <nav className="flex-grow">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => 
            
              `flex items-center p-3 my-2 rounded-xl transition-colors duration-200 
               ${isActive 
  
                 ? 'bg-blue-400/20 text-green-400 font-bold border border-blue-400 shadow-md' 
                 : 'text-gray-300 hover:bg-gray-700 hover:text-green-400'}`
            }
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
  );
};

export default AdminSidebar;