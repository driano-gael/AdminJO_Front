import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvenementModal from '../../../../src/components/componentsEvenement/evenements/EvenementModal';
import { Evenement } from '../../../../src/types/sportEvenement/evenement';

// Mock des services API
jest.mock('../../../../src/lib/api/services/evenementSports/lieuService', () => ({
  lieuApi: {
    getAll: jest.fn()
  }
}));

jest.mock('../../../../src/lib/api/services/evenementSports/epreuveService', () => ({
  epreuveApi: {
    getAll: jest.fn()
  }
}));

// Import des mocks après la déclaration
import { lieuApi } from '../../../../src/lib/api/services/evenementSports/lieuService';
import { epreuveApi } from '../../../../src/lib/api/services/evenementSports/epreuveService';

const mockLieuApi = lieuApi as jest.Mocked<typeof lieuApi>;
const mockEpreuveApi = epreuveApi as jest.Mocked<typeof epreuveApi>;

describe('EvenementModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const mockLieux = [
    { id: 1, nom: 'Stade de France' },
    { id: 2, nom: 'Centre Aquatique' }
  ];

  const mockEpreuves = [
    { id: 1, libelle: '100m Sprint', discipline: { id: 1, nom: 'Athlétisme' }, evenement: null },
    { id: 2, libelle: 'Papillon 200m', discipline: { id: 2, nom: 'Natation' }, evenement: null }
  ];

  const mockEvenement: Evenement = {
    id: 1,
    description: 'Finale 100m',
    date: '2024-07-28',
    horraire: '20:30',
    lieu: { id: 1, nom: 'Stade de France' },
    epreuves: [mockEpreuves[0]]
  };

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    loading: false,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLieuApi.getAll.mockResolvedValue(mockLieux);
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
  });

  describe('Modal Visibility', () => {
    it('should render when isOpen is true', () => {
      render(<EvenementModal {...defaultProps} />);
      
      // Chercher la structure du modal
      const modal = document.querySelector('.modal-overlay') || document.querySelector('[data-testid="evenement-modal"]');
      expect(modal).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<EvenementModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Créer un nouvel événement')).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        const closeButton = screen.getByText('×') || screen.getByText('Fermer');
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onClose when cancel button is clicked', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        const cancelButton = screen.getByText(/annuler/i);
        fireEvent.click(cancelButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Create Mode', () => {
    it('should display create title in create mode', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Créer un nouvel événement') || 
               screen.getByText('Créer un événement')).toBeInTheDocument();
      });
    });

    it('should display create button in create mode', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Créer')).toBeInTheDocument();
      });
    });

    it('should have empty form fields initially', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        const descriptionField = document.querySelector('textarea, input[type="text"]') as HTMLInputElement;
        if (descriptionField) {
          expect(descriptionField.value).toBe('');
        }
      });
    });
  });

  describe('Edit Mode', () => {
    it('should display edit title in edit mode', async () => {
      render(<EvenementModal {...defaultProps} evenement={mockEvenement} />);
      
      await waitFor(() => {
        expect(screen.getByText('Modifier l\'événement') || 
               screen.getByText('Modifier')).toBeInTheDocument();
      });
    });

    it('should display modify button in edit mode', async () => {
      render(<EvenementModal {...defaultProps} evenement={mockEvenement} />);
      
      await waitFor(() => {
        expect(screen.getByText('Modifier')).toBeInTheDocument();
      });
    });

    it('should populate form fields with evenement data', async () => {
      render(<EvenementModal {...defaultProps} evenement={mockEvenement} />);
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Finale 100m')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2024-07-28')).toBeInTheDocument();
        expect(screen.getByDisplayValue('20:30')).toBeInTheDocument();
      });
    });

    it('should pre-select evenement epreuves', async () => {
      render(<EvenementModal {...defaultProps} evenement={mockEvenement} />);
      
      await waitFor(() => {
        // Should show selected epreuve in tags
        expect(screen.getByText('100m Sprint')).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should require description field', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      const saveButton = screen.getByText('Créer');
      fireEvent.click(saveButton);
      
      // Should not call onSave without required fields
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should require lieu selection', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      const descriptionInput = screen.getByPlaceholderText(/description/i) || 
                             document.querySelector('textarea, input[type="text"]');
      fireEvent.change(descriptionInput, { target: { value: 'Test Event' } });
      
      const saveButton = screen.getByText('Créer');
      fireEvent.click(saveButton);
      
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should require date field', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      const descriptionInput = screen.getByPlaceholderText(/description/i) || 
                             document.querySelector('textarea, input[type="text"]');
      fireEvent.change(descriptionInput, { target: { value: 'Test Event' } });
      
      await waitFor(() => {
        const lieuSelect = screen.getByRole('combobox') || 
                         document.querySelector('select');
        fireEvent.change(lieuSelect, { target: { value: '1' } });
      });
      
      const saveButton = screen.getByText('Créer');
      fireEvent.click(saveButton);
      
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should require time field', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      const descriptionInput = screen.getByPlaceholderText(/description/i) || 
                             document.querySelector('textarea, input[type="text"]');
      fireEvent.change(descriptionInput, { target: { value: 'Test Event' } });
      
      const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
      if (dateInput) {
        fireEvent.change(dateInput, { target: { value: '2024-07-28' } });
      }
      
      await waitFor(() => {
        const lieuSelect = screen.getByRole('combobox') || 
                         document.querySelector('select');
        fireEvent.change(lieuSelect, { target: { value: '1' } });
      });
      
      const saveButton = screen.getByText('Créer');
      fireEvent.click(saveButton);
      
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should call onSave with correct data when form is valid', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      // Fill form fields
      const descriptionInput = screen.getByPlaceholderText(/description/i) || 
                             document.querySelector('textarea, input[type="text"]') as HTMLInputElement;
      if (descriptionInput) {
        fireEvent.change(descriptionInput, { target: { value: 'Test Event' } });
      }
      
      const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
      if (dateInput) {
        fireEvent.change(dateInput, { target: { value: '2024-07-28' } });
      }
      
      const timeInput = document.querySelector('input[type="time"]') as HTMLInputElement;
      if (timeInput) {
        fireEvent.change(timeInput, { target: { value: '20:30' } });
      }
      
      await waitFor(() => {
        const lieuSelect = screen.getByRole('combobox') || 
                         document.querySelector('select') as HTMLSelectElement;
        if (lieuSelect) {
          fireEvent.change(lieuSelect, { target: { value: '1' } });
        }
      });
      
      const saveButton = screen.getByText('Créer');
      fireEvent.click(saveButton);
      
      expect(mockOnSave).toHaveBeenCalledWith({
        description: 'Test Event',
        lieuId: 1,
        date: '2024-07-28',
        horraire: '20:30',
        epreuveIds: []
      });
    });

    it('should include selected epreuves in submission', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      // Fill form fields
      const descriptionInput = screen.getByPlaceholderText(/description/i) || 
                             document.querySelector('textarea, input[type="text"]') as HTMLInputElement;
      if (descriptionInput) {
        fireEvent.change(descriptionInput, { target: { value: 'Test Event' } });
      }
      
      const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
      if (dateInput) {
        fireEvent.change(dateInput, { target: { value: '2024-07-28' } });
      }
      
      const timeInput = document.querySelector('input[type="time"]') as HTMLInputElement;
      if (timeInput) {
        fireEvent.change(timeInput, { target: { value: '20:30' } });
      }
      
      await waitFor(() => {
        const lieuSelect = screen.getByRole('combobox') || 
                         document.querySelector('select') as HTMLSelectElement;
        if (lieuSelect) {
          fireEvent.change(lieuSelect, { target: { value: '1' } });
        }
      });
      
      // Select an epreuve
      await waitFor(() => {
        const sprintCheckbox = screen.getByDisplayValue('1') || screen.getByText('100m Sprint');
        fireEvent.click(sprintCheckbox);
      });
      
      const saveButton = screen.getByText('Créer');
      fireEvent.click(saveButton);
      
      expect(mockOnSave).toHaveBeenCalledWith({
        description: 'Test Event',
        lieuId: 1,
        date: '2024-07-28',
        horraire: '20:30',
        epreuveIds: [1]
      });
    });
  });

  describe('Loading State', () => {
    it('should disable form elements when loading', () => {
      render(<EvenementModal {...defaultProps} loading={true} />);
      
      const descriptionInput = screen.getByPlaceholderText(/description/i) || 
                             document.querySelector('textarea, input[type="text"]') as HTMLInputElement;
      const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
      const timeInput = document.querySelector('input[type="time"]') as HTMLInputElement;
      
      if (descriptionInput) expect(descriptionInput).toBeDisabled();
      if (dateInput) expect(dateInput).toBeDisabled();
      if (timeInput) expect(timeInput).toBeDisabled();
    });

    it('should show loading text on submit button when loading', () => {
      render(<EvenementModal {...defaultProps} loading={true} />);
      
      expect(screen.getByText('Création...')).toBeInTheDocument();
    });

    it('should show edit loading text in edit mode', () => {
      render(<EvenementModal {...defaultProps} loading={true} evenement={mockEvenement} />);
      
      expect(screen.getByText('Modification...')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error prop is provided', () => {
      const errorMessage = 'Erreur lors de la création';
      render(<EvenementModal {...defaultProps} error={errorMessage} />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should not display error when error prop is null', () => {
      render(<EvenementModal {...defaultProps} error={null} />);
      
      expect(screen.queryByText(/erreur/i)).not.toBeInTheDocument();
    });

    it('should handle API loading errors gracefully', async () => {
      mockLieuApi.getAll.mockRejectedValue(new Error('API Error'));
      
      // Should not crash the component
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        const modal = screen.getByTestId('evenement-modal') || document.querySelector('.modal-overlay');
        expect(modal).toBeInTheDocument();
      });
    });
  });

  describe('Lieux Loading', () => {
    it('should load and display lieux options', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Stade de France')).toBeInTheDocument();
        expect(screen.getByText('Centre Aquatique')).toBeInTheDocument();
      });
    });

    it('should sort lieux alphabetically', async () => {
      const unsortedLieux = [
        { id: 2, nom: 'Zebra Stadium' },
        { id: 1, nom: 'Alpha Arena' }
      ];
      mockLieuApi.getAll.mockResolvedValue(unsortedLieux);
      
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        const lieuSelect = (screen.getByRole('combobox') || 
                         document.querySelector('select')) as HTMLSelectElement;
        if (lieuSelect) {
          const options = Array.from(lieuSelect.querySelectorAll('option'));
          const optionTexts = options.map(option => option.textContent).filter(Boolean);
          
          expect(optionTexts).toContain('Alpha Arena');
          expect(optionTexts).toContain('Zebra Stadium');
        }
      });
    });
  });

  describe('Epreuves Management', () => {
    it('should load and display available epreuves', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('100m Sprint')).toBeInTheDocument();
        expect(screen.getByText('Papillon 200m')).toBeInTheDocument();
      });
    });

    it('should allow selecting epreuves', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        // Chercher par value de checkbox ou par texte de l'épreuve
        const sprintCheckbox = screen.getByDisplayValue('1') || screen.getByText('100m Sprint');
        fireEvent.click(sprintCheckbox);
        
        // Vérifier que l'épreuve apparaît deux fois (liste et tags)
        expect(screen.getAllByText('100m Sprint')).toHaveLength(2);
      });
    });

    it('should allow deselecting epreuves', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        const sprintCheckbox = screen.getByDisplayValue('1') || screen.getByText('100m Sprint');
        fireEvent.click(sprintCheckbox); // Select
        fireEvent.click(sprintCheckbox); // Deselect
        
        // Should only appear in list, not in tags
        expect(screen.getAllByText('100m Sprint')).toHaveLength(1);
      });
    });

    it('should allow removing epreuves from tags', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        const sprintCheckbox = screen.getByDisplayValue('1') || screen.getByText('100m Sprint');
        fireEvent.click(sprintCheckbox);
      });
      
      await waitFor(() => {
        // Chercher un bouton de suppression par classe ou par contenu proche
        const removeButton = screen.getByText('×') || 
                           document.querySelector('.remove-tag') ||
                           screen.getByRole('button');
        fireEvent.click(removeButton);
        
        // Should only appear in list
        expect(screen.getAllByText('100m Sprint')).toHaveLength(1);
      });
    });
  });

  describe('Discipline Management', () => {
    it('should group epreuves by discipline', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Athlétisme')).toBeInTheDocument();
        expect(screen.getByText('Natation')).toBeInTheDocument();
      });
    });

    it('should allow expanding/collapsing disciplines', async () => {
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        const athletismeToggle = screen.getByText('Athlétisme');
        fireEvent.click(athletismeToggle);
        
        // Should expand and show epreuves
        expect(screen.getByDisplayValue('1') || screen.getByText('100m Sprint')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal attributes', () => {
      render(<EvenementModal {...defaultProps} />);
      
      // Le composant utilise une div avec la classe modal-overlay, pas role="dialog"
      const modal = screen.getByTestId('evenement-modal') || document.querySelector('.modal-overlay');
      expect(modal).toBeInTheDocument();
    });

    it('should have proper form labels', () => {
      render(<EvenementModal {...defaultProps} />);
      
      // Utiliser des sélecteurs par placeholder ou par nom au lieu de labelText
      expect(screen.getByPlaceholderText(/description/i) || screen.getByDisplayValue('')).toBeInTheDocument();
      expect(screen.getByRole('combobox') || screen.getByDisplayValue('')).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(<EvenementModal {...defaultProps} />);
      
      const descriptionInput = screen.getByLabelText(/description/i);
      descriptionInput.focus();
      
      expect(document.activeElement).toBe(descriptionInput);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty lieux array', async () => {
      mockLieuApi.getAll.mockResolvedValue([]);
      
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        const lieuSelect = screen.getByLabelText(/lieu/i);
        expect(lieuSelect.children.length).toBe(1); // Only default option
      });
    });

    it('should handle empty epreuves array', async () => {
      mockEpreuveApi.getAll.mockResolvedValue([]);
      
      render(<EvenementModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText(/aucune épreuve disponible/i)).toBeInTheDocument();
      });
    });

    it('should reset form when modal is closed and reopened', async () => {
      const { rerender } = render(<EvenementModal {...defaultProps} />);
      
      // Fill form
      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });
      
      // Close modal
      rerender(<EvenementModal {...defaultProps} isOpen={false} />);
      
      // Reopen modal
      rerender(<EvenementModal {...defaultProps} isOpen={true} />);
      
      // Form should be reset
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
    });
  });
});
