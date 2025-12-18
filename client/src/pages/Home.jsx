// src/pages/Home.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import HeroSection from '../pages/HeroSection'; 
import StatsSection from '../components/StatsSection'; 
import LoginModal from '../components/LoginModal'; 
import RegisterModal from '../components/RegisterModal'; 
import ClassesSection from '../components/ClassesSection'; 
import MembershipSection from '../components/MembershipSection';
import FooterSection from '../components/FooterSection';
import DashboardAdmin from '../components/admin/DashboardAdmin';

const HomePage = () => {
    const { user, logout, isAuthenticated, register, login } = useContext(AuthContext); 
    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    
    // ESTADO PARA CONTROLAR QUÉ SECCIÓN SE VE Y EL COLOR DEL HEADER
    const [currentView, setCurrentView] = useState('home');

    const handleLogin = async (email, password) => {
        const result = await login(email, password); 
        if (result.success) setShowLogin(false);
    };

    const handleRegister = async (name, email, password, birthDate, role) => {
        const result = await register(name, email, password, birthDate, role);
        if (result.success) setShowRegister(false);
    };

    const userName = user?.nombre.split(' ')[0] || '';
    
    // Definimos isAdmin basado en el rol de la BD
    const isAdmin = user?.rol === 'administrador' || user?.rol === 'staff';

    return (
        <div className="min-h-screen bg-neutral-50">
            <Header 
                isLoggedIn={isAuthenticated}
                userName={userName}
                userRole={user?.rol} // Pasamos el rol exacto para el botón Admin
                currentView={currentView}
                onLoginClick={() => setShowLogin(true)} 
                onRegisterClick={() => setShowRegister(true)}
                onLogout={() => { logout(); setCurrentView('home'); }}
                onViewChange={(view) => setCurrentView(view)}
            />
            
            <main>
                {/* RENDERIZADO CONDICIONAL DE SECCIONES */}
                {currentView === 'home' && (
                    <>
                        <HeroSection 
                            isLoggedIn={isAuthenticated} 
                            userName={userName}
                            onRegisterClick={() => setShowRegister(true)}
                        />
                        <StatsSection />
                        <ClassesSection />
                        <MembershipSection />
                        <FooterSection />
                    </>
                )}
                {currentView === 'admin' && <DashboardAdmin />}

                {currentView === 'social' && (
                    <div className="p-20 text-center text-neutral-500">
                        {/* Aquí va tu componente de Comunidad */}
                        <h2 className="text-2xl font-bold">Sección Comunidad</h2>
                    </div>
                )}

                {currentView === 'progress' && (
                    <div className="p-20 text-center text-neutral-500">
                         {/* Aquí va tu componente de Mi Progreso */}
                        <h2 className="text-2xl font-bold">Mi Progreso</h2>
                    </div>
                )}
            </main>
            
            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onLogin={handleLogin}
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

export default HomePage;