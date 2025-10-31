import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/users/me');
      setUser(res.data.user);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      // Token is invalid
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { token: apiToken, user: apiUser } = res.data;

    setToken(apiToken);
    setUser(apiUser);
    localStorage.setItem('token', apiToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
    navigate('/dashboard');
  };

  const signup = async (formData) => {
    // Note: formData must be of type FormData for file uploads
    const res = await apiClient.post('/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data; // e.g., { success: true, message: '...' }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    fetchProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};