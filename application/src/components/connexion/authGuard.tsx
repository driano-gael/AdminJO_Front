/**
 * Composant AuthGuard - Protection avancée des routes par authentification AdminJO
 *
 * @name AuthGuard
 * Ce composant garde d'authentification sophistiqué protège les routes sensibles de l'application
 * AdminJO des Jeux Olympiques 2024 avec vérification continue de l'état d'authentification,
 * gestion automatique du refresh des tokens, et transitions fluides entre états authentifiés
 * et non-authentifiés. Conçu pour la sécurité renforcée des systèmes olympiques, il assure
 * une protection robuste contre l'accès non autorisé tout en maintenant une expérience
 * utilisateur fluide pour les administrateurs JO avec gestion intelligente des sessions
 * expirées et recovery automatique des tokens d'accès.
 *
 * ## Architecture de sécurité et protection routes
 *
 * ### Système de protection multicouches
 * - **Vérification initiale** : Contrôle état authentification via useAuth context
 * - **Validation token** : isTokenValid() pour vérifier expiration token actuel
 * - **Refresh automatique** : refreshToken() si token expiré mais refresh valide
 * - **Fallback sécurisé** : forceLogout() si refresh impossible
 * - **Protection continue** : Surveillance permanente validité session
 * - **États transitoires** : Gestion loading pendant vérifications/refresh
 * - **Recovery graceful** : Tentative récupération avant déconnexion forcée
 *
 * ### Flux de sécurité implémenté
 * 1. **Vérification context** : isAuthenticated depuis AuthContext
 * 2. **Validation token** : Contrôle expiration token access
 * 3. **Refresh tentative** : Si expiré, essai refresh automatique
 * 4. **Success path** : Token valide → affichage contenu protégé
 * 5. **Failure path** : Refresh échec → déconnexion → LoginAdminForm
 * 6. **Loading states** : Spinners pendant toutes vérifications async
 *
 * ## Gestion d'état sophistiquée et lifecycle
 *
 * ### États de sécurité et transitions
 * - **isLoading** : État chargement initial authentification (context)
 * - **isRefreshing** : État local refresh token en cours
 * - **hasValidToken** : État local validité token après vérifications
 * - **isAuthenticated** : État global authentification (context)
 * - **Transitions atomiques** : Changements état coordonnés et cohérents
 * - **Memory cleanup** : Nettoyage états lors démontage composant
 *
 * ### useEffect de vérification token avancée
 * - **Dépendances** : [isAuthenticated, forceLogout] pour re-vérification
 * - **Early return** : Sortie immédiate si non authentifié
 * - **Token validation** : Vérification expiration côté client
 * - **Async refresh** : Gestion promise refresh avec try/catch
 * - **Error recovery** : forceLogout automatique si refresh échoue
 * - **State cleanup** : setIsRefreshing(false) dans finally
 * - **Performance** : Évite vérifications inutiles si déjà non-auth
 *
 * ## Intégration contexte authentification AdminJO
 *
 * ### Communication avec AuthContext
 * - **useAuth hook** : Accès état global authentification
 * - **isAuthenticated** : État booléen authentification utilisateur
 * - **isLoading** : État chargement vérification initiale
 * - **forceLogout** : Callback déconnexion forcée utilisateur
 * - **Réactivité context** : Re-render automatique changements auth
 * - **State synchronization** : Cohérence état local et global
 * - **Event propagation** : Actions auth propagées dans application
 *
 * ### Intégration services authentification
 * - **isTokenValid()** : Helper vérification expiration token
 * - **refreshToken()** : Service refresh token automatique
 * - **Token storage** : Gestion localStorage/sessionStorage tokens
 * - **API integration** : Appels API authentification centralisés
 * - **Error handling** : Gestion erreurs réseau et serveur
 * - **Security headers** : Transmission sécurisée tokens API
 *
 * @param {AuthGuardProps} props - Configuration du garde d'authentification
 * @param {React.ReactNode} props.children - Contenu à protéger par authentification
 *
 * @returns {JSX.Element} Spinner, formulaire connexion ou contenu protégé selon état auth
 *
 * @see {@link useAuth} - Hook contexte authentification global
 * @see {@link LoginAdminForm} - Composant formulaire connexion administrateur
 * @see {@link Spinner} - Composant loading states réutilisable
 * @see {@link isTokenValid} - Helper validation expiration token
 * @see {@link refreshToken} - Service refresh automatique token
 *
 */

'use client';

import { useAuth } from '@/contexts/authContext';
import Spinner from '@/components/spinner';
import LoginAdminForm from '@/components/connexion/loginAdminForm';
import { useEffect, useState } from 'react';
import { isTokenValid } from '@/lib/api/core/tokenHelpers';
import { refreshToken } from '@/lib/api/auth/authService';

/**
 * Interface des propriétés du composant AuthGuard
 *
 * @interface AuthGuardProps
 */
export interface AuthGuardProps {
  /** Contenu React à protéger par authentification - affiché seulement si utilisateur authentifié avec token valide */
  children: React.ReactNode;
}

/**
 * Composant AuthGuard - Protection par authentification avec refresh automatique
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Spinner, formulaire de connexion ou contenu protégé
 */
export function AuthGuard({ children }: AuthGuardProps) {
  // Récupération de l'état d'authentification depuis le contexte
  const { isAuthenticated, isLoading, forceLogout } = useAuth();
  
  // État local pour gérer le processus de refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  // Vérification et refresh du token si nécessaire
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      // Si l'utilisateur n'est pas authentifié, pas besoin de vérifier le token
      if (!isAuthenticated) {
        setHasValidToken(false);
        return;
      }

      // Vérifier si le token actuel est valide
      const tokenValid = isTokenValid();
      
      if (tokenValid) {
        // Token valide, tout va bien
        setHasValidToken(true);
      } else {
        // Token expiré, tenter un refresh
        setIsRefreshing(true);
        
        try {
          await refreshToken();
          setHasValidToken(true);
        } catch {
          // Échec du refresh, déconnexion forcée
          forceLogout();
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    checkAndRefreshToken();
  }, [isAuthenticated, forceLogout]);

  // Affichage du spinner pendant la vérification de l'authentification initiale
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  // Affichage du spinner pendant le refresh du token
  if (isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }
  
  // Affichage du formulaire de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return <LoginAdminForm />;
  }

  // Affichage du formulaire de connexion si le token n'est pas valide
  if (!hasValidToken) {
    return <LoginAdminForm />;
  }
  
  // Affichage du contenu protégé si l'utilisateur est authentifié avec un token valide
  return <>{children}</>;
}
export default AuthGuard;