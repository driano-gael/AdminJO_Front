'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService, logout as logoutService, refreshToken } from '@/lib/api/auth/authService';
import { setSessionExpiredCallback, isTokenValid } from '@/lib/api/core/tokenHelpers';
import SessionExpiredModal from '@/components/connexion/SessionExpiredModal';


interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void; 
  forceLogout: () => void; 
  currentRoute: string | null;
  saveCurrentRoute: (route: string) => void;
  getAndClearSavedRoute: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode; 
}

export function AuthProvider({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const forceLogout = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Session expirée, déconnexion forcée');
    }
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/login') {
        setCurrentRoute(currentPath);
        if (process.env.NODE_ENV === 'development') {
          console.log('📍 Route sauvegardée pour reconnexion:', currentPath);
        }
      }
    }
    logoutService();
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
      } catch (error) {
        console.warn('Impossible de supprimer les données utilisateur:', error);
      }
    }
    setUser(null);
    setShowSessionExpiredModal(true);
  };

  const handleSessionExpired = () => {
    setShowSessionExpiredModal(false);
    router.push('/');
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          // Vérifier si le token d'accès est valide (non expiré)
          const tokenValid = isTokenValid();
          
          if (tokenValid) {
            // Le token est valide, récupérer l'email et le rôle
            const storedEmail = localStorage.getItem('user_email');
            const storedRole = localStorage.getItem('user_role');
            if (storedEmail && storedRole) {
              // Vérifier que l'utilisateur stocké est bien admin
              if (storedRole === 'admin') {
                setUser({ email: storedEmail, role: storedRole });
              } else {
                // Utilisateur non-admin, déconnexion
                logoutService();
              }
            } else {
              // Données manquantes, déconnexion
              logoutService();
            }
          } else {
            // Token invalide ou expiré, tenter de le rafraîchir
            try {
              // Tenter de rafraîchir le token
              await refreshToken();
              
              // Si le refresh réussit, récupérer les données utilisateur
              const storedEmail = localStorage.getItem('user_email');
              const storedRole = localStorage.getItem('user_role');
              if (storedEmail && storedRole && storedRole === 'admin') {
                setUser({ email: storedEmail, role: storedRole });
              } else {
                logoutService();
              }
            } catch {
              // Refresh échoué, déconnexion
              logoutService();
            }
          }
        } catch (error) {
          console.warn('localStorage non disponible:', error);
          logoutService();
        }
      }
      setIsLoading(false);
    };

    // Écouter les événements de refresh de token pour synchroniser l'état
    const handleTokenRefreshed = () => {
      // Pas besoin de recharger l'utilisateur, juste confirmer que le token est valide
    };
    
    setSessionExpiredCallback(forceLogout);
    
    // Ajouter l'écouteur d'événements pour le refresh de token
    if (typeof window !== 'undefined') {
      window.addEventListener('tokenRefreshed', handleTokenRefreshed);
    }
    
    checkAuth();

    // Nettoyer l'écouteur d'événements
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
      }
    };
  }, []); 


    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
          const data = await loginService({ email, password });

          // L'API retourne maintenant le rôle et l'email directement
          const { role, email: userEmail } = data;

          // Vérifier que seuls les administrateurs peuvent se connecter
          if (role !== 'admin') {
            logoutService();
            setUser(null);
            throw new Error("Accès réservé aux administrateurs. Votre rôle actuel ne vous permet pas d'accéder à cette application.");
          }

          // Sauvegarder l'email pour la persistance de session
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              localStorage.setItem('user_email', userEmail);
              localStorage.setItem('user_role', role);
            } catch (error) {
              console.warn('Impossible de sauvegarder les données utilisateur:', error);
            }
          }

          setUser({ email: userEmail, role });
        } catch (error) {
          setUser(null);
          throw error;
        } finally {
          setIsLoading(false);
        }
    };


    const logout = () => {
      logoutService();
      
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_role');
        } catch (error) {
          console.warn('Impossible de supprimer les données utilisateur:', error);
        }
      }
      
      setUser(null);
      
      router.push('/');
    };

    const saveCurrentRoute = (route: string) => {
      setCurrentRoute(route);
    };


    const getAndClearSavedRoute = () => {
        const savedRoute = currentRoute;
        setCurrentRoute(null);
        return savedRoute;
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        forceLogout,
        currentRoute,
        saveCurrentRoute,
        getAndClearSavedRoute,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <SessionExpiredModal
                isOpen={showSessionExpiredModal}
                onClose={() => setShowSessionExpiredModal(false)}
                onReconnect={handleSessionExpired}
            />
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