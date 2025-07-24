import { buildHeaders, makeRequest } from '@/lib/api/core/httpHelpers';
import { getAuthToken } from '@/lib/api/core/tokenHelpers';

// Mock dependencies
jest.mock('@/lib/api/core/tokenHelpers');

// Mock global fetch
global.fetch = jest.fn();

const mockGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('httpHelpers', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_URL: 'https://api.test.com',
      NODE_ENV: 'test'
    };
    
    // Clear console warn mock
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
  });

  describe('buildHeaders', () => {
    it('should build basic headers without auth', () => {
      const headers = buildHeaders(false);

      expect(headers).toEqual({
        'Content-Type': 'application/json'
      });
    });

    it('should build headers with auth token when requiresAuth is true', () => {
      mockGetAuthToken.mockReturnValue('test-token-123');

      const headers = buildHeaders(true);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-123'
      });
      expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
    });

    it('should build headers without auth token when token is null', () => {
      mockGetAuthToken.mockReturnValue(null);

      const headers = buildHeaders(true);

      expect(headers).toEqual({
        'Content-Type': 'application/json'
      });
      expect(mockGetAuthToken).toHaveBeenCalledTimes(1);
    });

    it('should warn in development when auth required but no token found', () => {
      process.env = { ...originalEnv, NODE_ENV: 'development' };
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      mockGetAuthToken.mockReturnValue(null);

      buildHeaders(true);

      expect(consoleSpy).toHaveBeenCalledWith('⚠️ Auth required but no token found!');
    });

    it('should not warn in production when auth required but no token found', () => {
      process.env = { ...originalEnv, NODE_ENV: 'production' };
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      mockGetAuthToken.mockReturnValue(null);

      buildHeaders(true);

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should merge base headers when provided as object', () => {
      const baseHeaders = {
        'Custom-Header': 'custom-value',
        'Another-Header': 'another-value'
      };

      const headers = buildHeaders(false, baseHeaders);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Custom-Header': 'custom-value',
        'Another-Header': 'another-value'
      });
    });

    it('should merge base headers when provided as Headers object', () => {
      const baseHeaders = new Headers();
      baseHeaders.set('Custom-Header', 'custom-value');
      baseHeaders.set('Another-Header', 'another-value');

      const headers = buildHeaders(false, baseHeaders);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'custom-header': 'custom-value', // Headers object normalizes to lowercase
        'another-header': 'another-value'
      });
    });

    it('should merge base headers when provided as array', () => {
      const baseHeaders: [string, string][] = [
        ['Custom-Header', 'custom-value'],
        ['Another-Header', 'another-value']
      ];

      const headers = buildHeaders(false, baseHeaders);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Custom-Header': 'custom-value',
        'Another-Header': 'another-value'
      });
    });

    it('should override Content-Type when provided in base headers', () => {
      const baseHeaders = {
        'Content-Type': 'multipart/form-data'
      };

      const headers = buildHeaders(false, baseHeaders);

      expect(headers).toEqual({
        'Content-Type': 'multipart/form-data'
      });
    });

    it('should combine auth and base headers', () => {
      mockGetAuthToken.mockReturnValue('test-token-123');
      const baseHeaders = {
        'Custom-Header': 'custom-value'
      };

      const headers = buildHeaders(true, baseHeaders);

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Custom-Header': 'custom-value',
        'Authorization': 'Bearer test-token-123'
      });
    });

    it('should handle empty base headers object', () => {
      const headers = buildHeaders(false, {});

      expect(headers).toEqual({
        'Content-Type': 'application/json'
      });
    });

    it('should handle null base headers', () => {
      const headers = buildHeaders(false, null as any);

      expect(headers).toEqual({
        'Content-Type': 'application/json'
      });
    });

    it('should handle undefined base headers', () => {
      const headers = buildHeaders(false, undefined);

      expect(headers).toEqual({
        'Content-Type': 'application/json'
      });
    });
  });

  describe('makeRequest', () => {
    let mockResponse: any;

    beforeEach(() => {
      // Mock Response constructor
      mockResponse = {
        body: '{}',
        status: 200,
        ok: true,
        json: jest.fn().mockResolvedValue({}),
        text: jest.fn().mockResolvedValue('{}')
      };
      
      mockFetch.mockResolvedValue(mockResponse);
    });

    it('should make request with correct URL and headers', async () => {
      const endpoint = '/users';
      const options = { method: 'GET' };

      await makeRequest(endpoint, options, false);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/users',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    });

    it('should add leading slash to endpoint if missing', async () => {
      const endpoint = 'users';
      const options = { method: 'GET' };

      await makeRequest(endpoint, options, false);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/users',
        expect.any(Object)
      );
    });

    it('should preserve existing leading slash in endpoint', async () => {
      const endpoint = '/users';
      const options = { method: 'GET' };

      await makeRequest(endpoint, options, false);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/users',
        expect.any(Object)
      );
    });

    it('should include auth headers when required', async () => {
      mockGetAuthToken.mockReturnValue('test-token-123');
      const endpoint = '/users';
      const options = { method: 'GET' };

      await makeRequest(endpoint, options, true);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/users',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token-123'
          }
        }
      );
    });

    it('should merge custom headers with built headers', async () => {
      const endpoint = '/users';
      const options = {
        method: 'POST',
        headers: {
          'Custom-Header': 'custom-value'
        },
        body: JSON.stringify({ name: 'Test' })
      };

      await makeRequest(endpoint, options, false);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/users',
        {
          method: 'POST',
          body: JSON.stringify({ name: 'Test' }),
          headers: {
            'Content-Type': 'application/json',
            'Custom-Header': 'custom-value'
          }
        }
      );
    });

    it('should preserve all request options', async () => {
      const endpoint = '/users';
      const options = {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
        credentials: 'include' as RequestCredentials,
        cache: 'no-cache' as RequestCache
      };

      await makeRequest(endpoint, options, false);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/users',
        {
          method: 'POST',
          body: JSON.stringify({ name: 'Test' }),
          credentials: 'include',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    });

    it('should return fetch response', async () => {
      const endpoint = '/users';
      const options = { method: 'GET' };

      const response = await makeRequest(endpoint, options, false);

      expect(response).toBe(mockResponse);
    });

    it('should handle complex endpoints', async () => {
      const endpoint = '/users/123/posts?page=1&limit=10';
      const options = { method: 'GET' };

      await makeRequest(endpoint, options, false);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/users/123/posts?page=1&limit=10',
        expect.any(Object)
      );
    });

    it('should work with different HTTP methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

      for (const method of methods) {
        await makeRequest('/test', { method }, false);
        
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.test.com/test',
          expect.objectContaining({ method })
        );
      }

      expect(mockFetch).toHaveBeenCalledTimes(methods.length);
    });

    it('should propagate fetch errors', async () => {
      const fetchError = new Error('Network error');
      mockFetch.mockRejectedValue(fetchError);

      await expect(makeRequest('/users', { method: 'GET' }, false))
        .rejects.toThrow('Network error');
    });

    it('should use environment API URL', async () => {
      process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: 'https://custom-api.com' };

      await makeRequest('/test', { method: 'GET' }, false);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom-api.com/test',
        expect.any(Object)
      );
    });
  });
});
