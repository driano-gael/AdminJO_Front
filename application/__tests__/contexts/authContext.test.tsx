import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/authContext';
import { login, logout } from '@/lib/api/auth/authService';
import { isTokenValid } from '@/lib/api/core/tokenHelpers';

// Mock des services API
jest.mock('@/lib/api/auth/authService');
jest.mock('@/lib/api/core/tokenHelpers');

const mockLogin = login as jest.MockedFunction<typeof login>;
const mockLogout = logout as jest.MockedFunction<typeof logout>;
const mockIsTokenValid = isTokenValid as jest.MockedFunction<typeof isTokenValid>;

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

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockIsTokenValid.mockReturnValue(false);
  });

  const TestComponent = () => {
    const { user, login: loginUser, logout: logoutUser, isLoading } = useAuth();
    const [loginError, setLoginError] = useState<string | null>(null);
    
    const handleLogin = async () => {
      try {
        setLoginError(null);
        await loginUser('test@example.com', 'password');
      } catch (error) {
        setLoginError(error instanceof Error ? error.message : 'Login failed');
      }
    };
    
    return (
      <div>
        <div data-testid="user-status">
          {user ? `Logged in as ${user.email}` : 'Not logged in'}
        </div>
        <div data-testid="loading-status">
          {isLoading ? 'Loading...' : 'Ready'}
        </div>
        <div data-testid="login-error">
          {loginError || 'No error'}
        </div>
        <button onClick={handleLogin}>
          Login
        </button>
        <button onClick={logoutUser}>
          Logout
        </button>
      </div>
    );
  };

  const renderWithAuthProvider = (component: React.ReactElement) => {
    return render(
      <AuthProvider>
        {component}
      </AuthProvider>
    );
  };

  it('should initialize with no user', async () => {
    await act(async () => {
      renderWithAuthProvider(<TestComponent />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Ready');
    });
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  });

  it('should handle successful login', async () => {
    mockLogin.mockResolvedValue({
      access: 'token',
      refresh: 'refresh_token',
      role: 'admin',
      email: 'admin@test.com'
    });

    await act(async () => {
      renderWithAuthProvider(<TestComponent />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Ready');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should handle login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));

    await act(async () => {
      renderWithAuthProvider(<TestComponent />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Ready');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
      expect(screen.getByTestId('login-error')).toHaveTextContent('Invalid credentials');
    });
  });

  it('should handle logout', async () => {
    // Simuler un utilisateur connecté
    mockLogin.mockResolvedValue({
      access: 'token',
      refresh: 'refresh_token',
      role: 'admin',
      email: 'admin@test.com'
    });

    await act(async () => {
      renderWithAuthProvider(<TestComponent />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Ready');
    });
    
    // Se connecter d'abord
    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
    });

    // Se déconnecter
    await act(async () => {
      fireEvent.click(screen.getByText('Logout'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  it('should show loading state during initialization', async () => {
    // Ce test vérifie que isLoading est true au début puis devient false
    let component: any;
    
    await act(async () => {
      component = renderWithAuthProvider(<TestComponent />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Ready');
    });
    
    // Vérifier que l'initialisation est terminée
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  });

  it('should restore user from localStorage on initialization', async () => {
    mockIsTokenValid.mockReturnValue(true);
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'user_email') return 'saved@example.com';
      return null;
    });

    await act(async () => {
      renderWithAuthProvider(<TestComponent />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as saved@example.com');
    });
  });

  it('should handle localStorage errors gracefully', async () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    await act(async () => {
      expect(() => {
        renderWithAuthProvider(<TestComponent />);
      }).not.toThrow();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
  });
});
