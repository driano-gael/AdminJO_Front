import { renderHook } from '@testing-library/react';
import { useAuthenticatedPage } from '@/hooks/useAuthenticatedPage';
import { useAuth } from '@/contexts/authContext';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';

// Mock des dépendances
jest.mock('@/contexts/authContext');
jest.mock('@/hooks/useSessionExpiry');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseSessionExpiry = useSessionExpiry as jest.MockedFunction<typeof useSessionExpiry>;

describe('useAuthenticatedPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return auth context data when user is authenticated', () => {
    const mockAuthData = {
      user: { email: 'admin@example.com', role: 'admin' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    };

    mockUseAuth.mockReturnValue(mockAuthData);

    const { result } = renderHook(() => useAuthenticatedPage());

    expect(result.current).toBe(mockAuthData);
    expect(mockUseAuth).toHaveBeenCalled();
    expect(mockUseSessionExpiry).toHaveBeenCalled();
  });

  it('should return auth context data when user is not authenticated', () => {
    const mockAuthData = {
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    };

    mockUseAuth.mockReturnValue(mockAuthData);

    const { result } = renderHook(() => useAuthenticatedPage());

    expect(result.current).toBe(mockAuthData);
    expect(mockUseAuth).toHaveBeenCalled();
    expect(mockUseSessionExpiry).toHaveBeenCalled();
  });

  it('should return auth context data when loading', () => {
    const mockAuthData = {
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: true,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    };

    mockUseAuth.mockReturnValue(mockAuthData);

    const { result } = renderHook(() => useAuthenticatedPage());

    expect(result.current).toBe(mockAuthData);
    expect(mockUseAuth).toHaveBeenCalled();
    expect(mockUseSessionExpiry).toHaveBeenCalled();
  });

  it('should call useSessionExpiry on every render', () => {
    const mockAuthData = {
      user: { email: 'admin@example.com', role: 'admin' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    };

    mockUseAuth.mockReturnValue(mockAuthData);

    const { rerender } = renderHook(() => useAuthenticatedPage());

    expect(mockUseSessionExpiry).toHaveBeenCalledTimes(1);

    rerender();

    expect(mockUseSessionExpiry).toHaveBeenCalledTimes(2);
  });

  it('should handle auth state changes correctly', () => {
    let mockAuthData = {
      user: null as { email: string } | null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    };

    mockUseAuth.mockReturnValue(mockAuthData);

    const { result, rerender } = renderHook(() => useAuthenticatedPage());

    // Initialement non authentifié
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);

    // Devient authentifié
    mockAuthData = {
      user: { email: 'admin@example.com', role: 'admin' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    };

    mockUseAuth.mockReturnValue(mockAuthData);
    rerender();

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ email: 'admin@example.com', role: 'admin' });
  });

  it('should handle undefined user state gracefully', () => {
    const mockAuthData = {
      user: undefined,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    } as any;

    mockUseAuth.mockReturnValue(mockAuthData);

    const { result } = renderHook(() => useAuthenticatedPage());

    expect(result.current.user).toBe(undefined);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle errors from useAuth gracefully', () => {
    mockUseAuth.mockImplementation(() => {
      throw new Error('Auth context error');
    });

    expect(() => {
      renderHook(() => useAuthenticatedPage());
    }).toThrow('Auth context error');
  });

  // Mock data avec des disciplines complètes
  const mockDiscipline: Discipline = {
    id: 1,
    nom: 'Athlétisme',
    icone: 'athletics.svg'
  };

  const mockEpreuve: Epreuve = {
    id: 1,
    libelle: '100m sprint',
    genre: 'hommes',
    tour: 'finale',
    discipline: mockDiscipline
  };
});
