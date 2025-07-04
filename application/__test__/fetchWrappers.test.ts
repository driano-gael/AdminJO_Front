import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { makeRequest } from '@/lib/api/core/httpHelpers';

// Mock du module httpHelpers
jest.mock('@/lib/api/core/httpHelpers', () => ({
  makeRequest: jest.fn(),
}));

// Mock du module authService pour le refresh automatique
jest.mock('@/lib/api/auth/authService', () => ({
  refreshToken: jest.fn(),
}));

// Mock des variables d'environnement
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_API_URL: 'http://localhost:8000/api',
    NEXT_PUBLIC_AUTH_TOKEN_KEY: 'test_auth_token',
    NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY: 'test_refresh_token',
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('fetchWrappers', () => {
  const mockMakeRequest = makeRequest as jest.MockedFunction<typeof makeRequest>;
  // Import du service mocké pour le refresh
  const mockRefreshToken = require('@/lib/api/auth/authService').refreshToken;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchApi', () => {
    const mockSuccessResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: jest.fn().mockResolvedValue({ data: 'test' }),
    } as unknown as Response;

    it('effectue une requête réussie avec du JSON', async () => {
      mockMakeRequest.mockResolvedValue(mockSuccessResponse);

      const result = await fetchApi('/test', { method: 'GET' });

      expect(mockMakeRequest).toHaveBeenCalledWith('/test', { method: 'GET' }, false);
      expect(result).toEqual({ data: 'test' });
    });

    it('effectue une requête sans authentification par défaut', async () => {
      mockMakeRequest.mockResolvedValue(mockSuccessResponse);

      await fetchApi('/test');

      expect(mockMakeRequest).toHaveBeenCalledWith('/test', {}, false);
    });

    it('effectue une requête avec authentification quand requis', async () => {
      mockMakeRequest.mockResolvedValue(mockSuccessResponse);

      await fetchApi('/protected', { method: 'GET' }, true);

      expect(mockMakeRequest).toHaveBeenCalledWith('/protected', { method: 'GET' }, true);
    });

    it('retourne un objet vide pour les réponses non-JSON', async () => {
      const nonJsonResponse = {
        ...mockSuccessResponse,
        headers: new Headers({ 'Content-Type': 'text/plain' }),
      } as Response;
      mockMakeRequest.mockResolvedValue(nonJsonResponse);

      const result = await fetchApi('/text');

      expect(result).toEqual({});
    });

    it('gère les réponses sans header Content-Type', async () => {
      const noContentTypeResponse = {
        ...mockSuccessResponse,
        headers: new Headers(),
      } as Response;
      mockMakeRequest.mockResolvedValue(noContentTypeResponse);

      const result = await fetchApi('/no-content-type');

      expect(result).toEqual({});
    });

    describe('gestion des erreurs', () => {
      it('lève une erreur pour une réponse 400', async () => {
        const errorResponse = {
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: jest.fn().mockResolvedValue({ detail: 'Données invalides' }),
        } as unknown as Response;
        mockMakeRequest.mockResolvedValue(errorResponse);

        await expect(fetchApi('/error')).rejects.toThrow('(400) Données invalides');
      });

      it('lève une erreur avec le statusText si detail est manquant', async () => {
        const errorResponse = {
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: jest.fn().mockResolvedValue({}),
        } as unknown as Response;
        mockMakeRequest.mockResolvedValue(errorResponse);

        await expect(fetchApi('/error')).rejects.toThrow('(500) Internal Server Error');
      });

      it('gère les erreurs avec des réponses non-JSON', async () => {
        const errorResponse = {
          ok: false,
          status: 404,
          statusText: 'Not Found',
          headers: new Headers({ 'Content-Type': 'text/plain' }),
          json: jest.fn().mockRejectedValue(new Error('Not JSON')),
        } as unknown as Response;
        mockMakeRequest.mockResolvedValue(errorResponse);

        await expect(fetchApi('/not-found')).rejects.toThrow('(404) Not Found');
      });

      it('attache les données d\'erreur à l\'objet Error', async () => {
        const errorData = { detail: 'Erreur spécifique', code: 'E001' };
        const errorResponse = {
          ok: false,
          status: 422,
          statusText: 'Unprocessable Entity',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: jest.fn().mockResolvedValue(errorData),
        } as unknown as Response;
        mockMakeRequest.mockResolvedValue(errorResponse);

        try {
          await fetchApi('/validation-error');
          fail('L\'erreur aurait dû être levée');
        } catch (error: any) {
          expect(error.message).toBe('(422) Erreur spécifique');
          expect(error.data).toEqual(errorData);
        }
      });
    });

    describe('gestion de l\'authentification 401', () => {
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ detail: 'Token invalide' }),
      } as unknown as Response;

      it('tente de rafraîchir le token en cas de 401 avec auth requise', async () => {
        mockMakeRequest
          .mockResolvedValueOnce(unauthorizedResponse)
          .mockResolvedValueOnce(mockSuccessResponse);
        mockRefreshToken.mockResolvedValue({ access: 'new-token', refresh: 'new-refresh' });

        const result = await fetchApi('/protected', {}, true);

        expect(mockMakeRequest).toHaveBeenCalledTimes(2);
        expect(mockRefreshToken).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ data: 'test' });
      });

      it('lève une erreur si le rafraîchissement du token échoue', async () => {
        mockMakeRequest.mockResolvedValue(unauthorizedResponse);
        mockRefreshToken.mockRejectedValue(new Error('Refresh failed'));

        await expect(fetchApi('/protected', {}, true)).rejects.toThrow('Session expirée. Veuillez vous reconnecter.');

        expect(mockMakeRequest).toHaveBeenCalledTimes(1);
        expect(mockRefreshToken).toHaveBeenCalledTimes(1);
      });

      it('ne tente pas de rafraîchir le token si auth n\'est pas requise', async () => {
        mockMakeRequest.mockResolvedValue(unauthorizedResponse);

        await expect(fetchApi('/public', {}, false)).rejects.toThrow('(401) Token invalide');

        expect(mockMakeRequest).toHaveBeenCalledTimes(1);
        expect(mockRefreshToken).not.toHaveBeenCalled();
      });

      it('ne tente pas de rafraîchir le token si le statut n\'est pas 401', async () => {
        const forbiddenResponse = {
          ...unauthorizedResponse,
          status: 403,
          statusText: 'Forbidden',
        } as Response;
        mockMakeRequest.mockResolvedValue(forbiddenResponse);

        await expect(fetchApi('/forbidden', {}, true)).rejects.toThrow('(403) Token invalide');

        expect(mockMakeRequest).toHaveBeenCalledTimes(1);
        expect(mockRefreshToken).not.toHaveBeenCalled();
      });
    });

    describe('configuration des options', () => {
      it('transmet les options personnalisées à makeRequest', async () => {
        mockMakeRequest.mockResolvedValue(mockSuccessResponse);
        const customOptions = {
          method: 'POST',
          body: JSON.stringify({ test: 'data' }),
          headers: { 'Custom-Header': 'value' },
        };

        await fetchApi('/custom', customOptions, true);

        expect(mockMakeRequest).toHaveBeenCalledWith('/custom', customOptions, true);
      });

      it('utilise les options par défaut si aucune n\'est fournie', async () => {
        mockMakeRequest.mockResolvedValue(mockSuccessResponse);

        await fetchApi('/default');

        expect(mockMakeRequest).toHaveBeenCalledWith('/default', {}, false);
      });
    });

    describe('types de réponse', () => {
      it('parse correctement les réponses JSON complexes', async () => {
        const complexData = {
          users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
          meta: { total: 2, page: 1 },
        };
        const complexResponse = {
          ...mockSuccessResponse,
          json: jest.fn().mockResolvedValue(complexData),
        } as unknown as Response;
        mockMakeRequest.mockResolvedValue(complexResponse);

        const result = await fetchApi<typeof complexData>('/users');

        expect(result).toEqual(complexData);
      });

      it('gère les réponses avec différents Content-Types JSON', async () => {
        const jsonResponse = {
          ...mockSuccessResponse,
          headers: new Headers({ 'Content-Type': 'application/json; charset=utf-8' }),
        } as Response;
        mockMakeRequest.mockResolvedValue(jsonResponse);

        const result = await fetchApi('/charset');

        expect(result).toEqual({ data: 'test' });
      });
    });
  });

  describe('validation des variables d\'environnement', () => {
    it('lève une erreur si NEXT_PUBLIC_API_URL est manquante', () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      
      expect(() => {
        jest.isolateModules(() => {
          require('@/lib/api/core/fetchWrappers');
        });
      }).toThrow('API base URL is not défini.');
    });

    it('lève une erreur si NEXT_PUBLIC_AUTH_TOKEN_KEY est manquante', () => {
      delete process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY;
      
      expect(() => {
        jest.isolateModules(() => {
          require('@/lib/api/core/fetchWrappers');
        });
      }).toThrow('NEXT_PUBLIC_AUTH_TOKEN_KEY est manquant.');
    });

    it('lève une erreur si NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY est manquante', () => {
      delete process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY;
      
      expect(() => {
        jest.isolateModules(() => {
          require('@/lib/api/core/fetchWrappers');
        });
      }).toThrow('NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY est manquant.');
    });
  });

  describe('scénarios d\'intégration', () => {
    it('gère un flux complet avec authentification et rafraîchissement', async () => {
      // Premier appel : 401
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ detail: 'Token expiré' }),
      } as unknown as Response;

      // Deuxième appel : succès après rafraîchissement
      const successResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ message: 'Succès après rafraîchissement' }),
      } as unknown as Response;

      mockMakeRequest
        .mockResolvedValueOnce(unauthorizedResponse)
        .mockResolvedValueOnce(successResponse);
      mockRefreshToken.mockResolvedValue({ access: 'new-token', refresh: 'new-refresh' });

      const result = await fetchApi('/protected-resource', { method: 'GET' }, true);

      expect(result).toEqual({ message: 'Succès après rafraîchissement' });
      expect(mockMakeRequest).toHaveBeenCalledTimes(2);
      expect(mockRefreshToken).toHaveBeenCalledTimes(1);
    });
  });
});
