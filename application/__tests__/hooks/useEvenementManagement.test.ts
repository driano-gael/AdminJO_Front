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

    expect(result.current.loading).toBe(false);
    expect(result.current.events).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 1,
        description: 'Event 1'
      })
    ]));
    expect(result.current.error).toBeNull();
  });

  it('should handle loading errors', async () => {
    mockEvenementApi.getAll.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Erreur lors du chargement des événements');
    expect(result.current.events).toEqual([]);
  });

  it('should create new event', async () => {
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
    mockEvenementApi.getAll.mockResolvedValue([createdEvent]);
    mockEpreuveApi.getAll.mockResolvedValue([]);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await result.current.createEvent(newEventData);
    });

    expect(mockEvenementApi.create).toHaveBeenCalledWith(newEventData);
    expect(mockEvenementApi.getAll).toHaveBeenCalled();
    expect(mockEpreuveApi.getAll).toHaveBeenCalled(); // Should refresh epreuves
  });

  it('should update existing event', async () => {
    const updateData = {
      id: 1,
      description: 'Updated Event',
      lieuId: 1,
      date: '2024-07-01',
      horraire: '15:30'
    };

    const updatedEvent = { 
      ...updateData,
      lieu: { id: 1, nom: 'Lieu 1', adresse: 'Adresse 1', capacite: 1000 },
      epreuves: []
    };
    mockEvenementApi.update.mockResolvedValue(updatedEvent);
    mockEvenementApi.getAll.mockResolvedValue([updatedEvent]);
    mockEpreuveApi.getAll.mockResolvedValue([]);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await result.current.updateEvent(updateData);
    });

    expect(mockEvenementApi.update).toHaveBeenCalledWith(updateData);
    expect(mockEvenementApi.getAll).toHaveBeenCalled();
    expect(mockEpreuveApi.getAll).toHaveBeenCalled(); // Should refresh epreuves
  });

  it('should delete event', async () => {
    // Mock window.confirm pour retourner true
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    mockEvenementApi.delete.mockResolvedValue(undefined);
    mockEvenementApi.getAll.mockResolvedValue([]);
    mockEpreuveApi.getAll.mockResolvedValue([]);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await result.current.deleteEvent(1);
    });

    expect(mockEvenementApi.delete).toHaveBeenCalledWith(1);
    expect(mockEpreuveApi.getAll).toHaveBeenCalled(); // Should refresh epreuves
    
    // Restore window.confirm
    window.confirm = originalConfirm;
  });

  it('should handle search', async () => {
    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await result.current.handleSearch('search query');
    });

    expect(result.current.searchTerm).toBe('search query');
  });

  it('should filter events by lieu', async () => {
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
    mockEvenementApi.getAll.mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.setLieuFilter(1);
    });

    const filteredEvents = result.current.events;
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0].lieu.id).toBe(1);
  });

  it('should filter events by date range', async () => {
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
        date: '2024-08-15',
        horraire: '16:00',
        lieu: { id: 1, nom: 'Lieu 1' },
        epreuves: []
      }
    ];
    mockEvenementApi.getAll.mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEventsManagement());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.setDateDebutFilter('2024-07-01');
      result.current.setDateFinFilter('2024-07-31');
    });

    const filteredEvents = result.current.events;
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0].date).toBe('2024-07-15');
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

    act(() => {
      result.current.setCreateError('Some error');
    });

    expect(result.current.createError).toBe('Some error');

    act(() => {
      result.current.setCreateError(null);
    });

    expect(result.current.createError).toBeNull();
  });
});
