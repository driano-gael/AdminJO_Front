import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EpreuvesHeader from '../../../../src/components/componentsEvenement/epreuve/EpreuvesHeader';

// Mock du composant BackToEventsButton
jest.mock('../../../../src/components/componentsEvenement/shared/BackToEventsButton', () => {
  return function MockBackToEventsButton() {
    return <button data-testid="back-to-events">Back to Events</button>;
  };
});

describe('EpreuvesHeader', () => {
  const defaultProps = {
    onCreateClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render header with correct title', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      expect(screen.getByText('🥇 🥈 🥉 Gestion des Épreuves')).toBeInTheDocument();
    });

    it('should render create button', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const createButton = screen.getByText('+ Nouvelle Épreuve');
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveClass('bg-blue-600');
    });

    it('should render back to events button', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      expect(screen.getByTestId('back-to-events')).toBeInTheDocument();
    });

    it('should render as header element', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onCreateClick when create button is clicked', () => {
      const mockOnCreateClick = jest.fn();
      render(<EpreuvesHeader onCreateClick={mockOnCreateClick} />);
      
      const createButton = screen.getByText('+ Nouvelle Épreuve');
      fireEvent.click(createButton);
      
      expect(mockOnCreateClick).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple rapid clicks on create button', () => {
      const mockOnCreateClick = jest.fn();
      render(<EpreuvesHeader onCreateClick={mockOnCreateClick} />);
      
      const createButton = screen.getByText('+ Nouvelle Épreuve');
      fireEvent.click(createButton);
      fireEvent.click(createButton);
      fireEvent.click(createButton);
      
      expect(mockOnCreateClick).toHaveBeenCalledTimes(3);
    });

    it('should not crash when onCreateClick is undefined', () => {
      expect(() => {
        render(<EpreuvesHeader onCreateClick={undefined as any} />);
      }).not.toThrow();
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct header styling', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-white', 'shadow-md');
    });

    it('should have correct container layout', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const headerContent = screen.getByText('🥇 🥈 🥉 Gestion des Épreuves').parentElement;
      expect(headerContent).toHaveClass('flex', 'justify-between', 'items-center', 'py-6', 'px-6');
    });

    it('should have correct title styling', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const title = screen.getByText('🥇 🥈 🥉 Gestion des Épreuves');
      expect(title).toHaveClass('text-3xl', 'font-bold', 'text-gray-900');
    });

    it('should have correct create button styling', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const createButton = screen.getByText('+ Nouvelle Épreuve');
      expect(createButton).toHaveClass(
        'bg-blue-600', 'hover:bg-blue-700', 'text-white', 'px-4', 'py-2', 
        'rounded-md', 'text-sm', 'font-medium', 'transition-colors'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have accessible create button', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const createButton = screen.getByRole('button', { name: '+ Nouvelle Épreuve' });
      expect(createButton).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const createButton = screen.getByRole('button', { name: '+ Nouvelle Épreuve' });
      expect(createButton).toBeVisible();
      expect(createButton).not.toHaveAttribute('disabled');
    });

    it('should have proper heading structure', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('🥇 🥈 🥉 Gestion des Épreuves');
    });
  });

  describe('Component Structure', () => {
    it('should have BackToEventsButton on the left', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const container = screen.getByRole('banner').firstElementChild;
      const backButton = screen.getByTestId('back-to-events');
      
      expect(container?.firstElementChild).toBe(backButton);
    });

    it('should have title in the center', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const container = screen.getByRole('banner').firstElementChild;
      const title = screen.getByText('🥇 🥈 🥉 Gestion des Épreuves');
      
      expect(container?.children[1]).toBe(title);
    });

    it('should have create button on the right', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const container = screen.getByRole('banner').firstElementChild;
      const createButton = screen.getByText('+ Nouvelle Épreuve');
      
      expect(container?.lastElementChild).toBe(createButton);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const headerContent = screen.getByText('🥇 🥈 🥉 Gestion des Épreuves').parentElement;
      expect(headerContent).toHaveClass('py-6', 'px-6');
    });

    it('should maintain layout on different screen sizes', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const headerContent = screen.getByText('🥇 🥈 🥉 Gestion des Épreuves').parentElement;
      expect(headerContent).toHaveClass('flex', 'justify-between', 'items-center');
    });
  });

  describe('Visual Elements', () => {
    it('should include emoji icons in title', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const title = screen.getByText('🥇 🥈 🥉 Gestion des Épreuves');
      expect(title).toBeInTheDocument();
      expect(title.textContent).toContain('🥇');
      expect(title.textContent).toContain('🥈');
      expect(title.textContent).toContain('🥉');
    });

    it('should have plus icon in create button', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const createButton = screen.getByText('+ Nouvelle Épreuve');
      expect(createButton.textContent).toContain('+');
    });
  });

  describe('Button States', () => {
    it('should have hover effect on create button', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const createButton = screen.getByText('+ Nouvelle Épreuve');
      expect(createButton).toHaveClass('hover:bg-blue-700');
    });

    it('should have transition effect on create button', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const createButton = screen.getByText('+ Nouvelle Épreuve');
      expect(createButton).toHaveClass('transition-colors');
    });
  });

  describe('Integration', () => {
    it('should integrate properly with BackToEventsButton component', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      expect(screen.getByTestId('back-to-events')).toBeInTheDocument();
      expect(screen.getByText('Back to Events')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null onCreateClick gracefully', () => {
      expect(() => {
        render(<EpreuvesHeader onCreateClick={null as any} />);
      }).not.toThrow();
    });

    it('should maintain structure with different prop combinations', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2); // BackButton + CreateButton
    });
  });

  describe('Text Content', () => {
    it('should have correct button text', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      expect(screen.getByText('+ Nouvelle Épreuve')).toBeInTheDocument();
    });

    it('should have correct title text', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      expect(screen.getByText('🥇 🥈 🥉 Gestion des Épreuves')).toBeInTheDocument();
    });
  });

  describe('CSS Classes Validation', () => {
    it('should have all required CSS classes for styling', () => {
      render(<EpreuvesHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      const title = screen.getByRole('heading');
      const createButton = screen.getByText('+ Nouvelle Épreuve');
      
      // Verify essential classes are present
      expect(header).toHaveClass('bg-white');
      expect(title).toHaveClass('text-3xl');
      expect(createButton).toHaveClass('bg-blue-600');
    });
  });
});
