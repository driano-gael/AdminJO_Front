import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginAdminForm from '@/components/connexion/loginAdminForm';
import { useAuth } from '@/contexts/authContext';

// Mock des dépendances
jest.mock('@/contexts/authContext');
jest.mock('@/components/spinner', () => {
  return function MockSpinner({ size, color }: { size?: string; color?: string }) {
    return <div data-testid={`spinner-${size || 'default'}-${color || 'default'}`}>Loading...</div>;
  };
});
jest.mock('@/components/notification', () => {
  return function MockNotification({ message, type, onClose }: { message: string; type: string; onClose: () => void }) {
    return (
      <div data-testid="notification" data-type={type}>
        {message}
        <button onClick={onClose} data-testid="notification-close">×</button>
      </div>
    );
  };
});
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} data-testid="password-toggle-icon" />;
  };
});

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('LoginAdminForm', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      user: null,
      isAuthenticated: false,
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });
  });

  it('should render login form correctly', () => {
    render(<LoginAdminForm />);

    expect(screen.getByRole('heading', { name: /ticket jo 2024 administration/i })).toBeInTheDocument();
    expect(screen.getByText('Connectez-vous pour accéder à l\'interface d\'administration')).toBeInTheDocument();
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('should handle email input change', () => {
    render(<LoginAdminForm />);
    
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    
    expect(emailInput.value).toBe('admin@test.com');
  });

  it('should handle password input change', () => {
    render(<LoginAdminForm />);
    
    const passwordInput = screen.getByLabelText('Mot de passe') as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput.value).toBe('password123');
  });

  it('should toggle password visibility', () => {
    render(<LoginAdminForm />);
    
    const passwordInput = screen.getByLabelText('Mot de passe') as HTMLInputElement;
    const toggleButton = screen.getByLabelText('Afficher le mot de passe');
    
    // Initially hidden
    expect(passwordInput.type).toBe('password');
    
    // Click to show
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    // Click to hide
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('should handle successful login', async () => {
    mockLogin.mockResolvedValue(undefined);
    
    render(<LoginAdminForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Connexion...')).toBeInTheDocument();
      expect(screen.getByTestId('spinner-small-white')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'password123');
    });
  });

  it('should handle login error', async () => {
    const errorMessage = 'Identifiants invalides';
    mockLogin.mockRejectedValue(new Error(errorMessage));
    
    render(<LoginAdminForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('notification')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'wrongpassword');
  });

  it('should handle unknown error during login', async () => {
    mockLogin.mockRejectedValue('String error');
    
    render(<LoginAdminForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Erreur de connexion')).toBeInTheDocument();
    });
  });

  it('should clear error when closing notification', async () => {
    mockLogin.mockRejectedValue(new Error('Test error'));
    
    render(<LoginAdminForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('notification')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByTestId('notification-close');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
  });

  it('should clear error when form is resubmitted', async () => {
    mockLogin.mockRejectedValueOnce(new Error('First error'));
    mockLogin.mockResolvedValueOnce(undefined);
    
    render(<LoginAdminForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    
    // First submission with error
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('First error')).toBeInTheDocument();
    });
    
    // Second submission should clear error
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText('First error')).not.toBeInTheDocument();
    });
  });

  it('should disable submit button during loading', async () => {
    let resolveLogin: (value?: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    mockLogin.mockReturnValue(loginPromise);
    
    render(<LoginAdminForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i }) as HTMLButtonElement;
    
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Button should be disabled during loading
    expect(submitButton.disabled).toBe(true);
    
    // Resolve the promise
    resolveLogin!();
    
    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });
  });

  it('should have proper form accessibility', () => {
    render(<LoginAdminForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const toggleButton = screen.getByLabelText('Afficher le mot de passe');
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    expect(toggleButton).toHaveAttribute('tabIndex', '-1');
  });

  it('should render password toggle icons correctly', () => {
    render(<LoginAdminForm />);
    
    const toggleButton = screen.getByLabelText('Afficher le mot de passe');
    const icon = screen.getByTestId('password-toggle-icon');
    
    // Initially showing "show" icon
    expect(icon).toHaveAttribute('src', '/images/show.png');
    expect(icon).toHaveAttribute('alt', 'Afficher le mot de passe');
    
    // Click to show password
    fireEvent.click(toggleButton);
    
    // Should now show "hide" icon
    expect(icon).toHaveAttribute('src', '/images/hidde.png');
    expect(icon).toHaveAttribute('alt', 'Masquer le mot de passe');
  });

  it('should have proper form structure and styling', () => {
    render(<LoginAdminForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    
    expect(emailInput).toHaveAttribute('placeholder', 'admin@jo2024.fr');
    expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
    expect(passwordInput).toHaveStyle({ color: '#111' });
  });
});
