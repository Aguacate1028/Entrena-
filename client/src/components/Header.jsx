import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Dumbbell, CreditCard, Info, Users, TrendingUp, BookOpen, 
  LayoutDashboard, QrCode, LockIcon, FileText, Briefcase,
  LogOut, User, ChevronDown, Bell, Check, Clock, BadgeInfo, Calendar
} from 'lucide-react';
import logoImg from '../img/logo.png'; 
import { 
    obtenerNotificacionesRequest, 
    marcarLeidaRequest, 
    marcarTodasLeidasRequest 
} from '../api/notificaciones';

// Función utilidad para el tiempo
const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Hace un momento';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${Math.floor(hours / 24)} días`;
};

const Header = ({ 
    isLoggedIn, 
    user,         
    userName,    
    userRole, // 'socio', 'staff', 'administrador'
    onLogout, 
    onLoginClick, 
    onRegisterClick 
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const currentUserId = user?.id_usuario || user?.id;

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]); 

    const loadNotificaciones = async () => {
        if (!currentUserId || !isLoggedIn) return;
        try {
            const data = await obtenerNotificacionesRequest(currentUserId);
            setNotifications(data || []);
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn && currentUserId) {
            loadNotificaciones();
            const interval = setInterval(loadNotificaciones, 60000); 
            return () => clearInterval(interval);
        }
    }, [isLoggedIn, currentUserId]);

    const unreadCount = notifications.filter(n => n.leido === false).length;

    const handleMarkRead = async (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, leido: true } : n));
        await marcarLeidaRequest(id);
    };

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, leido: true })));
        await marcarTodasLeidasRequest(currentUserId);
    };

    // --- LÓGICA DE MENÚS POR ROL ---
    const menuItems = useMemo(() => {
        // Items para visitantes
        const publicItems = [
            { id: 'home', label: 'Inicio', icon: Home, path: '/' },
            { id: 'clases', label: 'Clases', icon: Dumbbell, path: '/clases' },
            { id: 'planes', label: 'Membresías', icon: CreditCard, path: '/membresias' },
            { id: 'nosotros', label: 'Nosotros', icon: Info, path: '/informacion' },
        ];

        // Diccionario de rutas privadas
        const privateItems = [
            // SOCIO
            { id: 's-anuncios', label: 'Anuncios', icon: BadgeInfo, path: '/', role: 'socio' },
            { id: 's-clases', label: 'Clases', icon: Dumbbell, path: '/clases', role: 'socio' },
            { id: 's-reservas', label: 'Reservación', icon: Calendar, path: '/reservaciones', role: 'socio' },
            { id: 'planes', label: 'Membresías', icon: CreditCard, path: '/membresias', role: 'socio' },
            { id: 's-comunidad', label: 'Comunidad', icon: Users, path: '/comunidad', role: 'socio' },
            { id: 's-progreso', label: 'Progreso', icon: TrendingUp, path: '/progreso', role: 'socio' },
            { id: 's-guia', label: 'Guía', icon: BookOpen, path: '/guia', role: 'socio' },
            { id: 's-reportes', label: 'Reportes', icon: FileText, path: '/reportes', role: 'socio' },

            // STAFF
            { id: 's-anuncios', label: 'Anuncios', icon: BadgeInfo, path: '/', role: 'staff' },
            { id: 'st-dash', label: 'Panel', icon: LayoutDashboard, path: '/staffdashboard', role: 'staff' },
            { id: 'st-accesos', label: 'Accesos', icon: QrCode, path: '/staffscanner', role: 'staff' },
            { id: 'st-socios', label: 'Socios', icon: Users, path: '/staffsocios', role: 'staff' },
            { id: 'st-pagos', label: 'Pagos', icon: CreditCard, path: '/staffpagos', role: 'staff' },
            { id: 'st-lockers', label: 'Lockers', icon: LockIcon, path: '/stafflockers', role: 'staff' },

            // ADMINISTRADOR
<<<<<<< HEAD
            { id: 'ad-dash', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', role: 'administrador' },
            { id: 'ad-reportes', label: 'Reportes', icon: FileText, path: '/reportes', role: 'administrador' },
            { id: 'ad-pagos', label: 'Finanzas', icon: CreditCard, path: '/finanzas', role: 'administrador' },
            { id: 'ad-rrhh', label: 'RRHH', icon: Briefcase, path: '/empleados', role: 'administrador' },
            { id: 'ad-users', label: 'Usuarios', icon: Users, path: '/usuarios', role: 'administrador' },
=======
            { id: 's-anuncios', label: 'Anuncios', icon: BadgeInfo, path: '/', role: 'administrador' },
            { id: 'ad-dash', label: 'Panel', icon: LayoutDashboard, path: '/admindashboard', role: 'administrador' },
            { id: 'ad-reportes', label: 'Reportes', icon: FileText, path: '/adminreportes', role: 'administrador' },
            { id: 'ad-pagos', label: 'Finanzas', icon: CreditCard, path: '/adminpagos', role: 'administrador' },
            { id: 'ad-rrhh', label: 'Entrenadores', icon: Dumbbell, path: '/adminentrenadores', role: 'administrador' },
            { id: 'ad-users', label: 'Usuarios', icon: Users, path: '/adminusuarios', role: 'administrador' },
>>>>>>> a5db22499e1ebdea3f2428b7dd484c7f8cba2ff7
        ];

        if (!isLoggedIn) return publicItems;
        // Filtrar por el rol exacto que viene del backend
        return privateItems.filter(item => item.role === userRole);
    }, [isLoggedIn, userRole]);

    const handleNavigation = (path) => {
        navigate(path);
        setShowProfileDropdown(false);
        setShowNotifDropdown(false);
    };

    const displayName = userName || user?.nombre || 'Usuario'; 

    return (
        <header className="bg-neutral-800 sticky top-0 z-50 shadow-sm font-sans">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                
                <Link to="/" className="flex items-center gap-2">
                    <img src={logoImg} alt="Logo Entrena+" className="h-20 object-contain hover:scale-105 transition-transform" />
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {menuItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                                    active ? 'text-purple-400 font-bold' : 'text-neutral-300 hover:text-purple-400'
                                }`}
                            >
                                <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        <>
                            <button onClick={onLoginClick} className="hidden md:flex items-center font-medium text-sm text-neutral-300 hover:text-purple-400 transition-colors px-3">
                                Iniciar Sesión
                            </button>
                            <button onClick={onRegisterClick} className="px-5 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-all">
                                Registrarse
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            
                            {/* NOTIFICACIONES */}
                            <div className="relative">
                                <button 
                                    onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowProfileDropdown(false); }}
                                    className="relative p-2 rounded-full text-neutral-300 hover:bg-neutral-700 hover:text-purple-400 transition-all"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                        </span>
                                    )}
                                </button>
                                
                                {showNotifDropdown && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-[70] animate-fade-in-up origin-top-right">
                                        <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-100">
                                            <h3 className="font-bold text-sm text-neutral-800">Notificaciones</h3>
                                            {unreadCount > 0 && (
                                                <button onClick={handleMarkAllRead} className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
                                                    <Check size={12} /> Marcar leídas
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-neutral-400 text-sm">No tienes notificaciones</div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div 
                                                        key={notif.id} 
                                                        onClick={() => handleMarkRead(notif.id)} 
                                                        className={`px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors cursor-pointer flex gap-3 ${!notif.leido ? 'bg-purple-50/40' : ''}`}
                                                    >
                                                        <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!notif.leido ? 'bg-purple-500' : 'bg-neutral-200'}`} />
                                                        <div className="flex-1">
                                                            <p className={`text-sm ${!notif.leido ? 'font-bold text-neutral-900' : 'font-medium text-neutral-600'}`}>{notif.titulo}</p>
                                                            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{notif.mensaje}</p>
                                                            <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
                                                                <Clock size={10} /> {formatTimeAgo(notif.fecha_creacion)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PERFIL */}
                            <div className="relative">
                                <button 
                                    onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifDropdown(false); }}
                                    className="flex items-center gap-2 p-1 pr-3 bg-neutral-700 rounded-full border border-neutral-600 hover:border-purple-500 transition-all"
                                >
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md uppercase">
                                        {displayName.charAt(0)}
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-[11px] font-bold text-white leading-none mb-0.5">{displayName}</p>
                                        <p className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">{userRole}</p>
                                    </div>
                                    <ChevronDown size={14} className={`text-neutral-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {showProfileDropdown && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-[60] animate-fade-in-up origin-top-right">
                                        {userRole === 'socio' && (
                                            <button onClick={() => handleNavigation('/perfil')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-purple-50 hover:text-purple-600 transition-all font-semibold">
                                                <User size={16} /> Mi Cuenta
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => { 
                                                setShowProfileDropdown(false);
                                                onLogout();
                                                navigate('/');
                                            }} 
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition-all"
                                        >
                                            <LogOut size={16} /> Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;