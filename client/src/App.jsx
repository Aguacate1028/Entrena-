import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import HomePage from './pages/Home';
import LoginModal from './components/LoginModal';
// Vistas de Administración
import DashboardAdmin from "./components/admin/DashboardAdmin";
import AdminSidebar from './components/AdminSidebar';
import GestionSocios from './pages/GestionSocios';

// Vistas de Socios
import DashboardSocio from './pages/DashboardSocio';
import PerfilSocio from './pages/PerfilSocio'; 
import RegistroClases from './pages/RegistroClases'; 
import CalculoIMC from './pages/CalculoIMC';
import ProgresoRutinas from './pages/ProgresoRutinas'; 
import ManualMaquinas from './pages/ManualMaquinas'; 
import Comunidad from './pages/Comunidad';


const NotFound = () => <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white"><h1 className="text-3xl font-bold">404 | Página no encontrada</h1></div>;
const Unauthorized = () => <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white"><h1 className="text-3xl font-bold text-red-500">403 | Acceso Denegado</h1></div>;


// Mocks para otras vistas de administrador que usan el sidebar (usando AdminSidebar) (esto lo quitamos cuando ya tengamos back)
const Pagos = () => <div className="flex min-h-screen bg-dark-bg"><AdminSidebar /><main className="flex-1 p-8 text-white">Gestión de Pagos (En Desarrollo)</main></div>;
const Clases = () => <div className="flex min-h-screen bg-dark-bg"><AdminSidebar /><main className="flex-1 p-8 text-white">Gestión de Clases (En Desarrollo)</main></div>;
const Reportes = () => <div className="flex min-h-screen bg-dark-bg"><AdminSidebar /><main className="flex-1 p-8 text-white">Reportes (En Desarrollo - Ganancias, Clientes, etc.)</main></div>;
const Mantenimiento = () => <div className="flex min-h-screen bg-dark-bg"><AdminSidebar /><main className="flex-1 p-8 text-white">Mantenimiento (En Desarrollo)</main></div>;
const Empleados = () => <div className="flex min-h-screen bg-dark-bg"><AdminSidebar /><main className="flex-1 p-8 text-white">Gestión de Empleados (En Desarrollo)</main></div>;


const AppContent = () => {
    return (
        <Routes>
            {/* Rutas Públicas y de Socio envueltas en el MainLayout (tienen Header) */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                
                {/* RUTAS SOCIO */}
                <Route path="/socio/dashboard" element={<ProtectedRoute requiredRole="socio"><DashboardSocio /></ProtectedRoute>} />
                <Route path="/socio/perfil" element={<ProtectedRoute requiredRole="socio"><PerfilSocio /></ProtectedRoute>} />
                <Route path="/socio/clases" element={<ProtectedRoute requiredRole="socio"><RegistroClases /></ProtectedRoute>} />
                <Route path="/socio/imc" element={<ProtectedRoute requiredRole="socio"><CalculoIMC /></ProtectedRoute>} />
                <Route path="/socio/progreso" element={<ProtectedRoute requiredRole="socio"><ProgresoRutinas /></ProtectedRoute>} />
                <Route path="/socio/manual" element={<ProtectedRoute requiredRole="socio"><ManualMaquinas /></ProtectedRoute>} />
                <Route path="/socio/comunidad" element={<ProtectedRoute requiredRole="socio"><Comunidad /></ProtectedRoute>} />
            </Route>

            {/* Rutas Admin (Normalmente tienen su propio Layout/Sidebar, así que las dejamos fuera de MainLayout si DashboardAdmin ya tiene sidebar) */}
            <Route path="/DashboardAdmin" element={<ProtectedRoute requiredRole="administrador"><DashboardAdmin /></ProtectedRoute>} />
            <Route path="/GestionSocios" element={<ProtectedRoute requiredRole="administrador"><GestionSocios /></ProtectedRoute>} />
            <Route path="/Pagos" element={<ProtectedRoute requiredRole="administrador"><Pagos /></ProtectedRoute>} />

            {/* Rutas Auxiliares */}
            <Route path="/login" element={<LoginModal onClose={() => window.location.href='/'}/>} />
            <Route path="/unauthorized" element={<Unauthorized />} />
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