import React, { createContext, useReducer } from 'react';
import { MOCK_USER_administrador, MOCK_USER_SOCIO } from '../mocks/mockData';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, 
  token: localStorage.getItem('token') || null,
};

export const AuthContext = createContext(initialState);
const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'SET_USER': 
      localStorage.setItem('user', JSON.stringify(action.payload.user || action.payload));
      localStorage.setItem('token', action.payload.token || 'MOCK_TOKEN');
      return { ...state, user: action.payload.user || action.payload, token: action.payload.token || 'MOCK_TOKEN' };
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

  // SIMULACIÓN DE LOGIN SIN API
  const login = async (email, password) => {
    // Simula una pequeña latencia de red
    await new Promise(resolve => setTimeout(resolve, 500)); 

    // Verifica credenciales de mock
    if (email === MOCK_USER_administrador.email && password === 'administrador') {
        dispatch({ type: 'SET_USER', payload: MOCK_USER_administrador });
        return { success: true, rol: 'administrador' };
    }
    if (email === MOCK_USER_SOCIO.email && password === 'socio') {
        dispatch({ type: 'SET_USER', payload: MOCK_USER_SOCIO });
        return { success: true, rol: 'Socio' };
    }
    
    return { success: false, error: 'Credenciales de mock inválidas. Intente: administrador@entrena.com / administrador, o dylan@mail.com / socio' };
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      token: state.token,
      login,
      logout,
      isAuthenticated: !!state.user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};