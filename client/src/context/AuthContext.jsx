import React, { createContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);

    // Verificar si ya hay una sesión guardada al recargar la página
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    // Función de Registro
    const signup = async (userData) => {
        const res = await registerRequest(userData);
        if (res.success) {
            setUser(res.user);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(res.user)); // Guardar sesión
        } else {
            setErrors([res.error]);
        }
        return res; // Retornamos respuesta para manejar redirección en el componente
    };

    // Función de Login
    const signin = async (userCredentials) => {
        const res = await loginRequest(userCredentials);
        if (res.success) {
            setUser(res.user);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(res.user)); // Guardar sesión
            setErrors([]);
        } else {
            setErrors([res.error]);
        }
        return res;
    };

    // Función de Logout
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setErrors([]);
        localStorage.removeItem('user'); // Borrar sesión
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            errors,
            signup,
            signin,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};