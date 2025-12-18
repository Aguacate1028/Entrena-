import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from './Header';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const MainLayout = () => {
  const { isAuthenticated, user, logout, login, register } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Funciones intermedias para cerrar modales si la acción es exitosa
  const handleLogin = async (email, password) => {
      const result = await login(email, password);
      if (result.success) setShowLogin(false);
      return result;
  };

  const handleRegister = async (name, email, password, birthDate, role) => {
      const result = await register(name, email, password, birthDate, role);
      if (result.success) setShowRegister(false);
      return result;
  };

  // Obtener datos seguros del usuario
  const userName = user?.nombre?.split(' ')[0] || 'Usuario';
  const userRole = user?.rol;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Pasamos las funciones de control al Header */}
      <Header 
        isLoggedIn={isAuthenticated}
        userName={userName}
        userRole={userRole}
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogout={logout}
      />

      {/* Aquí se renderizan las páginas (Home, Dashboard, etc.) */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Los modales viven aquí, disponibles en toda la app */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onRegister={handleRegister}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
    </div>
  );
};

export default MainLayout;