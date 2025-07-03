import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthGuard from '@/components/connexion/authGuard';

// Mock des composants
jest.mock('@/components/spinner', () => {
  return function MockSpinner({ size }: { size?: string }) {
    return <div data-testid="spinner" data-size={size}>Chargement...</div>;
  };
});

jest.mock('@/components/connexion/loginAdminForm', () => {
  return function MockLoginAdminForm() {
    return <div data-testid="login-form">Formulaire de connexion</div>;
  };
});

// Mock du hook useAuth
const mockUseAuth = jest.fn();
jest.mock('@/contexts/authContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = () => <div data-testid="protected-content">Contenu protégé</div>;

  it('affiche le spinner pendant le chargement', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    render(<AuthGuard><TestComponent /></AuthGuard>);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'large');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('affiche le formulaire de connexion quand non authentifié', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    render(<AuthGuard><TestComponent /></AuthGuard>);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('affiche le contenu protégé quand authentifié', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { email: 'admin@test.com' },
    });

    render(<AuthGuard><TestComponent /></AuthGuard>);

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('gère correctement les transitions d\'état', () => {
    // Premier rendu : chargement
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    const { rerender } = render(<AuthGuard><TestComponent /></AuthGuard>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    // Deuxième rendu : non authentifié
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    rerender(<AuthGuard><TestComponent /></AuthGuard>);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    // Troisième rendu : authentifié
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { email: 'admin@test.com' },
    });

    rerender(<AuthGuard><TestComponent /></AuthGuard>);
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
