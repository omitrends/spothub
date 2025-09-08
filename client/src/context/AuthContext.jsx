// server/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify'; // ✅ Add this

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          logout();
        } else {
          setAuthToken(storedToken);
          setUser(storedUser ? JSON.parse(storedUser) : null);
        }
      } catch (e) {
        console.error('Invalid token or user format:', e);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
    toast.success(`Welcome, ${userData.name || 'User'}! 🎉`);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider value={{ user, authToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);                          
};
