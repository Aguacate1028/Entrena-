import React, { createContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Al cargar la página, revisamos si ya había una sesión guardada
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    // Función LOGIN
    const login = async (email, password) => {
        const res = await loginRequest({ email, password });
        if (res.success) {
            setUser(res.user);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(res.user));
        }
        return res; // Retornamos la respuesta para mostrar errores en el modal si falla
    };

    // Función SIGNUP (Registro)
    const signup = async (datosUsuario) => {
        const res = await registerRequest(datosUsuario);
        if (res.success) {
            setUser(res.user);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(res.user));
        }
        return res;
    };

    // Función LOGOUT
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};