import {
  setTokens,
  getAuthToken,
  getRefreshToken,
  clearTokens,
  isTokenValid
} from '@/lib/api/core/tokenHelpers';

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock de window
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock de atob pour le test de validation du token
const mockAtob = jest.fn();
Object.defineProperty(window, 'atob', {
  value: mockAtob
});

describe('TokenHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('setTokens', () => {
    it('should store tokens in localStorage', () => {
      setTokens('access_token', 'refresh_token');

      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'access_token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refresh_token', 'refresh_token');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('LocalStorage error');
      });

      expect(() => setTokens('access_token', 'refresh_token')).not.toThrow();
    });
  });

  describe('getAuthToken', () => {
    it('should return stored auth token', () => {
      localStorageMock.getItem.mockReturnValue('stored_token');

      const token = getAuthToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('auth_token');
      expect(token).toBe('stored_token');
    });

    it('should return null when token not found', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const token = getAuthToken();

      expect(token).toBeNull();
    });

    it('should handle localStorage errors', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('LocalStorage error');
      });

      const token = getAuthToken();

      expect(token).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return stored refresh token', () => {
      localStorageMock.getItem.mockReturnValue('stored_refresh_token');

      const token = getRefreshToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('refresh_token');
      expect(token).toBe('stored_refresh_token');
    });

    it('should return null when refresh token not found', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const token = getRefreshToken();

      expect(token).toBeNull();
    });
  });

  describe('clearTokens', () => {
    it('should remove tokens from localStorage', () => {
      clearTokens();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('LocalStorage error');
      });

      expect(() => clearTokens()).not.toThrow();
    });
  });

  describe('isTokenValid', () => {
    beforeEach(() => {
      // Mock Date.now() pour des tests déterministes
      jest.spyOn(Date, 'now').mockReturnValue(1000000 * 1000); // 1000000 secondes en millisecondes
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return false when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const isValid = isTokenValid();

      expect(isValid).toBe(false);
    });

    it('should return true for valid token', () => {
      const mockToken = 'header.payload.signature';
      const mockPayload = { exp: 1000001 }; // expire dans le futur
      
      localStorageMock.getItem.mockReturnValue(mockToken);
      mockAtob.mockReturnValue(JSON.stringify(mockPayload));

      const isValid = isTokenValid();

      expect(mockAtob).toHaveBeenCalledWith('payload');
      expect(isValid).toBe(true);
    });

    it('should return false for expired token', () => {
      const mockToken = 'header.payload.signature';
      const mockPayload = { exp: 999999 }; // expiré
      
      localStorageMock.getItem.mockReturnValue(mockToken);
      mockAtob.mockReturnValue(JSON.stringify(mockPayload));

      const isValid = isTokenValid();

      expect(isValid).toBe(false);
    });

    it('should return false for malformed token', () => {
      localStorageMock.getItem.mockReturnValue('invalid_token');
      mockAtob.mockImplementation(() => {
        throw new Error('Invalid base64');
      });

      const isValid = isTokenValid();

      expect(isValid).toBe(false);
    });

    it('should handle JSON parsing errors', () => {
      const mockToken = 'header.payload.signature';
      
      localStorageMock.getItem.mockReturnValue(mockToken);
      mockAtob.mockReturnValue('invalid_json');

      const isValid = isTokenValid();

      expect(isValid).toBe(false);
    });
  });
});
