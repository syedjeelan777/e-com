import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IUser } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const saved = localStorage.getItem('shaziyakart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('shaziyakart_token')
  );
  const [loading, setLoading] = useState<boolean>(true);

  const refetchUser = useCallback(async () => {
    if (!localStorage.getItem('shaziyakart_token')) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('shaziyakart_user', JSON.stringify(res.data));
      }
    } catch (error) {
      console.warn('Authentication check failed', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('shaziyakart_token');
      localStorage.removeItem('shaziyakart_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  const login = async (email: string, pass: string) => {
    const res = await authService.login({ email, password: pass });
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('shaziyakart_token', res.data.token);
      localStorage.setItem('shaziyakart_user', JSON.stringify(res.data.user));
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const register = async (data: any) => {
    const res = await authService.register(data);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('shaziyakart_token', res.data.token);
      localStorage.setItem('shaziyakart_user', JSON.stringify(res.data.user));
    } else {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const updateProfile = async (data: any) => {
    const res = await authService.updateProfile(data);
    if (res.success && res.data) {
      setUser(res.data);
      localStorage.setItem('shaziyakart_user', JSON.stringify(res.data));
    } else {
      throw new Error(res.message || 'Profile update failed');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('shaziyakart_token');
      localStorage.removeItem('shaziyakart_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateProfile,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
