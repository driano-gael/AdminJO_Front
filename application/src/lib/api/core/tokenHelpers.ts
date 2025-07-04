/**
 * Helpers pour la gestion des tokens d'authentification
 * 
 * Ce fichier contient les fonctions utilitaires pour :
 * - Récupérer les tokens depuis le localStorage
 * - Sauvegarder les tokens dans le localStorage
 * - Nettoyer les tokens
 * - Gérer les callbacks d'expiration de session
 */

/**
 * Récupère le token d'authentification depuis le localStorage
 * 
 * @returns string | null - Le token d'authentification ou null si non trouvé
 */
export function getAuthToken(): string | null {
  // Vérifier si nous sommes côté client (localStorage disponible)
  if (typeof window === 'undefined') return null;
  
  // Récupérer la clé du token depuis les variables d'environnement
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
  const token = localStorage.getItem(tokenKey);
  
  // Log de débogage en mode développement
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 Getting auth token:', { tokenKey, hasToken: !!token, token: token ? `${token.substring(0, 10)}...` : 'null' });
  }
  
  return token;
}

/**
 * Récupère le token de rafraîchissement depuis le localStorage
 * 
 * @returns string | null - Le token de rafraîchissement ou null si non trouvé
 */
export function getRefreshToken(): string | null {
  // Vérifier si nous sommes côté client
  if (typeof window === 'undefined') return null;
  
  // Récupérer la clé du refresh token depuis les variables d'environnement
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
  return localStorage.getItem(refreshKey);
}

/**
 * Sauvegarde les tokens d'authentification dans le localStorage
 * 
 * @param accessToken - Le token d'accès (obligatoire)
 * @param refreshToken - Le token de rafraîchissement (optionnel)
 */
export function setTokens(accessToken: string, refreshToken?: string): void {
  // Vérifier si nous sommes côté client
  if (typeof window === 'undefined') return;
  
  // Récupérer les clés depuis les variables d'environnement
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
  
  // Log de débogage en mode développement
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 Setting tokens:', { 
      accessToken: accessToken ? 'Set' : 'Empty', 
      refreshToken: refreshToken ? 'Set' : 'Empty',
      tokenKey,
      refreshKey 
    });
  }
  
  // Sauvegarder les tokens
  localStorage.setItem(tokenKey, accessToken);
  if (refreshToken) {
    localStorage.setItem(refreshKey, refreshToken);
  }
}

/**
 * Nettoie tous les tokens d'authentification du localStorage
 * 
 * Cette fonction :
 * - Supprime le token d'accès
 * - Supprime le token de rafraîchissement
 * - Gère les erreurs de localStorage en mode gracieux
 */
export function clearTokens(): void {
  // Vérifier si nous sommes côté client
  if (typeof window === 'undefined') return;
  
  // Récupérer les clés depuis les variables d'environnement
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
  
  try {
    // Supprimer les tokens
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshKey);
  } catch (error) {
    // Ignore les erreurs de localStorage (peut arriver en environnement restrictif)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Erreur lors de la suppression des tokens:', error);
    }
  }
}

/**
 * Vérifie si un token d'authentification valide existe
 * 
 * @returns boolean - true si un token existe, false sinon
 */
export function hasValidToken(): boolean {
  const token = getAuthToken();
  return !!token;
}

// Types et variables pour la gestion des callbacks d'expiration de session
export type SessionExpiredCallback = () => void;
let sessionExpiredCallback: SessionExpiredCallback | null = null;

/**
 * Configure le callback à appeler quand la session expire
 * 
 * @param callback - Fonction à appeler lors de l'expiration de session
 */
export function setSessionExpiredCallback(callback: SessionExpiredCallback): void {
  sessionExpiredCallback = callback;
}

/**
 * Déclenche le callback d'expiration de session
 * 
 * Cette fonction est appelée par fetchWrappers quand une erreur 401 
 * ne peut pas être résolue par un refresh token
 */
export function notifySessionExpired(): void {
  if (sessionExpiredCallback) {
    sessionExpiredCallback();
  }
}