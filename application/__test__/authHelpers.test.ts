import { buildHeaders, makeRequest, tryRefreshToken } from '@/lib/api/authHelpers';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock fetch
global.fetch = jest.fn();

// Mock Response constructor pour les tests
global.Response = class MockResponse {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Map<string, string>;
  private _body: string;

  constructor(body: string = '{}', init: { status?: number; statusText?: string; headers?: Record<string, string> } = {}) {
    this._body = body;
    this.status = init.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = init.statusText || 'OK';
    this.headers = new Map(Object.entries(init.headers || {}));
  }

  async json() {
    try {
      return JSON.parse(this._body);
    } catch (error) {
      throw new SyntaxError('Unexpected token in JSON');
    }
  }

  async text() {
    return this._body;
  }
} as any;

// Mock des variables d'environnement
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_AUTH_TOKEN_KEY: 'test_auth_token',
    NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY: 'test_refresh_token',
    NEXT_PUBLIC_API_URL: 'http://localhost:8000/api',
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('authHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    (fetch as jest.Mock).mockClear();
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
      localStorageMock.getItem.mockReturnValue('fake-token');
      
      const headers = buildHeaders(true);
      
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token',
      });
      expect(localStorageMock.getItem).toHaveBeenCalledWith('test_auth_token');
    });

    it('n\'ajoute pas d\'autorisation quand requiresAuth est true mais pas de token', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const headers = buildHeaders(true);
      
      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('n\'ajoute pas d\'autorisation côté serveur (window undefined)', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const headers = buildHeaders(true);
      
      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
      
      // Restaurer window
      global.window = originalWindow;
    });

    it('surcharge Content-Type avec les headers personnalisés', () => {
      const customHeaders = {
        'Content-Type': 'multipart/form-data',
      };
      
      const headers = buildHeaders(false, customHeaders);
      
      expect(headers).toEqual({
        'Content-Type': 'multipart/form-data',
      });
    });

    it('combine autorisation et headers personnalisés', () => {
      localStorageMock.getItem.mockReturnValue('fake-token');
      const customHeaders = {
        'Custom-Header': 'custom-value',
      };
      
      const headers = buildHeaders(true, customHeaders);
      
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Custom-Header': 'custom-value',
        'Authorization': 'Bearer fake-token',
      });
    });
  });

  describe('makeRequest', () => {
    it('fait une requête avec les bons headers et URL', async () => {
      const mockResponse = new Response('{}', { status: 200 });
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      await makeRequest('/test-endpoint', { method: 'GET' }, false);
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/test-endpoint',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('inclut l\'autorisation quand requiresAuth est true', async () => {
      localStorageMock.getItem.mockReturnValue('fake-token');
      const mockResponse = new Response('{}', { status: 200 });
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      await makeRequest('/protected-endpoint', { method: 'POST' }, true);
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/protected-endpoint',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake-token',
          },
        }
      );
    });

    it('combine les options passées avec les headers générés', async () => {
      const mockResponse = new Response('{}', { status: 200 });
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      const options = {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
        headers: { 'Custom-Header': 'custom' },
      };
      
      await makeRequest('/endpoint', options, false);
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/endpoint',
        {
          method: 'POST',
          body: JSON.stringify({ data: 'test' }),
          headers: {
            'Content-Type': 'application/json',
            'Custom-Header': 'custom',
          },
        }
      );
    });
  });

  describe('tryRefreshToken', () => {
    it('retourne false quand aucun refresh token n\'est disponible', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = await tryRefreshToken();
      
      expect(result).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('retourne false quand la requête de refresh échoue', async () => {
      localStorageMock.getItem.mockReturnValue('refresh-token');
      const mockResponse = new Response('{}', { status: 401 });
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await tryRefreshToken();
      
      expect(result).toBe(false);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/auth/token/refresh/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: 'refresh-token' }),
        }
      );
    });

    it('retourne false quand la réponse ne contient pas de token d\'accès', async () => {
      localStorageMock.getItem.mockReturnValue('refresh-token');
      const mockResponse = new Response(JSON.stringify({}), { status: 200 });
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await tryRefreshToken();
      
      expect(result).toBe(false);
    });

    it('retourne true et stocke le nouveau token quand le refresh réussit', async () => {
      localStorageMock.getItem.mockReturnValue('refresh-token');
      const mockResponse = new Response(
        JSON.stringify({ access: 'new-access-token' }), 
        { status: 200 }
      );
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await tryRefreshToken();
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test_auth_token',
        'new-access-token'
      );
    });    it('gère les erreurs de réseau gracieusement', async () => {
      localStorageMock.getItem.mockReturnValue('refresh-token');
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // La fonction ne gère pas les erreurs, donc elle va lever l'exception
      await expect(tryRefreshToken()).rejects.toThrow('Network error');
    });

    it('gère les réponses JSON malformées', async () => {
      localStorageMock.getItem.mockReturnValue('refresh-token');
      const mockResponse = new Response('invalid json', { status: 200 });
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // La fonction ne gère pas les erreurs JSON, donc elle va lever l'exception
      await expect(tryRefreshToken()).rejects.toThrow('Unexpected token in JSON');
    });

    it('utilise le bon refresh token depuis localStorage', async () => {
      localStorageMock.getItem.mockReturnValue('specific-refresh-token');
      const mockResponse = new Response(
        JSON.stringify({ access: 'new-token' }), 
        { status: 200 }
      );
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      await tryRefreshToken();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('test_refresh_token');
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ refresh: 'specific-refresh-token' }),
        })
      );
    });
  });

  describe('intégration des fonctions', () => {
    it('buildHeaders et makeRequest fonctionnent ensemble', async () => {
      localStorageMock.getItem.mockReturnValue('test-token');
      const mockResponse = new Response('{}', { status: 200 });
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      await makeRequest('/test', {}, true);
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });
  });
});
