import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bakery_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('bakery_user');
      const savedToken = localStorage.getItem('bakery_token');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify session validity with backend
          const freshUser = await api.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('bakery_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Session expired or invalid, logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, expectedRole) => {
    const data = await api.login(email, password, expectedRole);
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      address: data.address,
    };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem('bakery_token', data.token);
    localStorage.setItem('bakery_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password, phone) => {
    const data = await api.register(name, email, password, phone);
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem('bakery_token', data.token);
    localStorage.setItem('bakery_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bakery_token');
    localStorage.removeItem('bakery_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
