
import { makeRequest, tryRefreshToken } from "./authHelpers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;

if (!baseUrl) throw new Error("API base URL is not défini.");
if (!tokenKey) throw new Error("NEXT_PUBLIC_AUTH_TOKEN_KEY est manquant.");
if (!refreshKey) throw new Error("NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY est manquant.");

export async function fetchApi<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = false
    ): Promise<T>
{
    let response = await makeRequest(endpoint, options, requiresAuth);
    if (response.status === 401 && requiresAuth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
        response = await makeRequest(endpoint, options, requiresAuth);
    } else {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
    }
    const contentType = response.headers.get("Content-Type") || "";
    if (!response.ok) {
    const errorData = contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : {};
    const error = new Error(`(${response.status}) ${errorData.detail || response.statusText}`);
    (error as Error & { data: unknown }).data = errorData;
    throw error;
    }
    return contentType.includes("application/json")
    ? await response.json()
    : ({} as T);
}

