import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvenementModal from '../../../../src/components/componentsEvenement/evenements/EvenementModal';

// Mock des APIs avec création dans le mock
jest.mock('../../../../src/lib/api/services/evenementSports/lieuService', () => ({
  lieuApi: {
    getAll: jest.fn().mockResolvedValue([
      { id: 1, nom: 'Stade de France' },
      { id: 2, nom: 'Centre Aquatique' }
    ])
  }
}));

jest.mock('../../../../src/lib/api/services/evenementSports/epreuveService', () => ({
  epreuveApi: {
    getAll: jest.fn().mockResolvedValue([
      { 
        id: 1, 
        libelle: '100m Sprint', 
        discipline: { id: 1, nom: 'Athlétisme' }, 
        evenement: null 
      },
      { 
        id: 2, 
        libelle: 'Papillon 200m', 
        discipline: { id: 2, nom: 'Natation' }, 
        evenement: null 
      }
    ])
  }
}));

describe('EvenementModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    loading: false,
    error: null,
    evenement: undefined
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibilité du Modal', () => {
    it('devrait s\'afficher quand isOpen est true', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} />);
      });
      
      expect(screen.getByText('Créer un nouvel événement')).toBeInTheDocument();
    });

    it('ne devrait pas s\'afficher quand isOpen est false', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} isOpen={false} />);
      });
      
      expect(screen.queryByText('Créer un nouvel événement')).not.toBeInTheDocument();
    });
  });

  describe('Champs du Formulaire', () => {
    it('devrait afficher les champs de base du formulaire', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} />);
      });
      
      // Vérifier les champs essentiels
      expect(screen.getByRole('textbox')).toBeInTheDocument(); // input description
      expect(screen.getByRole('combobox')).toBeInTheDocument(); // select lieu
    });

    it('devrait afficher les labels du formulaire', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} />);
      });
      
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Lieu')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Horaire')).toBeInTheDocument();
    });

    it('devrait afficher les boutons', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} />);
      });
      
      expect(screen.getByText('Créer')).toBeInTheDocument();
      expect(screen.getByText('Annuler')).toBeInTheDocument();
    });
  });

  describe('Interaction des Boutons', () => {
    it('devrait appeler onClose quand le bouton annuler est cliqué', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} />);
      });
      
      const cancelButton = screen.getByText('Annuler');
      fireEvent.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('État de Chargement', () => {
    it('devrait afficher le texte de chargement quand loading est true', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} loading={true} />);
      });
      
      expect(screen.getByText('Création...')).toBeInTheDocument();
    });

    it('devrait désactiver les boutons pendant le chargement', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} loading={true} />);
      });
      
      const cancelButton = screen.getByText('Annuler');
      const submitButton = screen.getByText('Création...');
      
      expect(cancelButton).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Chargement des Données API', () => {
    it('devrait afficher les lieux chargés dans le select', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} />);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Stade de France')).toBeInTheDocument();
        expect(screen.getByText('Centre Aquatique')).toBeInTheDocument();
      });
    });

    it('devrait afficher les épreuves groupées par discipline', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} />);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Athlétisme')).toBeInTheDocument();
        expect(screen.getByText('Natation')).toBeInTheDocument();
      });
    });
  });

  describe('Interactions du Formulaire', () => {
    it('devrait mettre à jour le champ description', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} />);
      });
      
      const descriptionInput = screen.getByRole('textbox');
      fireEvent.change(descriptionInput, { target: { value: 'Test Event' } });
      
      expect(descriptionInput).toHaveValue('Test Event');
    });

    it('devrait mettre à jour la sélection de lieu', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} />);
      });
      
      await waitFor(() => {
        const lieuSelect = screen.getByRole('combobox');
        fireEvent.change(lieuSelect, { target: { value: '1' } });
        
        expect(lieuSelect).toHaveValue('1');
      });
    });
  });

  describe('Gestion des Erreurs', () => {
    it('devrait afficher le message d\'erreur quand fourni', async () => {
      const errorMessage = 'Erreur lors de la création';
      await act(async () => {
        render(<EvenementModal {...defaultProps} error={errorMessage} />);
      });
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('ne devrait pas afficher d\'erreur quand null', async () => {
      await act(async () => {
        render(<EvenementModal {...defaultProps} error={null} />);
      });
      
      expect(screen.queryByText(/erreur/i)).not.toBeInTheDocument();
    });
  });
});
