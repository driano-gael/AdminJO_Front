import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '@/contexts/authContext';

// Mock du service d'auth - déclaration avant jest.mock()
const mockLogin = jest.fn();
const mockLogout = jest.fn();

jest.mock('@/lib/api/authService', () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

// Import du module mocké pour récupérer les fonctions
import * as authService from '@/lib/api/authService';
const mockedAuthService = authService as jest.Mocked<typeof authService>;

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
beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_AUTH_TOKEN_KEY: 'test_auth_token',
    NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY: 'test_refresh_token',
  };
});

afterEach(() => {
  process.env = originalEnv;
});

// Composant de test pour utiliser le contexte
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('test@example.com', 'password');
    } catch (error) {
      // L'erreur sera propagée dans le test
      console.error('Login error:', error);
    }
  };
  
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'null'}</div>
      <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <button 
        data-testid="login-btn" 
        onClick={handleLogin}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockedAuthService.login.mockReset();
    mockedAuthService.logout.mockReset();
  });

  it('fournit les valeurs par défaut quand aucun utilisateur n\'est connecté', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('restaure l\'utilisateur depuis localStorage au chargement', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'test_auth_token') return 'fake-token';
      if (key === 'user_email') return 'admin@test.com';
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('admin@test.com');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
  });

  it('gère la connexion avec succès', async () => {
    mockedAuthService.login.mockResolvedValue({ access: 'new-token', refresh: 'refresh-token' });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Attendre que le chargement initial soit terminé
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    // Déclencher la connexion
    act(() => {
      screen.getByTestId('login-btn').click();
    });

    // Attendre que l'appel API soit effectué et l'état mis à jour
    await waitFor(() => {
      expect(mockedAuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    });

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user_email', 'test@example.com');
    });

    // Attendre que l'état soit mis à jour dans le contexte
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
    
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
  });

  it('propage les erreurs lors de l\'appel direct à login', async () => {
    const error = new Error('Identifiants invalides');
    mockedAuthService.login.mockRejectedValue(error);

    // Composant simple pour tester l'appel direct à la fonction login
    const DirectLoginTest = () => {
      const { login } = useAuth();
      
      // Exposer la fonction login pour pouvoir la tester directement
      (window as any).testLogin = login;
      
      return <div data-testid="test-component">Test Component</div>;
    };

    render(
      <AuthProvider>
        <DirectLoginTest />
      </AuthProvider>
    );

    // Attendre que le composant soit monté
    await waitFor(() => {
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });

    // Tester que l'erreur est bien propagée en appelant directement la fonction login
    await expect(
      (window as any).testLogin('test@example.com', 'wrongpassword')
    ).rejects.toThrow('Identifiants invalides');

    expect(mockedAuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'wrongpassword' });
    
    // Nettoyer
    delete (window as any).testLogin;
  });

  it('gère les erreurs de connexion', async () => {
    const error = new Error('Identifiants invalides');
    mockedAuthService.login.mockRejectedValue(error);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    // Capturer les erreurs de console pendant le test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Déclencher la connexion - l'erreur sera propagée mais pas catchée dans le test
    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    // Attendre que l'appel API soit effectué
    await waitFor(() => {
      expect(mockedAuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    });

    // Vérifier que l'état n'a pas changé (toujours non authentifié)
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');

    // Restaurer console.error
    consoleSpy.mockRestore();
  });

  it('gère la déconnexion correctement', async () => {
    // Démarrer avec un utilisateur connecté
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'test_auth_token') return 'fake-token';
      if (key === 'user_email') return 'admin@test.com';
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });

    // Déclencher la déconnexion
    act(() => {
      screen.getByTestId('logout-btn').click();
    });

    expect(mockedAuthService.logout).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user_email');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('lance une erreur quand useAuth est utilisé hors du provider', () => {
    // Créer un composant qui utilise useAuth sans être dans un AuthProvider
    const ComponentWithoutProvider = () => {
      useAuth();
      return <div>Test</div>;
    };

    // Capturer l'erreur dans la console pour éviter les logs pendant les tests
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('useAuth doit être utilisé dans un AuthProvider');

    console.error = originalError;
  });

  it('gère le cas où le token existe mais pas l\'email utilisateur', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'test_auth_token') return 'fake-token';
      if (key === 'user_email') return null; // Pas d'email stocké
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('met à jour l\'état correctement lors de changements multiples', async () => {
    mockedAuthService.login.mockResolvedValue({ access: 'token', refresh: 'refresh' });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // État initial
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');

    // Connexion
    act(() => {
      screen.getByTestId('login-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });

    // Déconnexion
    act(() => {
      screen.getByTestId('logout-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });
});
