import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Clases from './components/Clases';
import Membresias from './components/Membresias';
import Informacion from './components/Informacion';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Anuncios from './pages/Anuncios';
import UpdatePassword from './pages/UpdatePassword';
import { ToastProvider } from './context/ToastContext'; 
import Perfil from './pages/Perfil';
import Progreso from './pages/Progreso';
import Guia from './pages/Guia';
import Comunidad from './pages/Comunidad';
import Reportes from './pages/Reportes';
import Reservaciones from './pages/Reservaciones';
import StaffDashboard from './components/StaffDashboard';
import StaffScanner from './components/StaffScanner';
import StaffSocios from './components/StaffSocios';
import StaffLockers from './components/StaffLockers';
import StaffPagos from './components/StaffPagos';
import StaffReportes from './components/StaffReportes';
<<<<<<< HEAD
import Finanzas from './pages/Finanzas';
=======
import AdminDashboard from './pages/AdminDashboard';
import AdminEntrenadores from './pages/AdminEntrenadores';
import AdminReportes from './pages/AdminReportes';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminMembresias from './pages/AdminMembresias';
import AdminInventario from './pages/AdminInventario';

>>>>>>> a5db22499e1ebdea3f2428b7dd484c7f8cba2ff7

const AppContent = () => {
  // 1. Aquí traemos la información real del usuario desde tu AuthContext
  const { user, isAuthenticated, logout, signup } = useContext(AuthContext);
  const userRole = user?.rol;
  
  // 2. ESTADOS PARA LOS MODALES 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Funciones para manejar el cierre/apertura
  const openLogin = () => { setIsLoginOpen(true); setIsRegisterOpen(false); };
  const openRegister = () => { setIsRegisterOpen(true); setIsLoginOpen(false); };
  const closeAll = () => { setIsLoginOpen(false); setIsRegisterOpen(false); };

  const StaffRoute = ({ children }) => {
      const isStaffOrAdmin = isAuthenticated && (userRole === 'staff' || userRole === 'administrador');
      return isStaffOrAdmin ? children : <Navigate to="/" />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 3. Pasamos las funciones AL HEADER para que los botones funcionen */}
      <Header 
        key={user?.id_usuario || 'publico'}
        isLoggedIn={isAuthenticated}
        user={user}
        userName={user?.nombre || ''}
        userRole={user?.rol || 'cliente'} // Por defecto cliente si no hay rol
        onLogout={logout}
        onLoginClick={openLogin}       // Conecta el clic con la función de abrir
        onRegisterClick={openRegister} // Conecta el clic con la función de abrir
      />

      {/* RUTAS DE NAVEGACIÓN */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Home user={user} />
              <Anuncios /> 
            </>
          } />
          <Route path="/clases" element={<Clases 
          isLoggedIn={isAuthenticated} 
          onOpenLogin={openLogin}/>} />
          <Route path="/membresias" element={<Membresias />} />
          <Route path="/informacion" element={<Informacion />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          <Route path="/perfil" element={<Perfil/>} />
          <Route path="/progreso" element={<Progreso/>}/>
          <Route path="/guia" element={<Guia/>}/>
          <Route path="/reservaciones" element={<Reservaciones/>}/>
          <Route path="/comunidad" element={<Comunidad/>}/>
          <Route path="/reportes" element={<Reportes/>}/>

          <Route path="/staffdashboard" element={
            <StaffRoute><StaffDashboard /></StaffRoute>
          } />

          {/* 2. Escáner de QR */}
          <Route path="/staffscanner" element={
            <StaffRoute><StaffScanner /></StaffRoute>
          } />

          {/* 3. Lista de Socios */}
          <Route path="/staffsocios" element={
             <StaffRoute><StaffSocios /></StaffRoute>
          } />

          {/* 4. Casilleros */}
          <Route path="/stafflockers" element={
             <StaffRoute><StaffLockers /></StaffRoute>
          } />

           {/* Dashboard de Admin (Si es diferente al de staff) */}
           <Route path="/finanzas" element={<Finanzas />} />
           <Route path="/dashboard" element={
             <StaffRoute><StaffDashboard /></StaffRoute>
          } />
          <Route 
            path="/staffpagos" 
            element={
              isAuthenticated && (userRole === 'staff') 
              ? <StaffPagos /> 
              : <Navigate to="/" />
            } 
          />
          <Route path="/staffreportes" element={
              <StaffRoute><StaffReportes /></StaffRoute>
          } />

          <Route path="/admindashboard" element={
              <StaffRoute><AdminDashboard /></StaffRoute>
          } />
          <Route path="/adminentrenadores" element={
              <StaffRoute><AdminEntrenadores /></StaffRoute>
          } />
          <Route path="/adminreportes" element={
              <StaffRoute><AdminReportes /></StaffRoute>
          } />
          <Route path="/adminmembresias" element={
              <StaffRoute><AdminMembresias /></StaffRoute>
          } />
          <Route path="/adminusuarios" element={
              <StaffRoute><AdminUsuarios /></StaffRoute>
          } />
          <Route path="/admininventario" element={<StaffRoute><AdminInventario /></StaffRoute>} />

        </Routes>
      </main>

      <Footer />

      {/* 4. RENDERIZADO DE MODALES (Aparecen encima de todo si el estado es true) */}
      {isLoginOpen && (
        <LoginModal 
          onClose={closeAll} 
          onSwitchToRegister={openRegister} 
        />
      )}
      
      {isRegisterOpen && (
        <RegisterModal 
          onClose={closeAll} 
          onRegister={signup} // Conectamos con la función de registro del context
          onSwitchToLogin={openLogin}
        />
      )}
      
    </div>
  );
};

// Componente Principal
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;