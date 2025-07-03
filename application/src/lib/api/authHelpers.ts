export function buildHeaders(
        requiresAuth: boolean,
        baseHeaders: HeadersInit = {}
    ): HeadersInit
{
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(baseHeaders as Record<string, string>)
    };
    
    if (requiresAuth && typeof window !== 'undefined') {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!);
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
    ): Promise<Response>
{
    const headers = buildHeaders(requiresAuth, options.headers);
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
    });
}


export async function tryRefreshToken(): Promise<boolean> 
{
    const refreshToken = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!);
    if (!refreshToken) return false;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!response.ok) return false;
    const data = await response.json();
    if (data.access) {
        localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!, data.access);
        return true;
    }

    return false;
}