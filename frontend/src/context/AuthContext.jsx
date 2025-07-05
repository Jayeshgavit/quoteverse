import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios'; // Adjust path if needed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User object (decoded from token)
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Decode the token directly (client-side, fast)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload); // includes email, role, userId, etc.
      } catch (err) {
        console.error('Failed to decode token:', err);
        logout();
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
