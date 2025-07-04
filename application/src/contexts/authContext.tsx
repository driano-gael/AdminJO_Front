'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, logout as logoutService } from '@/lib/api/auth/authService';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const token = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
          
          if (token) {
            const storedEmail = localStorage.getItem('user_email');
            if (storedEmail) {
              setUser({ email: storedEmail });
            }
          }
        } catch (error) {
          // Si localStorage n'est pas disponible ou lève une erreur, on ignore
          console.warn('localStorage non disponible:', error);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginService({ email, password });
      
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('user_email', email);
        } catch (error) {
          console.warn('Impossible de sauvegarder l\'email:', error);
        }
      }
      setUser({ email });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('user_email');
      } catch (error) {
        console.warn('Impossible de supprimer l\'email:', error);
      }
    }
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}