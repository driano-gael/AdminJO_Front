import { makeRequest } from './httpHelpers';
import { refreshToken } from '../auth/authService';
import { clearTokens, notifySessionExpired } from './tokenHelpers';


const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;

if (!baseUrl) throw new Error("API base URL is not défini.");
if (!tokenKey) throw new Error("NEXT_PUBLIC_AUTH_TOKEN_KEY est manquant.");
if (!refreshKey) throw new Error("NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY est manquant.");


export async function fetchApi<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = true
): Promise<T> {
    let response = await makeRequest(endpoint, options, requiresAuth);
  
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
    await refreshToken();
    
    // Émettre un événement pour informer les autres composants du refresh réussi
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tokenRefreshed'));
    }
    
    return true;
  } catch (error) {
    return false;
  }
}