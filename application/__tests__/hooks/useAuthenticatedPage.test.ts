import { renderHook } from '@testing-library/react';
import { useAuthenticatedPage } from '@/hooks/useAuthenticatedPage';
import { useAuth } from '@/contexts/authContext';

// Mock des dépendances
jest.mock('@/contexts/authContext');
jest.mock('@/hooks/useSessionExpiry', () => ({
  useSessionExpiry: jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useAuthenticatedPage', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    } as any);
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    renderHook(() => useAuthenticatedPage());

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should not redirect when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@example.com' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    renderHook(() => useAuthenticatedPage());

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not redirect when loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: true,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    renderHook(() => useAuthenticatedPage());

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle auth state changes', () => {
    const { rerender } = renderHook(() => useAuthenticatedPage());

    // Initialement non authentifié
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    rerender();
    expect(mockPush).toHaveBeenCalledWith('/');

    // Devient authentifié
    mockPush.mockClear();
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@example.com' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    rerender();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle undefined user state', () => {
    mockUseAuth.mockReturnValue({
      user: undefined,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    } as any);

    renderHook(() => useAuthenticatedPage());

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should not redirect multiple times for same state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    const { rerender } = renderHook(() => useAuthenticatedPage());

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');

    // Re-render avec le même état
    rerender();

    // Ne devrait pas rediriger à nouveau
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('should handle router errors gracefully', () => {
    mockPush.mockImplementation(() => {
      throw new Error('Router error');
    });

    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    // Ne devrait pas lancer d'erreur
    expect(() => {
      renderHook(() => useAuthenticatedPage());
    }).not.toThrow();
  });
});
