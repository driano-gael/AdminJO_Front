import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EpreuveModal from '@/components/componentsEvenement/epreuve/EpreuveModal';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Discipline } from '@/types/sportEvenement/discipline';

describe('EpreuveModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const mockDisciplines: Discipline[] = [
    { id: 1, nom: 'Athlétisme', icone: 'athletics.svg' },
    { id: 2, nom: 'Natation', icone: 'swimming.svg' }
  ];

  const mockEpreuve: Epreuve = {
    id: 1,
    libelle: '100m sprint',
    genre: 'hommes',
    tour: 'finale',
    discipline: mockDisciplines[0]
  };

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    loading: false,
    error: null,
    disciplines: mockDisciplines
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<EpreuveModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Créer une nouvelle épreuve')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      render(<EpreuveModal {...defaultProps} />);

      expect(screen.getByText('Créer une nouvelle épreuve')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ex: 100m sprint, Saut en hauteur...')).toBeInTheDocument();
      expect(screen.getByText('Sélectionner une discipline')).toBeInTheDocument();
      expect(screen.getByText('Créer')).toBeInTheDocument();
      expect(screen.getByText('Annuler')).toBeInTheDocument();
    });

    it('should render in edit mode when epreuve is provided', () => {
      render(<EpreuveModal {...defaultProps} epreuve={mockEpreuve} />);
      
      expect(screen.getByText('Modifier l\'épreuve')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100m sprint')).toBeInTheDocument();
      expect(screen.getByText('Modifier')).toBeInTheDocument();
    });

    it("", () => {
      const errorMessage = 'Une erreur est survenue';
      render(<EpreuveModal {...defaultProps} error={errorMessage} />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should render disciplines in select dropdown', () => {
      render(<EpreuveModal {...defaultProps} />);
      
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
      expect(screen.getByText('Natation')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should update libelle input when typing', () => {
      render(<EpreuveModal {...defaultProps} />);

      const libelleInput = screen.getByPlaceholderText('Ex: 100m sprint, Saut en hauteur...');
      fireEvent.change(libelleInput, { target: { value: 'Saut en hauteur' } });

      expect(libelleInput).toHaveValue('Saut en hauteur');
    });

    it('should update discipline select quand modifiÃ©', () => {
      render(<EpreuveModal {...defaultProps} />);

      const disciplineSelect = screen.getByRole('combobox');
      fireEvent.change(disciplineSelect, { target: { value: '2' } });

      expect(disciplineSelect).toHaveValue('2');
    });

    it('should populate form when editing existing epreuve', () => {
      render(<EpreuveModal {...defaultProps} epreuve={mockEpreuve} />);

      const libelleInput = screen.getByDisplayValue('100m sprint');
      expect(libelleInput).toHaveValue('100m sprint');

      const disciplineSelect = screen.getByRole('combobox');
      expect(disciplineSelect).toHaveValue('1');
    });

    it('should reset form when switching modes', () => {
      const { rerender } = render(<EpreuveModal {...defaultProps} epreuve={mockEpreuve} />);

      expect(screen.getByDisplayValue('100m sprint')).toBeInTheDocument();

      rerender(<EpreuveModal {...defaultProps} epreuve={undefined} />);

      const libelleInput = screen.getByPlaceholderText('Ex: 100m sprint, Saut en hauteur...');
      expect(libelleInput).toHaveValue('');
    });
  });

  describe('Form Submission', () => {
    it('should call onSave with correct data when formulaire est soumis', () => {
      render(<EpreuveModal {...defaultProps} />);

      const libelleInput = screen.getByPlaceholderText('Ex: 100m sprint, Saut en hauteur...');
      const disciplineSelect = screen.getByRole('combobox');
      const submitButton = screen.getByText('Créer');

      fireEvent.change(libelleInput, { target: { value: 'Test Epreuve' } });
      fireEvent.change(disciplineSelect, { target: { value: '2' } });
      fireEvent.click(submitButton);

      expect(mockOnSave).toHaveBeenCalledWith({
        libelle: 'Test Epreuve',
        disciplineId: 2
      });
    });

    it('should not submit when libelle is empty', () => {
      render(<EpreuveModal {...defaultProps} />);

      const disciplineSelect = screen.getByRole('combobox');
      const submitButton = screen.getByText('Créer');

      fireEvent.change(disciplineSelect, { target: { value: '1' } });
      fireEvent.click(submitButton);

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should handle form submission via form submit', () => {
      render(<EpreuveModal {...defaultProps} />);

      const libelleInput = screen.getByPlaceholderText('Ex: 100m sprint, Saut en hauteur...');
      const disciplineSelect = screen.getByRole('combobox');
      
      fireEvent.change(libelleInput, { target: { value: 'Test Epreuve' } });
      fireEvent.change(disciplineSelect, { target: { value: '1' } });
      
      const form = libelleInput.closest('form')!;
      fireEvent.submit(form);

      expect(mockOnSave).toHaveBeenCalledWith({
        libelle: 'Test Epreuve',
        disciplineId: 1
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state Ã  la soumission button when loading', () => {
      render(<EpreuveModal {...defaultProps} loading={true} />);
      
      expect(screen.getByText('Création...')).toBeInTheDocument();
      expect(screen.queryByText('Créer')).not.toBeInTheDocument();
    });

    it('should show loading state for edit mode when loading', () => {
      render(<EpreuveModal {...defaultProps} epreuve={mockEpreuve} loading={true} />);
      
      expect(screen.getByText('Modification...')).toBeInTheDocument();
      expect(screen.queryByText('Modifier')).not.toBeInTheDocument();
    });

    it("", () => {
      render(<EpreuveModal {...defaultProps} loading={true} />);
      
      const cancelButton = screen.getByText('Annuler');
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Button Interactions', () => {
    it('should call onClose when cancel bouton est cliquÃ©', () => {
      render(<EpreuveModal {...defaultProps} />);

      const cancelButton = screen.getByText('Annuler');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should enable bouton de soumission when form is valid', () => {
      render(<EpreuveModal {...defaultProps} />);

      const libelleInput = screen.getByPlaceholderText('Ex: 100m sprint, Saut en hauteur...');
      const disciplineSelect = screen.getByRole('combobox');

      fireEvent.change(libelleInput, { target: { value: 'Test' } });
      fireEvent.change(disciplineSelect, { target: { value: '1' } });

      const submitButton = screen.getByText('Créer');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Disciplines Handling', () => {
    it('should handle empty disciplines array', () => {
      render(<EpreuveModal {...defaultProps} disciplines={[]} />);

      const disciplineSelect = screen.getByRole('combobox');
      expect(disciplineSelect).toHaveValue('0');
      expect(screen.getByText('Sélectionner une discipline')).toBeInTheDocument();
    });

    it('should auto-select first discipline when creating new epreuve', () => {
      render(<EpreuveModal {...defaultProps} />);

      const disciplineSelect = screen.getByRole('combobox');
      // Based on component logic, it selects first discipline when available
      expect(disciplineSelect).toHaveValue('1');
    });

    it('should preserve discipline selection in edit mode', () => {
      render(<EpreuveModal {...defaultProps} epreuve={mockEpreuve} />);

      const disciplineSelect = screen.getByRole('combobox');
      expect(disciplineSelect).toHaveValue('1');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form inputs with required attributes', () => {
      render(<EpreuveModal {...defaultProps} />);

      const libelleInput = screen.getByPlaceholderText('Ex: 100m sprint, Saut en hauteur...');
      const disciplineSelect = screen.getByRole('combobox');

      expect(libelleInput).toHaveAttribute('required');
      expect(disciplineSelect).toHaveAttribute('required');
    });

    it('should have proper button roles and labels', () => {
      render(<EpreuveModal {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: 'Annuler' });
      const submitButton = screen.getByRole('button', { name: 'Créer' });

      expect(cancelButton).toHaveAttribute('type', 'button');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Error Handling', () => {
    it('should display erreur de validation with proper styling', () => {
      const errorMessage = 'Erreur de validation';
      render(<EpreuveModal {...defaultProps} error={errorMessage} />);

      const errorElement = screen.getByText(errorMessage);
      expect(errorElement).toHaveClass('text-red-600');
    });

    it('should clear form when switching between create and edit modes', () => {
      const { rerender } = render(<EpreuveModal {...defaultProps} />);

      const libelleInput = screen.getByPlaceholderText('Ex: 100m sprint, Saut en hauteur...');
      fireEvent.change(libelleInput, { target: { value: 'Test Input' } });

      rerender(<EpreuveModal {...defaultProps} epreuve={mockEpreuve} />);
      expect(screen.getByDisplayValue('100m sprint')).toBeInTheDocument();

      rerender(<EpreuveModal {...defaultProps} epreuve={undefined} />);
      
      const newLibelleInput = screen.getByPlaceholderText('Ex: 100m sprint, Saut en hauteur...');
      expect(newLibelleInput).toHaveValue('');
    });
  });

  describe('Modal Overlay', () => {
    it('should render modal with proper overlay structure', () => {
      render(<EpreuveModal {...defaultProps} />);

      const overlay = screen.getByText('Créer une nouvelle épreuve').closest('.fixed');
      expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50');
    });

    it('should center modal content', () => {
      render(<EpreuveModal {...defaultProps} />);

      const overlay = screen.getByText('Créer une nouvelle épreuve').closest('.fixed');
      expect(overlay).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });
});
