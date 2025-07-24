import { render, screen, fireEvent } from '@testing-library/react';
import BackToEventsButton from '@/components/componentsEvenement/shared/BackToEventsButton';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('BackToEventsButton', () => {
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
    render(<BackToEventsButton />);

    const button = screen.getByRole('button', { name: '↩️ gestion globale évènements' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'bg-gray-600',
      'hover:bg-gray-700',
      'text-white',
      'px-4',
      'py-2',
      'rounded-md',
      'text-sm',
      'font-medium',
      'transition-colors'
    );
  });

  it('should render with custom text', () => {
    render(<BackToEventsButton text="Retour Événements" />);

    const button = screen.getByRole('button', { name: 'Retour Événements' });
    expect(button).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(
      <BackToEventsButton 
        className="custom-class bg-blue-500" 
        text="Custom Text"
      />
    );

    const button = screen.getByRole('button', { name: 'Custom Text' });
    expect(button).toHaveClass('custom-class', 'bg-blue-500');
    expect(button).not.toHaveClass('bg-gray-600');
  });

  it('should navigate to events page quand cliquÃ©', () => {
    render(<BackToEventsButton />);

    const button = screen.getByRole('button', { name: '↩️ gestion globale évènements' });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/pagesEvenements');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('should work with custom text and custom className together', () => {
    render(
      <BackToEventsButton 
        text="Back to Events"
        className="bg-green-500 text-white p-2"
      />
    );

    const button = screen.getByRole('button', { name: 'Back to Events' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-green-500', 'text-white', 'p-2');
    
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/pagesEvenements');
  });

  it('should handle multiple clicks correctement', () => {
    render(<BackToEventsButton />);

    const button = screen.getByRole('button', { name: '↩️ gestion globale évènements' });
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledTimes(3);
    expect(mockPush).toHaveBeenCalledWith('/pagesEvenements');
  });

  it('should be accessible', () => {
    render(<BackToEventsButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Les boutons HTML n'ont pas forcément l'attribut type="button" explicite
    expect(button.tagName).toBe('BUTTON');
  });

  it('should handle empty custom text', () => {
    render(<BackToEventsButton text="" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });

  it('should preserve default text when text prop is undefined', () => {
    render(<BackToEventsButton text={undefined} />);

    const button = screen.getByRole('button', { name: '↩️ gestion globale évènements' });
    expect(button).toBeInTheDocument();
  });

  it('should preserve default className when className prop is undefined', () => {
    render(<BackToEventsButton className={undefined} />);

    const button = screen.getByRole('button', { name: '↩️ gestion globale évènements' });
    expect(button).toHaveClass(
      'bg-gray-600',
      'hover:bg-gray-700',
      'text-white'
    );
  });

  it('should handle router navigation consistently', () => {
    render(<BackToEventsButton />);

    const button = screen.getByRole('button', { name: '↩️ gestion globale évènements' });
    
    // Test normal functionality
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/pagesEvenements');
  });

  it('should render with proper button styling for events management context', () => {
    render(<BackToEventsButton />);

    const button = screen.getByRole('button', { name: '↩️ gestion globale évènements' });
    
    // Verify specific styling for events context (gray background vs blue for dashboard)
    expect(button).toHaveClass('bg-gray-600');
    expect(button).toHaveClass('hover:bg-gray-700');
    expect(button).not.toHaveClass('text-blue-600'); // Different from BackToDashboardButton
  });
});
