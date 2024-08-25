import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem('userId');
    return storedUserId || null;
  });

  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('autoLogin');
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('userId', userId);
  }, [userId]);

  return (
    <AuthContext.Provider value={{ user, setUser, userId, setUserId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
