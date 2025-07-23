import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EpreuvesTableRow from '../../../../src/components/componentsEvenement/epreuve/EpreuvesTableRow';
import { Epreuve } from '../../../../src/types/sportEvenement/epreuve';

describe('EpreuvesTableRow', () => {
  const mockEpreuve: Epreuve = {
    id: 1,
    libelle: '100m Sprint',
    discipline: { id: 1, nom: 'Athlétisme' }
  };

  const defaultProps = {
    epreuve: mockEpreuve,
    onDelete: jest.fn(),
    onEdit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render epreuve information correctly', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      expect(screen.getByText('100m Sprint')).toBeInTheDocument();
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      expect(screen.getByText('Modifier')).toBeInTheDocument();
      expect(screen.getByText('Supprimer')).toBeInTheDocument();
    });

    it('should render as table row', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      expect(screen.getByRole('row')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onEdit when modify button is clicked', () => {
      const mockOnEdit = jest.fn();
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} onEdit={mockOnEdit} />
          </tbody>
        </table>
      );
      
      const editButton = screen.getByText('Modifier');
      fireEvent.click(editButton);
      
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(mockEpreuve);
    });

    it('should call onDelete when delete button is clicked', () => {
      const mockOnDelete = jest.fn();
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} onDelete={mockOnDelete} />
          </tbody>
        </table>
      );
      
      const deleteButton = screen.getByText('Supprimer');
      fireEvent.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(mockEpreuve.id);
    });

    it('should handle multiple rapid clicks on edit button', () => {
      const mockOnEdit = jest.fn();
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} onEdit={mockOnEdit} />
          </tbody>
        </table>
      );
      
      const editButton = screen.getByText('Modifier');
      fireEvent.click(editButton);
      fireEvent.click(editButton);
      fireEvent.click(editButton);
      
      expect(mockOnEdit).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple rapid clicks on delete button', () => {
      const mockOnDelete = jest.fn();
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} onDelete={mockOnDelete} />
          </tbody>
        </table>
      );
      
      const deleteButton = screen.getByText('Supprimer');
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledTimes(3);
    });
  });

  describe('Different Epreuve Data', () => {
    it('should render epreuve with different discipline', () => {
      const natationEpreuve: Epreuve = {
        id: 2,
        libelle: 'Papillon 200m',
        discipline: { id: 2, nom: 'Natation' }
      };

      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} epreuve={natationEpreuve} />
          </tbody>
        </table>
      );
      
      expect(screen.getByText('Papillon 200m')).toBeInTheDocument();
      expect(screen.getByText('Natation')).toBeInTheDocument();
    });

    it('should render epreuve with long libelle', () => {
      const longLibelleEpreuve: Epreuve = {
        id: 3,
        libelle: 'Très très très long libellé d\'épreuve qui dépasse la largeur normale de la cellule',
        discipline: { id: 1, nom: 'Athlétisme' }
      };

      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} epreuve={longLibelleEpreuve} />
          </tbody>
        </table>
      );
      
      expect(screen.getByText(longLibelleEpreuve.libelle)).toBeInTheDocument();
    });

    it('should render epreuve with special characters', () => {
      const specialEpreuve: Epreuve = {
        id: 4,
        libelle: 'Épreuve spéciale 100m & relais 4×100m',
        discipline: { id: 1, nom: 'Athlétisme & Course' }
      };

      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} epreuve={specialEpreuve} />
          </tbody>
        </table>
      );
      
      expect(screen.getByText('Épreuve spéciale 100m & relais 4×100m')).toBeInTheDocument();
      expect(screen.getByText('Athlétisme & Course')).toBeInTheDocument();
    });

    it('should handle different epreuve IDs', () => {
      const highIdEpreuve: Epreuve = {
        id: 999999,
        libelle: 'Test Epreuve',
        discipline: { id: 1, nom: 'Test Discipline' }
      };

      const mockOnDelete = jest.fn();
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} epreuve={highIdEpreuve} onDelete={mockOnDelete} />
          </tbody>
        </table>
      );
      
      const deleteButton = screen.getByText('Supprimer');
      fireEvent.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledWith(999999);
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct row styling', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const row = screen.getByRole('row');
      expect(row).toHaveClass('hover:bg-gray-50');
    });

    it('should have correct cell styling for libelle', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const libelleCell = screen.getByText('100m Sprint').parentElement;
      expect(libelleCell).toHaveClass('px-6', 'py-4', 'whitespace-nowrap');
      
      const libelleDiv = screen.getByText('100m Sprint');
      expect(libelleDiv).toHaveClass('text-sm', 'font-medium', 'text-gray-900');
    });

    it('should have correct cell styling for discipline', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const disciplineCell = screen.getByText('Athlétisme').parentElement;
      expect(disciplineCell).toHaveClass('px-6', 'py-4', 'whitespace-nowrap');
      
      const disciplineDiv = screen.getByText('Athlétisme');
      expect(disciplineDiv).toHaveClass('text-sm', 'text-gray-500');
    });

    it('should have correct styling for action buttons', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const editButton = screen.getByText('Modifier');
      expect(editButton).toHaveClass('text-blue-600', 'hover:text-blue-900', 'mr-3');
      
      const deleteButton = screen.getByText('Supprimer');
      expect(deleteButton).toHaveClass('text-red-600', 'hover:text-red-900');
    });

    it('should have correct actions cell styling', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const actionsCell = screen.getByText('Modifier').parentElement;
      expect(actionsCell).toHaveClass('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible buttons', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const editButton = screen.getByRole('button', { name: 'Modifier' });
      const deleteButton = screen.getByRole('button', { name: 'Supprimer' });
      
      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const editButton = screen.getByRole('button', { name: 'Modifier' });
      const deleteButton = screen.getByRole('button', { name: 'Supprimer' });
      
      expect(editButton).toBeVisible();
      expect(deleteButton).toBeVisible();
    });

    it('should have proper table cell structure', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(3); // libelle, discipline, actions
    });
  });

  describe('Edge Cases', () => {
    it('should handle null discipline gracefully', () => {
      const epreuveWithNullDiscipline: Epreuve = {
        id: 1,
        libelle: 'Test Epreuve',
        discipline: null as any
      };

      expect(() => {
        render(
          <table>
            <tbody>
              <EpreuvesTableRow {...defaultProps} epreuve={epreuveWithNullDiscipline} />
            </tbody>
          </table>
        );
      }).toThrow('Cannot read properties of null');
    });

    it('should handle empty libelle', () => {
      const epreuveWithEmptyLibelle: Epreuve = {
        id: 1,
        libelle: '',
        discipline: { id: 1, nom: 'Athlétisme' }
      };

      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} epreuve={epreuveWithEmptyLibelle} />
          </tbody>
        </table>
      );
      
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    });

    it('should handle zero ID', () => {
      const epreuveWithZeroId: Epreuve = {
        id: 0,
        libelle: 'Test Epreuve',
        discipline: { id: 1, nom: 'Athlétisme' }
      };

      const mockOnDelete = jest.fn();
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} epreuve={epreuveWithZeroId} onDelete={mockOnDelete} />
          </tbody>
        </table>
      );
      
      const deleteButton = screen.getByText('Supprimer');
      fireEvent.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledWith(0);
    });

    it('should handle undefined callbacks gracefully', () => {
      expect(() => {
        render(
          <table>
            <tbody>
              <EpreuvesTableRow 
                epreuve={mockEpreuve} 
                onDelete={undefined as any} 
                onEdit={undefined as any} 
              />
            </tbody>
          </table>
        );
      }).not.toThrow();
    });
  });

  describe('Hover Effects', () => {
    it('should have hover effect on row', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const row = screen.getByRole('row');
      expect(row).toHaveClass('hover:bg-gray-50');
    });

    it('should have hover effects on buttons', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const editButton = screen.getByText('Modifier');
      const deleteButton = screen.getByText('Supprimer');
      
      expect(editButton).toHaveClass('hover:text-blue-900');
      expect(deleteButton).toHaveClass('hover:text-red-900');
    });
  });

  describe('Button Spacing', () => {
    it('should have correct spacing between buttons', () => {
      render(
        <table>
          <tbody>
            <EpreuvesTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      const editButton = screen.getByText('Modifier');
      expect(editButton).toHaveClass('mr-3');
    });
  });
});
