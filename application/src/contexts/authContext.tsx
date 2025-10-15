/**
 * Contexte d'authentification de l'application AdminJO
 *
 * Ce module fournit le contexte React pour la gestion complète de l'authentification
 * des administrateurs dans l'application AdminJO. Il gère les sessions utilisateurs,
 * la persistance des données, le refresh automatique des tokens et la sécurité d'accès.
 *
 * @module AuthContext
 * @category Contexts
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService, logout as logoutService, refreshToken } from '@/lib/api/auth/authService';
import { setSessionExpiredCallback, isTokenValid } from '@/lib/api/core/tokenHelpers';
import SessionExpiredModal from '@/components/connexion/SessionExpiredModal';


/**
 * Interface représentant un utilisateur authentifié
 *
 * Définit la structure des données utilisateur stockées dans le contexte
 * d'authentification. Seuls les utilisateurs avec le rôle 'admin' peuvent
 * accéder à l'application.
 *
 * @interface User
 */
export interface User {
  /** Adresse email de l'utilisateur administrateur */
  email: string;
  /** Rôle de l'utilisateur - doit être 'admin' pour l'accès */
  role: string;
}

/**
 * Interface du contexte d'authentification
 *
 * Définit l'API complète du contexte d'authentification avec toutes les
 * fonctionnalités de gestion de session, navigation et sécurité.
 *
 * @interface AuthContextType
 */
export interface AuthContextType {
  /** Données de l'utilisateur connecté ou null si non connecté */
  user: User | null;
  /** État d'authentification calculé basé sur la présence de l'utilisateur */
  isAuthenticated: boolean;
  /** Indicateur de chargement pendant les opérations d'authentification */
  isLoading: boolean;
  /** Fonction de connexion avec email et mot de passe */
  login: (email: string, password: string) => Promise<void>;
  /** Fonction de déconnexion volontaire */
  logout: () => void;
  /** Fonction de déconnexion forcée en cas d'expiration de session */
  forceLogout: () => void;
  /** Route sauvegardée pour redirection après reconnexion */
  currentRoute: string | null;
  /** Fonction pour sauvegarder la route courante */
  saveCurrentRoute: (route: string) => void;
  /** Fonction pour récupérer et effacer la route sauvegardée */
  getAndClearSavedRoute: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props du composant AuthProvider
 *
 * @interface AuthProviderProps
 */
export interface AuthProviderProps {
  /** Composants enfants à enrober dans le contexte */
  children: ReactNode;
}

/**
 * Composant AuthProvider - Fournisseur de contexte d'authentification
 *
 * Ce composant enrobe l'application entière et fournit toutes les fonctionnalités
 * d'authentification à travers un contexte React. Il gère la persistance des sessions,
 * le refresh automatique des tokens, et la sécurité d'accès aux administrateurs.
 *
 * @name AuthProvider
 *
 * ## Fonctionnalités principales
 *
 * ### Gestion des sessions
 * - **Vérification automatique** : Contrôle de validité des tokens au chargement
 * - **Refresh automatique** : Renouvellement des tokens expirés via refreshToken()
 * - **Persistance locale** : Sauvegarde email/rôle dans localStorage
 * - **Synchronisation d'état** : Mise à jour en temps réel du statut d'authentification
 *
 * ### Sécurité d'accès
 * - **Restriction aux admins** : Seuls les utilisateurs avec role='admin' peuvent se connecter
 * - **Validation des tokens** : Vérification continue de la validité des tokens d'accès
 * - **Gestion d'expiration** : Modal d'expiration de session avec possibilité de reconnexion
 * - **Nettoyage sécurisé** : Suppression complète des données en cas de déconnexion
 *
 * ### Navigation intelligente
 * - **Sauvegarde de route** : Conservation de la page courante lors d'une expiration
 * - **Redirection automatique** : Retour à la page précédente après reconnexion
 * - **Protection des routes** : Redirection vers '/' pour les utilisateurs non autorisés
 *
 * ## États gérés
 *
 * - **user** : Données utilisateur (email, role) ou null
 * - **isLoading** : État de chargement pendant les opérations d'auth
 * - **showSessionExpiredModal** : Affichage de la modal d'expiration
 * - **currentRoute** : Route sauvegardée pour redirection post-reconnexion
 *
 * ## Cycle de vie d'authentification
 *
 * 1. **Initialisation** : Vérification des tokens stockés au chargement
 * 2. **Connexion** : Validation rôle admin + sauvegarde données utilisateur
 * 3. **Session active** : Monitoring continu + refresh automatique des tokens
 * 4. **Expiration** : Déconnexion forcée + modal de reconnexion
 * 5. **Déconnexion** : Nettoyage complet + redirection vers page d'accueil
 *
 * ## Intégrations
 *
 * - **authService** : Services de connexion/déconnexion/refresh
 * - **tokenHelpers** : Utilitaires de validation et gestion des tokens
 * - **SessionExpiredModal** : Composant modal pour les sessions expirées
 * - **useRouter** : Navigation programmée Next.js
 *
 * @param {AuthProviderProps} props - Props avec children à enrober
 * @returns {JSX.Element} Provider du contexte avec modal de session
 *
 * @see {@link useAuth} - Hook pour consommer le contexte
 * @see {@link SessionExpiredModal} - Modal d'expiration de session
 * @see authService - Services d'authentification
 * @see tokenHelpers - Utilitaires de gestion des tokens
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

  const isAuthenticated = !!user;

  /**
   * Fonction de déconnexion forcée en cas d'expiration de session
   *
   * Cette fonction est appelée automatiquement par le système de gestion des tokens
   * lorsqu'une session expire. Elle sauvegarde la route courante pour permettre
   * une redirection après reconnexion et affiche la modal d'expiration.
   *
   * ## Actions effectuées
   * 1. Log de déconnexion forcée (en développement)
   * 2. Sauvegarde de la route courante si différente de '/' ou '/login'
   * 3. Appel du service de déconnexion
   * 4. Nettoyage du localStorage (email et rôle)
   * 5. Reset de l'état utilisateur
   * 6. Affichage de la modal d'expiration de session
   *
   * @function forceLogout
   */
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

