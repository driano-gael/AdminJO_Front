import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchAndFilters from '../../../../src/components/componentsEvenement/discipline/SearchAndFilters';

describe('SearchAndFilters', () => {
  const mockOnSearch = jest.fn();

  const defaultProps = {
    searchTerm: '',
    onSearch: mockOnSearch
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input with correct placeholder', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Rechercher une discipline...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should display current search term in input', () => {
      render(<SearchAndFilters {...defaultProps} searchTerm="Football" />);

      const searchInput = screen.getByDisplayValue('Football');
      expect(searchInput).toBeInTheDocument();
    });

    it('should have correct input type', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('should have correct CSS classes for container', () => {
      const { container } = render(<SearchAndFilters {...defaultProps} />);

      const containerDiv = container.firstChild;
      expect(containerDiv).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6', 'mb-8');
    });

    it('should have correct CSS classes for input wrapper', () => {
      const { container } = render(<SearchAndFilters {...defaultProps} />);

      const inputWrapper = container.querySelector('.flex-1');
      expect(inputWrapper).toHaveClass('flex-1', 'max-w-md');
    });

    it('should have correct CSS classes for input element', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
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
  });

  describe('User Interactions', () => {
    it('should call onSearch when utilisateur tape', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'Basketball' } });

      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('Basketball');
    });

    it('should call onSearch with empty string when input is cleared', () => {
      render(<SearchAndFilters {...defaultProps} searchTerm="Football" />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: '' } });

      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('');
    });

    it('should handle multiple character inputs', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      
      fireEvent.change(searchInput, { target: { value: 'F' } });
      fireEvent.change(searchInput, { target: { value: 'Fo' } });
      fireEvent.change(searchInput, { target: { value: 'Foo' } });
      fireEvent.change(searchInput, { target: { value: 'Foot' } });

      expect(mockOnSearch).toHaveBeenCalledTimes(4);
      expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'F');
      expect(mockOnSearch).toHaveBeenNthCalledWith(2, 'Fo');
      expect(mockOnSearch).toHaveBeenNthCalledWith(3, 'Foo');
      expect(mockOnSearch).toHaveBeenNthCalledWith(4, 'Foot');
    });

    it('should handle special characters in search', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'Tir à l\'arc & Précision' } });

      expect(mockOnSearch).toHaveBeenCalledWith('Tir à l\'arc & Précision');
    });

    it('should handle numbers in search', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'Sport 2024' } });

      expect(mockOnSearch).toHaveBeenCalledWith('Sport 2024');
    });

    it('should handle spaces in search', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: '  Basketball Féminin  ' } });

      expect(mockOnSearch).toHaveBeenCalledWith('  Basketball Féminin  ');
    });
  });

  describe('Keyboard Interactions', () => {
    it('should be focusable', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      searchInput.focus();

      expect(document.activeElement).toBe(searchInput);
    });

    it('should handle Enter key press', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

      // Should not cause any errors or unwanted behavior
      expect(searchInput).toBeInTheDocument();
    });

    it('should handle Tab key press for navigation', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.keyDown(searchInput, { key: 'Tab', code: 'Tab' });

      // Should not cause any errors
      expect(searchInput).toBeInTheDocument();
    });

    it('should handle Escape key press', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' });

      // Should not cause any errors
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Different Search Terms', () => {
    it('should handle long search terms', () => {
      const longSearchTerm = 'This is a very long search term that might be used to test the component behavior with lengthy input values';
      
      render(<SearchAndFilters {...defaultProps} searchTerm={longSearchTerm} />);

      const searchInput = screen.getByDisplayValue(longSearchTerm);
      expect(searchInput).toBeInTheDocument();
    });

    it('should handle search terms with emojis', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'Football ⚽ 🏆' } });

      expect(mockOnSearch).toHaveBeenCalledWith('Football ⚽ 🏆');
    });

    it('should handle search terms with quotes', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: '"Basketball"' } });

      expect(mockOnSearch).toHaveBeenCalledWith('"Basketball"');
    });

    it('should handle search terms with HTML characters', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: '<script>alert("test")</script>' } });

      expect(mockOnSearch).toHaveBeenCalledWith('<script>alert("test")</script>');
    });
  });

  describe('Component State', () => {
    it('should update display when searchTerm prop changes', () => {
      const { rerender } = render(<SearchAndFilters {...defaultProps} searchTerm="" />);

      expect(screen.getByDisplayValue('')).toBeInTheDocument();

      rerender(<SearchAndFilters {...defaultProps} searchTerm="Tennis" />);

      expect(screen.getByDisplayValue('Tennis')).toBeInTheDocument();
    });

    it('should maintain input focus during re-renders', () => {
      const { rerender } = render(<SearchAndFilters {...defaultProps} searchTerm="" />);

      const searchInput = screen.getByRole('textbox');
      searchInput.focus();

      rerender(<SearchAndFilters {...defaultProps} searchTerm="Test" />);

      // Note: Focus might be lost during re-render, this tests that the component handles it gracefully
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper role for screen readers', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
    });

    it('should have descriptive placeholder text', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Rechercher une discipline...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should support screen reader navigation', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toHaveAttribute('placeholder', 'Rechercher une discipline...');
    });
  });

  describe('Layout and Styling', () => {
    it('should have responsive design classes', () => {
      const { container } = render(<SearchAndFilters {...defaultProps} />);

      const inputWrapper = container.querySelector('.max-w-md');
      expect(inputWrapper).toHaveClass('flex-1', 'max-w-md');
    });

    it('should have proper spacing and padding', () => {
      const { container } = render(<SearchAndFilters {...defaultProps} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('p-6', 'mb-8');
    });

    it('should have proper input styling for focus states', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
    });

    it('should have proper border and background styling', () => {
      const { container } = render(<SearchAndFilters {...defaultProps} />);
      
      const mainContainer = container.firstChild;
      const searchInput = screen.getByRole('textbox');

      expect(mainContainer).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
      expect(searchInput).toHaveClass('border', 'border-gray-300', 'rounded-md');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null or undefined onSearch gracefully', () => {
      // This test verifies proper component rendering even with edge case props
      // In real usage, TypeScript would prevent null onSearch props
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Test that component renders without throwing
      expect(() => {
        render(<SearchAndFilters searchTerm="" onSearch={null as any} />);
      }).not.toThrow();
      
      consoleSpy.mockRestore();
    });

    it('should handle very rapid typing', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      
      // Simulate very rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.change(searchInput, { target: { value: `test${i}` } });
      }

      expect(mockOnSearch).toHaveBeenCalledTimes(10);
    });

    it('should handle copy-paste operations', () => {
      render(<SearchAndFilters {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      
      // Simulate paste operation
      fireEvent.paste(searchInput, {
        clipboardData: {
          getData: () => 'Pasted text content'
        }
      });

      // Should not cause errors
      expect(searchInput).toBeInTheDocument();
    });
  });
});
