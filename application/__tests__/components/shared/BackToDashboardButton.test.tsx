import { render, screen, fireEvent } from '@testing-library/react';
import BackToDashboardButton from '@/components/shared/BackToDashboardButton';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('BackToDashboardButton', () => {
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

  it('should render with default text and classes', () => {
    render(<BackToDashboardButton />);

    const button = screen.getByRole('button', { name: '⬅️ Accueil' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'text-blue-600',
      'hover:text-blue-800',
      'font-medium'
    );
  });

  it('should render with custom text', () => {
    render(<BackToDashboardButton text="Retour Accueil" />);

    const button = screen.getByRole('button', { name: 'Retour Accueil' });
    expect(button).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(
      <BackToDashboardButton 
        className="custom-class bg-red-500" 
        text="Custom Text"
      />
    );

    const button = screen.getByRole('button', { name: 'Custom Text' });
    expect(button).toHaveClass('custom-class', 'bg-red-500');
    expect(button).not.toHaveClass('text-blue-600');
  });

  it('should navigate to dashboard quand cliquÃ©', () => {
    render(<BackToDashboardButton />);

    const button = screen.getByRole('button', { name: '⬅️ Accueil' });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('should work with custom text and custom className together', () => {
    render(
      <BackToDashboardButton 
        text="Back to Home"
        className="bg-green-500 text-white p-2"
      />
    );

    const button = screen.getByRole('button', { name: 'Back to Home' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-green-500', 'text-white', 'p-2');
    
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle multiple clicks correctement', () => {
    render(<BackToDashboardButton />);

    const button = screen.getByRole('button', { name: '⬅️ Accueil' });
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledTimes(3);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should be accessible', () => {
    render(<BackToDashboardButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Les boutons HTML n'ont pas forcément l'attribut type="button" explicite
    expect(button.tagName).toBe('BUTTON');
  });

  it('should handle empty custom text', () => {
    render(<BackToDashboardButton text="" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });

  it('should preserve default text when text prop is undefined', () => {
    render(<BackToDashboardButton text={undefined} />);

    const button = screen.getByRole('button', { name: '⬅️ Accueil' });
    expect(button).toBeInTheDocument();
  });

  it('should preserve default className when className prop is undefined', () => {
    render(<BackToDashboardButton className={undefined} />);

    const button = screen.getByRole('button', { name: '⬅️ Accueil' });
    expect(button).toHaveClass(
      'text-blue-600',
      'hover:text-blue-800',
      'font-medium'
    );
  });

  it('should handle router navigation consistently', () => {
    render(<BackToDashboardButton />);

    const button = screen.getByRole('button', { name: '⬅️ Accueil' });
    
    // Test normal functionality
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
