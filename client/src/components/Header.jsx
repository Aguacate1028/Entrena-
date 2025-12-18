import React, { useState, useMemo } from 'react';
import { 
  Dumbbell, User, Home, Users, LayoutDashboard, 
  TrendingUp, BookOpen, Bell, ChevronDown, LogOut,
  Calendar, CreditCard, Briefcase, FileText, QrCode
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ isLoggedIn, userName, userRole, onLogout, onLoginClick, onRegisterClick }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(() => [
    // --- PÚBLICO ---
    //{ id: 'home', label: 'Inicio', icon: Home, path: '/' },
    
    // --- SOCIOS ---
    { id: 'home', label: 'Inicio', icon: Home, path: '/' },
    { id: 'classes', label: 'Clases', icon: Calendar, authRequired: true, socioOnly: true, path: '/socio/clases' },
    { id: 'social', label: 'Comunidad', icon: Users, authRequired: true, socioOnly: true, path: '/socio/comunidad' },
    { id: 'progress', label: 'Progreso', icon: TrendingUp, authRequired: true, socioOnly: true, path: '/socio/progreso' },
    { id: 'guide', label: 'Guía', icon: BookOpen, authRequired: true, socioOnly: true, path: '/socio/manual' },

    // --- ADMIN / STAFF (Menú extendido solicitado) ---
    { id: 'admin-dash', label: 'Vista General', icon: LayoutDashboard, authRequired: true, adminOnly: true, path: '/DashboardAdmin' },
    { id: 'admin-reportes', label: 'Reportes', icon: FileText, authRequired: true, adminOnly: true, path: '/Reportes' },
    { id: 'admin-pagos', label: 'Pagos', icon: CreditCard, authRequired: true, adminOnly: true, path: '/Pagos' },
    { id: 'admin-asistencias', label: 'Asistencias', icon: QrCode, authRequired: true, adminOnly: true, path: '/Asistencias' },
    { id: 'admin-empleados', label: 'Empleados', icon: Briefcase, authRequired: true, adminOnly: true, path: '/GestionEmpleados' },
  ], [isLoggedIn, userRole]);

  const visibleItems = menuItems.filter(item => {
    if (item.authRequired && !isLoggedIn) return false;
    const isAdmin = userRole === 'administrador' || userRole === 'staff';
    const isSocio = userRole === 'socio' || userRole === 'cliente';
    if (item.adminOnly && !isAdmin) return false;
    if (item.socioOnly && !isSocio) return false;
    return true;
  });

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
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavigation('/')}>
            <div className="bg-purple-500 p-2 rounded-lg shadow-md shadow-purple-200 transition-transform group-hover:scale-105">
                <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900 hidden md:block">
                entrena<span className="text-purple-500">+</span>
            </span>
          </div>

          {/* Navegación con Indicador Deslizante Morado */}
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
                className={`relative z-10 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors duration-300 min-w-[95px] ${
                  activeIndex !== -1 && visibleItems[activeIndex].id === item.id 
                  ? 'text-white' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <item.icon size={16} />
                <span className="font-bold text-xs">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Perfil y Dropdown */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <div className="flex items-center gap-3 relative">
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

                {/* Dropdown: Mi Perfil y Cerrar Sesión */}
                <div className={`absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-[60] transition-all duration-300 origin-top-right ${
                  showProfileDropdown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}>
                  <button 
                    onClick={() => handleNavigation(userRole === 'socio' ? '/socio/perfil' : '/DashboardAdmin')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-purple-50 hover:text-purple-600 transition-all font-semibold"
                  >
                    <User size={16} /> Mi Perfil
                  </button>
                  <div className="h-px bg-neutral-100 my-1 mx-4"></div>
                  <button 
                    onClick={() => { onLogout(); setShowProfileDropdown(false); navigate('/'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition-all"
                  >
                    <LogOut size={16} /> Cerrar sesión
                  </button>
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