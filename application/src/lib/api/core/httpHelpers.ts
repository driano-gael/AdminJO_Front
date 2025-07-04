/**
 * Helpers HTTP pour la gestion des requêtes API
 * 
 * Ce fichier contient les fonctions pour :
 * - Construire les headers HTTP avec authentification
 * - Effectuer les requêtes HTTP avec la bonne configuration
 */

import { getAuthToken } from './tokenHelpers';

/**
 * Construit les headers HTTP pour une requête
 * 
 * @param requiresAuth - Indique si la requête nécessite une authentification
 * @param baseHeaders - Headers de base à inclure (optionnel)
 * @returns HeadersInit - Les headers construits
 */
export function buildHeaders(
  requiresAuth: boolean,
  baseHeaders: HeadersInit = {}
): HeadersInit {
    // Headers de base pour toutes les requêtes
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    // Ajouter les headers de base fournis
    if (baseHeaders) {
        if (baseHeaders instanceof Headers) {
            // Si baseHeaders est une instance de Headers
            baseHeaders.forEach((value, key) => {
                headers[key] = value;
            });
        } else if (Array.isArray(baseHeaders)) {
            // Si baseHeaders est un tableau de paires [clé, valeur]
            baseHeaders.forEach(([key, value]) => {
                headers[key] = value;
            });
        } else {
            // Si baseHeaders est un objet simple
            Object.assign(headers, baseHeaders);
        }
    }
    
    // Ajouter l'authentification si nécessaire
    if (requiresAuth) {
        const token = getAuthToken();
        
        // Log de débogage en mode développement
        if (process.env.NODE_ENV === 'development') {
            console.log('🔒 Building auth headers:', { requiresAuth, hasToken: !!token });
        }
        
        if (token) {
            // Ajouter le token Bearer dans les headers
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            // Avertir si l'authentification est requise mais aucun token n'est trouvé
            if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️ Auth required but no token found!');
            }
        }
    }
    
    return headers;
}

/**
 * Effectue une requête HTTP avec les headers appropriés
 * 
 * @param endpoint - L'endpoint de l'API (relatif à la base URL)
 * @param options - Options de la requête fetch
 * @param requiresAuth - Indique si la requête nécessite une authentification
 * @returns Promise<Response> - La réponse HTTP
 */
export async function makeRequest(
    endpoint: string,
    options: RequestInit,
    requiresAuth: boolean
): Promise<Response> {
    // Construire les headers avec ou sans authentification
    const headers = buildHeaders(requiresAuth, options.headers);
    
    // Récupérer l'URL de base depuis les variables d'environnement
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Nettoyer l'endpoint pour éviter les doubles slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Construire l'URL complète
    const fullUrl = `${baseUrl}${cleanEndpoint}`;
    
    // Effectuer la requête avec les options et headers construits
    return fetch(fullUrl, {
        ...options,
        headers,
    });
}