// src/components/Header.jsx
import React, { useState, useMemo } from 'react';
import { 
  Dumbbell, User, Home, Users, LayoutDashboard, 
  TrendingUp, BookOpen, Bell, ChevronDown, LogOut 
} from 'lucide-react';

const Header = ({ isLoggedIn, userName, userRole, currentView, onLoginClick, onRegisterClick, onLogout, onViewChange }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Definición de ítems para calcular el desplazamiento
  const menuItems = useMemo(() => [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'social', label: 'Comunidad', icon: Users, authRequired: true },
    { id: 'progress', label: 'Progreso', icon: TrendingUp, authRequired: true },
    { id: 'guide', label: 'Guía', icon: BookOpen, authRequired: true },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard, authRequired: true, adminOnly: true },
  ], []);

  // Filtrar ítems visibles según estado y rol
  const visibleItems = menuItems.filter(item => {
    if (item.authRequired && !isLoggedIn) return false;
    if (item.adminOnly && !(userRole === 'administrador' || userRole === 'staff')) return false;
    return true;
  });

  const activeIndex = visibleItems.findIndex(item => item.id === currentView);

  return (
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onViewChange('home')}>
            <div className="bg-purple-500 p-2 rounded-lg shadow-md shadow-purple-200 transition-transform group-hover:scale-105">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-neutral-900 tracking-tight">
              entrena<span className="text-purple-500">+</span>
            </span>
          </div>

          {/* Navegación con Indicador Deslizante */}
          <nav className="hidden md:flex items-center relative gap-0">
            {activeIndex !== -1 && (
              <div 
                className="absolute h-10 bg-purple-500 rounded-xl transition-all duration-300 ease-in-out shadow-lg shadow-purple-200"
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
                onClick={() => onViewChange(item.id)}
                className={`relative z-10 flex items-center justify-center gap-2 px-6 py-2 rounded-xl transition-colors duration-300 min-w-[120px] h-10 ${
                  currentView === item.id ? 'text-white' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <item.icon size={18} />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Área de Perfil */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <div className="flex gap-3">
                <button onClick={onLoginClick} className="text-neutral-700 font-bold text-sm hover:text-purple-600 transition-colors">
                  Iniciar sesión
                </button>
                <button onClick={onRegisterClick} className="px-6 py-2.5 bg-purple-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200 hover:bg-purple-600 transition-all">
                  Registrarse
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 relative">
                <button className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 p-1.5 pr-3 bg-neutral-50 rounded-full border border-neutral-100 hover:border-purple-200 transition-all"
                  >
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-[11px] font-bold text-neutral-900 leading-none mb-0.5">{userName}</p>
                      <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-tighter">{userRole}</p>
                    </div>
                    <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown con Animación de Escala y Opacidad */}
                  <div className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-[60] transition-all duration-300 origin-top-right ${
                    showProfileDropdown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}>
                    <div className="px-4 py-3 border-b border-neutral-50 mb-1">
                      <p className="text-xs font-bold text-neutral-900">{userName}</p>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{userRole}</p>
                    </div>
                    
                    {/* Botón Mi Perfil */}
                    <button 
                      onClick={() => { onViewChange('profile'); setShowProfileDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-purple-50 hover:text-purple-600 transition-all font-semibold"
                    >
                      <User size={16} /> Mi Perfil
                    </button>

                    <div className="h-px bg-neutral-100 my-1 mx-4"></div>
                    
                    {/* Botón Cerrar Sesión */}
                    <button 
                      onClick={() => { onLogout(); setShowProfileDropdown(false); }}
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