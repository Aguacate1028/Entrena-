import React, { useState, useMemo } from 'react';
import { 
  Dumbbell, User, Home, Users, LayoutDashboard, 
  TrendingUp, BookOpen, Bell, ChevronDown, LogOut,
  Calendar, CreditCard, Briefcase, FileText, QrCode,
  LockIcon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ isLoggedIn, userName, userRole, onLogout, onLoginClick, onRegisterClick }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Configuración de menús por Rol
  const menuItems = useMemo(() => [
    { id: 'home', label: 'Inicio', icon: Home, path: '/', public: true },
    
    // --- SOCIO ---
    { id: 'classes', label: 'Clases', icon: Calendar, path: '/socio/clases', role: 'socio' },
    { id: 'social', label: 'Comunidad', icon: Users, path: '/socio/comunidad', role: 'socio' },
    { id: 'progress', label: 'Progreso', icon: TrendingUp, path: '/socio/progreso', role: 'socio' },
    { id: 'guide', label: 'Guía', icon: BookOpen, path: '/socio/manual', role: 'socio' },

    // --- STAFF ---
    { id: 'staff-dash', label: 'Vista General', icon: LayoutDashboard, path: '/staff/VistaGeneral', role: 'staff' },
    { id: 'staff-pagos', label: 'Pagos', icon: CreditCard, path: '/staff/Pagos', role: 'staff' },
    { id: 'staff-asistencias', label: 'Asistencias', icon: QrCode, path: '/staff/Asistencias', role: 'staff' },
    { id: 'staff-gestion', label: 'Socios', icon: Users, path: '/staff/GestionSocios', role: 'staff' },
    { id: 'staff-casilleros', label: 'Casilleros', icon: LockIcon, path: '/staff/Casilleros', role: 'staff' },

    // --- ADMINISTRADOR ---
    { id: 'admin-dash', label: 'Vista General', icon: LayoutDashboard, path: '/VistaGeneral', role: 'administrador' },
    { id: 'admin-reportes', label: 'Reportes', icon: FileText, path: '/Reportes', role: 'administrador' },
    { id: 'admin-pagos', label: 'Pagos', icon: CreditCard, path: '/Pagos', role: 'administrador' },
    { id: 'admin-asistencias', label: 'Asistencias', icon: QrCode, path: '/Asistencias', role: 'administrador' },
    { id: 'admin-empleados', label: 'Empleados', icon: Briefcase, path: '/Empleados', role: 'administrador' },
    { id: 'admin-gestion', label: 'Socios', icon: Users, path: '/GestionSocios', role: 'administrador' },
  ], []);

  // Filtrado lógico de items visibles según el estado de la sesión
  const visibleItems = useMemo(() => {
    if (!isLoggedIn) return menuItems.filter(item => item.public);
    return menuItems.filter(item => item.role === userRole || (item.public && userRole === 'socio'));
  }, [isLoggedIn, userRole, menuItems]);

  const activeIndex = visibleItems.findIndex(item => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  });

  const handleNavigation = (path) => {
    navigate(path);
    setShowProfileDropdown(false);
  };

  return (
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Centralizado */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavigation('/')}>
            <div className="bg-purple-500 p-2 rounded-lg shadow-md shadow-purple-200 transition-transform group-hover:scale-105">
                <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900 hidden md:block">
                entrena<span className="text-purple-500">+</span>
            </span>
          </div>

          {/* Navegación Dinámica con Indicador Morado */}
          <nav className="hidden md:flex items-center relative gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-100">
            {activeIndex !== -1 && (
              <div 
                className="absolute h-9 bg-purple-500 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-200"
                style={{ 
                  width: `calc(${100 / visibleItems.length}% - 4px)`,
                  transform: `translateX(${activeIndex * 100}%)`,
                  zIndex: 0 
                }}
              />
            )}

            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 min-w-[100px] ${
                  activeIndex !== -1 && visibleItems[activeIndex].id === item.id 
                  ? 'text-white' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <item.icon size={16} />
                <span className="font-bold text-xs lg:text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Perfil y Auth */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <div className="flex gap-2">
                <button onClick={onLoginClick} className="text-neutral-700 font-bold text-sm hover:text-purple-600 transition-colors px-3 py-2">
                  Iniciar sesión
                </button>
                <button onClick={onRegisterClick} className="px-5 py-2 bg-purple-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-purple-200 hover:bg-purple-600 transition-all">
                  Registrarse
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 relative">
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 p-1 pr-3 bg-neutral-50 rounded-full border border-neutral-100 hover:border-purple-200 transition-all"
                  >
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md uppercase">
                      {userName.charAt(0)}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-[11px] font-bold text-neutral-900 leading-none mb-0.5">{userName}</p>
                      <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-tighter">{userRole}</p>
                    </div>
                    <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown unificado: Mi Cuenta y Cerrar Sesión */}
                  <div className={`absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-[60] transition-all duration-300 origin-top-right ${
                    showProfileDropdown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}>
                    {/* Lógica condicional de opciones por rol */}
                    {userRole === 'socio' && (
                      <>
                        <button 
                          onClick={() => handleNavigation('/socio/perfil')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-purple-50 hover:text-purple-600 transition-all font-semibold"
                        >
                          <User size={16} /> Mi Cuenta
                        </button>
                        <div className="h-px bg-neutral-100 my-1 mx-4"></div>
                      </>
                    )}
                    <button 
                      onClick={() => { 
                        onLogout(); // 1. Limpia el estado
                        setShowProfileDropdown(false); // 2. Cierra el menú
                        navigate('/', { replace: true }); // 3. Redirige a Home reemplazando el historial
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition-all"
                    >
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;