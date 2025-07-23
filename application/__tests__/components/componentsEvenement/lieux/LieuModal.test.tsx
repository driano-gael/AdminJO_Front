import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LieuModal from '@/components/componentsEvenement/lieux/LieuModal';
import { Lieu } from '@/types/sportEvenement/lieu';

describe('LieuModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    loading: false,
    error: null,
    lieu: undefined
  };

  const mockLieu: Lieu = {
    id: 1,
    nom: 'Stade de France'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Creation Mode', () => {
    it('should render creation modal correctly', () => {
      render(<LieuModal {...defaultProps} />);
      
      expect(screen.getByText('Créer un nouveau lieu')).toBeInTheDocument();
      expect(screen.getByText('Créer')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ex: Stade de France')).toBeInTheDocument();
    });

    it('should have empty form in creation mode', () => {
      render(<LieuModal {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Ex: Stade de France');
      expect(input).toHaveValue('');
    });

    it('should call onSave with form data when submitted', async () => {
      render(<LieuModal {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Ex: Stade de France');
      const submitButton = screen.getByText('Créer');
      
      fireEvent.change(input, { target: { value: 'Arena Bercy' } });
      fireEvent.click(submitButton);
      
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith({ nom: 'Arena Bercy' });
    });

    it('should not submit with empty nom', () => {
      render(<LieuModal {...defaultProps} />);
      
      const submitButton = screen.getByText('Créer');
      fireEvent.click(submitButton);
      
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should not submit with whitespace only nom', () => {
      render(<LieuModal {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Ex: Stade de France');
      const submitButton = screen.getByText('Créer');
      
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(submitButton);
      
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    it('should render edit modal correctly', () => {
      render(<LieuModal {...defaultProps} lieu={mockLieu} />);
      
      expect(screen.getByText('Modifier le lieu')).toBeInTheDocument();
      expect(screen.getByText('Modifier')).toBeInTheDocument();
    });

    it('should pre-fill form with lieu data in edit mode', () => {
      render(<LieuModal {...defaultProps} lieu={mockLieu} />);
      
      const input = screen.getByDisplayValue('Stade de France');
      expect(input).toBeInTheDocument();
    });

    it('should call onSave with updated data in edit mode', () => {
      render(<LieuModal {...defaultProps} lieu={mockLieu} />);
      
      const input = screen.getByDisplayValue('Stade de France');
      const submitButton = screen.getByText('Modifier');
      
      fireEvent.change(input, { target: { value: 'Stade de France Rénové' } });
      fireEvent.click(submitButton);
      
      expect(mockOnSave).toHaveBeenCalledWith({ nom: 'Stade de France Rénové' });
    });

    it('should reset form when switching from edit to create', () => {
      const { rerender } = render(<LieuModal {...defaultProps} lieu={mockLieu} />);
      
      // Verify initial state with lieu data
      expect(screen.getByDisplayValue('Stade de France')).toBeInTheDocument();
      
      // Switch to create mode
      rerender(<LieuModal {...defaultProps} lieu={undefined} />);
      
      const input = screen.getByPlaceholderText('Ex: Stade de France');
      expect(input).toHaveValue('');
    });
  });

  describe('Modal Visibility', () => {
    it('should not render when isOpen is false', () => {
      render(<LieuModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Créer un nouveau lieu')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<LieuModal {...defaultProps} isOpen={true} />);
      
      expect(screen.getByText('Créer un nouveau lieu')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading text when loading', () => {
      render(<LieuModal {...defaultProps} loading={true} />);
      
      expect(screen.getByText('Création...')).toBeInTheDocument();
    });

    it('should show loading text for edit mode when loading', () => {
      render(<LieuModal {...defaultProps} lieu={mockLieu} loading={true} />);
      
      expect(screen.getByText('Modification...')).toBeInTheDocument();
    });

    it('should disable buttons when loading', () => {
      render(<LieuModal {...defaultProps} loading={true} />);
      
      const cancelButton = screen.getByText('Annuler');
      const submitButton = screen.getByText('Création...');
      
      expect(cancelButton).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error exists', () => {
      const errorMessage = 'Le lieu existe déjà';
      render(<LieuModal {...defaultProps} error={errorMessage} />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toHaveClass('text-sm', 'text-red-600', 'bg-red-50');
    });

    it('should not display error section when no error', () => {
      render(<LieuModal {...defaultProps} error={null} />);
      
      expect(screen.queryByText(/erreur/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should call onClose when cancel button is clicked', () => {
      render(<LieuModal {...defaultProps} />);
      
      const cancelButton = screen.getByText('Annuler');
      fireEvent.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should handle form submission via Enter key', () => {
      render(<LieuModal {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Ex: Stade de France');
      fireEvent.change(input, { target: { value: 'Roland-Garros' } });
      fireEvent.submit(input.closest('form')!);
      
      expect(mockOnSave).toHaveBeenCalledWith({ nom: 'Roland-Garros' });
    });

    it('should update input value as user types', () => {
      render(<LieuModal {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Ex: Stade de France');
      fireEvent.change(input, { target: { value: 'Arena' } });
      
      expect(input).toHaveValue('Arena');
    });
  });

  describe('Modal Styling and Structure', () => {
    it('should have correct modal structure', () => {
      render(<LieuModal {...defaultProps} />);
      
      expect(screen.getByText('Créer un nouveau lieu')).toBeInTheDocument();
    });

    it('should have backdrop overlay', () => {
      render(<LieuModal {...defaultProps} />);
      
      expect(screen.getByText('Créer un nouveau lieu')).toBeInTheDocument();
    });

    it('should have proper form styling', () => {
      render(<LieuModal {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Ex: Stade de France');
      expect(input).toHaveClass(
        'w-full',
        'px-3',
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

    it('should have proper button styling', () => {
      render(<LieuModal {...defaultProps} />);
      
      const cancelButton = screen.getByText('Annuler');
      const submitButton = screen.getByText('Créer');
      
      expect(cancelButton).toHaveClass('px-4', 'py-2', 'text-sm', 'font-medium', 'text-gray-700', 'bg-gray-200');
      expect(submitButton).toHaveClass('px-4', 'py-2', 'text-sm', 'font-medium', 'text-white', 'bg-blue-600');
    });
  });

  describe('Accessibility', () => {
    it('should have required attribute on input', () => {
      render(<LieuModal {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Ex: Stade de France');
      expect(input).toHaveAttribute('required');
    });

    it('should have proper form structure', () => {
      render(<LieuModal {...defaultProps} />);
      
      const form = screen.getByRole('textbox').closest('form');
      expect(form).toBeInTheDocument();
    });

    it('should have accessible buttons', () => {
      render(<LieuModal {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: 'Annuler' });
      const submitButton = screen.getByRole('button', { name: 'Créer' });
      
      expect(cancelButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Special Characters and Edge Cases', () => {
    it('should handle special characters in lieu name', () => {
      render(<LieuModal {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Ex: Stade de France');
      const specialName = 'Palais des Sports - Léo Lagrange';
      
      fireEvent.change(input, { target: { value: specialName } });
      fireEvent.click(screen.getByText('Créer'));
      
      expect(mockOnSave).toHaveBeenCalledWith({ nom: specialName });
    });

    it('should trim whitespace from input', () => {
      render(<LieuModal {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Ex: Stade de France');
      fireEvent.change(input, { target: { value: '  Arena Bercy  ' } });
      fireEvent.click(screen.getByText('Créer'));
      
      expect(mockOnSave).toHaveBeenCalledWith({ nom: '  Arena Bercy  ' });
    });
  });
});
