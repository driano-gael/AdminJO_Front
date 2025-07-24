import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { getAuthToken, isTokenValid } from '@/lib/api/core/tokenHelpers';
import { refreshToken } from '@/lib/api/auth/authService';

// Mock des dépendances
jest.mock('@/lib/api/core/tokenHelpers');
jest.mock('@/lib/api/auth/authService');

const mockGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;
const mockIsTokenValid = isTokenValid as jest.MockedFunction<typeof isTokenValid>;
const mockRefreshToken = refreshToken as jest.MockedFunction<typeof refreshToken>;

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('FetchWrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://127.0.0.1:8000/api';
  });

  describe('fetchApi', () => {
    it('should make authenticated request successfully', async () => {
      const mockResponse = { data: 'test' };
      mockGetAuthToken.mockReturnValue('valid_token');
      mockIsTokenValid.mockReturnValue(true);
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
        headers: { get: () => 'application/json' }
      });

      const result = await fetchApi('/test');

      expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/test', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid_token'
        }
      });
      expect(result).toEqual(mockResponse);
    });

    it('should make unauthenticated request when requireAuth is false', async () => {
      const mockResponse = { data: 'test' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
        headers: { get: () => 'application/json' }
      });

      const result = await fetchApi('/test', {}, false);

      expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/test', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(result).toEqual(mockResponse);
    });

    it('should refresh token when expired and retry request', async () => {
      const mockResponse = { data: 'test' };
      
      // Premier appel : token valide mais serveur retourne 401
      mockGetAuthToken.mockReturnValue('expired_token');
      mockIsTokenValid.mockReturnValue(true);
      
      // Premier fetch retourne 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValue({}),
        headers: { get: () => 'application/json' }
      });
      
      // Refresh token réussit
      mockRefreshToken.mockResolvedValue({
        access: 'new_token',
        refresh: 'new_refresh'
      });
      
      // Deuxième fetch avec nouveau token réussit
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
        headers: { get: () => 'application/json' }
      });

      const result = await fetchApi('/test');

      expect(mockRefreshToken).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResponse);
    });

    it('should handle 401 unauthorized error', async () => {
      mockGetAuthToken.mockReturnValue('valid_token');
      mockIsTokenValid.mockReturnValue(true);
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: jest.fn().mockResolvedValue('Unauthorized'),
        json: jest.fn().mockResolvedValue({ detail: 'Unauthorized' }),
        headers: { get: () => 'application/json' }
      });

      await expect(fetchApi('/test')).rejects.toThrow('(401) Unauthorized');
    });

    it('should handle network errors', async () => {
      mockGetAuthToken.mockReturnValue('valid_token');
      mockIsTokenValid.mockReturnValue(true);
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(fetchApi('/test')).rejects.toThrow('Network error');
    });

    it('should handle non-JSON responses', async () => {
      mockGetAuthToken.mockReturnValue('valid_token');
      mockIsTokenValid.mockReturnValue(true);
      mockFetch.mockResolvedValue({
        ok: true,
        headers: { get: () => 'text/plain' },
        text: jest.fn().mockResolvedValue('Plain text response')
      });

      const result = await fetchApi('/test');

      expect(result).toEqual({});
    });

    it('should handle custom options', async () => {
      const mockResponse = { data: 'test' };
      mockGetAuthToken.mockReturnValue('valid_token');
      mockIsTokenValid.mockReturnValue(true);
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
        headers: { get: () => 'application/json' }
      });

      const customOptions = {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
        headers: { 'Custom-Header': 'value' }
      };

      await fetchApi('/test', customOptions);

      expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/test', {
        ...customOptions,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid_token',
          'Custom-Header': 'value'
        }
      });
    });

    it('should handle refresh token failure', async () => {
      // Premier appel : token valide mais serveur retourne 401
      mockGetAuthToken.mockReturnValue('expired_token');
      mockIsTokenValid.mockReturnValue(true);
      
      // Premier fetch retourne 401
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValue({}),
        headers: { get: () => 'application/json' }
      });
      
      // Refresh token échoue
      mockRefreshToken.mockRejectedValue(new Error('Refresh failed'));

      await expect(fetchApi('/test')).rejects.toThrow('Session expirée. Veuillez vous reconnecter.');
    });
  });
});
