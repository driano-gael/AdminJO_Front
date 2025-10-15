/**
 * Wrappers de requêtes HTTP avec gestion automatique de l'authentification
 *
 * Ce module fournit une couche d'abstraction pour les requêtes HTTP avec
 * gestion automatique des tokens JWT, rafraîchissement automatique et
 * gestion centralisée des erreurs.
 *
 * @module core/fetchWrappers
 */

import { makeRequest } from './httpHelpers';
import { refreshToken } from '../auth/authService';
import { clearTokens, notifySessionExpired } from './tokenHelpers';

/** URL de base de l'API définie dans les variables d'environnement */
const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
/** Clé de stockage du token d'accès */
const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
/** Clé de stockage du token de rafraîchissement */
const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;

if (!baseUrl) throw new Error("API base URL is not défini.");
if (!tokenKey) throw new Error("NEXT_PUBLIC_AUTH_TOKEN_KEY est manquant.");
if (!refreshKey) throw new Error("NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY est manquant.");

/**
 * Fonction wrapper principale pour les requêtes API avec gestion automatique de l'authentification.
 *
 * Cette fonction encapsule toute la logique de communication avec l'API :
 * - Ajoute automatiquement les headers d'authentification
 * - Gère le rafraîchissement automatique des tokens en cas d'expiration (401)
 * - Parse automatiquement les réponses JSON
 * - Gère les erreurs HTTP avec messages détaillés
 * - Émet des événements pour notifier les changements d'état d'authentification
 *
 * @template T - Type de retour attendu de l'API
 * @param endpoint - Point de terminaison de l'API (ex: '/users/client/')
 * @param options - Options de la requête fetch (méthode, body, headers, etc.)
 * @param requiresAuth - Indique si la requête nécessite une authentification
 * @returns Données parsées de la réponse API
 * @throws En cas d'erreur HTTP, de session expirée, ou d'erreur réseau
 *
 * @example
 * ```typescript
 * // Requête GET authentifiée simple
 * const clients = await fetchApi<Client[]>('/users/client/');
 *
 * // Requête POST avec données
 * const newClient = await fetchApi<Client>('/users/client/', {
 *   method: 'POST',
 *   body: JSON.stringify({ nom: 'Dupont', email: 'dupont@example.com' })
 * });
 *
 * // Requête sans authentification (login)
 * const authResponse = await fetchApi<AuthResponse>('/auth/login/', {
 *   method: 'POST',
 *   body: JSON.stringify({ email, password })
 * }, false);
 * ```
 */
export async function fetchApi<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = true
): Promise<T> {
    let response = await makeRequest(endpoint, options, requiresAuth);
  
    if (response.status === 401 && requiresAuth) {
        // Tenter de rafraîchir le token
        const refreshed = await tryRefreshToken();
        
        if (refreshed) {
            // Émettre un événement pour informer de la réussite du refresh (optionnel)
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('tokenRefreshed'));
            }
            
            // Refaire la requête avec le nouveau token
            response = await makeRequest(endpoint, options, requiresAuth);
        } else {
            // Nettoyer les tokens invalides
            clearTokens();
            
            // Notifier l'expiration de session (déclenche le modal)
            notifySessionExpired();
            
            // Lever une erreur pour arrêter le processus
            throw new Error("Session expirée. Veuillez vous reconnecter.");
        }
    }
    
    // Récupérer le type de contenu de la réponse
    const contentType = response.headers.get("Content-Type") || "";
    
    // Gérer les erreurs HTTP (status codes 4xx, 5xx)
    if (!response.ok) {
        // Tenter de parser l'erreur en JSON si possible
        const errorData = contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : {};
        
        // Créer une erreur avec le message du serveur ou le status text par défaut
        const error = new Error(`(${response.status}) ${errorData.detail || response.statusText}`);
        
        // Attacher les données d'erreur à l'exception pour un debugging avancé
        (error as Error & { data: unknown }).data = errorData;
        
        throw error;
    }
    
    // Parser et retourner les données de la réponse
    return contentType.includes("application/json")
        ? await response.json()      // Parser en JSON si le content-type l'indique
        : ({} as T);                 // Retourner un objet vide sinon
}

/**
 * Fonction utilitaire interne pour tenter de rafraîchir le token d'authentification.
 *
 * Cette fonction :
 * - Appelle le service de refresh token
 * - Gère silencieusement les erreurs de refresh (token expiré, réseau, etc.)
 * - Émet un événement 'tokenRefreshed' en cas de succès
 * - Retourne un booléen indiquant le résultat de l'opération
 *
 * @returns `true` si le refresh a réussi, `false` en cas d'échec
 *
 * @example
 * ```typescript
 * // Usage interne dans fetchApi
 * const refreshed = await tryRefreshToken();
 * if (refreshed) {
 *   // Retry original request
 * } else {
 *   // Handle session expiry
 * }
 * ```
 */
async function tryRefreshToken(): Promise<boolean> {
  try {
    await refreshToken();
    
    // Émettre un événement pour informer les autres composants du refresh réussi
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tokenRefreshed'));
    }
    
    return true;
  } catch {
    return false;
  }
}