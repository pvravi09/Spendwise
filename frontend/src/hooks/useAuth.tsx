import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, authApi, LoginCredentials, RegisterData, ApiError } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user data
      // This would typically involve a backend call
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const { data } = await authApi.login(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Login failed:', apiError);
      setError(apiError.message || 'Login failed. Please try again.');
      throw apiError;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await authApi.register(data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Registration failed:', apiError);
      setError(apiError.message || 'Registration failed. Please try again.');
      throw apiError;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth; 