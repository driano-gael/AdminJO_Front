'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, logout as logoutService } from '@/lib/api/auth/authService';
import { setSessionExpiredCallback } from '@/lib/api/core/tokenHelpers';
import SessionExpiredModal from '@/components/connexion/SessionExpiredModal';

/**
 * Interface représentant un utilisateur connecté
 */
interface User {
  email: string; // Email de l'utilisateur connecté
}

/**
 * Interface définissant les fonctions et états disponibles dans le contexte d'authentification
 */
interface AuthContextType {
  user: User | null;           // Utilisateur connecté ou null si non connecté
  isAuthenticated: boolean;    // Booléen indiquant si l'utilisateur est connecté
  isLoading: boolean;          // Booléen indiquant si l'authentification est en cours de vérification
  login: (email: string, password: string) => Promise<void>; // Fonction de connexion
  logout: () => void;          // Fonction de déconnexion manuelle
  forceLogout: () => void;     // Fonction de déconnexion forcée (quand session expire)
}

/**
 * Context React pour l'authentification
 * Undefined par défaut pour détecter les erreurs d'utilisation
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props pour le composant AuthProvider
 */
interface AuthProviderProps {
  children: ReactNode; // Composants enfants qui auront accès au contexte
}

/**
 * Composant Provider pour l'authentification
 * 
 * Ce composant :
 * - Gère l'état d'authentification global de l'application
 * - Vérifie automatiquement si l'utilisateur est connecté au chargement
 * - Fournit les fonctions de connexion/déconnexion
 * - Gère l'expiration de session avec un modal automatique
 * - Sauvegarde l'état d'authentification dans le localStorage
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Le provider d'authentification
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // État de l'utilisateur connecté (null si non connecté)
  const [user, setUser] = useState<User | null>(null);
  
  // État de chargement pour éviter les rendus prématurés
  const [isLoading, setIsLoading] = useState(true);
  
  // État pour contrôler l'affichage du modal d'expiration de session
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  // Calculer si l'utilisateur est authentifié
  const isAuthenticated = !!user;

  /**
   * Fonction de déconnexion forcée utilisée quand la session expire
   * 
   * Cette fonction :
   * - Nettoie les tokens d'authentification
   * - Supprime les informations utilisateur du localStorage
   * - Réinitialise l'état utilisateur
   * - Affiche le modal d'expiration de session
   */
  const forceLogout = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Session expirée, déconnexion forcée');
    }
    
    // Nettoyer les tokens côté serveur
    logoutService();
    
    // Nettoyer les informations utilisateur du localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('user_email');
      } catch (error) {
        console.warn('Impossible de supprimer l\'email:', error);
      }
    }
    
    // Réinitialiser l'état utilisateur
    setUser(null);
    
    // Afficher le modal d'expiration de session
    setShowSessionExpiredModal(true);
  };

  /**
   * Fonction appelée quand l'utilisateur doit se reconnecter
   * (depuis le modal d'expiration de session)
   */
  const handleSessionExpired = () => {
    // Fermer le modal
    setShowSessionExpiredModal(false);
    
    // Rediriger vers la page de connexion
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  /**
   * Effet pour vérifier l'authentification au chargement de l'application
   * et configurer le callback d'expiration de session
   */
  useEffect(() => {
    /**
     * Fonction pour vérifier si l'utilisateur est connecté
     * en regardant les tokens dans le localStorage
     */
    const checkAuth = () => {
      // Vérifier si nous sommes côté client (localStorage disponible)
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          // Récupérer le token d'authentification
          const token = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
          
          // Si un token existe, récupérer l'email utilisateur
          if (token) {
            const storedEmail = localStorage.getItem('user_email');
            if (storedEmail) {
              // Restaurer l'état utilisateur depuis le localStorage
              setUser({ email: storedEmail });
            }
          }
        } catch (error) {
          // Si localStorage n'est pas disponible ou lève une erreur, on ignore
          console.warn('localStorage non disponible:', error);
        }
      }
      
      // Marquer la vérification d'authentification comme terminée
      setIsLoading(false);
    };

    // Configurer le callback pour l'expiration de session
    // Ce callback sera appelé par le système d'authentification quand la session expire
    setSessionExpiredCallback(forceLogout);

    // Effectuer la vérification d'authentification
    checkAuth();
  }, []); // Effet exécuté une seule fois au montage du composant

  /**
   * Fonction de connexion
   * 
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   * @throws Error - Si la connexion échoue
   */
  const login = async (email: string, password: string) => {
    try {
      // Appeler le service de connexion qui gère l'API
      await loginService({ email, password });
      
      // Sauvegarder l'email dans le localStorage pour la persistance
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('user_email', email);
        } catch (error) {
          console.warn('Impossible de sauvegarder l\'email:', error);
        }
      }
      
      // Mettre à jour l'état utilisateur
      setUser({ email });
    } catch (error) {
      // Propager l'erreur pour que le composant appelant puisse la gérer
      throw error;
    }
  };

  /**
   * Fonction de déconnexion manuelle
   * (utilisée quand l'utilisateur clique sur "Se déconnecter")
   */
  const logout = () => {
    // Nettoyer les tokens côté serveur
    logoutService();
    
    // Nettoyer les informations utilisateur du localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('user_email');
      } catch (error) {
        console.warn('Impossible de supprimer l\'email:', error);
      }
    }
    
    // Réinitialiser l'état utilisateur
    setUser(null);
  };

  // Créer l'objet de valeur du contexte
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    forceLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Rendre les composants enfants avec accès au contexte */}
      {children}
      
      {/* Modal d'expiration de session affiché conditionnellement */}
      <SessionExpiredModal
        isOpen={showSessionExpiredModal}
        onClose={() => setShowSessionExpiredModal(false)}
        onReconnect={handleSessionExpired}
      />
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * 
 * Ce hook :
 * - Vérifie que le contexte est disponible
 * - Retourne les fonctions et états d'authentification
 * - Doit être utilisé dans les composants enfants d'AuthProvider
 * 
 * @returns AuthContextType - Les fonctions et états d'authentification
 * @throws Error - Si utilisé en dehors d'un AuthProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <LoginForm onLogin={login} />;
 *   }
 *   
 *   return <div>Bonjour {user?.email}</div>;
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}