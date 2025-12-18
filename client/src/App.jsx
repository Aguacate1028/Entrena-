import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Vistas Públicas
import Home from './Home/Home'; // Actualizado según estructura src/Home/Home.jsx

// Vistas de Administración (Componentes Modulares)
import DashboardAdmin from "./Home/DashboardAdmin"; // Centralizador de administración
import GestionSocios from './pages/GestionSocios';

// Vistas de Socios
import DashboardSocio from './pages/DashboardSocio';
import PerfilSocio from './pages/PerfilSocio'; 
import RegistroClases from './pages/RegistroClases'; 
import CalculoIMC from './pages/CalculoIMC';
import ProgresoRutinas from './pages/ProgresoRutinas'; 
import ManualMaquinas from './pages/ManualMaquinas'; 
import Comunidad from './pages/Comunidad';

const NotFound = () => <div className="min-h-screen flex items-center justify-center font-bold text-2xl">404 | Página no encontrada</div>;
const Unauthorized = () => <div className="min-h-screen flex items-center justify-center text-red-500 font-bold text-2xl">403 | Acceso Denegado</div>;

const AppContent = () => {
    return (
        <Routes>
            {/* Todas las rutas usan MainLayout para el Header con indicador animado */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                
                {/* RUTAS SOCIO */}
                <Route path="/socio/dashboard" element={<ProtectedRoute requiredRole="socio"><DashboardSocio /></ProtectedRoute>} />
                <Route path="/socio/perfil" element={<ProtectedRoute requiredRole="socio"><PerfilSocio /></ProtectedRoute>} />
                <Route path="/socio/clases" element={<ProtectedRoute requiredRole="socio"><RegistroClases /></ProtectedRoute>} />
                <Route path="/socio/imc" element={<ProtectedRoute requiredRole="socio"><CalculoIMC /></ProtectedRoute>} />
                <Route path="/socio/progreso" element={<ProtectedRoute requiredRole="socio"><ProgresoRutinas /></ProtectedRoute>} />
                <Route path="/socio/manual" element={<ProtectedRoute requiredRole="socio"><ManualMaquinas /></ProtectedRoute>} />
                <Route path="/socio/comunidad" element={<ProtectedRoute requiredRole="socio"><Comunidad /></ProtectedRoute>} />

                {/* RUTAS ADMIN - Centralizadas en DashboardAdmin con tabs animadas */}
                <Route path="/DashboardAdmin" element={
                    <ProtectedRoute requiredRole="administrador">
                        <DashboardAdmin />
                    </ProtectedRoute>
                } />
                <Route path="/GestionSocios" element={
                    <ProtectedRoute requiredRole="administrador">
                        <GestionSocios />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Rutas de estado */}
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