import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisciplinesTable from '../../../../src/components/componentsEvenement/discipline/DisciplinesTable';
import { Discipline } from '../../../../src/types/sportEvenement/discipline';

// Mock des composants enfants
jest.mock('../../../../src/components/componentsEvenement/discipline/DisciplinesTableRow', () => {
  return function MockDisciplinesTableRow({ discipline, onDelete, onEdit }: any) {
    return (
      <tr data-testid={`discipline-row-${discipline.id}`}>
        <td>{discipline.nom}</td>
        <td>
          <button onClick={() => onEdit(discipline)}>Modifier</button>
          <button onClick={() => onDelete(discipline.id)}>Supprimer</button>
        </td>
      </tr>
    );
  };
});

jest.mock('../../../../src/components/spinner', () => {
  return function MockSpinner({ size }: { size?: string }) {
    return <div data-testid="spinner" data-size={size}>Loading...</div>;
  };
});

describe('DisciplinesTable', () => {
  const mockOnRefresh = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const defaultProps = {
    disciplines: [],
    loading: false,
    searchTerm: '',
    onRefresh: mockOnRefresh,
    onDelete: mockOnDelete,
    onEdit: mockOnEdit,
    error: null
  };

  const mockDisciplines: Discipline[] = [
    { id: 1, nom: 'Athlétisme' },
    { id: 2, nom: 'Natation' },
    { id: 3, nom: 'Basketball' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Table Structure', () => {
    it('should render table with correct headers', () => {
      render(<DisciplinesTable {...defaultProps} />);
      
      expect(screen.getByText('Nom de la Discipline')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should have correct table structure', () => {
      render(<DisciplinesTable {...defaultProps} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveClass('min-w-full', 'divide-y', 'divide-gray-200');
    });

    it('should display disciplines count in header', () => {
      render(<DisciplinesTable {...defaultProps} disciplines={mockDisciplines} />);
      
      expect(screen.getByText('Disciplines (3)')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should render disciplines when provided', () => {
      render(<DisciplinesTable {...defaultProps} disciplines={mockDisciplines} />);
      
      expect(screen.getByTestId('discipline-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('discipline-row-2')).toBeInTheDocument();
      expect(screen.getByTestId('discipline-row-3')).toBeInTheDocument();
      
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
      expect(screen.getByText('Natation')).toBeInTheDocument();
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    it('should pass correct props to DisciplinesTableRow', () => {
      render(<DisciplinesTable {...defaultProps} disciplines={[mockDisciplines[0]]} />);
      
      const editButton = screen.getByText('Modifier');
      const deleteButton = screen.getByText('Supprimer');
      
      fireEvent.click(editButton);
      expect(mockOnEdit).toHaveBeenCalledWith(mockDisciplines[0]);
      
      fireEvent.click(deleteButton);
      expect(mockOnDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no disciplines', () => {
      render(<DisciplinesTable {...defaultProps} />);
      
      expect(screen.getByText('Aucune discipline')).toBeInTheDocument();
      expect(screen.getByText('Commencez par créer votre première discipline')).toBeInTheDocument();
    });

    it('should show no results message when search returns empty', () => {
      render(<DisciplinesTable {...defaultProps} searchTerm="Football" />);
      
      expect(screen.getByText('Aucune discipline trouvée')).toBeInTheDocument();
      expect(screen.getByText(/Aucune discipline ne correspond à votre recherche/)).toBeInTheDocument();
      expect(screen.getByText(/Football/)).toBeInTheDocument();
    });

    it('should show loading message when loading with no data', () => {
      render(<DisciplinesTable {...defaultProps} loading={true} />);
      
      expect(screen.getByText('Chargement des disciplines...')).toBeInTheDocument();
      const spinners = screen.getAllByTestId('spinner');
      expect(spinners.length).toBeGreaterThan(0);
      expect(spinners.find(s => s.getAttribute('data-size') === 'medium')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator in header when loading', () => {
      render(<DisciplinesTable {...defaultProps} loading={true} disciplines={mockDisciplines} />);
      
      expect(screen.getByText('Chargement...')).toBeInTheDocument();
      const spinners = screen.getAllByTestId('spinner');
      expect(spinners[0]).toHaveAttribute('data-size', 'small');
    });

    it('should disable refresh button when loading', () => {
      render(<DisciplinesTable {...defaultProps} loading={true} />);
      
      const refreshButton = screen.getByText('🔄 Actualiser');
      expect(refreshButton).toBeDisabled();
    });

    it('should enable refresh button when not loading', () => {
      render(<DisciplinesTable {...defaultProps} loading={false} />);
      
      const refreshButton = screen.getByText('🔄 Actualiser');
      expect(refreshButton).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error exists', () => {
      render(<DisciplinesTable {...defaultProps} error="Erreur de chargement" />);
      
      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
    });

    it('should not display error when error is null', () => {
      render(<DisciplinesTable {...defaultProps} error={null} />);
      
      const errorElement = screen.queryByText(/erreur/i);
      expect(errorElement).not.toBeInTheDocument();
    });

    it('should have correct error styling', () => {
      render(<DisciplinesTable {...defaultProps} error="Test error" />);
      
      const errorDiv = screen.getByText('Test error');
      expect(errorDiv).toHaveClass('mt-2', 'text-sm', 'text-red-600', 'bg-red-50', 'p-2', 'rounded');
    });
  });

  describe('Refresh Functionality', () => {
    it('should call onRefresh when refresh button is clicked', () => {
      render(<DisciplinesTable {...defaultProps} />);
      
      const refreshButton = screen.getByText('🔄 Actualiser');
      fireEvent.click(refreshButton);
      
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it('should not call onRefresh when button is disabled', () => {
      render(<DisciplinesTable {...defaultProps} loading={true} />);
      
      const refreshButton = screen.getByText('🔄 Actualiser');
      fireEvent.click(refreshButton);
      
      expect(mockOnRefresh).not.toHaveBeenCalled();
    });
  });

  describe('Component Styling', () => {
    it('should have correct container styling', () => {
      render(<DisciplinesTable {...defaultProps} />);
      
      const container = screen.getByText('Disciplines (0)').closest('.bg-white');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden');
    });

    it('should have correct header styling', () => {
      render(<DisciplinesTable {...defaultProps} />);
      
      const header = screen.getByText('Disciplines (0)').closest('.px-6');
      expect(header).toHaveClass('px-6', 'py-4', 'border-b', 'border-gray-200');
    });

    it('should have correct table styling', () => {
      render(<DisciplinesTable {...defaultProps} />);
      
      const tableContainer = screen.getByRole('table').closest('.overflow-x-auto');
      expect(tableContainer).toHaveClass('overflow-x-auto');
    });
  });

  describe('Accessibility', () => {
    it('should have proper table structure', () => {
      render(<DisciplinesTable {...defaultProps} disciplines={mockDisciplines} />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(2);
      expect(screen.getAllByRole('row')).toHaveLength(4); // 1 header + 3 data rows
    });

    it('should have accessible button', () => {
      render(<DisciplinesTable {...defaultProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /actualiser/i });
      expect(refreshButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty disciplines array', () => {
      render(<DisciplinesTable {...defaultProps} disciplines={[]} />);
      
      expect(screen.getByText('Disciplines (0)')).toBeInTheDocument();
      expect(screen.getByText('Aucune discipline')).toBeInTheDocument();
    });

    it('should handle single discipline', () => {
      render(<DisciplinesTable {...defaultProps} disciplines={[mockDisciplines[0]]} />);
      
      expect(screen.getByText('Disciplines (1)')).toBeInTheDocument();
      expect(screen.getByTestId('discipline-row-1')).toBeInTheDocument();
    });

    it('should handle special characters in search term', () => {
      const specialSearchTerm = 'Basket & Ball';
      render(<DisciplinesTable {...defaultProps} searchTerm={specialSearchTerm} />);
      
      expect(screen.getByText(/Aucune discipline ne correspond à votre recherche/)).toBeInTheDocument();
      expect(screen.getByText(/Basket & Ball/)).toBeInTheDocument();
    });
  });
});
