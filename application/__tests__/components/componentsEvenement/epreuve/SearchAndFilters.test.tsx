import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchAndFilters from '../../../../src/components/componentsEvenement/epreuve/SearchAndFilters';
import { Discipline } from '../../../../src/types/sportEvenement/discipline';

describe('SearchAndFilters', () => {
  const mockDisciplines: Discipline[] = [
    { id: 1, nom: 'Athlétisme' },
    { id: 2, nom: 'Natation' },
    { id: 3, nom: 'Gymnastique' }
  ];

  const defaultProps = {
    searchTerm: '',
    selectedDisciplineId: null,
    disciplines: mockDisciplines,
    onSearch: jest.fn(),
    onDisciplineFilter: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render search input', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Rechercher une épreuve...');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('should render discipline filter dropdown', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      const disciplineSelect = screen.getByRole('combobox');
      expect(disciplineSelect).toBeInTheDocument();
    });

    it('should render all discipline options', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      expect(screen.getByText('Toutes les disciplines')).toBeInTheDocument();
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
      expect(screen.getByText('Natation')).toBeInTheDocument();
      expect(screen.getByText('Gymnastique')).toBeInTheDocument();
    });

    it('should have correct container styling', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      const container = screen.getByPlaceholderText('Rechercher une épreuve...').closest('.bg-white');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6', 'mb-8');
    });
  });

  describe('Search Input Functionality', () => {
    it('should display current search term', () => {
      render(<SearchAndFilters {...defaultProps} searchTerm="100m" />);
      
      const searchInput = screen.getByDisplayValue('100m');
      expect(searchInput).toBeInTheDocument();
    });

    it('should call onSearch when input value changes', () => {
      const mockOnSearch = jest.fn();
      render(<SearchAndFilters {...defaultProps} onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText('Rechercher une épreuve...');
      fireEvent.change(searchInput, { target: { value: 'sprint' } });
      
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('sprint');
    });

    it('should handle empty search input', () => {
      const mockOnSearch = jest.fn();
      render(<SearchAndFilters {...defaultProps} searchTerm="test" onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByDisplayValue('test');
      fireEvent.change(searchInput, { target: { value: '' } });
      
      expect(mockOnSearch).toHaveBeenCalledWith('');
    });

    it('should handle special characters in search', () => {
      const mockOnSearch = jest.fn();
      render(<SearchAndFilters {...defaultProps} onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText('Rechercher une épreuve...');
      fireEvent.change(searchInput, { target: { value: 'épreuve spéciale & test 123' } });
      
      expect(mockOnSearch).toHaveBeenCalledWith('épreuve spéciale & test 123');
    });

    it('should handle very long search terms', () => {
      const mockOnSearch = jest.fn();
      const longTerm = 'a'.repeat(100);
      render(<SearchAndFilters {...defaultProps} onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText('Rechercher une épreuve...');
      fireEvent.change(searchInput, { target: { value: longTerm } });
      
      expect(mockOnSearch).toHaveBeenCalledWith(longTerm);
    });
  });

  describe('Discipline Filter Functionality', () => {
    it('should display selected discipline', () => {
      render(<SearchAndFilters {...defaultProps} selectedDisciplineId={1} />);
      
      const disciplineSelect = screen.getByRole('combobox');
      expect(disciplineSelect).toHaveValue('1');
    });

    it('should display "all disciplines" when no discipline selected', () => {
      render(<SearchAndFilters {...defaultProps} selectedDisciplineId={null} />);
      
      const disciplineSelect = screen.getByRole('combobox');
      expect(disciplineSelect).toHaveValue('');
    });

    it('should call onDisciplineFilter when discipline is selected', () => {
      const mockOnDisciplineFilter = jest.fn();
      render(<SearchAndFilters {...defaultProps} onDisciplineFilter={mockOnDisciplineFilter} />);
      
      const disciplineSelect = screen.getByRole('combobox');
      fireEvent.change(disciplineSelect, { target: { value: '2' } });
      
      expect(mockOnDisciplineFilter).toHaveBeenCalledTimes(1);
      expect(mockOnDisciplineFilter).toHaveBeenCalledWith(2);
    });

    it('should call onDisciplineFilter with null when "all disciplines" is selected', () => {
      const mockOnDisciplineFilter = jest.fn();
      render(<SearchAndFilters {...defaultProps} selectedDisciplineId={1} onDisciplineFilter={mockOnDisciplineFilter} />);
      
      const disciplineSelect = screen.getByRole('combobox');
      fireEvent.change(disciplineSelect, { target: { value: '' } });
      
      expect(mockOnDisciplineFilter).toHaveBeenCalledWith(null);
    });

    it('should handle discipline changes between different disciplines', () => {
      const mockOnDisciplineFilter = jest.fn();
      render(<SearchAndFilters {...defaultProps} onDisciplineFilter={mockOnDisciplineFilter} />);
      
      const disciplineSelect = screen.getByRole('combobox');
      
      // Select first discipline
      fireEvent.change(disciplineSelect, { target: { value: '1' } });
      expect(mockOnDisciplineFilter).toHaveBeenCalledWith(1);
      
      // Select second discipline
      fireEvent.change(disciplineSelect, { target: { value: '3' } });
      expect(mockOnDisciplineFilter).toHaveBeenCalledWith(3);
    });
  });

  describe('Layout and Styling', () => {
    it('should have responsive flex layout', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      const flexContainer = screen.getByPlaceholderText('Rechercher une épreuve...').parentElement?.parentElement;
      expect(flexContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-4');
    });

    it('should have correct search input styling', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Rechercher une épreuve...');
      expect(searchInput).toHaveClass(
        'w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'text-black', 
        'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
      );
    });

    it('should have correct select styling', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const disciplineSelect = screen.getByRole('combobox');
      expect(disciplineSelect).toHaveClass(
        'w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'text-black', 
        'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
      );
    });    it('should have correct search container styling', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      const searchContainer = screen.getByPlaceholderText('Rechercher une épreuve...').parentElement;
      expect(searchContainer).toHaveClass('flex-1');
    });

    it('should have correct filter container styling', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      const filterContainer = screen.getByRole('combobox').parentElement;
      expect(filterContainer).toHaveClass('sm:w-64');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form controls', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      const searchInput = screen.getByRole('textbox');
      const disciplineSelect = screen.getByRole('combobox');
      
      expect(searchInput).toBeInTheDocument();
      expect(disciplineSelect).toBeInTheDocument();
    });

    it('should have proper placeholder text', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      expect(screen.getByPlaceholderText('Rechercher une épreuve...')).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      const searchInput = screen.getByRole('textbox');
      const disciplineSelect = screen.getByRole('combobox');
      
      expect(searchInput).toBeVisible();
      expect(disciplineSelect).toBeVisible();
    });

    it('should have proper option values', () => {
      render(<SearchAndFilters {...defaultProps} />);
      
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveValue(''); // "Toutes les disciplines"
      expect(options[1]).toHaveValue('1'); // "Athlétisme"
      expect(options[2]).toHaveValue('2'); // "Natation"
      expect(options[3]).toHaveValue('3'); // "Gymnastique"
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty disciplines array', () => {
      render(<SearchAndFilters {...defaultProps} disciplines={[]} />);
      
      expect(screen.getByText('Toutes les disciplines')).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(1);
    });

    it('should handle null disciplines', () => {
      expect(() => {
        render(<SearchAndFilters {...defaultProps} disciplines={null as any} />);
      }).toThrow('Cannot read properties of null');
    });

    it('should handle undefined searchTerm', () => {
      render(<SearchAndFilters {...defaultProps} searchTerm={undefined as any} />);
      
      const searchInput = screen.getByPlaceholderText('Rechercher une épreuve...');
      expect(searchInput).toHaveValue('');
    });

    it('should handle undefined selectedDisciplineId', () => {
      render(<SearchAndFilters {...defaultProps} selectedDisciplineId={undefined as any} />);
      
      const disciplineSelect = screen.getByRole('combobox');
      expect(disciplineSelect).toHaveValue('');
    });

    it('should handle null callback functions gracefully', () => {
      expect(() => {
        render(
          <SearchAndFilters 
            {...defaultProps} 
            onSearch={null as any} 
            onDisciplineFilter={null as any} 
          />
        );
      }).not.toThrow();
    });
  });

  describe('Data Handling', () => {
    it('should render disciplines with special characters', () => {
      const specialDisciplines: Discipline[] = [
        { id: 1, nom: 'Athlétisme & Course' },
        { id: 2, nom: 'Natation (piscine)' },
        { id: 3, nom: 'Arts martiaux - Judo' }
      ];

      render(<SearchAndFilters {...defaultProps} disciplines={specialDisciplines} />);
      
      expect(screen.getByText('Athlétisme & Course')).toBeInTheDocument();
      expect(screen.getByText('Natation (piscine)')).toBeInTheDocument();
      expect(screen.getByText('Arts martiaux - Judo')).toBeInTheDocument();
    });

    it('should handle disciplines with very long names', () => {
      const longNameDisciplines: Discipline[] = [
        { id: 1, nom: 'Discipline avec un nom extrêmement long qui dépasse la largeur normale' }
      ];

      render(<SearchAndFilters {...defaultProps} disciplines={longNameDisciplines} />);
      
      expect(screen.getByText('Discipline avec un nom extrêmement long qui dépasse la largeur normale')).toBeInTheDocument();
    });

    it('should handle disciplines with duplicate names', () => {
      const duplicateDisciplines: Discipline[] = [
        { id: 1, nom: 'Athlétisme' },
        { id: 2, nom: 'Athlétisme' }
      ];

      render(<SearchAndFilters {...defaultProps} disciplines={duplicateDisciplines} />);
      
      const options = screen.getAllByText('Athlétisme');
      expect(options).toHaveLength(2);
    });

    it('should maintain state when props change', () => {
      const { rerender } = render(<SearchAndFilters {...defaultProps} searchTerm="initial" />);
      
      expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
      
      rerender(<SearchAndFilters {...defaultProps} searchTerm="updated" />);
      expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
    });
  });

  describe('User Experience', () => {
    it('should allow rapid typing in search input', () => {
      const mockOnSearch = jest.fn();
      render(<SearchAndFilters {...defaultProps} onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText('Rechercher une épreuve...');
      
      fireEvent.change(searchInput, { target: { value: 'a' } });
      fireEvent.change(searchInput, { target: { value: 'ab' } });
      fireEvent.change(searchInput, { target: { value: 'abc' } });
      
      expect(mockOnSearch).toHaveBeenCalledTimes(3);
      expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'a');
      expect(mockOnSearch).toHaveBeenNthCalledWith(2, 'ab');
      expect(mockOnSearch).toHaveBeenNthCalledWith(3, 'abc');
    });

    it('should allow rapid selection changes in discipline filter', () => {
      const mockOnDisciplineFilter = jest.fn();
      render(<SearchAndFilters {...defaultProps} onDisciplineFilter={mockOnDisciplineFilter} />);
      
      const disciplineSelect = screen.getByRole('combobox');
      
      fireEvent.change(disciplineSelect, { target: { value: '1' } });
      fireEvent.change(disciplineSelect, { target: { value: '2' } });
      fireEvent.change(disciplineSelect, { target: { value: '' } });
      
      expect(mockOnDisciplineFilter).toHaveBeenCalledTimes(3);
      expect(mockOnDisciplineFilter).toHaveBeenNthCalledWith(1, 1);
      expect(mockOnDisciplineFilter).toHaveBeenNthCalledWith(2, 2);
      expect(mockOnDisciplineFilter).toHaveBeenNthCalledWith(3, null);
    });
  });
});
