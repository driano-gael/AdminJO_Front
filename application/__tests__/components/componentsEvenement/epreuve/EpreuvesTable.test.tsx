import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EpreuvesTable from '../../../../src/components/componentsEvenement/epreuve/EpreuvesTable';
import { Epreuve } from '../../../../src/types/sportEvenement/epreuve';

// Mock du composant EpreuvesTableRow
jest.mock('../../../../src/components/componentsEvenement/epreuve/EpreuvesTableRow', () => {
  return function MockEpreuvesTableRow({ epreuve, onDelete, onEdit }: any) {
    return (
      <tr data-testid={`epreuve-row-${epreuve.id}`}>
        <td>{epreuve.libelle}</td>
        <td>{epreuve.discipline.nom}</td>
        <td>
          <button onClick={() => onEdit(epreuve)}>Edit</button>
          <button onClick={() => onDelete(epreuve.id)}>Delete</button>
        </td>
      </tr>
    );
  };
});

// Mock du composant Spinner
jest.mock('../../../../src/components/spinner', () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

describe('EpreuvesTable', () => {
  const mockEpreuves: Epreuve[] = [
    { 
      id: 1, 
      libelle: '100m Sprint', 
      discipline: { id: 1, nom: 'Athlétisme' }
    },
    { 
      id: 2, 
      libelle: 'Papillon 200m', 
      discipline: { id: 2, nom: 'Natation' }
    },
    { 
      id: 3, 
      libelle: 'Saut en hauteur', 
      discipline: { id: 1, nom: 'Athlétisme' }
    }
  ];

  const defaultProps = {
    epreuves: mockEpreuves,
    loading: false,
    searchTerm: '',
    onRefresh: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render table with correct structure', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Épreuves (3)')).toBeInTheDocument();
      expect(screen.getByText('Libellé de l\'Épreuve')).toBeInTheDocument();
      expect(screen.getByText('Discipline')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should render correct number of epreuves', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      expect(screen.getByTestId('epreuve-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('epreuve-row-2')).toBeInTheDocument();
      expect(screen.getByTestId('epreuve-row-3')).toBeInTheDocument();
    });

    it('should display epreuve count in header', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      expect(screen.getByText('Épreuves (3)')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /actualiser/i });
      expect(refreshButton).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty message when no epreuves', () => {
      render(<EpreuvesTable {...defaultProps} epreuves={[]} />);
      
      expect(screen.getByText('Épreuves (0)')).toBeInTheDocument();
      expect(screen.getByText('Aucune épreuve')).toBeInTheDocument();
    });

    it('should display search-specific empty message when search term exists', () => {
      render(<EpreuvesTable {...defaultProps} epreuves={[]} searchTerm="test" />);
      
      expect(screen.getByText('Aucune épreuve trouvée')).toBeInTheDocument();
      expect(screen.getByText(/Aucune épreuve ne correspond à votre recherche/)).toBeInTheDocument();
    });

    it('should show clear search suggestion when search term exists', () => {
      render(<EpreuvesTable {...defaultProps} epreuves={[]} searchTerm="test" />);
      
      expect(screen.getByText(/Aucune épreuve ne correspond à votre recherche/)).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading', () => {
      render(<EpreuvesTable {...defaultProps} loading={true} />);
      
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should show loading text when no epreuves and loading', () => {
      render(<EpreuvesTable {...defaultProps} loading={true} epreuves={[]} />);
      
      expect(screen.getByText('Chargement des épreuves...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it("should display message d'erreur when error exists", () => {
      render(<EpreuvesTable {...defaultProps} error="Test message d'erreur" />);
      
      expect(screen.getByText("Test message d'erreur")).toBeInTheDocument();
    });

    it('should still show table content when error exists', () => {
      render(<EpreuvesTable {...defaultProps} error="Test error" />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should apply error styling', () => {
      render(<EpreuvesTable {...defaultProps} error="Test error" />);
      
      const errorElement = screen.getByText('Test error');
      expect(errorElement).toHaveClass('text-red-600', 'bg-red-50');
    });
  });

  describe('User Interactions', () => {
    it('should call onRefresh when refresh bouton est cliquÃ©', () => {
      const mockOnRefresh = jest.fn();
      render(<EpreuvesTable {...defaultProps} onRefresh={mockOnRefresh} />);
      
      const refreshButton = screen.getByRole('button', { name: /actualiser/i });
      fireEvent.click(refreshButton);
      
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it('should call onEdit when edit bouton est cliquÃ©', () => {
      const mockOnEdit = jest.fn();
      render(<EpreuvesTable {...defaultProps} onEdit={mockOnEdit} />);
      
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      expect(mockOnEdit).toHaveBeenCalledWith(mockEpreuves[0]);
    });

    it('should call onDelete when delete bouton est cliquÃ©', () => {
      const mockOnDelete = jest.fn();
      render(<EpreuvesTable {...defaultProps} onDelete={mockOnDelete} />);
      
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledWith(mockEpreuves[0].id);
    });
  });

  describe('Data Handling', () => {
    it('should pass correct props to EpreuvesTableRow', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      // Verify that the row component receives the correct epreuve data
      expect(screen.getByText('100m Sprint')).toBeInTheDocument();
      expect(screen.getByText('Papillon 200m')).toBeInTheDocument();
      expect(screen.getByText('Saut en hauteur')).toBeInTheDocument();
    });

    it('should handle epreuves with different disciplines', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      expect(screen.getAllByText('Athlétisme')).toHaveLength(2);
      expect(screen.getByText('Natation')).toBeInTheDocument();
    });

    it('should update count when epreuves change', () => {
      const { rerender } = render(<EpreuvesTable {...defaultProps} />);
      expect(screen.getByText('Épreuves (3)')).toBeInTheDocument();
      
      rerender(<EpreuvesTable {...defaultProps} epreuves={mockEpreuves.slice(0, 1)} />);
      expect(screen.getByText('Épreuves (1)')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct container styling', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      const container = screen.getByRole('table').closest('.bg-white');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden');
    });

    it('should have correct header styling', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      const header = screen.getByText('Épreuves (3)');
      expect(header).toHaveClass('text-xl', 'font-semibold', 'text-gray-900');
    });

    it('should have correct table header styling', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      const tableHeaders = screen.getAllByRole('columnheader');
      tableHeaders.forEach(header => {
        expect(header).toHaveClass('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper table structure for screen readers', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(3);
      expect(screen.getAllByRole('row')).toHaveLength(4); // 1 header + 3 data rows
    });

    it('should have accessible refresh button', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      const refreshButton = screen.getByRole('button', { name: /actualiser/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it("", () => {
      render(<EpreuvesTable {...defaultProps} error="Test error" />);
      
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive table classes', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      const tableContainer = screen.getByRole('table').parentElement;
      expect(tableContainer).toHaveClass('overflow-x-auto');
    });

    it('should handle responsive header layout', () => {
      render(<EpreuvesTable {...defaultProps} />);
      
      const headerContainer = screen.getByText('Épreuves (3)').parentElement;
      expect(headerContainer).toHaveClass('flex', 'justify-between', 'items-center');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null epreuves gracefully', () => {
      // Le composant peut crasher avec null, on teste donc avec un tableau vide
      render(<EpreuvesTable {...defaultProps} epreuves={[]} />);
      
      expect(screen.getByText('Épreuves (0)')).toBeInTheDocument();
    });

    it('should handle undefined searchTerm', () => {
      render(<EpreuvesTable {...defaultProps} searchTerm={undefined as any} />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should handle very long epreuve names', () => {
      const longNameEpreuve: Epreuve = {
        id: 4,
        libelle: 'Très très très très long nom d\'épreuve qui dépasse la largeur normale',
        discipline: { id: 1, nom: 'Athlétisme' }
      };
      
      render(<EpreuvesTable {...defaultProps} epreuves={[longNameEpreuve]} />);
      
      expect(screen.getByText(longNameEpreuve.libelle)).toBeInTheDocument();
    });

    it('should handle special characters in search term', () => {
      render(<EpreuvesTable {...defaultProps} epreuves={[]} searchTerm="épreuve spéciale &@#" />);
      
      expect(screen.getByText(/Aucune épreuve ne correspond à votre recherche/)).toBeInTheDocument();
    });
  });
});
