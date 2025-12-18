import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Vistas Públicas
import Home from './Home/Home'; 

// Vistas de Administración
import VistaGeneral from './admin/VistaGeneral';
import Reportes from './admin/Reportes';
import Pagos from './admin/Pagos';
import Asistencias from './admin/Asistencias';
import Empleados from './admin/Empleados';
import GestionSocios from './pages/GestionSocios';
import Casilleros from './admin/Casilleros';

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

                {/* RUTAS ADMIN*/}
                <Route path="/VistaGeneral" element={<ProtectedRoute requiredRole="administrador"><VistaGeneral /></ProtectedRoute>} />
                <Route path="/Reportes" element={<ProtectedRoute requiredRole="administrador"><Reportes /></ProtectedRoute>} />
                <Route path="/Pagos" element={<ProtectedRoute requiredRole="administrador"><Pagos /></ProtectedRoute>} />
                <Route path="/Asistencias" element={<ProtectedRoute requiredRole="administrador"><Asistencias /></ProtectedRoute>} />
                <Route path="/Empleados" element={<ProtectedRoute requiredRole="administrador"><Empleados /></ProtectedRoute>} />
                <Route path="/GestionSocios" element={<ProtectedRoute requiredRole="administrador"><GestionSocios /></ProtectedRoute>} />

                {/* RUTAS STAFF*/}
                <Route path="/staff/VistaGeneral" element={<ProtectedRoute requiredRole="staff"><VistaGeneral /></ProtectedRoute>} />
                <Route path="/staff/Pagos" element={<ProtectedRoute requiredRole="staff"><Pagos /></ProtectedRoute>} />
                <Route path="/staff/Asistencias" element={<ProtectedRoute requiredRole="staff"><Asistencias /></ProtectedRoute>} />
                <Route path="/staff/GestionSocios" element={<ProtectedRoute requiredRole="staff"><GestionSocios /></ProtectedRoute>} />
                <Route path="/staff/Casilleros" element={<ProtectedRoute requiredRole="staff"><Casilleros /></ProtectedRoute>} />
            </Route>

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