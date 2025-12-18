import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Vistas Públicas
import HomePage from './pages/Home';

// Vistas de Administración
import DashboardAdmin from "./components/admin/DashboardAdmin";
import GestionSocios from './pages/GestionSocios';
const Pagos = () => <div className="p-20 text-center"><h1>Gestión de Pagos</h1></div>; // Placeholder

// Vistas de Socios
import DashboardSocio from './pages/DashboardSocio';
import PerfilSocio from './pages/PerfilSocio'; 
import RegistroClases from './pages/RegistroClases'; 
import CalculoIMC from './pages/CalculoIMC';
import ProgresoRutinas from './pages/ProgresoRutinas'; 
import ManualMaquinas from './pages/ManualMaquinas'; 
import Comunidad from './pages/Comunidad';

const NotFound = () => <div className="min-h-screen flex items-center justify-center"><h1>404 | Página no encontrada</h1></div>;
const Unauthorized = () => <div className="min-h-screen flex items-center justify-center text-red-500"><h1>403 | Acceso Denegado</h1></div>;

const AppContent = () => {
    return (
        <Routes>
            {/* Todas las rutas usan MainLayout para tener el Header */}
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

                {/* RUTAS ADMIN - Ahora accesibles desde el Header */}
                <Route path="/DashboardAdmin" element={<ProtectedRoute requiredRole="administrador"><DashboardAdmin /></ProtectedRoute>} />
                <Route path="/GestionSocios" element={<ProtectedRoute requiredRole="administrador"><GestionSocios /></ProtectedRoute>} />
                <Route path="/Pagos" element={<ProtectedRoute requiredRole="administrador"><Pagos /></ProtectedRoute>} />
            </Route>

            {/* Rutas de error */}
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