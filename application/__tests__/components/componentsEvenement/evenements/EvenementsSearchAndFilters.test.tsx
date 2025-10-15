import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvenementsSearchAndFilters from '@/components/componentsEvenement/evenements/EvenementsSearchAndFilters';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Lieu } from '@/types/sportEvenement/lieu';
import { Discipline } from '@/types/sportEvenement/discipline';
import { ExtendEvenement, StatutEvenement } from '@/types/sportEvenement/evenement';

describe('EvenementsSearchAndFilters', () => {
  const mockEpreuves: Epreuve[] = [
    { id: 1, libelle: '100m Sprint', discipline: { id: 1, nom: 'Athlétisme', icone: 'athletics.svg' }, genre:'mixte', tour: 'inconnu' },
    { id: 2, libelle: 'Papillon 200m', discipline: { id: 2, nom: 'Natation', icone: 'athletics.svg' }, genre:'mixte', tour: 'inconnu' },
    { id: 3, libelle: 'Marathon', discipline: { id: 1, nom: 'Athlétisme', icone: 'athletics.svg' }, genre:'mixte', tour: 'inconnu' }
  ];

  const mockLieux: Lieu[] = [
    { id: 1, nom: 'Stade de France' },
    { id: 2, nom: 'Centre Aquatique' },
    { id: 3, nom: 'Vélodrome' }
  ];

  const mockDisciplines: Discipline[] = [
    { id: 1, nom: 'Athlétisme', icone: 'athletics.svg' },
    { id: 2, nom: 'Natation', icone: 'swimming.svg' },
    { id: 3, nom: 'Basketball', icone: 'basketball.svg' }
  ];

  const mockEvents: ExtendEvenement[] = [
    {
      id: 1,
      description: 'Finale 100m',
      date: '2024-07-28',
      horraire: '20:30',
      lieu: mockLieux[0],
      epreuves: [mockEpreuves[0]],
      status: StatutEvenement.A_VENIR
    },
    {
      id: 2,
      description: 'Finale 200m Papillon',
      date: '2024-07-29',
      horraire: '19:00',
      lieu: mockLieux[1],
      epreuves: [mockEpreuves[1]],
      status: StatutEvenement.EN_COURS
    }
  ];

  const defaultProps = {
    searchTerm: '',
    onSearch: jest.fn(),
    epreuves: mockEpreuves,
    lieux: mockLieux,
    disciplines: mockDisciplines,
    events: mockEvents,
    loading: false,
    onLieuChange: jest.fn(),
    onDisciplineChange: jest.fn(),
    onEpreuveChange: jest.fn(),
    onStatutChange: jest.fn(),
    onDateDebutChange: jest.fn(),
    onDateFinChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render search input with correct placeholder', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      expect(screen.getByPlaceholderText('Rechercher un événement...')).toBeInTheDocument();
    });

    it('should render all filter dropdowns', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      expect(screen.getByText('Lieu')).toBeInTheDocument();
      expect(screen.getByText('Discipline')).toBeInTheDocument();
      expect(screen.getByText('Épreuve')).toBeInTheDocument();
      expect(screen.getByText('Statut')).toBeInTheDocument();
    });

    it('should render date inputs with default values', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      expect(screen.getByDisplayValue('2024-07-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-09-01')).toBeInTheDocument();
    });

    it('should render reset button', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      expect(screen.getByText('Réinitialiser')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should call onSearch when typing in search input', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Rechercher un événement...');
      fireEvent.change(searchInput, { target: { value: 'Finale' } });
      
      expect(defaultProps.onSearch).toHaveBeenCalledWith('Finale');
    });

    it('should display current search term', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} searchTerm="Test search" />);
      
      expect(screen.getByDisplayValue('Test search')).toBeInTheDocument();
    });
  });

  describe('Lieu Filter', () => {
    it('should render all lieux options', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      expect(screen.getByText('Tous les lieux')).toBeInTheDocument();
      expect(screen.getByText('Stade de France')).toBeInTheDocument();
      expect(screen.getByText('Centre Aquatique')).toBeInTheDocument();
      expect(screen.getByText('Vélodrome')).toBeInTheDocument();
    });

    it('should call onLieuChange when lieu is selected', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      const lieuSelect = screen.getByDisplayValue('Tous les lieux');
      fireEvent.change(lieuSelect, { target: { value: '1' } });
      
      expect(defaultProps.onLieuChange).toHaveBeenCalledWith(1);
    });

    it('should show selected lieu', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} selectedLieu={1} />);
      
      const lieuSelect = screen.getByDisplayValue('Stade de France');
      expect(lieuSelect).toBeInTheDocument();
    });
  });

  describe('Discipline Filter', () => {
    it('should render all disciplines options', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      expect(screen.getByText('Toutes les disciplines')).toBeInTheDocument();
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
      expect(screen.getByText('Natation')).toBeInTheDocument();
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    it('should call onDisciplineChange when discipline is selected', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      const disciplineSelect = screen.getByDisplayValue('Toutes les disciplines');
      fireEvent.change(disciplineSelect, { target: { value: '1' } });
      
      expect(defaultProps.onDisciplineChange).toHaveBeenCalledWith(1);
    });

    it('should show selected discipline', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} selectedDiscipline={1} />);
      
      const disciplineSelect = screen.getByDisplayValue('Athlétisme');
      expect(disciplineSelect).toBeInTheDocument();
    });
  });

  describe('Date Filters', () => {
    it('should call onDateDebutChange when start date changes', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      const dateDebutInput = screen.getByDisplayValue('2024-07-01');
      fireEvent.change(dateDebutInput, { target: { value: '2024-07-15' } });
      
      expect(defaultProps.onDateDebutChange).toHaveBeenCalledWith('2024-07-15');
    });

    it('should call onDateFinChange when end date changes', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      const dateFinInput = screen.getByDisplayValue('2024-09-01');
      fireEvent.change(dateFinInput, { target: { value: '2024-07-30' } });
      
      expect(defaultProps.onDateFinChange).toHaveBeenCalledWith('2024-07-30');
    });
  });

  describe('Reset Functionality', () => {
    it('should call all reset functions when reset bouton est cliquÃ©', () => {
      render(<EvenementsSearchAndFilters {...defaultProps} />);
      
      const resetButton = screen.getByText('Réinitialiser');
      fireEvent.click(resetButton);
      
      expect(defaultProps.onSearch).toHaveBeenCalledWith('');
      expect(defaultProps.onLieuChange).toHaveBeenCalledWith(undefined);
      expect(defaultProps.onDisciplineChange).toHaveBeenCalledWith(undefined);
      expect(defaultProps.onEpreuveChange).toHaveBeenCalledWith(undefined);
      expect(defaultProps.onStatutChange).toHaveBeenCalledWith(undefined);
      expect(defaultProps.onDateDebutChange).toHaveBeenCalledWith('2024-07-01');
      expect(defaultProps.onDateFinChange).toHaveBeenCalledWith('2024-09-01');
    });
  });
});
