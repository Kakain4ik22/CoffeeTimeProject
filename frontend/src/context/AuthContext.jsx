// context/AuthContext.jsx - упрощенная версия
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем токен при загрузке
    const token = localStorage.getItem('access_token');
    const storedUser = authService.getCurrentUser();
    
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error in context:', error);
      let errorMessage = 'Ошибка входа';
      
      if (error.response?.status === 401) {
        errorMessage = 'Неверные имя пользователя или пароль';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await authService.register(userData);
      // После регистрации автоматически логинимся
      return await login(userData.username, userData.password);
    } catch (error) {
      console.error('Register error:', error);
      let errorMessage = 'Ошибка регистрации';
      
      if (error.response?.data) {
        // Обрабатываем ошибки валидации Django
        const errors = error.response.data;
        if (typeof errors === 'object') {
          errorMessage = Object.values(errors).flat().join(', ');
        } else {
          errorMessage = errors;
        }
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};