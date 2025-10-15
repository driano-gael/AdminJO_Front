/**
 * Utilitaires de gestion des tokens d'authentification JWT
 *
 * Ce module fournit des fonctions pour la gestion sécurisée des tokens
 * d'authentification dans le localStorage, incluant la validation,
 * le stockage et la gestion des callbacks d'expiration de session.
 *
 * @module core/tokenHelpers
 */

/**
 * Récupère le token d'accès JWT depuis le localStorage.
 *
 * Cette fonction gère automatiquement les erreurs de lecture du localStorage
 * et retourne null en cas de problème ou si l'environnement n'est pas un navigateur.
 *
 * @returns Token d'accès JWT ou null s'il n'existe pas ou en cas d'erreur
 *
 * @example
 * ```typescript
 * const token = getAuthToken();
 * if (token) {
 *   console.log("Utilisateur connecté");
 * } else {
 *   console.log("Aucun token trouvé");
 * }
 * ```
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
    const token = localStorage.getItem(tokenKey);
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Récupère le token de rafraîchissement depuis le localStorage.
 *
 * @returns Token de rafraîchissement ou null s'il n'existe pas
 *
 * @example
 * ```typescript
 * const refreshToken = getRefreshToken();
 * if (refreshToken) {
 *   // Peut tenter un refresh du token d'accès
 * }
 * ```
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
  return localStorage.getItem(refreshKey);
}

/**
 * Stocke les tokens d'authentification dans le localStorage de manière sécurisée.
 *
 * Cette fonction gère automatiquement les erreurs de stockage et ignore
 * silencieusement les tentatives de stockage côté serveur (SSR).
 *
 * @param accessToken - Token d'accès JWT à stocker
 * @param refreshToken - Token de rafraîchissement à stocker (optionnel)
 *
 * @example
 * ```typescript
 * // Stockage des deux tokens après connexion
 * setTokens(authResponse.access, authResponse.refresh);
 *
 * // Stockage du token d'accès uniquement après refresh
 * setTokens(newAccessToken);
 * ```
 */
export function setTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
    const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
    localStorage.setItem(tokenKey, accessToken);
    if (refreshToken) {
      localStorage.setItem(refreshKey, refreshToken);
    }
  } catch (error) {
    console.error('Error setting tokens:', error);
  }
}

/**
 * Supprime tous les tokens d'authentification du localStorage.
 *
 * Cette fonction nettoie complètement la session utilisateur en supprimant
 * à la fois le token d'accès et le token de rafraîchissement.
 *
 * @example
 * ```typescript
 * // Lors de la déconnexion
 * clearTokens();
 *
 * // Lors d'une expiration de session
 * clearTokens();
 * window.location.href = '/login';
 * ```
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
  try {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshKey);
  } catch {
  }
}

/**
 * Vérifie la validité du token d'accès actuel en examinant sa date d'expiration.
 *
 * Cette fonction decode le JWT et compare sa date d'expiration (`exp`) avec
 * l'heure actuelle pour déterminer si le token est encore valide.
 *
 * @returns `true` si le token existe et n'est pas expiré, `false` sinon
 *
 * @example
 * ```typescript
 * if (isTokenValid()) {
 *   console.log("Token valide, l'utilisateur est connecté");
 * } else {
 *   console.log("Token invalide ou expiré");
 *   // Rediriger vers la page de connexion ou tenter un refresh
 * }
 * ```
 */
export function isTokenValid(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    const isValid = payload.exp > now;
    return isValid;
  }catch {
    return false;
  }
}

/**
 * Type pour les fonctions de callback appelées lors de l'expiration de session.
 */
export type SessionExpiredCallback = () => void;

/** Variable globale pour stocker le callback d'expiration */
let sessionExpiredCallback: SessionExpiredCallback | null = null;

/**
 * Définit la fonction callback à exécuter lors de l'expiration de session.
 *
 * Cette fonction permet aux composants de l'application de s'abonner aux
 * événements d'expiration de session pour afficher des modales ou
 * rediriger l'utilisateur.
 *
 * @param callback - Fonction à exécuter lors de l'expiration
 *
 * @example
 * ```typescript
 * // Dans un composant React ou un contexte
 * setSessionExpiredCallback(() => {
 *   setShowSessionExpiredModal(true);
 * });
 *
 * // Ou pour une redirection directe
 * setSessionExpiredCallback(() => {
 *   window.location.href = '/login?expired=true';
 * });
 * ```
 */
export function setSessionExpiredCallback(callback: SessionExpiredCallback): void {
  sessionExpiredCallback = callback;
}

/**
 * Déclenche la notification d'expiration de session en appelant le callback configuré.
 *
 * Cette fonction est appelée automatiquement par le système d'authentification
 * lorsqu'un token ne peut pas être rafraîchi ou est définitivement expiré.
 *
 * @example
 * ```typescript
 * // Usage interne dans fetchApi ou d'autres modules
 * if (tokenRefreshFailed) {
 *   clearTokens();
 *   notifySessionExpired(); // Déclenche le callback configuré
 * }
 * ```
 */
export function notifySessionExpired(): void {
  if (sessionExpiredCallback) {
    sessionExpiredCallback();
  }
}