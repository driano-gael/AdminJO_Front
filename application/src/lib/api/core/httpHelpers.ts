import { getAuthToken } from './tokenHelpers';

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
        }
    }
    
    return headers;
}

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