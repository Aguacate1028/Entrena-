// src/pages/HomePage.jsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Rutas Corregidas: Todos los componentes están en '../components/'
import Header from '../components/Header';
import HeroSection from '../pages/HeroSection'; // Ajustado
import StatsSection from '../components/StatsSection'; // Ajustado
import LoginModal from '../components/LoginModal'; 
import RegisterModal from '../components/RegisterModal'; 

// Mocks de secciones (asumiendo que están definidos aquí)
const ClassesSection = () => <div className="p-16 text-center bg-neutral-50 text-neutral-700">Sección de Clases (En Desarrollo)</div>;
const MembershipSection = () => <div className="p-16 text-center bg-white text-neutral-700">Sección de Membresías (En Desarrollo)</div>;


const HomePage = () => {
    const { user, logout, isAuthenticated } = useContext(AuthContext); 
    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = async (email, password) => {
        await login(email, password); 
    };

    const handleRegister = (name, email, password) => {
        // SIMULACIÓN DE REGISTRO
        // Llama a la simulación de login después del "registro"
        login(email, password); 
    };
    
    const handleLoginClick = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleRegisterClick = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/'); 
    }

    const userName = user?.nombre.split(' ')[0] || '';
    const isAdmin = user?.rol === 'administrador' || user?.rol === 'Trainer';


    return (
        <div className="min-h-screen bg-neutral-50">
            
            <Header 
                isLoggedIn={isAuthenticated}
                userName={userName}
                isAdmin={isAdmin}
                onLoginClick={handleLoginClick} 
                onRegisterClick={handleRegisterClick}
                onLogout={handleLogout}
            />
            
            <main>
                <HeroSection 
                    isLoggedIn={isAuthenticated} 
                    userName={userName}
                    onRegisterClick={handleRegisterClick}
                />
                
                <StatsSection />
                
                <ClassesSection />
                <MembershipSection />
            </main>
            
            {/* Modales */}
            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onLogin={handleLogin}
                    onSwitchToRegister={handleRegisterClick}
                />
            )}

            {showRegister && (
                <RegisterModal
                    onClose={() => setShowRegister(false)}
                    onRegister={handleRegister}
                    onSwitchToLogin={handleLoginClick}
                />
            )}
        </div>
    );
};

export default HomePage;