  /**
   * Gestionnaire de fermeture de la modal d'expiration
   *
   * Ferme la modal d'expiration de session et redirige l'utilisateur
   * vers la page d'accueil pour qu'il puisse se reconnecter.
   *
   * @function handleSessionExpired
   */
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


  /**
   * Fonction de connexion avec validation du rôle administrateur
   *
   * Authentifie un utilisateur avec email/mot de passe et vérifie qu'il possède
   * le rôle 'admin' requis pour accéder à l'application d'administration.
   *
   * ## Processus de connexion
   * 1. Activation de l'état de chargement
   * 2. Appel du service de connexion avec les identifiants
   * 3. Vérification du rôle 'admin' dans la réponse
   * 4. Sauvegarde des données utilisateur dans localStorage
   * 5. Mise à jour de l'état utilisateur dans le contexte
   *
   * ## Gestion des erreurs
   * - **Rôle non-admin** : Déconnexion automatique + erreur explicite
   * - **Échec de connexion** : Propagation de l'erreur du service
   * - **Problème localStorage** : Warning mais pas d'échec de connexion
   *
   * @param {string} email - Adresse email de l'administrateur
   * @param {string} password - Mot de passe de l'administrateur
   * @returns {Promise<void>} Promise résolue en cas de succès
   * @throws {Error} Erreur si les identifiants sont invalides ou rôle non-admin
   *
   */
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

  /**
   * Fonction de déconnexion volontaire
   *
   * Déconnecte l'utilisateur de manière volontaire (bouton déconnexion)
   * et effectue un nettoyage complet des données de session.
   *
   * ## Actions effectuées
   * 1. Appel du service de déconnexion (invalidation des tokens)
   * 2. Suppression des données utilisateur du localStorage
   * 3. Reset de l'état utilisateur dans le contexte
   * 4. Redirection vers la page d'accueil
   *
   * @function logout
   */
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

  /**
   * Fonction de sauvegarde de la route courante
   *
   * Sauvegarde la route actuelle pour permettre une redirection
   * après reconnexion en cas d'expiration de session.
   *
   * @param {string} route - Route à sauvegarder
   * @function saveCurrentRoute
   */
  const saveCurrentRoute = (route: string) => {
    setCurrentRoute(route);
  };

  /**
   * Fonction de récupération et effacement de la route sauvegardée
   *
   * Récupère la route précédemment sauvegardée et l'efface du contexte
   * pour éviter les redirections indésirables lors des prochaines connexions.
   *
   * @returns {string | null} Route sauvegardée ou null si aucune route
   * @function getAndClearSavedRoute
   */
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

/**
 * Hook useAuth - Consommateur du contexte d'authentification
 *
 * Hook personnalisé pour accéder au contexte d'authentification depuis
 * n'importe quel composant enfant du AuthProvider. Fournit une interface
 * simple pour toutes les opérations d'authentification.
 *
 * @name useAuth
 *
 * ## Fonctionnalités fournies
 *
 * ### État d'authentification
 * - **user** : Données de l'utilisateur connecté (email, role)
 * - **isAuthenticated** : Boolean indiquant si l'utilisateur est connecté
 * - **isLoading** : État de chargement des opérations d'authentification
 *
 * ### Actions disponibles
 * - **login()** : Connexion avec email/mot de passe
 * - **logout()** : Déconnexion volontaire
 * - **forceLogout()** : Déconnexion forcée (expiration)
 *
 * ### Gestion de navigation
 * - **currentRoute** : Route sauvegardée pour redirection
 * - **saveCurrentRoute()** : Sauvegarder la route courante
 * - **getAndClearSavedRoute()** : Récupérer et effacer la route sauvegardée
 *
 * ## Validation d'utilisation
 *
 * Le hook vérifie automatiquement qu'il est utilisé dans un composant
 * enfant du AuthProvider et lève une erreur explicite si ce n'est pas le cas.
 *
 * @returns {AuthContextType} Interface complète du contexte d'authentification
 * @throws {Error} Erreur si utilisé en dehors d'un AuthProvider
 *
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
}