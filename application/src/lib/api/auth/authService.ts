import { fetchApi } from '../core/fetchWrappers';
import { setTokens, clearTokens, getRefreshToken } from '../core/tokenHelpers';

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

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

export async function refreshToken(): Promise<AuthResponse> {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error("Refresh token manquant");
  }

  const data = await fetchApi<AuthResponse>('/auth/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  }, false);

  setTokens(data.access);
  return data;
}

export function logout(): void {
  clearTokens();
}