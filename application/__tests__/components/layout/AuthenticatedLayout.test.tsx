import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import { useAuth } from '@/contexts/authContext';

// Mock des dépendances
jest.mock('next/navigation');
jest.mock('@/contexts/authContext');
jest.mock('@/hooks/useSessionExpiry');
jest.mock('@/components/connexion/authGuard', () => {
  return function MockAuthGuard({ children }: { children: React.ReactNode }) {
    return <div data-testid="auth-guard">{children}</div>;
  };
});
jest.mock('@/components/navigation/AppHeader', () => {
  return function MockAppHeader({ title }: { title: string }) {
    return <div data-testid="app-header">App Header - {title}</div>;
  };
});

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('AuthenticatedLayout', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    } as any);
  });

  it('should render children with title', () => {
    render(
      <AuthenticatedLayout title="Test Page">
        <div data-testid="test-content">Test Content</div>
      </AuthenticatedLayout>
    );

    expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
    expect(screen.getByTestId('app-header')).toHaveTextContent('App Header - Test Page');
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should render with back navigation props', () => {
    render(
      <AuthenticatedLayout 
        title="Test Page" 
        backUrl="/dashboard" 
        backLabel="Retour au tableau de bord"
      >
        <div data-testid="test-content">Test Content</div>
      </AuthenticatedLayout>
    );

    expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should render layout with proper structure', () => {
    const { container } = render(
      <AuthenticatedLayout title="Test Page">
        <div data-testid="test-content">Test Content</div>
      </AuthenticatedLayout>
    );

    // Vérifier la structure du layout
    const layoutDiv = container.querySelector('.bg-base-200');
    expect(layoutDiv).toBeInTheDocument();
  });

  it('should handle multiple children', () => {
    render(
      <AuthenticatedLayout title="Test Page">
        <div data-testid="content-1">Content 1</div>
        <div data-testid="content-2">Content 2</div>
      </AuthenticatedLayout>
    );

    expect(screen.getByTestId('content-1')).toBeInTheDocument();
    expect(screen.getByTestId('content-2')).toBeInTheDocument();
  });

  it('should pass title to AppHeader', () => {
    render(
      <AuthenticatedLayout title="Events Management">
        <div data-testid="test-content">Test Content</div>
      </AuthenticatedLayout>
    );

    expect(screen.getByTestId('app-header')).toHaveTextContent('App Header - Events Management');
  });

  it('should wrap content in AuthGuard', () => {
    render(
      <AuthenticatedLayout title="Test Page">
        <div data-testid="test-content">Test Content</div>
      </AuthenticatedLayout>
    );

    expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should handle empty children', () => {
    render(
      <AuthenticatedLayout title="Test Page">
        {null}
      </AuthenticatedLayout>
    );

    expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
    expect(screen.getByTestId('app-header')).toBeInTheDocument();
  });

  it('should render without optional props', () => {
    render(
      <AuthenticatedLayout title="Test Page">
        <div data-testid="test-content">Test Content</div>
      </AuthenticatedLayout>
    );

    expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });
});
