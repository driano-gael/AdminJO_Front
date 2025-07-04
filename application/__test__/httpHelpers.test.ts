import { buildHeaders, makeRequest } from '@/lib/api/core/httpHelpers';
import { getAuthToken } from '@/lib/api/core/tokenHelpers';

// Mock tokenHelpers
jest.mock('@/lib/api/core/tokenHelpers', () => ({
  getAuthToken: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock des variables d'environnement
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_API_URL: 'http://localhost:8000/api',
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('httpHelpers', () => {
  const mockGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthToken.mockReturnValue(null);
  });

  describe('buildHeaders', () => {
    it('construit les headers de base sans authentification', () => {
      const headers = buildHeaders(false);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('ajoute les headers personnalisés', () => {
      const customHeaders = {
        'Custom-Header': 'custom-value',
        'Another-Header': 'another-value',
      };

      const headers = buildHeaders(false, customHeaders);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Custom-Header': 'custom-value',
        'Another-Header': 'another-value',
      });
    });

    it('ajoute le token d\'autorisation quand requiresAuth est true et token disponible', () => {
      mockGetAuthToken.mockReturnValue('test-token');

      const headers = buildHeaders(true);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      });
    });

    it('n\'ajoute pas d\'autorisation quand requiresAuth est true mais pas de token', () => {
      mockGetAuthToken.mockReturnValue(null);

      const headers = buildHeaders(true);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('n\'ajoute pas d\'autorisation quand requiresAuth est false même avec token', () => {
      mockGetAuthToken.mockReturnValue('test-token');

      const headers = buildHeaders(false);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
      expect(mockGetAuthToken).not.toHaveBeenCalled();
    });

    it('surcharge Content-Type avec les headers personnalisés', () => {
      const customHeaders = {
        'Content-Type': 'application/xml',
      };

      const headers = buildHeaders(false, customHeaders);

      expect(headers).toEqual({
        'Content-Type': 'application/xml',
      });
    });

    it('combine autorisation et headers personnalisés', () => {
      mockGetAuthToken.mockReturnValue('auth-token');
      const customHeaders = {
        'Custom-Header': 'value',
        'X-Request-ID': '12345',
      };

      const headers = buildHeaders(true, customHeaders);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Custom-Header': 'value',
        'X-Request-ID': '12345',
        'Authorization': 'Bearer auth-token',
      });
    });

    it('gère les headers avec différents types', () => {
      const headersInit = new Headers({ 'X-Custom': 'test' });

      const headers = buildHeaders(false, headersInit);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'x-custom': 'test', // Headers normalise automatiquement en minuscules
      });
    });

    it('gère un token vide comme pas de token', () => {
      mockGetAuthToken.mockReturnValue('');

      const headers = buildHeaders(true);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
    });
  });

  describe('makeRequest', () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
    } as Response;

    beforeEach(() => {
      mockFetch.mockResolvedValue(mockResponse);
    });

    it('fait une requête avec les bons headers et URL', async () => {
      await makeRequest('/test-endpoint', { method: 'GET' }, false);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/test-endpoint', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('inclut l\'autorisation quand requiresAuth est true', async () => {
      mockGetAuthToken.mockReturnValue('bearer-token');

      await makeRequest('/protected-endpoint', { method: 'POST' }, true);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/protected-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer bearer-token',
        },
      });
    });

    it('combine les options passées avec les headers générés', async () => {
      const options = {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
        headers: { 'X-Custom': 'value' },
      };

      await makeRequest('/custom', options, false);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/custom', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
        headers: {
          'Content-Type': 'application/json',
          'X-Custom': 'value',
        },
      });
    });

    it('utilise l\'URL de base depuis les variables d\'environnement', async () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';

      await makeRequest('/endpoint', {}, false);

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/endpoint', expect.any(Object));
    });

    it('retourne la réponse fetch', async () => {
      const result = await makeRequest('/test', {}, false);

      expect(result).toBe(mockResponse);
    });

    it('propage les erreurs de fetch', async () => {
      const fetchError = new Error('Network error');
      mockFetch.mockRejectedValue(fetchError);

      await expect(makeRequest('/error', {}, false)).rejects.toThrow('Network error');
    });

    it('gère les endpoints avec et sans slash initial', async () => {
      await makeRequest('no-slash', {}, false);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/no-slash', expect.any(Object));

      await makeRequest('/with-slash', {}, false);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/with-slash', expect.any(Object));
    });

    it('préserve toutes les options RequestInit', async () => {
      const options: RequestInit = {
        method: 'PUT',
        body: 'test-body',
        cache: 'no-cache',
        credentials: 'include',
        redirect: 'follow',
        signal: new AbortController().signal,
      };

      await makeRequest('/full-options', options, false);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/full-options', {
        ...options,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('intégration buildHeaders et makeRequest', () => {
    const mockResponse = {
      ok: true,
      status: 200,
    } as Response;

    beforeEach(() => {
      mockFetch.mockResolvedValue(mockResponse);
    });

    it('buildHeaders et makeRequest fonctionnent ensemble', async () => {
      mockGetAuthToken.mockReturnValue('integration-token');

      await makeRequest('/integration', { method: 'POST' }, true);

      expect(mockGetAuthToken).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer integration-token',
        },
      });
    });

    it('gère correctement les requêtes sans authentification', async () => {
      await makeRequest('/public', { method: 'GET' }, false);

      expect(mockGetAuthToken).not.toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/public', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('gestion des erreurs', () => {
    it('gère les erreurs de getAuthToken', () => {
      mockGetAuthToken.mockImplementation(() => {
        throw new Error('Token retrieval error');
      });

      expect(() => buildHeaders(true)).toThrow('Token retrieval error');
    });

    it('gère les URL de base manquantes', async () => {
      delete process.env.NEXT_PUBLIC_API_URL;

      await makeRequest('/test', {}, false);

      expect(mockFetch).toHaveBeenCalledWith('undefined/test', expect.any(Object));
    });
  });

  describe('scénarios de types de headers', () => {
    it('gère les headers comme objet Record', () => {
      const headers: Record<string, string> = {
        'X-API-Key': 'key123',
        'Accept': 'application/json',
      };

      const result = buildHeaders(false, headers);

      expect(result).toEqual({
        'Content-Type': 'application/json',
        'X-API-Key': 'key123',
        'Accept': 'application/json',
      });
    });

    it('gère les headers comme tableau de tuples', () => {
      const headers: [string, string][] = [
        ['X-Version', '1.0'],
        ['X-Client', 'test'],
      ];

      const result = buildHeaders(false, headers);

      expect(result).toEqual({
        'Content-Type': 'application/json',
        'X-Version': '1.0',
        'X-Client': 'test',
      });
    });
  });
});
