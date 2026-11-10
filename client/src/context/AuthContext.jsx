import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem('profile');
      return savedProfile ? JSON.parse(savedProfile) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync / Verify profile on app startup if token exists
  useEffect(() => {
    const fetchCurrentSession = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.data) {
            setUser(res.data.user);
            setProfile(res.data.profile);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            if (res.data.profile) {
              localStorage.setItem('profile', JSON.stringify(res.data.profile));
            }
          }
        } catch (err) {
          console.warn('[AuthContext] Session verification notice:', err.message);
          // Only clear session if explicitly 401 unauthorized
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchCurrentSession();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        const { token: receivedToken, user: receivedUser, profile: receivedProfile } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        setProfile(receivedProfile);

        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(receivedUser));
        if (receivedProfile) {
          localStorage.setItem('profile', JSON.stringify(receivedProfile));
        }

        return { success: true, user: receivedUser };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.success && res.data) {
        const { token: receivedToken, user: receivedUser, profile: receivedProfile } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        setProfile(receivedProfile);

        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(receivedUser));
        if (receivedProfile) {
          localStorage.setItem('profile', JSON.stringify(receivedProfile));
        }

        return { success: true, user: receivedUser };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(msg);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
  };

  const updateUserProfile = (updatedUser, updatedProfile) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    if (updatedProfile) {
      setProfile(updatedProfile);
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
    }
  };

  const value = {
    user,
    profile,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

