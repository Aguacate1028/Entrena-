// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    console.warn(`ACCESO DENEGADO: Rol requerido: ${requiredRole}, Rol actual: ${user?.rol}`);
    return <Navigate to="/unauthorized" replace />; 
  }

  return children;
};

export default ProtectedRoute;