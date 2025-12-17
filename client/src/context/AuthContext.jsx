import React, { createContext, useReducer } from 'react';

// Estado inicial: Intenta recuperar la sesión del localStorage si existe
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, 
  token: localStorage.getItem('token') || null,
};

export const AuthContext = createContext(initialState);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // Guardamos la información real del usuario y el token devuelto por el servidor
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token || 'TOKEN_PROVISIONAL');
      return { 
        ...state, 
        user: action.payload.user, 
        token: action.payload.token || 'TOKEN_PROVISIONAL' 
      };
    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { ...state, user: null, token: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  /**
   * FUNCIÓN DE LOGIN REAL
   * Se conecta al backend de Node.js/Express
   */
  const login = async (email, password) => {
    try {
      // Petición al endpoint de login en tu servidor local
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // El servidor devuelve { user: { id, nombre, rol }, token }
        dispatch({ type: 'LOGIN_SUCCESS', payload: data });
        return { success: true, rol: data.user.rol };
      } else {
        // Devuelve el error específico del servidor (ej: "Contraseña incorrecta")
        return { success: false, error: data.error || 'Fallo en la autenticación' };
      }
    } catch (error) {
      console.error("Error en AuthContext:", error);
      return { success: false, error: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.' };
    }
  };

  /**
   * FUNCIÓN DE REGISTRO REAL
   * Conecta con el modal de registro y guarda en Postgres
   */
  const register = async (name, email, password, birthDate, role) => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: name,
          email: email,
          password: password,
          fecha_nacimiento: birthDate,
          rol: role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Tras un registro exitoso, iniciamos sesión automáticamente
        return await login(email, password);
      } else {
        return { success: false, error: data.error || 'Error al crear la cuenta' };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión con el servidor.' };
    }
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      token: state.token,
      isAuthenticated: !!state.user,
      login,
      register, // Ahora puedes usar register en tus modales
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};