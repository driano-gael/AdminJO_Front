import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LieuxHeader from '@/components/componentsEvenement/lieux/LieuxHeader';

// Mock du composant BackToEventsButton
jest.mock('@/components/componentsEvenement/shared/BackToEventsButton', () => {
  return function MockBackToEventsButton() {
    return <button data-testid="back-to-events-button">Retour aux événements</button>;
  };
});

describe('LieuxHeader', () => {
  const mockOnCreateClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the header with correct title', () => {
    render(<LieuxHeader onCreateClick={mockOnCreateClick} />);
    
    expect(screen.getByText('🏢 Gestion des Lieux')).toBeInTheDocument();
  });

  it('should render the BackToEventsButton component', () => {
    render(<LieuxHeader onCreateClick={mockOnCreateClick} />);
    
    expect(screen.getByTestId('back-to-events-button')).toBeInTheDocument();
  });

  it('should render the create button with correct text', () => {
    render(<LieuxHeader onCreateClick={mockOnCreateClick} />);
    
    const createButton = screen.getByText('+ Nouveau Lieu');
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  });

  it('should call onCreateClick when create button is clicked', () => {
    render(<LieuxHeader onCreateClick={mockOnCreateClick} />);
    
    const createButton = screen.getByText('+ Nouveau Lieu');
    fireEvent.click(createButton);
    
    expect(mockOnCreateClick).toHaveBeenCalledTimes(1);
  });

  it('should have proper layout structure', () => {
    render(<LieuxHeader onCreateClick={mockOnCreateClick} />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('bg-white', 'shadow-md');
  });

  it('should have correct button styling', () => {
    render(<LieuxHeader onCreateClick={mockOnCreateClick} />);
    
    const createButton = screen.getByText('+ Nouveau Lieu');
    expect(createButton).toHaveClass(
      'bg-blue-600',
      'hover:bg-blue-700',
      'text-white',
      'px-4',
      'py-2',
      'rounded-md',
      'text-sm',
      'font-medium',
      'transition-colors'
    );
  });

  it('should maintain consistent spacing and layout', () => {
    render(<LieuxHeader onCreateClick={mockOnCreateClick} />);
    
    const headerContent = screen.getByText('🏢 Gestion des Lieux').closest('div');
    expect(headerContent).toHaveClass('flex', 'justify-between', 'items-center');
  });

  it('should handle multiple clicks correctly', () => {
    render(<LieuxHeader onCreateClick={mockOnCreateClick} />);
    
    const createButton = screen.getByText('+ Nouveau Lieu');
    
    fireEvent.click(createButton);
    fireEvent.click(createButton);
    fireEvent.click(createButton);
    
    expect(mockOnCreateClick).toHaveBeenCalledTimes(3);
  });

  it('should render emoji in title correctly', () => {
    render(<LieuxHeader onCreateClick={mockOnCreateClick} />);
    
    const title = screen.getByText('🏢 Gestion des Lieux');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-gray-900');
  });

  it('should be accessible', () => {
    render(<LieuxHeader onCreateClick={mockOnCreateClick} />);
    
    const createButton = screen.getByRole('button', { name: '+ Nouveau Lieu' });
    expect(createButton).toBeInTheDocument();
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
