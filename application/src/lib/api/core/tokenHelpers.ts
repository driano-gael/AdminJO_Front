export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!);
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!, accessToken);
  if (refreshToken) {
    localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!, refreshToken);
  }
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!);
  localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!);
}

export function hasValidToken(): boolean {
  const token = getAuthToken();
  return !!token;
}