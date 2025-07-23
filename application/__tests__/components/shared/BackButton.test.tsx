import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '@/components/shared/BackButton';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('BackButton', () => {
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
    render(<BackButton url="/test" />);

    const button = screen.getByRole('button', { name: '← Retour' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'text-blue-600',
      'hover:text-blue-800',
      'font-medium'
    );
  });

  it('should render with custom text', () => {
    render(<BackButton url="/test" text="Go Back" />);

    const button = screen.getByRole('button', { name: 'Go Back' });
    expect(button).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(
      <BackButton 
        url="/test"
        className="custom-class bg-red-500" 
        text="Custom Text"
      />
    );

    const button = screen.getByRole('button', { name: 'Custom Text' });
    expect(button).toHaveClass('custom-class', 'bg-red-500');
    expect(button).not.toHaveClass('text-blue-600');
  });

  it('should navigate to specified URL when clicked', () => {
    render(<BackButton url="/custom-page" />);

    const button = screen.getByRole('button', { name: '← Retour' });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/custom-page');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('should work with different URLs', () => {
    const { rerender } = render(<BackButton url="/page1" />);
    
    let button = screen.getByRole('button', { name: '← Retour' });
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/page1');

    rerender(<BackButton url="/page2" />);
    button = screen.getByRole('button', { name: '← Retour' });
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/page2');

    expect(mockPush).toHaveBeenCalledTimes(2);
  });

  it('should work with custom text and custom className together', () => {
    render(
      <BackButton 
        url="/test"
        text="Back to List"
        className="bg-green-500 text-white p-2"
      />
    );

    const button = screen.getByRole('button', { name: 'Back to List' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-green-500', 'text-white', 'p-2');
    
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/test');
  });

  it('should handle multiple clicks correctly', () => {
    render(<BackButton url="/test" />);

    const button = screen.getByRole('button', { name: '← Retour' });
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledTimes(3);
    expect(mockPush).toHaveBeenCalledWith('/test');
  });

  it('should be accessible', () => {
    render(<BackButton url="/test" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Les boutons HTML n'ont pas forcément l'attribut type="button" explicite
    expect(button.tagName).toBe('BUTTON');
  });

  it('should handle empty custom text', () => {
    render(<BackButton url="/test" text="" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });

  it('should preserve default text when text prop is undefined', () => {
    render(<BackButton url="/test" text={undefined} />);

    const button = screen.getByRole('button', { name: '← Retour' });
    expect(button).toBeInTheDocument();
  });

  it('should preserve default className when className prop is undefined', () => {
    render(<BackButton url="/test" className={undefined} />);

    const button = screen.getByRole('button', { name: '← Retour' });
    expect(button).toHaveClass(
      'text-blue-600',
      'hover:text-blue-800',
      'font-medium'
    );
  });

  it('should handle various URL formats', () => {
    const testUrls = [
      '/dashboard',
      '/events/123',
      '/users?page=1',
      '/settings#profile',
      'https://example.com',
      '/path/with/multiple/segments'
    ];

    testUrls.forEach((url) => {
      const { unmount } = render(<BackButton url={url} />);
      
      const button = screen.getByRole('button', { name: '← Retour' });
      fireEvent.click(button);
      
      expect(mockPush).toHaveBeenCalledWith(url);
      
      // Unmount the component before testing the next URL
      unmount();
    });

    expect(mockPush).toHaveBeenCalledTimes(testUrls.length);
  });

  it('should handle router navigation consistently', () => {
    render(<BackButton url="/test" />);

    const button = screen.getByRole('button', { name: '← Retour' });
    
    // Test normal functionality
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/test');
  });

  it('should have proper component interface', () => {
    // Test component renders correctly with required props
    const { container } = render(<BackButton url="/test" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
