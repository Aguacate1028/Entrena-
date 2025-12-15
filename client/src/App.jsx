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
import DashboardAdmin from './pages/DashboardAdmin';
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
        if (!isAuthenticated) return '/login';
        // REDIRECCIÓN DEL STAFF (administrador o Trainer)
        if (user?.rol === 'administrador' || user?.rol === 'Trainer') return '/DashboardAdmin';
        // REDIRECCIÓN DEL SOCIO
        if (user?.rol === 'Socio') return '/socio/dashboard'; 
        return '/login'; 
    };
    
    return (
        <Routes>
            {/* Redirige la ruta raíz (/) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/" element={isAuthenticated ? <Navigate to={getRedirectRoute()} replace /> : <HomePage />} />
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginModal />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* RUTAS PROTEGIDAS PARA EL STAFF (administrador/TRAINER) */}
            {/* Estas rutas usarán el requiredRole="administrador" */}
            <Route path="/DashboardAdmin" element={<ProtectedRoute requiredRole="administrador"><DashboardAdmin /></ProtectedRoute>} />
            <Route path="/GestionSocios" element={<ProtectedRoute requiredRole="administrador"><GestionSocios /></ProtectedRoute>} />
            <Route path="/Pagos" element={<ProtectedRoute requiredRole="administrador"><Pagos /></ProtectedRoute>} />
            <Route path="/Clases" element={<ProtectedRoute requiredRole="administrador"><Clases /></ProtectedRoute>} />
            <Route path="/Reportes" element={<ProtectedRoute requiredRole="administrador"><Reportes /></ProtectedRoute>} />
            <Route path="/Mantenimiento" element={<ProtectedRoute requiredRole="administrador"><Mantenimiento /></ProtectedRoute>} />
            <Route path="/Empleados" element={<ProtectedRoute requiredRole="administrador"><Empleados /></ProtectedRoute>} />
            
            {/* RUTAS PROTEGIDAS PARA EL SOCIO - Usamos path /socio/* */}
            <Route path="/socio/dashboard" element={<ProtectedRoute requiredRole="Socio"><DashboardSocio /></ProtectedRoute>} />
            <Route path="/socio/perfil" element={<ProtectedRoute requiredRole="Socio"><PerfilSocio /></ProtectedRoute>} />
            <Route path="/socio/clases" element={<ProtectedRoute requiredRole="Socio"><RegistroClases /></ProtectedRoute>} />
            <Route path="/socio/imc" element={<ProtectedRoute requiredRole="Socio"><CalculoIMC /></ProtectedRoute>} />
            <Route path="/socio/progreso" element={<ProtectedRoute requiredRole="Socio"><ProgresoRutinas /></ProtectedRoute>} />
            <Route path="/socio/manual" element={<ProtectedRoute requiredRole="Socio"><ManualMaquinas /></ProtectedRoute>} />


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