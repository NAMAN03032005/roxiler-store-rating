import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  // Sync session profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            const normalizedRole =
              res.data.role === 'ADMIN'
                ? 'admin'
                : res.data.role === 'STORE_OWNER'
                ? 'owner'
                : 'user';
            const userObj = { ...res.data, role: normalizedRole };
            setCurrentUser(userObj);
            localStorage.setItem('user', JSON.stringify(userObj));
          }
        } catch (err) {
          console.warn('[AuthContext] Token verification failed, clearing session.');
          logout();
        }
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res.success && res.data) {
        const { token: authToken, role, ...userData } = res.data;
        const normalizedRole =
          role === 'ADMIN'
            ? 'admin'
            : role === 'STORE_OWNER'
            ? 'owner'
            : 'user';
        const userObj = { ...userData, role: normalizedRole };

        setToken(authToken);
        setCurrentUser(userObj);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userObj));
        return userObj;
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.signup(userData);
      if (res.success && res.data) {
        const { token: authToken, role, ...userObj } = res.data;
        const normalizedRole =
          role === 'ADMIN'
            ? 'admin'
            : role === 'STORE_OWNER'
            ? 'owner'
            : 'user';
        const fullUserObj = { ...userObj, role: normalizedRole };

        setToken(authToken);
        setCurrentUser(fullUserObj);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(fullUserObj));
        return fullUserObj;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Helper function for developer preview mode (if dev banner is toggled)
  const switchRole = (newRole) => {
    const mockProfiles = {
      admin: { name: 'Christopher David Sterling', email: 'admin.sterling@roxiler.com', role: 'admin' },
      user: { name: 'Alexander Montgomery Harrison', email: 'alexander.harrison@example.com', role: 'user' },
      owner: { name: 'Beatrice Eleanor Vance', email: 'beatrice.vance@apexelectronics.com', role: 'owner' },
    };
    const profile = mockProfiles[newRole] || null;
    setCurrentUser(profile);
    if (profile) {
      localStorage.setItem('user', JSON.stringify(profile));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        token,
        loading,
        login,
        signup,
        logout,
        switchRole,
        isAuthenticated: !!currentUser && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
