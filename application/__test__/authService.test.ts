import { login, logout, refreshToken } from '@/lib/api/authService';
import { fetchApi } from '@/lib/api/fetchWrappers';

// Mock du module fetchWrappers
jest.mock('@/lib/api/fetchWrappers', () => ({
  fetchApi: jest.fn(),
}));

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

// Mock des variables d'environnement
const originalEnv = process.env;

describe('authService', () => {
  const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Restaurer les variables d'environnement par défaut pour chaque test
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

  describe('login', () => {
    const mockLoginData = {
      email: 'admin@test.com',
      password: 'password123'
    };

    const mockApiResponse = {
      access: 'test-access-token',
      refresh: 'test-refresh-token'
    };

    it('effectue une connexion réussie et stocke les tokens', async () => {
      mockFetchApi.mockResolvedValue(mockApiResponse);

      const result = await login(mockLoginData);

      expect(mockFetchApi).toHaveBeenCalledWith('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(mockLoginData),
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_auth_token', 'test-access-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_refresh_token', 'test-refresh-token');
      expect(result).toEqual(mockApiResponse);
    });

    it('lève une erreur si le token access est manquant dans la réponse', async () => {
      const invalidResponse = { refresh: 'test-refresh-token' };
      mockFetchApi.mockResolvedValue(invalidResponse);

      await expect(login(mockLoginData)).rejects.toThrow('Token non trouvé dans la réponse du serveur.');

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('lève une erreur si les clés de token sont manquantes dans l\'environnement', async () => {
      // Utiliser jest.isolateModules pour forcer la re-importation du module
      await jest.isolateModules(async () => {
        delete process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY;
        
        // Re-importer le module dans cet environnement isolé
        const { login: isolatedLogin } = await import('@/lib/api/authService');
        mockFetchApi.mockResolvedValue(mockApiResponse);

        try {
          await isolatedLogin(mockLoginData);
          fail('Le test aurait dû lever une erreur');
        } catch (error: any) {
          expect(error.message).toContain("Clé de token manquante dans les variables");
          expect(error.message).toContain("environnement");
        }

        expect(localStorageMock.setItem).not.toHaveBeenCalled();
      });
    });

    it('lève une erreur si la clé refresh est manquante dans l\'environnement', async () => {
      await jest.isolateModules(async () => {
        delete process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY;
        
        const { login: isolatedLogin } = await import('@/lib/api/authService');
        mockFetchApi.mockResolvedValue(mockApiResponse);

        try {
          await isolatedLogin(mockLoginData);
          fail('Le test aurait dû lever une erreur');
        } catch (error: any) {
          expect(error.message).toContain("Clé de token manquante dans les variables");
          expect(error.message).toContain("environnement");
        }

        expect(localStorageMock.setItem).not.toHaveBeenCalled();
      });
    });

    it('propage les erreurs de l\'API', async () => {
      const apiError = new Error('Identifiants invalides');
      mockFetchApi.mockRejectedValue(apiError);

      await expect(login(mockLoginData)).rejects.toThrow('Identifiants invalides');

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('appelle l\'API avec les bonnes données de formulaire', async () => {
      mockFetchApi.mockResolvedValue(mockApiResponse);
      const customLoginData = {
        email: 'user@example.com',
        password: 'mypassword'
      };

      await login(customLoginData);

      expect(mockFetchApi).toHaveBeenCalledWith('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(customLoginData),
      });
    });
  });

  describe('logout', () => {
    it('supprime le token d\'authentification du localStorage', () => {
      logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_auth_token');
    });

    it('ne lève pas d\'erreur si le token n\'existe pas', () => {
      expect(() => logout()).not.toThrow();
    });

    it('utilise la bonne clé de token depuis l\'environnement', () => {
      process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY = 'custom_token_key';
      
      logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('custom_token_key');
    });
  });

  describe('refreshToken', () => {
    const mockRefreshResponse = {
      access: 'new-access-token',
      refresh: 'new-refresh-token'
    };

    it('rafraîchit le token avec succès', async () => {
      localStorageMock.getItem.mockReturnValue('existing-refresh-token');
      mockFetchApi.mockResolvedValue(mockRefreshResponse);

      const result = await refreshToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('test_refresh_token');
      expect(mockFetchApi).toHaveBeenCalledWith('/auth/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: 'existing-refresh-token' }),
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_auth_token', 'new-access-token');
      expect(result).toEqual(mockRefreshResponse);
    });

    it('lève une erreur si le refresh token est manquant', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      await expect(refreshToken()).rejects.toThrow('Refresh token manquant');

      expect(mockFetchApi).not.toHaveBeenCalled();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('lève une erreur si le refresh token est une chaîne vide', async () => {
      localStorageMock.getItem.mockReturnValue('');

      await expect(refreshToken()).rejects.toThrow('Refresh token manquant');

      expect(mockFetchApi).not.toHaveBeenCalled();
    });

    it('propage les erreurs de l\'API lors du rafraîchissement', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-refresh-token');
      const apiError = new Error('Refresh token invalide');
      mockFetchApi.mockRejectedValue(apiError);

      await expect(refreshToken()).rejects.toThrow('Refresh token invalide');

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('utilise les bonnes clés d\'environnement', async () => {
      process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY = 'custom_refresh_key';
      process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY = 'custom_token_key';
      
      localStorageMock.getItem.mockReturnValue('test-refresh-token');
      mockFetchApi.mockResolvedValue(mockRefreshResponse);

      await refreshToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('custom_refresh_key');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('custom_token_key', 'new-access-token');
    });
  });

  describe('intégration', () => {
    it('peut effectuer un cycle complet login -> refresh -> logout', async () => {
      // Login
      const loginData = { email: 'test@test.com', password: 'password' };
      const loginResponse = { access: 'access-token', refresh: 'refresh-token' };
      mockFetchApi.mockResolvedValueOnce(loginResponse);

      await login(loginData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_auth_token', 'access-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_refresh_token', 'refresh-token');

      // Refresh
      localStorageMock.getItem.mockReturnValue('refresh-token');
      const refreshResponse = { access: 'new-access-token', refresh: 'new-refresh-token' };
      mockFetchApi.mockResolvedValueOnce(refreshResponse);

      await refreshToken();

      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_auth_token', 'new-access-token');

      // Logout
      logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_auth_token');
    });
  });
});
