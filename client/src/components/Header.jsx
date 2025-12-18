import React, { useState, useMemo } from 'react';
import { 
  Dumbbell, User, Home, Users, LayoutDashboard, 
  TrendingUp, BookOpen, Bell, ChevronDown, LogOut,
  Calendar, CreditCard
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ isLoggedIn, userName, userRole, onLogout, onLoginClick, onRegisterClick }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(() => [
    // --- PÚBLICO ---
    { id: 'home', label: 'Inicio', icon: Home, path: '/' },
    
    // --- SOCIOS (socioOnly: true) ---
    { id: 'classes', label: 'Clases', icon: Calendar, authRequired: true, socioOnly: true, path: '/socio/clases' },
    { id: 'social', label: 'Comunidad', icon: Users, authRequired: true, socioOnly: true, path: '/socio/comunidad' },
    { id: 'progress', label: 'Progreso', icon: TrendingUp, authRequired: true, socioOnly: true, path: '/socio/progreso' },
    { id: 'guide', label: 'Guía', icon: BookOpen, authRequired: true, socioOnly: true, path: '/socio/manual' },

    // --- ADMIN (adminOnly: true) ---
    { id: 'admin-dash', label: 'Dashboard', icon: LayoutDashboard, authRequired: true, adminOnly: true, path: '/DashboardAdmin' },
    { id: 'admin-socios', label: 'Socios', icon: Users, authRequired: true, adminOnly: true, path: '/GestionSocios' },
    { id: 'admin-pagos', label: 'Pagos', icon: CreditCard, authRequired: true, adminOnly: true, path: '/Pagos' },
  ], []);

  const visibleItems = menuItems.filter(item => {
    // 1. Si requiere auth y no está logueado -> Fuera
    if (item.authRequired && !isLoggedIn) return false;

    // Roles normalizados
    const isAdmin = userRole === 'administrador' || userRole === 'staff';
    const isSocio = userRole === 'socio' || userRole === 'cliente';

    // 2. Filtros por Rol
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
  };

  return (
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavigation('/')}>
            <div className="bg-purple-500 p-2 rounded-lg shadow-md shadow-purple-200 transition-transform group-hover:scale-105">
                <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900 hidden md:block">
                entrena<span className="text-purple-500">+</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center relative gap-1">
            {activeIndex !== -1 && (
              <div 
                className="absolute h-9 bg-purple-500 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-200"
                style={{ 
                  width: `${100 / visibleItems.length}%`,
                  transform: `translateX(${activeIndex * 100}%)`,
                  zIndex: 0 
                }}
              />
            )}

            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`relative z-10 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors duration-300 flex-1 min-w-[90px] ${
                  activeIndex !== -1 && visibleItems[activeIndex].id === item.id ? 'text-white' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <item.icon size={16} />
                <span className="font-bold text-xs lg:text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

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

                  <div className={`absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-[60] transition-all duration-300 origin-top-right ${
                    showProfileDropdown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}>
                    {userRole === 'socio' && (
                        <button 
                        onClick={() => { navigate('/socio/perfil'); setShowProfileDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-600 hover:bg-purple-50 hover:text-purple-600 transition-all font-semibold"
                        >
                        <User size={16} /> Mi Perfil
                        </button>
                    )}
                    <div className="h-px bg-neutral-100 my-1 mx-4"></div>
                    <button 
                      onClick={() => { onLogout(); setShowProfileDropdown(false); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-bold transition-all"
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