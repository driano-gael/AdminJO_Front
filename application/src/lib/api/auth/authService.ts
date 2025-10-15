/**
 * Service d'authentification pour l'application AdminJO
 *
 * Ce module fournit les fonctionnalités d'authentification utilisateur,
 * incluant la connexion, le rafraîchissement des tokens et la déconnexion.
 *
 * @module auth/authService
 */

import { fetchApi } from '../core/fetchWrappers';
import { setTokens, clearTokens, getRefreshToken } from '../core/tokenHelpers';

/**
 * Interface représentant la réponse d'authentification du serveur.
 */
export interface AuthResponse {
  /** Token d'accès JWT pour les requêtes authentifiées */
  access: string;
  /** Token de rafraîchissement pour renouveler l'accès */
  refresh: string;
  /** Rôle de l'utilisateur (admin, employe, etc.) */
  role: string;
  /** Email de l'utilisateur connecté */
  email: string;
}

/**
 * Interface pour les identifiants de connexion utilisateur.
 */
export interface LoginCredentials {
  /** Adresse email de l'utilisateur */
  email: string;
  /** Mot de passe de l'utilisateur */
  password: string;
}

/**
 * Authentifie un utilisateur avec ses identifiants.
 *
 * Cette fonction envoie les identifiants au serveur et stocke
 * automatiquement les tokens d'authentification en cas de succès.
 *
 * @param credentials - Identifiants de connexion (email et mot de passe)
 * @returns Réponse contenant les tokens d'authentification et les informations utilisateur
 * @throws Si le token d'accès n'est pas trouvé dans la réponse du serveur
 *
 * @example
 * ```typescript
 * try {
 *   const result = await login({
 *     email: "admin@example.com",
 *     password: "password123"
 *   });
 *   console.log(`Connecté en tant que ${result.role}`);
 * } catch (error) {
 *   console.error("Échec de la connexion:", error.message);
 * }
 * ```
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const data = await fetchApi<AuthResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }, false);
  if (!data.access) {
    throw new Error('Token non trouvé dans la réponse du serveur.');
  }
  setTokens(data.access, data.refresh);
  return data;
}

/**
 * Rafraîchit le token d'accès en utilisant le token de rafraîchissement stocké.
 *
 * Cette fonction utilise le refresh token pour obtenir de nouveaux tokens
 * d'authentification. En cas d'échec, elle nettoie automatiquement les tokens stockés.
 *
 * @returns Nouveaux tokens d'authentification et informations utilisateur
 * @throws Si le token de rafraîchissement est manquant ou expiré
 *
 * @example
 * ```typescript
 * try {
 *   const newTokens = await refreshToken();
 *   console.log("Token rafraîchi avec succès");
 * } catch (error) {
 *   console.error("Échec du rafraîchissement:", error.message);
 *   // Redirection vers la page de connexion nécessaire
 * }
 * ```
 */
export async function refreshToken(): Promise<AuthResponse> {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error("Refresh token manquant");
  }
  try {
    const data = await fetchApi<AuthResponse>('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }, false);
    setTokens(data.access, data.refresh);
    return data;
  } catch {
    clearTokens();
    throw new Error("Refresh token expiré");
  }
}

/**
 * Déconnecte l'utilisateur en supprimant tous les tokens d'authentification du stockage local.
 *
 * Cette fonction nettoie complètement la session utilisateur en supprimant
 * les tokens d'accès et de rafraîchissement du localStorage.
 *
 * @example
 * ```typescript
 * logout(); // L'utilisateur est déconnecté
 * // Redirection vers la page de connexion recommandée
 * ```
 */
export function logout(): void {
  clearTokens();
}