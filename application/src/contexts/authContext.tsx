'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, logout as logoutService } from '@/lib/api/authService';

interface User {
  email: string;
  // Ajoutez d'autres propriétés utilisateur selon votre API Django
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
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
        
        if (token) {
          // Ici vous pourriez faire un appel API pour récupérer les infos utilisateur
          // Pour l'instant, on simule avec l'email stocké
          const storedEmail = localStorage.getItem('user_email');
          if (storedEmail) {
            setUser({ email: storedEmail });
          }
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginService({ email, password });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_email', email);
      }
      setUser({ email });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_email');
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