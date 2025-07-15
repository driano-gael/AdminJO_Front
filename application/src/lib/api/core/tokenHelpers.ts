export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
  const token = localStorage.getItem(tokenKey);
  return token;
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
  return localStorage.getItem(refreshKey);
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === 'undefined') return;
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
  localStorage.setItem(tokenKey, accessToken);
  if (refreshToken) {
    localStorage.setItem(refreshKey, refreshToken);
  }
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
  try {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshKey);
  } catch (error) {
  }
}


export function isTokenValid(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    const isValid = payload.exp > now;
    return isValid;
  }catch (error) {
    return false;
  }
}

export type SessionExpiredCallback = () => void;
let sessionExpiredCallback: SessionExpiredCallback | null = null;

export function setSessionExpiredCallback(callback: SessionExpiredCallback): void {
  sessionExpiredCallback = callback;
}

export function notifySessionExpired(): void {
  if (sessionExpiredCallback) {
    sessionExpiredCallback();
  }
}