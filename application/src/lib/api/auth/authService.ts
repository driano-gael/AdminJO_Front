/**
 * Service d'authentification pour l'API Django REST
 * 
 * Ce service gère :
 * - La connexion des utilisateurs (login)
 * - Le rafraîchissement des tokens (refresh)
 * - La déconnexion (logout)
 * - La sauvegarde et nettoyage des tokens
 */

import { fetchApi } from '../core/fetchWrappers';
import { setTokens, clearTokens, getRefreshToken } from '../core/tokenHelpers';

/**
 * Interface pour la réponse d'authentification de l'API Django
 */
export interface AuthResponse {
  access: string;   // Token d'accès JWT
  refresh: string;  // Token de rafraîchissement JWT
}

/**
 * Interface pour les données de connexion
 */
export interface LoginCredentials {
  email: string;    // Email de l'utilisateur
  password: string; // Mot de passe de l'utilisateur
}

/**
 * Authentifie un utilisateur auprès de l'API Django
 * 
 * Cette fonction :
 * - Envoie les credentials à l'endpoint de login Django
 * - Récupère les tokens d'accès et de rafraîchissement
 * - Sauvegarde les tokens dans le localStorage
 * - Ne nécessite pas d'authentification (requiresAuth = false)
 * 
 * @param credentials - Email et mot de passe de l'utilisateur
 * @returns Promise<AuthResponse> - Les tokens d'authentification
 * @throws Error - Si les credentials sont invalides ou si l'API est inaccessible
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Appeler l'endpoint de login Django (POST /auth/login/)
  const data = await fetchApi<AuthResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }, false); // false = pas besoin d'authentification pour se connecter

  // Vérifier que la réponse contient un token d'accès
  if (!data.access) {
    throw new Error('Token non trouvé dans la réponse du serveur.');
  }

  // Sauvegarder les tokens dans le localStorage
  setTokens(data.access, data.refresh);
  
  return data;
}

/**
 * Rafraîchit le token d'authentification en utilisant le refresh token
 * 
 * Cette fonction :
 * - Récupère le refresh token depuis le localStorage
 * - Appelle l'endpoint de refresh Django
 * - Sauvegarde les nouveaux tokens
 * - Nettoie les tokens si le refresh échoue
 * - Est appelée automatiquement par fetchApi en cas d'erreur 401
 * 
 * @returns Promise<AuthResponse> - Les nouveaux tokens
 * @throws Error - Si le refresh token est manquant, expiré ou invalide
 */
export async function refreshToken(): Promise<AuthResponse> {
  // Récupérer le refresh token depuis le localStorage
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error("Refresh token manquant");
  }

  try {
    // Appeler l'endpoint de refresh Django (POST /auth/token/refresh/)
    const data = await fetchApi<AuthResponse>('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }, false); // false = pas besoin d'authentification pour rafraîchir le token

    // Sauvegarder les nouveaux tokens
    setTokens(data.access, data.refresh);
    
    return data;
  } catch (error) {
    // Si le refresh échoue, c'est que le refresh token est expiré
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur lors du refresh token:', error);
    }
    
    // Nettoyer tous les tokens invalides
    clearTokens();
    
    // Relancer l'erreur avec un message explicite
    throw new Error("Refresh token expiré");
  }
}

/**
 * Déconnecte l'utilisateur en nettoyant tous les tokens
 * 
 * Cette fonction :
 * - Supprime les tokens du localStorage
 * - Ne fait pas d'appel API (le logout côté serveur n'est pas implémenté)
 * - Est une opération locale uniquement
 */
export function logout(): void {
  clearTokens();
}