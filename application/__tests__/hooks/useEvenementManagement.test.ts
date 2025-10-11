import { renderHook, act } from '@testing-library/react';
import { useEventsManagement } from '@/hooks/useEvenementManagement';
import { evenementApi } from '@/lib/api/services/evenementSports/evenementService';
import { lieuApi } from '@/lib/api/services/evenementSports/lieuService';
import { epreuveApi } from '@/lib/api/services/evenementSports/epreuveService';

// Mock des services API
jest.mock('@/lib/api/services/evenementSports/evenementService');
jest.mock('@/lib/api/services/evenementSports/lieuService');
jest.mock('@/lib/api/services/evenementSports/epreuveService');

const mockEvenementApi = evenementApi as jest.Mocked<typeof evenementApi>;
const mockLieuApi = lieuApi as jest.Mocked<typeof lieuApi>;
const mockEpreuveApi = epreuveApi as jest.Mocked<typeof epreuveApi>;

describe('useEventsManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup des mocks par défaut
    mockEvenementApi.getAll.mockResolvedValue([]);
    mockLieuApi.getAll.mockResolvedValue([]);
    mockEpreuveApi.getAll.mockResolvedValue([]);
  });

  it('should initialize with default state', async () => {
    const { result } = renderHook(() => useEventsManagement());

    expect(result.current.events).toEqual([]);
    expect(result.current.lieux).toEqual([]);
    expect(result.current.epreuves).toEqual([]);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Attendre que les appels asynchrones se terminent
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  it('should load events successfully', async () => {
    const mockEvents = [
      { 
        id: 1, 
        description: 'Event 1', 
        date: '2024-07-01',
        horraire: '14:30',
        lieu: { id: 1, nom: 'Lieu 1', adresse: 'Adresse 1', capacite: 1000 },
        epreuves: []
      }
    ];
    mockEvenementApi.getAll.mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockEvenementApi.getAll).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].description).toBe('Event 1');
  });

  it('should load lieux successfully', async () => {
    const mockLieux = [
      { id: 1, nom: 'Lieu 1', adresse: 'Adresse 1', capacite: 1000 },
      { id: 2, nom: 'Lieu 2', adresse: 'Adresse 2', capacite: 2000 }
    ];
    mockLieuApi.getAll.mockResolvedValue(mockLieux);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockLieuApi.getAll).toHaveBeenCalled();
    expect(result.current.lieux).toEqual(mockLieux);
  });

  it('should load epreuves successfully', async () => {
    const mockEpreuves = [
      { 
        id: 1, 
        libelle: 'Épreuve 1',
        genre: 'hommes',
        tour: 'finale',
        discipline: { id: 1, nom: 'Discipline 1', icone: 'discipline1.svg' }
      }
    ];
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockEpreuveApi.getAll).toHaveBeenCalled();
    expect(result.current.epreuves).toEqual(mockEpreuves);
  });

  it('should handle search term update', async () => {
    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await result.current.handleSearch('test search'); // Utiliser handleSearch au lieu de setSearchTerm
    });

    expect(result.current.searchTerm).toBe('test search');
  });

  it('should create event successfully', async () => {
    const newEventData = {
      description: 'New Event',
      lieuId: 1,
      date: '2024-07-01',
      horraire: '14:30'
    };

    const createdEvent = {
      id: 1,
      ...newEventData,
      lieu: { id: 1, nom: 'Lieu 1', adresse: 'Adresse 1', capacite: 1000 },
      epreuves: []
    };

    mockEvenementApi.create.mockResolvedValue(createdEvent);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await result.current.createEvent(newEventData);
    });

    expect(mockEvenementApi.create).toHaveBeenCalledWith(newEventData);
    expect(result.current.createError).toBeNull();
  });

  it('should update event successfully', async () => {
    const eventToUpdate = {
      description: 'Updated Event',
      lieuId: 1,
      date: '2024-07-01',
      horraire: '15:30'
    };

    const updatedEvent = {
      id: 1,
      ...eventToUpdate,
      lieu: { id: 1, nom: 'Lieu 1', adresse: 'Adresse 1', capacite: 1000 },
      epreuves: []
    };

    mockEvenementApi.update.mockResolvedValue(updatedEvent);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await result.current.updateEvent(1, eventToUpdate);
    });

    // Le hook appelle l'API avec les bonnes données combinées
    expect(mockEvenementApi.update).toHaveBeenCalledWith({
      id: 1,
      ...eventToUpdate
    });
  });

  it('should delete event successfully', async () => {
    // Mock window.confirm pour retourner true
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    mockEvenementApi.delete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await result.current.deleteEvent(1);
    });

    expect(mockEvenementApi.delete).toHaveBeenCalledWith(1);

    // Restaurer window.confirm
    window.confirm = originalConfirm;
  });

  it('should handle create event error', async () => {
    const newEventData = {
      description: 'New Event',
      lieuId: 1,
      date: '2024-07-01',
      horraire: '14:30'
    };

    mockEvenementApi.create.mockRejectedValue(new Error('Create failed'));

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      try {
        await result.current.createEvent(newEventData);
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.createError).toBe('Erreur lors de la création de l\'événement');
  });

  it('should reset create error', async () => {
    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      result.current.setCreateError('Some error');
    });

    expect(result.current.createError).toBe('Some error');

    await act(async () => {
      result.current.setCreateError(null); // Utiliser setCreateError(null) au lieu de resetCreateError
    });

    expect(result.current.createError).toBeNull();
  });

  it('should set create error manually', async () => {
    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      result.current.setCreateError('Custom error message');
    });

    expect(result.current.createError).toBe('Custom error message');
  });
});
