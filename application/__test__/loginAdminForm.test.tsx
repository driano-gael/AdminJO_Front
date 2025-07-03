import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginAdminForm from '@/components/connexion/loginAdminForm';
import { AuthProvider } from '@/contexts/authContext';

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

// Mock du service d'authentification
jest.mock('@/lib/api/authService', () => ({
  login: jest.fn(),
}));

// Composant wrapper avec AuthProvider pour les tests
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

describe('LoginAdminForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('affiche le formulaire de connexion avec les champs email et mot de passe', () => {
    render(
      <Wrapper>
        <LoginAdminForm />
      </Wrapper>
    );

    // Vérifier les éléments principaux - le texte est séparé par un <br/>
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'h2' && content.includes('Ticket JO 2024') && content.includes('Administration');
    })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('permet à l\'utilisateur de saisir email et mot de passe', () => {
    render(
      <Wrapper>
        <LoginAdminForm />
      </Wrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('admin@test.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('affiche l\'état de chargement lors de la soumission du formulaire', async () => {
    const { login } = require('@/lib/api/authService');
    login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <Wrapper>
        <LoginAdminForm />
      </Wrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Connexion...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('affiche une notification d\'erreur en cas d\'échec de connexion', async () => {
    const { login } = require('@/lib/api/authService');
    login.mockRejectedValue(new Error('Identifiants invalides'));

    render(
      <Wrapper>
        <LoginAdminForm />
      </Wrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Identifiants invalides')).toBeInTheDocument();
    });
  });

  it('appelle la fonction de connexion avec les bonnes informations d\'identification', async () => {
    const { login } = require('@/lib/api/authService');
    login.mockResolvedValue({ access: 'fake-token', refresh: 'fake-refresh' });

    render(
      <Wrapper>
        <LoginAdminForm />
      </Wrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: 'admin@test.com', password: 'password123' });
    });
  });

  it('rend les champs email et mot de passe obligatoires', () => {
    render(
      <Wrapper>
        <LoginAdminForm />
      </Wrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
