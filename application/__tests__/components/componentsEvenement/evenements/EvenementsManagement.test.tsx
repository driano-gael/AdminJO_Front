import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EvenementsManagement from '@/components/componentsEvenement/evenements/EvenementsManagement';
import { useEventsManagement } from '@/hooks/useEvenementManagement';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';

// Mock des hooks
jest.mock('@/hooks/useEvenementManagement');
jest.mock('@/hooks/useSessionExpiry');

// Mock des composants enfants
jest.mock('@/components/componentsEvenement/evenements/EvenementsHeader', () => {
  return function MockEvenementsHeader({ onCreateEvent }: { onCreateEvent: () => void }) {
    return (
      <div data-testid="events-header">
        <button onClick={onCreateEvent}>Créer Événement</button>
      </div>
    );
  };
});

jest.mock('@/components/componentsEvenement/evenements/EvenementsSearchAndFilters', () => {
  return function MockSearchAndFilters({ onSearch }: { onSearch: (query: string) => void }) {
    return (
      <div data-testid="search-filters">
        <input 
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Rechercher"
        />
      </div>
    );
  };
});

jest.mock('@/components/componentsEvenement/evenements/EvenementsTable', () => {
  return function MockEvenementsTable({ 
    events, 
    onEdit, 
    onDeleteEvent 
  }: { 
    events: any[];
    onEdit: (event: any) => void;
    onDeleteEvent: (id: number) => void;
  }) {
    return (
      <div data-testid="events-table">
        {events.map(event => (
          <div key={event.id} data-testid={`event-${event.id}`}>
            <span>{event.description}</span>
            <button onClick={() => onEdit(event)}>Modifier</button>
            <button onClick={() => onDeleteEvent(event.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/componentsEvenement/evenements/EvenementModal', () => {
  return function MockEvenementModal({ 
    isOpen, 
    onSave, 
    onClose 
  }: { 
    isOpen: boolean;
    onSave: (data: any) => void;
    onClose: () => void;
  }) {
    if (!isOpen) return null;
    
    return (
      <div data-testid="event-modal">
        <input data-testid="event-description" placeholder="Description" />
        <button onClick={() => onSave({ description: 'Test Event' })}>
          Sauvegarder
        </button>
        <button onClick={onClose}>Annuler</button>
      </div>
    );
  };
});

jest.mock('@/components/notification', () => {
  return function MockNotification({ message, onClose }: { message: string; onClose: () => void }) {
    return (
      <div data-testid="notification">
        <span>{message}</span>
        <button onClick={onClose}>Fermer</button>
      </div>
    );
  };
});

const mockUseEventsManagement = useEventsManagement as jest.MockedFunction<typeof useEventsManagement>;
const mockUseSessionExpiry = useSessionExpiry as jest.MockedFunction<typeof useSessionExpiry>;

describe('EvenementsManagement', () => {
  const mockEvents = [
    {
      id: 1,
      description: 'Event 1',
      date: '2024-07-15',
      horraire: '14:30',
      lieu: { id: 1, nom: 'Lieu 1' },
      epreuves: []
    },
    {
      id: 2,
      description: 'Event 2',
      date: '2024-07-16',
      horraire: '16:00',
      lieu: { id: 2, nom: 'Lieu 2' },
      epreuves: []
    }
  ];

  const mockHookReturnValue = {
    events: mockEvents,
    lieux: [],
    epreuves: [],
    searchTerm: '',
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
    filterLieu: undefined,
    filterDiscipline: undefined,
    filterEpreuve: undefined,
    filterStatut: undefined,
    filterDateDebut: '2024-07-01',
    filterDateFin: '2024-09-01',
    setFilterLieu: jest.fn(),
    setFilterDiscipline: jest.fn(),
    setFilterEpreuve: jest.fn(),
    setFilterStatut: jest.fn(),
    setFilterDateDebut: jest.fn(),
    setFilterDateFin: jest.fn(),
    getFilteredEvents: jest.fn(() => mockEvents),
    loadEvents: jest.fn(),
    loadLieux: jest.fn(),
    loadEpreuves: jest.fn(),
    createEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
    setSearchTerm: jest.fn(),
    setCreateError: jest.fn(),
    handleSearch: jest.fn(),
    refreshEvents: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEventsManagement.mockReturnValue(mockHookReturnValue);
    mockUseSessionExpiry.mockReturnValue();
  });

  it('should render events management interface', () => {
    render(<EvenementsManagement />);

    expect(screen.getByTestId('events-header')).toBeInTheDocument();
    expect(screen.getByTestId('search-filters')).toBeInTheDocument();
    expect(screen.getByTestId('events-table')).toBeInTheDocument();
  });

  it('should display events in the table', () => {
    render(<EvenementsManagement />);

    expect(screen.getByTestId('event-1')).toBeInTheDocument();
    expect(screen.getByTestId('event-2')).toBeInTheDocument();
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('should open modal when create bouton est cliquÃ©', () => {
    render(<EvenementsManagement />);

    const createButton = screen.getByText('Créer Événement');
    fireEvent.click(createButton);

    expect(screen.getByTestId('event-modal')).toBeInTheDocument();
  });

  it('should open modal when edit bouton est cliquÃ©', () => {
    render(<EvenementsManagement />);

    const editButton = screen.getAllByText('Modifier')[0];
    fireEvent.click(editButton);

    expect(screen.getByTestId('event-modal')).toBeInTheDocument();
  });

  it('should handle search', () => {
    render(<EvenementsManagement />);

    const searchInput = screen.getByPlaceholderText('Rechercher');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockHookReturnValue.handleSearch).toHaveBeenCalledWith('test search');
  });

  it('should create new event', async () => {
    mockHookReturnValue.createEvent.mockResolvedValue(undefined);

    render(<EvenementsManagement />);

    // Ouvrir le modal
    const createButton = screen.getByText('Créer Événement');
    fireEvent.click(createButton);

    // Sauvegarder
    const saveButton = screen.getByText('Sauvegarder');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockHookReturnValue.createEvent).toHaveBeenCalledWith({ description: 'Test Event' });
    });

    // Vérifier que la notification de succès s'affiche
    await waitFor(() => {
      expect(screen.getByText('Événement créé avec succès !')).toBeInTheDocument();
    });
  });

  it('should update existing event', async () => {
    mockHookReturnValue.updateEvent.mockResolvedValue(undefined);

    render(<EvenementsManagement />);

    // Ouvrir le modal d'édition
    const editButton = screen.getAllByText('Modifier')[0];
    fireEvent.click(editButton);

    // Sauvegarder
    const saveButton = screen.getByText('Sauvegarder');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockHookReturnValue.updateEvent).toHaveBeenCalledWith(1, {
        description: 'Test Event'
      });
    });

    // Vérifier que la notification de succès s'affiche
    await waitFor(() => {
      expect(screen.getByText('Événement modifié avec succès !')).toBeInTheDocument();
    });
  });

  it('should delete event', async () => {
    mockHookReturnValue.deleteEvent.mockResolvedValue(undefined);

    render(<EvenementsManagement />);

    const deleteButton = screen.getAllByText('Supprimer')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockHookReturnValue.deleteEvent).toHaveBeenCalledWith(1);
    });

    // Vérifier que la notification de succès s'affiche
    await waitFor(() => {
      expect(screen.getByText('Événement supprimé avec succès !')).toBeInTheDocument();
    });
  });

  it('should handle create error', async () => {
    mockHookReturnValue.createEvent.mockRejectedValue(new Error('Create failed'));

    render(<EvenementsManagement />);

    // Ouvrir le modal et essayer de créer
    const createButton = screen.getByText('Créer Événement');
    fireEvent.click(createButton);

    const saveButton = screen.getByText('Sauvegarder');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Erreur lors de la sauvegarde')).toBeInTheDocument();
    });
  });

  it('should close modal on cancel', () => {
    render(<EvenementsManagement />);

    // Ouvrir le modal
    const createButton = screen.getByText('Créer Événement');
    fireEvent.click(createButton);

    expect(screen.getByTestId('event-modal')).toBeInTheDocument();

    // Annuler
    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId('event-modal')).not.toBeInTheDocument();
  });

  it('should close notification', () => {
    render(<EvenementsManagement />);

    // Simuler l'affichage d'une notification
    const createButton = screen.getByText('Créer Événement');
    fireEvent.click(createButton);
    
    const saveButton = screen.getByText('Sauvegarder');
    fireEvent.click(saveButton);

    // Attendre que la notification apparaisse puis la fermer
    waitFor(() => {
      const closeButton = screen.getByText('Fermer');
      fireEvent.click(closeButton);
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    mockUseEventsManagement.mockReturnValue({
      ...mockHookReturnValue,
      loading: true
    });

    render(<EvenementsManagement />);

    expect(screen.getByTestId('events-table')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    mockUseEventsManagement.mockReturnValue({
      ...mockHookReturnValue,
      error: 'Something went wrong'
    });

    render(<EvenementsManagement />);

    expect(screen.getByTestId('events-table')).toBeInTheDocument();
  });
});
