import React, { createContext, useContext, useState, useEffect } from 'react';
import { fakeLogin } from './authMock';

// TODO: Preparado para JWT no futuro. O estado armazenaria 'user' e 'token'.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao iniciar o app, verifica se há sessão ativa (mesmo sendo mock, ajuda no dev flow)
    const storedUser = localStorage.getItem('@TuSocio:user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await fakeLogin(email, password);
      // TODO: Usar cookie httpOnly ou localStorage apenas para tokens não-sensíveis no futuro.
      localStorage.setItem('@TuSocio:user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('@TuSocio:user');
    setUser(null);
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
