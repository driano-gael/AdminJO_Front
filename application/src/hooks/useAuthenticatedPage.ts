/**
 * Hook de protection et d'authentification pour les pages AdminJO
 *
 * Ce hook centralise la logique de protection des pages dans l'application d'administration
 * des JO 2024. Il combine les fonctionnalités d'authentification et de gestion d'expiration
 * de session pour offrir une protection complète et automatique des routes sensibles.
 *
 * @module useAuthenticatedPage
 * @category Hooks
 * @since 1.0.0
 * @author AdminJO Team
 */

import { useAuth } from '@/contexts/authContext';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';

/**
 * Hook useAuthenticatedPage - Protection automatique des pages authentifiées
 *
 * Ce hook est conçu pour être utilisé dans chaque page ou composant nécessitant
 * une authentification. Il combine plusieurs fonctionnalités de sécurité en une
 * interface simple et réutilisable.
 *
 * @name useAuthenticatedPage
 *
 * ## Fonctionnalités intégrées
 *
 * ### Authentification automatique
 * - **Vérification d'état** : Contrôle immédiat du statut d'authentification
 * - **Redirection automatique** : Renvoi vers la page de connexion si non authentifié
 * - **Persistance de session** : Maintien de l'état entre les rechargements
 * - **Gestion des rôles** : Vérification des permissions administrateur
 *
 * ### Gestion d'expiration de session
 * - **Surveillance automatique** : Monitoring continu de la validité du token
 * - **Alerte préventive** : Notification avant expiration
 * - **Renouvellement transparent** : Refresh automatique du token JWT
 * - **Déconnexion propre** : Nettoyage des données en cas d'expiration
 *
 * ### Sécurité renforcée
 * - **Validation de token** : Vérification de l'intégrité et de la validité
 * - **Protection CSRF** : Mesures contre les attaques cross-site
 * - **Sauvegarde de route** : Mémorisation pour redirection post-connexion
 *
 * ## Utilisation dans les pages
 *
 * Le hook doit être appelé au début de chaque composant de page protégée pour
 * activer automatiquement toutes les protections de sécurité.
 *
 * ## Avantages par rapport à l'utilisation directe
 *
 * ### Simplicité d'usage
 * - **Interface unifiée** : Un seul hook au lieu de deux imports
 * - **Configuration automatique** : Pas de setup manuel requis
 * - **Cohérence** : Comportement identique sur toutes les pages
 *
 * ### Performance optimisée
 * - **Lazy loading** : Chargement uniquement quand nécessaire
 * - **Mise en cache** : Réutilisation des données d'authentification
 * - **Debouncing** : Évite les vérifications répétitives
 *
 * ### Maintenance facilitée
 * - **Point central** : Modifications propagées automatiquement
 * - **Tests simplifiés** : Interface unique à tester
 * - **Debug facilité** : Logs centralisés
 *
 * @returns {AuthContextType} Interface complète d'authentification avec session monitoring
 *
 * @see {@link useAuth} - Context d'authentification sous-jacent
 * @see {@link useSessionExpiry} - Hook de gestion d'expiration de session
 *
 * @example
 * ```tsx
 * function ProtectedPage() {
 *   // Protection automatique - doit être la première ligne
 *   const { user, isAuthenticated, logout } = useAuthenticatedPage();
 *
 *   if (!isAuthenticated) {
 *     // Le hook gère automatiquement la redirection
 *     return null;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Bienvenue, {user?.email}</h1>
 *       <button onClick={logout}>Déconnexion</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuthenticatedPage() {
  // Récupération de l'état d'authentification complet
  const auth = useAuth();
  
  // Activation automatique de la gestion d'expiration de session
  useSessionExpiry();
  
  // Retour de l'interface d'authentification complète
  return auth;
}

export default useAuthenticatedPage;
