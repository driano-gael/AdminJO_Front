/**
 * Wrappers pour les requêtes API avec gestion automatique de l'authentification
 * 
 * Ce fichier contient :
 * - La fonction principale fetchApi qui gère toutes les requêtes
 * - La gestion automatique du refresh token en cas d'erreur 401
 * - La gestion des erreurs et de l'expiration de session
 * - La configuration des variables d'environnement
 */

import { makeRequest } from './httpHelpers';
import { refreshToken } from '../auth/authService';
import { clearTokens, notifySessionExpired } from './tokenHelpers';

// Validation des variables d'environnement requises
const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;

// Vérifications de sécurité au chargement du module
if (!baseUrl) throw new Error("API base URL is not défini.");
if (!tokenKey) throw new Error("NEXT_PUBLIC_AUTH_TOKEN_KEY est manquant.");
if (!refreshKey) throw new Error("NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY est manquant.");

/**
 * Fonction principale pour effectuer des requêtes API avec gestion automatique de l'authentification
 * 
 * Cette fonction :
 * - Effectue la requête HTTP initiale
 * - Gère automatiquement le refresh token en cas d'erreur 401
 * - Parse les réponses JSON
 * - Gère les erreurs et l'expiration de session
 * 
 * @param endpoint - L'endpoint de l'API (exemple: '/users', '/auth/login')
 * @param options - Options de la requête fetch (method, body, headers, etc.)
 * @param requiresAuth - Indique si la requête nécessite une authentification (true par défaut pour la sécurité)
 * @returns Promise<T> - Les données parsées de la réponse
 * @throws Error - Si la requête échoue ou si la session expire
 */
export async function fetchApi<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = true
): Promise<T> {
    // Effectuer la requête HTTP initiale
    let response = await makeRequest(endpoint, options, requiresAuth);
  
    // Gestion du refresh automatique pour les erreurs 401 (Unauthorized)
    if (response.status === 401 && requiresAuth) {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Token expiré, tentative de refresh...');
        }
        
        // Tenter de rafraîchir le token
        const refreshed = await tryRefreshToken();
        
        if (refreshed) {
            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Token refreshé avec succès, nouvelle tentative...');
            }
            
            // Émettre un événement pour informer de la réussite du refresh (optionnel)
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('tokenRefreshed'));
            }
            
            // Refaire la requête avec le nouveau token
            response = await makeRequest(endpoint, options, requiresAuth);
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.log('❌ Échec du refresh token, session expirée');
            }
            
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
 * Fonction utilitaire pour tenter de rafraîchir le token d'authentification
 * 
 * Cette fonction :
 * - Appelle le service de refresh token
 * - Gère les erreurs de refresh (token expiré, réseau, etc.)
 * - Retourne un booléen indiquant le succès ou l'échec
 * 
 * @returns Promise<boolean> - true si le refresh a réussi, false sinon
 */
async function tryRefreshToken(): Promise<boolean> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Tentative de refresh du token...');
    }
    
    // Appeler le service de refresh token
    await refreshToken();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Token refreshé avec succès');
    }
    
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ Échec du refresh token:', error);
    }
    
    // Si le refresh échoue, c'est que le refresh token est aussi expiré
    return false;
  }
}