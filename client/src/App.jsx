import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

const AppContent = () => {
  // 1. Aquí traemos la información real del usuario desde tu AuthContext
  const { user, isAuthenticated, logout, signup } = useContext(AuthContext);
  
  // 2. ESTADOS PARA LOS MODALES 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Funciones para manejar el cierre/apertura
  const openLogin = () => { setIsLoginOpen(true); setIsRegisterOpen(false); };
  const openRegister = () => { setIsRegisterOpen(true); setIsLoginOpen(false); };
  const closeAll = () => { setIsLoginOpen(false); setIsRegisterOpen(false); };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 3. Pasamos las funciones AL HEADER para que los botones funcionen */}
      <Header 
        isLoggedIn={isAuthenticated}
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
          <Route path="/clases" element={<Clases />} />
          <Route path="/membresias" element={<Membresias />} />
          <Route path="/informacion" element={<Informacion />} />
          
          {/* Aquí puedes agregar tus rutas privadas de socio/admin más adelante */}
          {/* <Route path="/socio/clases" element={<ClasesSocio />} /> */}
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
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;