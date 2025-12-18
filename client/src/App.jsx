import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/LoginModal';
import AdminSidebar from './components/AdminSidebar';
import HomePage from './pages/Home';

const NotFound = () => <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white"><h1 className="text-3xl font-bold">404 | Página no encontrada</h1></div>;
const Unauthorized = () => <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white"><h1 className="text-3xl font-bold text-red-500">403 | Acceso Denegado</h1></div>;

// Vistas de Administración
import DashboardAdmin from "./components/admin/DashboardAdmin";
import GestionSocios from './pages/GestionSocios';
// Mocks para otras vistas de administrador que usan el sidebar (usando AdminSidebar) (esto lo quitamos cuando ya tengamos back)
const Pagos = () => <div className="flex min-h-screen bg-dark-bg"><AdminSidebar /><main className="flex-1 p-8 text-white">Gestión de Pagos (En Desarrollo)</main></div>;
const Clases = () => <div className="flex min-h-screen bg-dark-bg"><AdminSidebar /><main className="flex-1 p-8 text-white">Gestión de Clases (En Desarrollo)</main></div>;
const Reportes = () => <div className="flex min-h-screen bg-dark-bg"><AdminSidebar /><main className="flex-1 p-8 text-white">Reportes (En Desarrollo - Ganancias, Clientes, etc.)</main></div>;
const Mantenimiento = () => <div className="flex min-h-screen bg-dark-bg"><AdminSidebar /><main className="flex-1 p-8 text-white">Mantenimiento (En Desarrollo)</main></div>;
const Empleados = () => <div className="flex min-h-screen bg-dark-bg"><AdminSidebar /><main className="flex-1 p-8 text-white">Gestión de Empleados (En Desarrollo)</main></div>;


// Vistas de Socios
import DashboardSocio from './pages/DashboardSocio';
import PerfilSocio from './pages/PerfilSocio'; 
import RegistroClases from './pages/RegistroClases'; 
import CalculoIMC from './pages/CalculoIMC';
import ProgresoRutinas from './pages/ProgresoRutinas'; 
import ManualMaquinas from './pages/ManualMaquinas'; 


const AppContent = () => {
    const { isAuthenticated, user } = useContext(AuthContext);

    const getRedirectRoute = () => {
        if (!isAuthenticated) return '/';
        // REDIRECCIÓN DEL STAFF (administrador o staff)
        if (user?.rol === 'administrador' || user?.rol === 'staff') return '/DashboardAdmin';
        // REDIRECCIÓN DEL SOCIO
        if (user?.rol === 'socio') return '/socio/dashboard'; 
        return '/'; 
    };
    
    return (
        <Routes>
            {/* Si está autenticado, redirige a su panel; si no, muestra Home siempre */}
            <Route path="/" element={<HomePage />} />
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginModal />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* RUTAS PROTEGIDAS PARA EL STAFF (administrador/staff) */}
            {/* Estas rutas usarán el requiredRole="administrador" */}
            <Route path="/DashboardAdmin" element={<ProtectedRoute requiredRole="administrador"><DashboardAdmin /></ProtectedRoute>} />
            <Route path="/GestionSocios" element={<ProtectedRoute requiredRole="administrador"><GestionSocios /></ProtectedRoute>} />
            <Route path="/Pagos" element={<ProtectedRoute requiredRole="administrador"><Pagos /></ProtectedRoute>} />
            <Route path="/Clases" element={<ProtectedRoute requiredRole="administrador"><Clases /></ProtectedRoute>} />
            <Route path="/Reportes" element={<ProtectedRoute requiredRole="administrador"><Reportes /></ProtectedRoute>} />
            <Route path="/Mantenimiento" element={<ProtectedRoute requiredRole="administrador"><Mantenimiento /></ProtectedRoute>} />
            <Route path="/Empleados" element={<ProtectedRoute requiredRole="administrador"><Empleados /></ProtectedRoute>} />
            
            {/* RUTAS PROTEGIDAS PARA EL SOCIO - Usamos path /socio/* */}
            <Route path="/socio/dashboard" element={<ProtectedRoute requiredRole="socio"><DashboardSocio /></ProtectedRoute>} />
            <Route path="/socio/perfil" element={<ProtectedRoute requiredRole="socio"><PerfilSocio /></ProtectedRoute>} />
            <Route path="/socio/clases" element={<ProtectedRoute requiredRole="socio"><RegistroClases /></ProtectedRoute>} />
            <Route path="/socio/imc" element={<ProtectedRoute requiredRole="socio"><CalculoIMC /></ProtectedRoute>} />
            <Route path="/socio/progreso" element={<ProtectedRoute requiredRole="socio"><ProgresoRutinas /></ProtectedRoute>} />
            <Route path="/socio/manual" element={<ProtectedRoute requiredRole="socio"><ManualMaquinas /></ProtectedRoute>} />


            {/* Catch-all para 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

const App = () => (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
);

export default App;