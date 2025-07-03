import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginAdminForm from '@/components/connexion/loginAdminForm';
import { AuthProvider } from '@/contexts/authContext';

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
  });

  it('renders login form with email and password fields', () => {
    render(
      <Wrapper>
        <LoginAdminForm />
      </Wrapper>
    );

    expect(screen.getByText('Administration JO')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('shows loading state when submitting form', async () => {
    const { login } = require('@/lib/api/authService');
    login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <Wrapper>
        <LoginAdminForm />
      </Wrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Connexion...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('displays error message on login failure', async () => {
    const { login } = require('@/lib/api/authService');
    login.mockRejectedValue(new Error('Identifiants invalides'));

    render(
      <Wrapper>
        <LoginAdminForm />
      </Wrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Identifiants invalides')).toBeInTheDocument();
    });
  });
});
