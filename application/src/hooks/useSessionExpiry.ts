/**
 * Hook de gestion d'expiration de session pour l'application AdminJO
 *
 * Ce hook fournit un système automatisé de surveillance et de gestion de l'expiration
 * des sessions utilisateur. Il écoute les événements de système et déclenche les
 * actions appropriées pour maintenir la sécurité de l'application.
 *
 * @module useSessionExpiry
 * @category Hooks
 * @since 1.0.0
 * @author AdminJO Team
 */

'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';

/**
 * Hook useSessionExpiry - Surveillance automatique de l'expiration de session
 *
 * Ce hook gère la surveillance continue de la validité des sessions utilisateur
 * et déclenche automatiquement les processus de déconnexion sécurisée en cas
 * d'expiration ou d'invalidation du token d'authentification.
 *
 * @name useSessionExpiry
 *
 * ## Fonctionnalités principales
 *
 * ### Surveillance d'événements
 * - **Écoute active** : Monitoring des événements 'sessionExpired' globaux
 * - **Réaction automatique** : Déclenchement immédiat des actions de sécurité
 * - **Nettoyage propre** : Suppression des listeners lors du démontage
 *
 * ### Gestion de l'expiration
 * - **Vérification d'état** : Contrôle du statut d'authentification avant action
 * - **Déconnexion forcée** : Appel automatique de forceLogout() si nécessaire
 * - **Protection continue** : Surveillance tant que le composant est monté
 *
 * ## Intégration système
 *
 * Ce hook fait partie du système de sécurité global et fonctionne en coordination avec :
 * - **tokenHelpers** : Qui émettent les événements d'expiration
 * - **AuthContext** : Qui gère les actions de déconnexion
 * - **Services API** : Qui détectent les erreurs 401/403
 *
 * ## Cycle de fonctionnement
 *
 * 1. **Initialisation** : Enregistrement de l'écouteur d'événements au montage
 * 2. **Surveillance** : Écoute continue des événements 'sessionExpired'
 * 3. **Validation** : Vérification de l'état d'authentification à réception
 * 4. **Action** : Déclenchement de forceLogout() si utilisateur connecté
 * 5. **Nettoyage** : Suppression de l'écouteur au démontage du composant
 *
 * ## Utilisation recommandée
 *
 * Le hook doit être utilisé dans tous les composants nécessitant une authentification
 * ou dans les layouts de pages protégées. Il est automatiquement inclus dans
 * useAuthenticatedPage() pour simplifier l'usage.
 *
 * @returns {void} Ce hook ne retourne aucune valeur - effet de bord uniquement
 *
 * @see {@link useAuth} - Context d'authentification pour forceLogout()
 * @see {@link useAuthenticatedPage} - Hook qui inclut automatiquement cette fonctionnalité
 * @see {@link emitSessionExpired} - Fonction utilitaire pour déclencher l'expiration
 *
 * @example
 * ```tsx
 * function ProtectedComponent() {
 *   useSessionExpiry(); // Active la surveillance automatique
 *
 *   return <div>Contenu protégé</div>;
 * }
 * ```
 */
export function useSessionExpiry() {
  const { isAuthenticated, forceLogout } = useAuth();

  useEffect(() => {
      /**
       * Gestionnaire d'événement d'expiration de session
       *
       * Appelé automatiquement lorsqu'un événement 'sessionExpired' est émis
       * par le système de gestion des tokens ou les services API.
       *
       * @function handleSessionExpired
       */
      const handleSessionExpired = () => {
        if (isAuthenticated) {
          forceLogout();
        }
      };

      // Enregistrement de l'écouteur d'événements global
      window.addEventListener('sessionExpired', handleSessionExpired);

      // Nettoyage lors du démontage du composant
      return () => {
        window.removeEventListener('sessionExpired', handleSessionExpired);
      };
  }, [isAuthenticated, forceLogout]); // Recréer l'effet si l'état d'authentification change
}

/**
 * Fonction utilitaire emitSessionExpired - Émission d'événement d'expiration
 *
 * Cette fonction utilitaire permet à n'importe quelle partie de l'application
 * de signaler une expiration de session. Elle émet un événement personnalisé
 * qui sera capturé par tous les hooks useSessionExpiry() actifs.
 *
 * @name emitSessionExpired
 *
 * ## Utilisation dans les services
 *
 * Cette fonction est typiquement appelée par :
 * - **Services API** : Lors de réponses HTTP 401 (Unauthorized)
 * - **Intercepteurs** : Dans les middleware de gestion d'erreurs
 * - **Token helpers** : Lors de la détection d'expiration de JWT
 *
 * ## Sécurité
 *
 * L'émission de cet événement déclenche immédiatement la déconnexion forcée
 * de tous les utilisateurs connectés dans l'application, assurant une sécurité
 * maximale en cas de compromission de session.
 *
 * @returns {void} Fonction sans valeur de retour
 *
 * @see {@link useSessionExpiry} - Hook qui écoute ces événements
 *
 * @example
 * ```tsx
 * // Dans un service API
 * export async function apiCall() {
 *   try {
 *     const response = await fetch('/api/data');
 *     if (response.status === 401) {
 *       emitSessionExpired(); // Déclenche la déconnexion
 *       throw new Error('Session expirée');
 *     }
 *     return response.json();
 *   } catch (error) {
 *     // Gestion d'erreur...
 *   }
 * }
 * ```
 */
export function emitSessionExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sessionExpired'));
  }
}

export default useSessionExpiry;
