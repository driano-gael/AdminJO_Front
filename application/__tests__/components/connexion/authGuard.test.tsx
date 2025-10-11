import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AuthGuard from '@/components/connexion/authGuard';
import { useAuth } from '@/contexts/authContext';
import { isTokenValid } from '@/lib/api/core/tokenHelpers';
import { refreshToken } from '@/lib/api/auth/authService';

// Mock des dépendances
jest.mock('@/contexts/authContext');
jest.mock('@/lib/api/core/tokenHelpers');
jest.mock('@/lib/api/auth/authService');
jest.mock('@/components/spinner', () => {
  return function MockSpinner({ size }: { size?: string }) {
    return <div data-testid={`spinner-${size || 'default'}`}>Loading...</div>;
  };
});
jest.mock('@/components/connexion/loginAdminForm', () => {
  return function MockLoginAdminForm() {
    return <div data-testid="login-form">Login Form</div>;
  };
});

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockIsTokenValid = isTokenValid as jest.MockedFunction<typeof isTokenValid>;
const mockRefreshToken = refreshToken as jest.MockedFunction<typeof refreshToken>;

describe('AuthGuard', () => {
  const mockForceLogout = jest.fn();
  const TestContent = () => <div data-testid="protected-content">Protected Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default auth state
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    // Clear console logs for cleaner test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should show indicateur de chargement when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    render(
      <AuthGuard>
        <TestContent />
      </AuthGuard>
    );

    expect(screen.getByTestId('spinner-large')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('should show login form when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    render(
      <AuthGuard>
        <TestContent />
      </AuthGuard>
    );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('spinner-large')).not.toBeInTheDocument();
  });

  it('should show protected content when user is authenticated with valid token', async () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    mockIsTokenValid.mockReturnValue(true);

    render(
      <AuthGuard>
        <TestContent />
      </AuthGuard>
    );

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('spinner-large')).not.toBeInTheDocument();
  });

  it('should attempt token refresh when user is authenticated but token is invalid', async () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    mockIsTokenValid.mockReturnValue(false);
    mockRefreshToken.mockResolvedValue({
      access: 'new_token',
      refresh: 'new_refresh_token',
      role: 'admin',
      email: 'admin@test.com'
    });

    render(
      <AuthGuard>
        <TestContent />
      </AuthGuard>
    );

    // Should show spinner while refreshing
    expect(screen.getByTestId('spinner-large')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockRefreshToken).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  it('should force logout when token refresh fails', async () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    mockIsTokenValid.mockReturnValue(false);
    mockRefreshToken.mockRejectedValue(new Error('Refresh failed'));

    render(
      <AuthGuard>
        <TestContent />
      </AuthGuard>
    );

    await waitFor(() => {
      expect(mockRefreshToken).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockForceLogout).toHaveBeenCalled();
    });
  });

  it('should show login form when token is invalid and cannot be refreshed', async () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    mockIsTokenValid.mockReturnValue(false);
    mockRefreshToken.mockRejectedValue(new Error('Refresh failed'));

    render(
      <AuthGuard>
        <TestContent />
      </AuthGuard>
    );

    await waitFor(() => {
      expect(mockForceLogout).toHaveBeenCalled();
    });
  });

  it('should not check token when user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    render(
      <AuthGuard>
        <TestContent />
      </AuthGuard>
    );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(mockIsTokenValid).not.toHaveBeenCalled();
    expect(mockRefreshToken).not.toHaveBeenCalled();
  });

  it('should re-check token when authentication state changes', async () => {
    const { rerender } = render(
      <AuthGuard>
        <TestContent />
      </AuthGuard>
    );

    // Initially not authenticated
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(mockIsTokenValid).not.toHaveBeenCalled();

    // User becomes authenticated
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    mockIsTokenValid.mockReturnValue(true);

    rerender(
      <AuthGuard>
        <TestContent />
      </AuthGuard>
    );

    await waitFor(() => {
      expect(mockIsTokenValid).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  it('should handle undefined user state', () => {
    mockUseAuth.mockReturnValue({
      user: undefined as any,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    render(
      <AuthGuard>
        <TestContent />
      </AuthGuard>
    );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should handle multiple children correctement', async () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    mockIsTokenValid.mockReturnValue(true);

    render(
      <AuthGuard>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });
});
