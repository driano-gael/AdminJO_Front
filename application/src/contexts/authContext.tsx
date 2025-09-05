'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService, logout as logoutService, refreshToken } from '@/lib/api/auth/authService';
import { setSessionExpiredCallback, isTokenValid } from '@/lib/api/core/tokenHelpers';
import SessionExpiredModal from '@/components/connexion/SessionExpiredModal';


interface User {
  email: string;
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
      } catch (error) {
        console.warn('Impossible de supprimer l\'email:', error);
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
            // Le token est valide, récupérer l'email pour l'utilisateur
            const storedEmail = localStorage.getItem('user_email');
            if (storedEmail) {
              setUser({ email: storedEmail });
            } else {
              // Token valide mais pas d'email sauvé, déconnexion
              logoutService();
            }
          } else {
            // Token invalide ou expiré, tenter de le rafraîchir
            try {
              // Tenter de rafraîchir le token
              await refreshToken();
              
              // Si le refresh réussit, récupérer l'email
              const storedEmail = localStorage.getItem('user_email');
              if (storedEmail) {
                setUser({ email: storedEmail });
              } else {
                logoutService();
              }
            } catch (error) {
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
        try {
            await loginService({ email, password });
            if(typeof window !== 'undefined' && window.localStorage){
                try{
                    localStorage.setItem('user_email', email);
                }catch{
                }
            }
            setUser({ email });
            if(currentRoute){
                setTimeout(() => {
                  const routeToRestore = currentRoute;
                  setCurrentRoute(null);
                  router.push(routeToRestore);
              }, 100);
            }else{
                setTimeout(() => {
                    router.push('/dashboard');
                }, 100);
            }
        }catch (error) {
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