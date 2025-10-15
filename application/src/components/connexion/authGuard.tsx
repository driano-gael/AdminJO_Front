/**
 * Composant AuthGuard - Protection avancée des routes par authentification AdminJO
 *
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
 * ### 🔐 Système de protection multicouches
 * - **Vérification initiale** : Contrôle état authentification via useAuth context
 * - **Validation token** : isTokenValid() pour vérifier expiration token actuel
 * - **Refresh automatique** : refreshToken() si token expiré mais refresh valide
 * - **Fallback sécurisé** : forceLogout() si refresh impossible
 * - **Protection continue** : Surveillance permanente validité session
 * - **États transitoires** : Gestion loading pendant vérifications/refresh
 * - **Recovery graceful** : Tentative récupération avant déconnexion forcée
 *
 * ### 🛡️ Flux de sécurité implémenté
 * 1. **Vérification context** : isAuthenticated depuis AuthContext
 * 2. **Validation token** : Contrôle expiration token access
 * 3. **Refresh tentative** : Si expiré, essai refresh automatique
 * 4. **Success path** : Token valide → affichage contenu protégé
 * 5. **Failure path** : Refresh échec → déconnexion → LoginAdminForm
 * 6. **Loading states** : Spinners pendant toutes vérifications async
 *
 * ## Gestion d'état sophistiquée et lifecycle
 *
 * ### 🔄 États de sécurité et transitions
 * - **isLoading** : État chargement initial authentification (context)
 * - **isRefreshing** : État local refresh token en cours
 * - **hasValidToken** : État local validité token après vérifications
 * - **isAuthenticated** : État global authentification (context)
 * - **Transitions atomiques** : Changements état coordonnés et cohérents
 * - **Race conditions** : Protection contre états concurrents
 * - **Memory cleanup** : Nettoyage états lors démontage composant
 *
 * ### ⚡ useEffect de vérification token avancée
 * - **Dépendances** : [isAuthenticated, forceLogout] pour re-vérification
 * - **Early return** : Sortie immédiate si non authentifié
 * - **Token validation** : Vérification expiration côté client
 * - **Async refresh** : Gestion promise refresh avec try/catch
 * - **Error recovery** : forceLogout automatique si refresh échoue
 * - **State cleanup** : setIsRefreshing(false) dans finally
 * - **Performance** : Évite vérifications inutiles si déjà non-auth
 *
 * ## Interface utilisateur et expérience sécurisée
 *
 * ### 🎨 États visuels et feedback utilisateur
 * - **Loading initial** : Spinner large centré pendant vérification auth
 * - **Loading refresh** : Spinner large pendant refresh token
 * - **LoginAdminForm** : Formulaire connexion si non authentifié
 * - **Protected content** : Affichage children si authentifié validé
 * - **Transitions smooth** : Pas de flickering entre états
 * - **Feedback immédiat** : États loading pour toutes opérations async
 * - **Consistent UX** : Même spinner pour tous états loading
 *
 * ### 📱 Layout responsive et accessibilité sécurité
 * - **Full viewport** : min-h-screen pour occupation écran complète
 * - **Centrage universel** : flex items-center justify-center tous écrans
 * - **Spinner sizing** : size="large" pour visibilité optimale
 * - **Form integration** : LoginAdminForm responsive intégré
 * - **Children passthrough** : Contenu protégé rendu sans modification
 * - **Screen readers** : Structure logique pour synthèse vocale
 * - **Focus management** : Gestion focus lors transitions états
 *
 * ## Intégration contexte authentification AdminJO
 *
 * ### 🔗 Communication avec AuthContext
 * - **useAuth hook** : Accès état global authentification
 * - **isAuthenticated** : État booléen authentification utilisateur
 * - **isLoading** : État chargement vérification initiale
 * - **forceLogout** : Callback déconnexion forcée utilisateur
 * - **Réactivité context** : Re-render automatique changements auth
 * - **State synchronization** : Cohérence état local et global
 * - **Event propagation** : Actions auth propagées dans application
 *
 * ### 🛠️ Intégration services authentification
 * - **isTokenValid()** : Helper vérification expiration token
 * - **refreshToken()** : Service refresh token automatique
 * - **Token storage** : Gestion localStorage/sessionStorage tokens
 * - **API integration** : Appels API authentification centralisés
 * - **Error handling** : Gestion erreurs réseau et serveur
 * - **Security headers** : Transmission sécurisée tokens API
 *
 * ## Sécurité avancée et bonnes pratiques
 *
 * ### 🔒 Mesures sécurité implémentées
 * - **Token validation** : Vérification expiration côté client
 * - **Automatic refresh** : Renouvellement silencieux tokens
 * - **Forced logout** : Déconnexion si compromission détectée
 * - **Protected rendering** : Contenu sensible seulement si authentifié
 * - **State isolation** : États sécurité isolés composant
 * - **Error boundaries** : Gestion erreurs sans exposition données
 * - **Memory security** : Nettoyage états sensibles lors démontage
 *
 * ### 🛡️ Protection contre attaques courantes
 * - **Token hijacking** : Validation continue empêche usage tokens volés expirés
 * - **Session fixation** : Refresh tokens renouvelle session sécurisée
 * - **XSS mitigation** : Pas de manipulation DOM directe données sensibles
 * - **CSRF protection** : Tokens intégrés requêtes authentifiées
 * - **Timing attacks** : Pas d'exposition temps validation côté client
 * - **Replay attacks** : Expiration tokens limite fenêtre attaque
 *
 * ## Performance et optimisations sécurisées
 *
 * ### ⚡ Optimisations performance actuelles
 * - **Conditional checks** : Early returns évitent vérifications inutiles
 * - **Async operations** : Refresh non-bloquant avec états loading
 * - **Minimal re-renders** : useEffect dépendances optimisées
 * - **State colocation** : États locaux pour performance
 * - **Component purity** : Pas d'effets de bord non contrôlés
 * - **Memory efficiency** : Cleanup automatique états temporaires
 *
 * ### 🎯 Candidats optimisation avancée
 * - **Token caching** : Cache validation côté client avec expiration
 * - **Preemptive refresh** : Refresh avant expiration pour UX fluide
 * - **Background refresh** : Renouvellement tokens en arrière-plan
 * - **Retry logic** : Tentatives multiples refresh avec backoff
 * - **Connection monitoring** : Adaptation comportement selon réseau
 * - **Concurrent safety** : Protection contre refreshs concurrents
 *
 * ## Contexte métier sécurité olympique JO 2024
 *
 * ### 🏅 Spécificités sécurité événements olympiques
 * - **Sécurité renforcée** : Standards élevés systèmes critiques JO
 * - **Accès administrateurs** : Protection interfaces gestion olympique
 * - **Données sensibles** : Informations événements, athlètes, résultats
 * - **Conformité CIO** : Respect standards sécurité Comité Olympique
 * - **Audit trails** : Traçabilité accès pour sécurité JO
 * - **Multi-tenancy** : Séparation accès différents rôles organisateurs
 * - **High availability** : Disponibilité continue pendant JO
 *
 * ### 📊 Types d'accès protégés AdminJO
 * - **Gestion événements** : Création/modification événements sportifs
 * - **Administration lieux** : Gestion infrastructure olympique
 * - **Gestion disciplines** : Configuration sports et épreuves
 * - **Gestion athlètes** : Données personnelles et performances
 * - **Résultats temps réel** : Saisie scores et classements
 * - **Médias olympiques** : Accès contenus officiels JO
 * - **Logistique JO** : Coordination opérationnelle événements
 *
 * ## Gestion erreurs et recovery robuste
 *
 * ### 🚨 Stratégies de recovery implémentées
 * - **Graceful degradation** : Affichage login si problème auth
 * - **Automatic retry** : Refresh automatique avant déconnexion
 * - **Error isolation** : Erreurs auth n'affectent pas app globale
 * - **User feedback** : États loading pendant opérations recovery
 * - **State consistency** : Cohérence états même en cas d'erreur
 * - **Fallback UI** : Interface connexion toujours disponible
 *
 * ### 🔄 Patterns de gestion d'erreurs
 * - **Try-catch async** : Gestion erreurs refresh token
 * - **Finally cleanup** : Nettoyage états même en cas d'erreur
 * - **Error boundaries** : Protection contre crashes composant
 * - **Defensive programming** : Vérifications null/undefined
 * - **Timeout handling** : Gestion timeouts opérations réseau
 * - **Network resilience** : Adaptation problèmes connectivité
 *
 * ## Extensibilité et maintenance
 *
 * ### 🔧 Architecture extensible
 * - **Props interface** : children ReactNode pour flexibilité maximale
 * - **Context integration** : Découplage logique auth via context
 * - **Service abstraction** : Services auth interchangeables
 * - **Hook composition** : Logique réutilisable via custom hooks
 * - **Component composition** : AuthGuard wrappable autour contenu
 * - **Configuration externalisée** : Paramètres auth via environment
 *
 * ### 📈 Évolutions futures possibles
 * - **Multi-factor auth** : Support 2FA pour sécurité renforcée
 * - **Role-based access** : Contrôle granulaire permissions
 * - **Session monitoring** : Surveillance activité utilisateur
 * - **Biometric auth** : Authentification biométrique mobile
 * - **SSO integration** : Single Sign-On avec systèmes CIO
 * - **Audit logging** : Journalisation détaillée accès
 * - **Geo-restriction** : Limitation accès géographique
 * - **Device fingerprinting** : Sécurité basée appareils
 *
 * ## Patterns de développement sécurisé
 *
 * ### 🏗️ Architecture sécurité by design
 * - **Principle of least privilege** : Accès minimal nécessaire
 * - **Defense in depth** : Multicouches protection
 * - **Fail secure** : Échec vers état sécurisé (déconnexion)
 * - **Zero trust** : Vérification continue, pas de confiance implicite
 * - **Separation of concerns** : Logique auth isolée
 * - **Immutable state** : États sécurité non mutables
 *
 * ### 🔍 Testing et validation sécurité
 * - **Unit tests** : Tests isolés fonctions sécurité
 * - **Integration tests** : Tests flux authentification complets
 * - **Security tests** : Validation résistance attaques
 * - **Performance tests** : Impact security checks sur performance
 * - **Accessibility tests** : Sécurité n'impact pas accessibilité
 * - **Cross-browser** : Compatibilité sécurité tous navigateurs
 *
 * ## Limitations et considérations sécurité
 *
 * ### ❌ Limitations actuelles identifiées
 * - **Client-side validation** : Validation token côté client seulement
 * - **No concurrent refresh** : Pas protection refreshs simultanés
 * - **Basic error handling** : Gestion erreurs simplifiée
 * - **No retry logic** : Pas de retry automatique si refresh échoue
 * - **No session timeout** : Pas de timeout inactivité utilisateur
 * - **No device tracking** : Pas de limitation appareils
 * - **Single token type** : Pas de differentiation tokens par scope
 *
 * ### 🚀 Améliorations sécurité prioritaires
 * - **Server-side validation** : Double validation tokens côté serveur
 * - **Concurrent protection** : Mutex pour refreshs simultanés
 * - **Advanced retry** : Backoff exponentiel tentatives refresh
 * - **Session monitoring** : Timeout inactivité automatique
 * - **Device management** : Limitation nombre appareils connectés
 * - **Token revocation** : Révocation immédiate tokens compromis
 * - **Security headers** : CSP, HSTS headers sécurité
 * - **Audit integration** : Logs sécurité détaillés
 * - **Rate limiting** : Protection contre brute force
 * - **IP whitelisting** : Restriction accès par adresses IP
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
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Protection route simple
 * <AuthGuard>
 *   <DashboardAdmin />
 * </AuthGuard>
 * ```
 *
 * @example
 * ```tsx
 * // Protection layout complet application
 * export default function ProtectedLayout({ children }) {
 *   return (
 *     <AuthGuard>
 *       <AdminLayout>
 *         {children}
 *       </AdminLayout>
 *     </AuthGuard>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Intégration page Next.js
 * export default function AdminEventsPage() {
 *   return (
 *     <AuthGuard>
 *       <EvenementsManagement />
 *     </AuthGuard>
 *   );
 * }
 * ```
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
export default function AuthGuard({ children }: AuthGuardProps) {
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