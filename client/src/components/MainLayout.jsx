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

  const handleLogin = async (email, password) => {
      const result = await login(email, password);
      if (result.success) setShowLogin(false);
  };

  const handleRegister = async (name, email, password, birthDate, role) => {
      const result = await register(name, email, password, birthDate, role);
      if (result.success) setShowRegister(false);
  };

  // Obtenemos el nombre y rol para pasar al Header
  const userName = user?.nombre?.split(' ')[0] || 'Usuario';
  const userRole = user?.rol;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header 
        isLoggedIn={isAuthenticated}
        userName={userName}
        userRole={userRole}
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogout={logout}
      />

      {/* Aquí se renderizarán todas las páginas (Home, Perfil, Comunidad, etc.) */}
      <main>
        <Outlet />
      </main>

      {/* Modales Globales */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin} // Asegúrate que tu LoginModal use esta prop o la del contexto internamente
          onSwitchToRegister={() => { setShowRegister(true); setShowLogin(false); }}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onRegister={handleRegister}
          onSwitchToLogin={() => { setShowLogin(true); setShowRegister(false); }}
        />
      )}
    </div>
  );
};

export default MainLayout;