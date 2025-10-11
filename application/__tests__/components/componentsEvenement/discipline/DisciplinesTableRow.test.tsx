import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisciplinesTableRow from '../../../../src/components/componentsEvenement/discipline/DisciplinesTableRow';
import { Discipline } from '../../../../src/types/sportEvenement/discipline';

describe('DisciplinesTableRow', () => {
  const mockDiscipline: Discipline = {
    id: 1,
    nom: 'Football',
    icone: 'football.svg'
  };

  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const defaultProps = {
    discipline: mockDiscipline,
    onDelete: mockOnDelete,
    onEdit: mockOnEdit
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render discipline name correctement', () => {
      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      expect(screen.getByText('Football')).toBeInTheDocument();
    });

    it('should render both action buttons', () => {
      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      expect(screen.getByText('Modifier')).toBeInTheDocument();
      expect(screen.getByText('Supprimer')).toBeInTheDocument();
    });

    it('should have correct CSS classes for ligne de tableau', () => {
      const { container } = render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const row = container.querySelector('tr');
      expect(row).toHaveClass('hover:bg-gray-50');
    });

    it('should have correct styling for discipline name cell', () => {
      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const nameElement = screen.getByText('Football');
      expect(nameElement).toHaveClass('text-sm', 'font-medium', 'text-gray-900');
    });

    it('should have correct styling for action buttons', () => {
      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const editButton = screen.getByText('Modifier');
      const deleteButton = screen.getByText('Supprimer');

      expect(editButton).toHaveClass('text-blue-600', 'hover:text-blue-900', 'mr-3');
      expect(deleteButton).toHaveClass('text-red-600', 'hover:text-red-900');
    });
  });

  describe('User Interactions', () => {
    it('should call onEdit with discipline when edit bouton est cliquÃ©', () => {
      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const editButton = screen.getByText('Modifier');
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(mockDiscipline);
    });

    it('should call onDelete with discipline id when delete bouton est cliquÃ©', () => {
      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const deleteButton = screen.getByText('Supprimer');
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(mockDiscipline.id);
    });

    it('should not call callbacks when row is clicked but buttons are not', () => {
      const { container } = render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const row = container.querySelector('tr');
      fireEvent.click(row!);

      expect(mockOnEdit).not.toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('Different Discipline Data', () => {
    it('should render discipline with long name correctement', () => {
      const longNameDiscipline: Discipline = {
        id: 2,
        nom: 'Basketball Féminin Catégorie Junior',
        icone: 'basketball.svg'
      };

      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} discipline={longNameDiscipline} />
          </tbody>
        </table>
      );

      expect(screen.getByText('Basketball Féminin Catégorie Junior')).toBeInTheDocument();
    });

    it('should render discipline with special characters', () => {
      const specialCharDiscipline: Discipline = {
        id: 3,
        nom: 'Tir à l\'arc & Précision',
        icone: 'tir_arc.svg'
      };

      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} discipline={specialCharDiscipline} />
          </tbody>
        </table>
      );

      expect(screen.getByText('Tir à l\'arc & Précision')).toBeInTheDocument();
    });

    it('should handle discipline with id 0', () => {
      const zeroIdDiscipline: Discipline = {
        id: 0,
        nom: 'Test Discipline',
        icone: 'test.svg'
      };

      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} discipline={zeroIdDiscipline} />
          </tbody>
        </table>
      );

      const deleteButton = screen.getByText('Supprimer');
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith(0);
    });

    it('should handle discipline with large id', () => {
      const largeIdDiscipline: Discipline = {
        id: 999999,
        nom: 'Test Discipline',
        icone: 'test.svg'
      };

      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} discipline={largeIdDiscipline} />
          </tbody>
        </table>
      );

      const deleteButton = screen.getByText('Supprimer');
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith(999999);
    });
  });

  describe('Layout Structure', () => {
    it('should have correct table structure with proper cells', () => {
      const { container } = render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells).toHaveLength(2);

      // First cell should contain discipline name
      expect(cells[0]).toHaveClass('px-6', 'py-4', 'whitespace-nowrap');
      
      // Second cell should contain action buttons
      expect(cells[1]).toHaveClass('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium');
    });

    it('should have buttons in the correct order', () => {
      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('Modifier');
      expect(buttons[1]).toHaveTextContent('Supprimer');
    });
  });

  describe('Accessibility', () => {
    it('should have buttons with proper roles', () => {
      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
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
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const editButton = screen.getByText('Modifier');
      
      // Should be focusable
      editButton.focus();
      expect(document.activeElement).toBe(editButton);
    });
  });

  describe('Edge Cases', () => {
    it("", () => {
      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const editButton = screen.getByText('Modifier');
      
      // Simulate multiple rapid clicks
      fireEvent.click(editButton);
      fireEvent.click(editButton);
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(3);
      expect(mockOnEdit).toHaveBeenCalledWith(mockDiscipline);
    });

    it('should handle multiple rapid clicks on bouton de suppression', () => {
      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} />
          </tbody>
        </table>
      );

      const deleteButton = screen.getByText('Supprimer');
      
      // Simulate multiple rapid clicks
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(3);
      expect(mockOnDelete).toHaveBeenCalledWith(mockDiscipline.id);
    });

    it('should handle empty discipline name gracefully', () => {
      const emptyNameDiscipline: Discipline = {
        id: 4,
        nom: '',
        icone: 'empty.svg'
      };

      render(
        <table>
          <tbody>
            <DisciplinesTableRow {...defaultProps} discipline={emptyNameDiscipline} />
          </tbody>
        </table>
      );

      // Should still render the row structure
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });
  });
});
