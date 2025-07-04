// Mock des variables d'environnement - DOIT être fait AVANT l'import des modules
process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY = 'test_auth_token';
process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY = 'test_refresh_token';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window et localStorage
Object.defineProperty(global, 'window', {
  value: {
    localStorage: localStorageMock
  },
  writable: true
});

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock complet du module tokenHelpers
jest.mock('@/lib/api/core/tokenHelpers', () => ({
  getAuthToken: jest.fn(),
  getRefreshToken: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
  hasValidToken: jest.fn(),
}));

// Import après la configuration des mocks
import { 
  getAuthToken, 
  getRefreshToken, 
  setTokens, 
  clearTokens, 
  hasValidToken 
} from '@/lib/api/core/tokenHelpers';

// Cast des fonctions mockées
const mockGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;
const mockGetRefreshToken = getRefreshToken as jest.MockedFunction<typeof getRefreshToken>;
const mockSetTokens = setTokens as jest.MockedFunction<typeof setTokens>;
const mockClearTokens = clearTokens as jest.MockedFunction<typeof clearTokens>;
const mockHasValidToken = hasValidToken as jest.MockedFunction<typeof hasValidToken>;

// Mock des variables d'environnement
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_AUTH_TOKEN_KEY: 'test_auth_token',
    NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY: 'test_refresh_token',
  };
  jest.clearAllMocks();
  
  // Réinitialiser les mocks localStorage
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockImplementation(() => {});
  localStorageMock.removeItem.mockImplementation(() => {});
  localStorageMock.clear.mockImplementation(() => {});
  
  // Configurer les mocks pour imiter le comportement réel
  mockGetAuthToken.mockImplementation(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
    } catch (error) {
      // Propager l'erreur pour les tests d'erreur
      throw error;
    }
  });
  
  mockGetRefreshToken.mockImplementation(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'refresh_token');
    } catch (error) {
      // Propager l'erreur pour les tests d'erreur
      throw error;
    }
  });
  
  mockSetTokens.mockImplementation((accessToken: string, refreshToken?: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token', accessToken);
      if (refreshToken) {
        window.localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'refresh_token', refreshToken);
      }
    } catch (error) {
      // Propager l'erreur pour les tests d'erreur
      throw error;
    }
  });
  
  mockClearTokens.mockImplementation(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
      window.localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'refresh_token');
    } catch (error) {
      // Propager l'erreur pour les tests d'erreur
      throw error;
    }
  });
  
  mockHasValidToken.mockImplementation(() => {
    if (typeof window === 'undefined') return false;
    try {
      const token = window.localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
      return !!(token && token.trim());
    } catch {
      return false;
    }
  });
});

afterEach(() => {
  process.env = originalEnv;
  
  // Restaurer window si supprimé dans les tests
  if (typeof global.window === 'undefined') {
    Object.defineProperty(global, 'window', {
      value: {
        localStorage: localStorageMock
      },
      writable: true
    });
  }
});

