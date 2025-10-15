/**
 * Utilitaires HTTP pour la construction de requêtes et headers
 *
 * Ce module fournit des fonctions utilitaires pour la construction automatique
 * des en-têtes HTTP, la gestion de l'authentification Bearer et l'exécution
 * de requêtes HTTP avec configuration automatique.
 *
 * @module core/httpHelpers
 */

import { getAuthToken } from './tokenHelpers';

/**
 * Construit les en-têtes HTTP pour une requête avec gestion conditionnelle de l'authentification.
 *
 * Cette fonction :
 * - Ajoute automatiquement le Content-Type application/json
 * - Merge les en-têtes de base fournis avec les en-têtes par défaut
 * - Ajoute l'en-tête Authorization Bearer si l'authentification est requise
 * - Gère différents formats d'en-têtes (Headers, Array, Object)
 * - Affiche des warnings en développement si l'authentification est requise mais aucun token n'est trouvé
 *
 * @param requiresAuth - Indique si l'autorisation Bearer doit être ajoutée
 * @param baseHeaders - En-têtes de base à inclure dans la requête
 * @returns En-têtes construits avec Content-Type et Authorization si nécessaire
 *
 * @example
 * ```typescript
 * // Headers pour requête authentifiée
 * const authHeaders = buildHeaders(true);
 * // Résultat: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <token>' }
 *
 * // Headers pour requête publique avec headers personnalisés
 * const publicHeaders = buildHeaders(false, { 'Accept-Language': 'fr-FR' });
 * // Résultat: { 'Content-Type': 'application/json', 'Accept-Language': 'fr-FR' }
 *
 * // Avec un objet Headers
 * const customHeaders = new Headers({ 'Custom-Header': 'value' });
 * const headers = buildHeaders(true, customHeaders);
 * ```
 */
export function buildHeaders(
  requiresAuth: boolean,
  baseHeaders: HeadersInit = {}
): HeadersInit {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (baseHeaders) {
        if (baseHeaders instanceof Headers) {
            baseHeaders.forEach((value, key) => {
                headers[key] = value;
            });
        } else if (Array.isArray(baseHeaders)) {
            baseHeaders.forEach(([key, value]) => {
                headers[key] = value;
            });
        } else {
            Object.assign(headers, baseHeaders);
        }
    }
    if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️ Auth required but no token found!');
            }
        }
    }
    return headers;
}

/**
 * Exécute une requête HTTP avec construction automatique de l'URL et des en-têtes.
 *
 * Cette fonction :
 * - Construit automatiquement l'URL complète à partir de l'endpoint et de l'URL de base
 * - Normalise l'endpoint (ajoute le / initial si nécessaire)
 * - Construit les en-têtes avec gestion de l'authentification
 * - Exécute la requête fetch avec la configuration complète
 *
 * @param endpoint - Point de terminaison de l'API (ex: '/users/client/' ou 'users/client/')
 * @param options - Options de la requête fetch (méthode, body, etc.)
 * @param requiresAuth - Indique si la requête nécessite une authentification
 * @returns Réponse HTTP brute (non parsée)
 *
 * @example
 * ```typescript
 * // Requête GET simple
 * const response = await makeRequest('/users/client/', {}, true);
 * const data = await response.json();
 *
 * // Requête POST avec données
 * const response = await makeRequest('/users/client/', {
 *   method: 'POST',
 *   body: JSON.stringify({ nom: 'Dupont', email: 'dupont@example.com' })
 * }, true);
 *
 * // Requête sans authentification
 * const response = await makeRequest('/auth/login/', {
 *   method: 'POST',
 *   body: JSON.stringify({ email, password })
 * }, false);
 * ```
 */
export async function makeRequest(
    endpoint: string,
    options: RequestInit,
    requiresAuth: boolean
): Promise<Response> {
    const headers = buildHeaders(requiresAuth, options.headers);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `${baseUrl}${cleanEndpoint}`;
    return fetch(fullUrl, {
        ...options,
        headers,
    });
}