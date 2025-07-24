import { login, refreshToken, logout } from '@/lib/api/auth/authService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { setTokens, clearTokens, getRefreshToken } from '@/lib/api/core/tokenHelpers';

// Mock des dépendances
jest.mock('@/lib/api/core/fetchWrappers');
jest.mock('@/lib/api/core/tokenHelpers');

const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;
const mockSetTokens = setTokens as jest.MockedFunction<typeof setTokens>;
const mockClearTokens = clearTokens as jest.MockedFunction<typeof clearTokens>;
const mockGetRefreshToken = getRefreshToken as jest.MockedFunction<typeof getRefreshToken>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        access: 'access_token',
        refresh: 'refresh_token'
      };
      
      mockFetchApi.mockResolvedValue(mockResponse);

      const result = await login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(mockFetchApi).toHaveBeenCalledWith('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      }, false);
      
      expect(mockSetTokens).toHaveBeenCalledWith('access_token', 'refresh_token');
      expect(result).toEqual(mockResponse);
    });

    it('should handle login failure', async () => {
      mockFetchApi.mockRejectedValue(new Error('Invalid credentials'));

      await expect(login({
        email: 'test@example.com',
        password: 'wrong_password'
      })).rejects.toThrow('Invalid credentials');

      expect(mockSetTokens).not.toHaveBeenCalled();
    });

    it('should throw error when access token is missing', async () => {
      mockFetchApi.mockResolvedValue({ refresh: 'refresh_token' });

      await expect(login({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Token non trouvé dans la réponse du serveur.');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        access: 'new_access_token',
        refresh: 'new_refresh_token'
      };
      
      mockGetRefreshToken.mockReturnValue('current_refresh_token');
      mockFetchApi.mockResolvedValue(mockResponse);

      const result = await refreshToken();

      expect(mockFetchApi).toHaveBeenCalledWith('/auth/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: 'current_refresh_token' })
      }, false);
      
      expect(mockSetTokens).toHaveBeenCalledWith('new_access_token', 'new_refresh_token');
      expect(result).toEqual(mockResponse);
    });

    it('should handle refresh token failure', async () => {
      mockGetRefreshToken.mockReturnValue('expired_refresh_token');
      mockFetchApi.mockRejectedValue(new Error('Token expired'));

      await expect(refreshToken()).rejects.toThrow('Refresh token expiré');

      expect(mockClearTokens).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear tokens on logout', () => {
      logout();
      expect(mockClearTokens).toHaveBeenCalled();
    });
  });
});