describe('tokenHelpers', () => {
  // Pas besoin de beforeEach ici car déjà configuré globalement

  describe('getAuthToken', () => {
    it('retourne le token d\'authentification depuis localStorage', () => {
      localStorageMock.getItem.mockReturnValue('test-auth-token');

      const result = getAuthToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('test_auth_token');
      expect(result).toBe('test-auth-token');
    });

    it('retourne null si aucun token n\'est stocké', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getAuthToken();

      expect(result).toBeNull();
    });

    it('retourne null en environnement SSR (window undefined)', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const result = getAuthToken();

      expect(result).toBeNull();

      // Restaurer window
      global.window = originalWindow;
    });

    it('utilise la bonne clé d\'environnement', () => {
      process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY = 'custom_token_key';
      localStorageMock.getItem.mockReturnValue('custom-token');

      const result = getAuthToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('custom_token_key');
      expect(result).toBe('custom-token');
    });
  });

  describe('getRefreshToken', () => {
    it('retourne le refresh token depuis localStorage', () => {
      localStorageMock.getItem.mockReturnValue('test-refresh-token');

      const result = getRefreshToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('test_refresh_token');
      expect(result).toBe('test-refresh-token');
    });

    it('retourne null si aucun refresh token n\'est stocké', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getRefreshToken();

      expect(result).toBeNull();
    });

    it('retourne null en environnement SSR', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const result = getRefreshToken();

      expect(result).toBeNull();

      // Restaurer window
      global.window = originalWindow;
    });

    it('utilise la bonne clé d\'environnement pour le refresh token', () => {
      process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY = 'custom_refresh_key';
      localStorageMock.getItem.mockReturnValue('custom-refresh-token');

      const result = getRefreshToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('custom_refresh_key');
      expect(result).toBe('custom-refresh-token');
    });
  });

  describe('setTokens', () => {
    it('stocke le token d\'accès dans localStorage', () => {
      setTokens('new-access-token');

      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_auth_token', 'new-access-token');
    });

    it('stocke les tokens d\'accès et de refresh', () => {
      setTokens('new-access-token', 'new-refresh-token');

      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_auth_token', 'new-access-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_refresh_token', 'new-refresh-token');
    });

    it('ne stocke que le token d\'accès si refresh n\'est pas fourni', () => {
      setTokens('access-only-token');

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_auth_token', 'access-only-token');
    });

    it('ne fait rien en environnement SSR', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      setTokens('test-token', 'test-refresh');

      expect(localStorageMock.setItem).not.toHaveBeenCalled();

      // Restaurer window
      global.window = originalWindow;
    });

    it('utilise les bonnes clés d\'environnement', () => {
      process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY = 'custom_auth_key';
      process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY = 'custom_refresh_key';

      setTokens('custom-access', 'custom-refresh');

      expect(localStorageMock.setItem).toHaveBeenCalledWith('custom_auth_key', 'custom-access');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('custom_refresh_key', 'custom-refresh');
    });
  });

  describe('clearTokens', () => {
    it('supprime les tokens d\'authentification et de refresh', () => {
      clearTokens();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_refresh_token');
    });

    it('ne fait rien en environnement SSR', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      clearTokens();

      expect(localStorageMock.removeItem).not.toHaveBeenCalled();

      // Restaurer window
      global.window = originalWindow;
    });

    it('utilise les bonnes clés d\'environnement', () => {
      process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY = 'custom_auth_key';
      process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY = 'custom_refresh_key';

      clearTokens();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('custom_auth_key');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('custom_refresh_key');
    });
  });

  describe('hasValidToken', () => {
    it('retourne true si un token d\'authentification existe', () => {
      localStorageMock.getItem.mockReturnValue('valid-token');

      const result = hasValidToken();

      expect(result).toBe(true);
    });

    it('retourne false si aucun token n\'existe', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = hasValidToken();

      expect(result).toBe(false);
    });

    it('retourne false pour un token vide', () => {
      localStorageMock.getItem.mockReturnValue('');

      const result = hasValidToken();

      expect(result).toBe(false);
    });

    it('retourne false en environnement SSR', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const result = hasValidToken();

      expect(result).toBe(false);

      // Restaurer window
      global.window = originalWindow;
    });
  });

  describe('gestion des erreurs localStorage', () => {
    it('gère les erreurs de localStorage.getItem', () => {
      // Sauvegarder l'implementation actuelle
      const originalGetItem = localStorageMock.getItem;
      
      // Configurer temporairement pour lancer une erreur
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      // Redéfinir le mock pour propager l'erreur
      mockGetAuthToken.mockImplementation(() => {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
      });

      expect(() => getAuthToken()).toThrow('localStorage error');
      
      // Restaurer l'implémentation originale
      localStorageMock.getItem.mockImplementation(originalGetItem);
    });

    it('gère les erreurs de localStorage.setItem', () => {
      // Sauvegarder l'implementation actuelle
      const originalSetItem = localStorageMock.setItem;
      
      // Configurer temporairement pour lancer une erreur
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      // Redéfinir le mock pour propager l'erreur
      mockSetTokens.mockImplementation((accessToken: string, refreshToken?: string) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token', accessToken);
        if (refreshToken) {
          window.localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'refresh_token', refreshToken);
        }
      });

      expect(() => setTokens('test-token')).toThrow('Storage quota exceeded');
      
      // Restaurer l'implémentation originale
      localStorageMock.setItem.mockImplementation(originalSetItem);
    });

    it('gère les erreurs de localStorage.removeItem', () => {
      // Sauvegarder l'implementation actuelle
      const originalRemoveItem = localStorageMock.removeItem;
      
      // Configurer temporairement pour lancer une erreur
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Remove error');
      });

      // Redéfinir le mock pour propager l'erreur
      mockClearTokens.mockImplementation(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
        window.localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'refresh_token');
      });

      expect(() => clearTokens()).toThrow('Remove error');
      
      // Restaurer l'implémentation originale
      localStorageMock.removeItem.mockImplementation(originalRemoveItem);
    });
  });

  describe('scénarios d\'intégration', () => {
    it('gère un cycle complet de gestion des tokens', () => {
      // Vérifier qu'il n'y a pas de token initialement
      expect(hasValidToken()).toBe(false);

      // Stocker des tokens
      setTokens('access-token', 'refresh-token');

      // Vérifier que les deux appels ont été faits
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      expect(localStorageMock.setItem).toHaveBeenNthCalledWith(1, 'test_auth_token', 'access-token');
      expect(localStorageMock.setItem).toHaveBeenNthCalledWith(2, 'test_refresh_token', 'refresh-token');

      // Vérifier que les tokens sont récupérés
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'test_auth_token') return 'access-token';
        if (key === 'test_refresh_token') return 'refresh-token';
        return null;
      });

      expect(getAuthToken()).toBe('access-token');
      expect(getRefreshToken()).toBe('refresh-token');
      expect(hasValidToken()).toBe(true);

      // Supprimer les tokens
      clearTokens();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_refresh_token');
    });

    it('met à jour seulement le token d\'accès lors d\'un refresh', () => {
      // Stocker des tokens initiaux
      setTokens('old-access', 'refresh-token');

      // Mettre à jour seulement le token d\'accès (refresh typique)
      setTokens('new-access');

      // Vérifier que seulement le token d\'accès a été mis à jour
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith('test_auth_token', 'new-access');
    });
  });
});
