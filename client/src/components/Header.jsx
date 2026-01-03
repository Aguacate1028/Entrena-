import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Dumbbell, LogIn, User, Home, Users, LayoutDashboard, 
  TrendingUp, BookOpen, ChevronDown, LogOut,
  Calendar, CreditCard, Briefcase, FileText, QrCode,
  LockIcon
} from 'lucide-react';
import logoImg from '../img/logo.png'; 

const Header = ({ 
    isLoggedIn, 
    userName, 
    userRole, // 'socio' | 'staff' | 'administrador'
    onLogout,
    onLoginClick,    // Prop para abrir modal Login
    onRegisterClick  // Prop para abrir modal Registro
}) => {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // --- 1. MENÚS PRIVADOS (SOLO LOGUEADOS) ---
    const roleMenuItems = useMemo(() => [
        // ROL: SOCIO
        { id: 'classes', label: 'Clases', icon: Calendar, path: '/socio/clases', role: 'socio' },
        { id: 'social', label: 'Comunidad', icon: Users, path: '/socio/comunidad', role: 'socio' },
        { id: 'progress', label: 'Progreso', icon: TrendingUp, path: '/socio/progreso', role: 'socio' },
        { id: 'guide', label: 'Guía', icon: BookOpen, path: '/socio/manual', role: 'socio' },

        // ROL: STAFF
        { id: 'staff-dash', label: 'Panel', icon: LayoutDashboard, path: '/staff/dashboard', role: 'staff' },
        { id: 'staff-pagos', label: 'Cobros', icon: CreditCard, path: '/staff/pagos', role: 'staff' },
        { id: 'staff-asistencias', label: 'Accesos', icon: QrCode, path: '/staff/asistencias', role: 'staff' },
        { id: 'staff-gestion', label: 'Socios', icon: Users, path: '/staff/socios', role: 'staff' },
        { id: 'staff-casilleros', label: 'Casilleros', icon: LockIcon, path: '/staff/casilleros', role: 'staff' },

        // ROL: ADMINISTRADOR
        { id: 'admin-dash', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', role: 'administrador' },
        { id: 'admin-reportes', label: 'Reportes', icon: FileText, path: '/admin/reportes', role: 'administrador' },
        { id: 'admin-pagos', label: 'Finanzas', icon: CreditCard, path: '/admin/pagos', role: 'administrador' },
        { id: 'admin-empleados', label: 'RRHH', icon: Briefcase, path: '/admin/empleados', role: 'administrador' },
        { id: 'admin-gestion', label: 'Usuarios', icon: Users, path: '/admin/usuarios', role: 'administrador' },
    ], []);

    // --- 2. FILTRADO ---
    const visibleItems = useMemo(() => {
        if (!isLoggedIn) return []; 
        return roleMenuItems.filter(item => item.role === userRole);
    }, [isLoggedIn, userRole, roleMenuItems]);

    // Índice activo para la barra morada
    const activeIndex = visibleItems.findIndex(item => location.pathname.startsWith(item.path));

    const handleNavigation = (path) => {
        navigate(path);
        setShowProfileDropdown(false);
    };

    return (
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm font-sans">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                
                {/* --- LOGO --- */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img 
                        src={logoImg} 
                        alt="Logo Entrena+" 
                        className="h-25 w-25 object-contain hover:scale-105 transition-transform" 
                    />
                </Link>

                {/* --- NAVEGACIÓN CENTRAL --- */}
                {!isLoggedIn ? (
                    // OPCIÓN A: MENÚ PÚBLICO (TEXTO SIMPLE)
                    <nav className="hidden md:flex gap-8 font-medium text-sm text-neutral-600">
                        <Link to="/" className="hover:text-purple-500 transition-colors">Inicio</Link>
                        <Link to="/clases" className="hover:text-purple-500 transition-colors">Clases</Link>
                        <Link to="/membresias" className="hover:text-purple-500 transition-colors">Planes</Link>
                        <Link to="/informacion" className="hover:text-purple-500 transition-colors">Nosotros</Link>
                    </nav>
                ) : (
                    // OPCIÓN B: MENÚ PRIVADO (ICONOS + BARRA MORADA)
                    <nav className="hidden md:flex items-center relative gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-100">
                        {activeIndex !== -1 && (
                            <div 
                                className="absolute h-9 bg-purple-500 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-200"
                                style={{ 
                                    width: `calc(${100 / visibleItems.length}% - 4px)`,
                                    left: '2px',
                                    transform: `translateX(${activeIndex * 100}%)`,
                                    zIndex: 0 
                                }}
                            />
                        )}
                        {visibleItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.path)}
                                className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 min-w-[110px] ${
                                    activeIndex !== -1 && visibleItems[activeIndex].id === item.id 
                                    ? 'text-white' : 'text-neutral-500 hover:text-neutral-900'
                                }`}
                            >
                                <item.icon size={16} strokeWidth={2.5} />
                                <span className="font-bold text-xs lg:text-sm">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                )}

                {/* --- BOTONES DE ACCIÓN (DERECHA) --- */}
                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        // BOTONES PÚBLICOS: INGRESAR Y REGISTRARSE
                        <>
                            <button 
                                onClick={onLoginClick}
                                className="hidden md:flex items-center font-medium text-sm text-neutral-600 hover:text-purple-600 transition-colors px-3"
                            >Iniciar Sesión
                            </button>
                            <button 
                                onClick={onRegisterClick}
                                className="px-5 py-2 bg-purple-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-purple-200 hover:bg-purple-600 transition-all"
                            >Registrarse
                            </button>
                        </>
                    ) : (
                        // PERFIL DE USUARIO (LOGUEADO)
                        <div className="relative">
                            <button 
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center gap-2 p-1 pr-3 bg-neutral-50 rounded-full border border-neutral-100 hover:border-purple-200 transition-all"
                            >
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md uppercase">
                                    {userName ? userName.charAt(0) : 'U'}
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-[11px] font-bold text-neutral-900 leading-none mb-0.5">{userName}</p>
                                    <p className="text-[9px] text-purple-500 font-bold uppercase tracking-wider">{userRole}</p>
                                </div>
                                <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-[60]">
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
                                        onClick={() => { onLogout(); setShowProfileDropdown(false); navigate('/'); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition-all"
                                    >
                                        <LogOut size={16} /> Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;