import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchAndFilters from '@/components/componentsEvenement/lieux/SearchAndFilters';

describe('SearchAndFilters', () => {
  const mockOnSearch = jest.fn();
  const defaultProps = {
    searchTerm: '',
    onSearch: mockOnSearch
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input with correct placeholder', () => {
    render(<SearchAndFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher un lieu...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('should display current search term', () => {
    render(<SearchAndFilters {...defaultProps} searchTerm="Stade de France" />);
    
    const searchInput = screen.getByDisplayValue('Stade de France');
    expect(searchInput).toBeInTheDocument();
  });

  it('should call onSearch when input value changes', () => {
    render(<SearchAndFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher un lieu...');
    fireEvent.change(searchInput, { target: { value: 'Arena' } });
    
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('Arena');
  });

  it('should handle empty search term', () => {
    render(<SearchAndFilters {...defaultProps} searchTerm="" />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher un lieu...');
    expect(searchInput).toHaveValue('');
  });

  it('should handle multiple character input', () => {
    render(<SearchAndFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher un lieu...');
    
    fireEvent.change(searchInput, { target: { value: 'S' } });
    expect(mockOnSearch).toHaveBeenCalledWith('S');
    
    fireEvent.change(searchInput, { target: { value: 'St' } });
    expect(mockOnSearch).toHaveBeenCalledWith('St');
    
    fireEvent.change(searchInput, { target: { value: 'Stade' } });
    expect(mockOnSearch).toHaveBeenCalledWith('Stade');
    
    expect(mockOnSearch).toHaveBeenCalledTimes(3);
  });

  it('should handle special characters in search', () => {
    render(<SearchAndFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher un lieu...');
    fireEvent.change(searchInput, { target: { value: 'Palais des Sports - Léo Lagrange' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('Palais des Sports - Léo Lagrange');
  });

  it('should handle clearing search term', () => {
    render(<SearchAndFilters {...defaultProps} searchTerm="Previous search" />);
    
    const searchInput = screen.getByDisplayValue('Previous search');
    fireEvent.change(searchInput, { target: { value: '' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('should have correct styling classes', () => {
    render(<SearchAndFilters {...defaultProps} />);
    
    const container = screen.getByPlaceholderText('Rechercher un lieu...').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6', 'mb-8');
    
    const searchInput = screen.getByPlaceholderText('Rechercher un lieu...');
    expect(searchInput).toHaveClass(
      'w-full',
      'px-4',
      'py-2',
      'border',
      'border-gray-300',
      'text-black',
      'rounded-md',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500'
    );
  });

  it('should have proper input attributes', () => {
    render(<SearchAndFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher un lieu...');
    expect(searchInput).toHaveAttribute('type', 'text');
    expect(searchInput).toHaveAttribute('placeholder', 'Rechercher un lieu...');
  });

  it('should handle focus and blur events', () => {
    render(<SearchAndFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher un lieu...') as HTMLInputElement;
    
    searchInput.focus();
    expect(document.activeElement).toBe(searchInput);
    
    searchInput.blur();
    expect(document.activeElement).not.toBe(searchInput);
  });

  it('should handle keyboard events', () => {
    render(<SearchAndFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher un lieu...');
    
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    fireEvent.keyUp(searchInput, { key: 'Enter' });
    
    // Should not crash and onSearch should not be called by keyboard events
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should maintain responsive design classes', () => {
    render(<SearchAndFilters {...defaultProps} />);
    
    const inputWrapper = screen.getByPlaceholderText('Rechercher un lieu...').closest('div');
    expect(inputWrapper).toHaveClass('flex-1', 'max-w-md');
  });

  it('should handle long search terms', () => {
    const longSearchTerm = 'Centre Nautique Olympique de Paris La Défense Arena Nanterre';
    render(<SearchAndFilters {...defaultProps} searchTerm={longSearchTerm} />);
    
    const searchInput = screen.getByDisplayValue(longSearchTerm);
    expect(searchInput).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<SearchAndFilters {...defaultProps} />);
    
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Rechercher un lieu...');
  });
});
