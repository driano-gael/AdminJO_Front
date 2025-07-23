import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppHeader from '@/components/navigation/AppHeader';
import { useAuth } from '@/contexts/authContext';

// Mock des dépendances
jest.mock('@/contexts/authContext');
jest.mock('next/link', () => {
  return function MockLink({ href, children, className }: any) {
    return (
      <a href={href} className={className} data-testid="custom-link">
        {children}
      </a>
    );
  };
});
jest.mock('@/components/shared/BackToDashboardButton', () => {
  return function MockBackToDashboardButton({ text }: { text?: string }) {
    return <button data-testid="back-to-dashboard-button">{text || 'Back to Dashboard'}</button>;
  };
});

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('AppHeader', () => {
  const mockLogout = jest.fn();
  const defaultUser = { email: 'admin@test.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: defaultUser,
      isAuthenticated: true,
      logout: mockLogout,
      login: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });
  });

  it('should render header with title and user email', () => {
    render(<AppHeader title="Test Page" />);

    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('admin@test.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /déconnexion/i })).toBeInTheDocument();
  });

  it('should render back to dashboard button by default', () => {
    render(<AppHeader title="Test Page" />);

    expect(screen.getByTestId('back-to-dashboard-button')).toBeInTheDocument();
  });

  it('should render custom back button when backUrl is provided', () => {
    render(
      <AppHeader 
        title="Test Page" 
        backUrl="/custom-page" 
        backLabel="Custom Back" 
      />
    );

    expect(screen.getByTestId('custom-link')).toBeInTheDocument();
    expect(screen.getByText('Custom Back')).toBeInTheDocument();
    expect(screen.queryByTestId('back-to-dashboard-button')).not.toBeInTheDocument();
  });

  it('should use BackToDashboardButton when backUrl is /dashboard', () => {
    render(
      <AppHeader 
        title="Test Page" 
        backUrl="/dashboard" 
        backLabel="Dashboard" 
      />
    );

    expect(screen.getByTestId('back-to-dashboard-button')).toBeInTheDocument();
    expect(screen.queryByTestId('custom-link')).not.toBeInTheDocument();
  });

  it('should hide back navigation when showBackToDashboard is false', () => {
    render(
      <AppHeader 
        title="Test Page" 
        showBackToDashboard={false}
      />
    );

    expect(screen.queryByTestId('back-to-dashboard-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('custom-link')).not.toBeInTheDocument();
  });

  it('should handle logout button click', () => {
    render(<AppHeader title="Test Page" />);

    const logoutButton = screen.getByRole('button', { name: /déconnexion/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should display user email correctly', () => {
    const customUser = { email: 'custom@test.com' };
    mockUseAuth.mockReturnValue({
      user: customUser,
      isAuthenticated: true,
      logout: mockLogout,
      login: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    render(<AppHeader title="Test Page" />);

    expect(screen.getByText('custom@test.com')).toBeInTheDocument();
  });

  it('should handle null user gracefully', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: mockLogout,
      login: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    render(<AppHeader title="Test Page" />);

    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.queryByText('@')).not.toBeInTheDocument(); // No email shown
  });

  it('should render with default back label when not provided', () => {
    render(
      <AppHeader 
        title="Test Page" 
        backUrl="/custom" 
      />
    );

    expect(screen.getByText('⬅️ Accueil')).toBeInTheDocument();
  });

  it('should have proper header structure', () => {
    render(<AppHeader title="Test Page" />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'shadow-md');
  });

  it('should render back button with custom text', () => {
    render(
      <AppHeader 
        title="Test Page" 
        backLabel="Custom Text" 
      />
    );

    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('should handle missing backLabel gracefully', () => {
    render(
      <AppHeader 
        title="Test Page" 
        backUrl="/custom"
        backLabel={undefined}
      />
    );

    // When backLabel is undefined, should use default "⬅️ Accueil"
    expect(screen.getByText('⬅️ Accueil')).toBeInTheDocument();
  });

  it('should position elements correctly in header layout', () => {
    render(<AppHeader title="Test Page" />);

    const title = screen.getByText('Test Page');
    const backButton = screen.getByTestId('back-to-dashboard-button');
    const logoutButton = screen.getByRole('button', { name: /déconnexion/i });

    expect(title).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  it('should apply correct CSS classes to logout button', () => {
    render(<AppHeader title="Test Page" />);

    const logoutButton = screen.getByRole('button', { name: /déconnexion/i });
    expect(logoutButton).toHaveClass(
      'bg-red-600',
      'hover:bg-red-700',
      'text-white',
      'px-4',
      'py-2',
      'rounded-md',
      'text-sm',
      'font-medium',
      'transition-colors'
    );
  });

  it('should show user email in bold', () => {
    render(<AppHeader title="Test Page" />);

    const userEmailElement = screen.getByText('admin@test.com');
    const strongElement = userEmailElement.closest('strong');
    expect(strongElement).toBeInTheDocument();
  });
});
