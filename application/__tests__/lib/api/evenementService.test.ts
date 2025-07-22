import { EvenementService, evenementApi } from '@/lib/api/services/evenementSports/evenementService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';

// Mock du fetchApi
jest.mock('@/lib/api/core/fetchWrappers');
const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

describe('EvenementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllEvenements', () => {
    it('should fetch all events without filters', async () => {
      const mockEvents = [
        { id: 1, description: 'Event 1', date: '2024-07-01' },
        { id: 2, description: 'Event 2', date: '2024-07-02' }
      ];
      
      mockFetchApi.mockResolvedValue(mockEvents);

      const result = await EvenementService.getAllEvenements();

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/');
      expect(result).toEqual(mockEvents);
    });

    it('should fetch events with filters', async () => {
      const mockEvents = [{ id: 1, description: 'Filtered Event' }];
      const filters = {
        description: 'test',
        lieuId: 1,
        page: 1,
        limit: 10
      };
      
      mockFetchApi.mockResolvedValue(mockEvents);

      const result = await EvenementService.getAllEvenements(filters);

      expect(mockFetchApi).toHaveBeenCalledWith(
        '/evenement/?description=test&lieuId=1&page=1&limit=10'
      );
      expect(result).toEqual(mockEvents);
    });
  });

  describe('getEvenementById', () => {
    it('should fetch event by id', async () => {
      const mockEvent = { id: 1, description: 'Test Event' };
      mockFetchApi.mockResolvedValue(mockEvent);

      const result = await EvenementService.getEvenementById(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/1/');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('createEvenement', () => {
    it('should create a new event', async () => {
      const eventData = {
        description: 'New Event',
        lieuId: 1,
        date: '2024-07-01',
        horraire: '14:30',
        epreuveIds: [1, 2]
      };
      
      const mockCreatedEvent = { id: 1, ...eventData };
      mockFetchApi.mockResolvedValue(mockCreatedEvent);

      const result = await EvenementService.createEvenement(eventData);

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/create/', {
        method: 'POST',
        body: JSON.stringify({
          description: 'New Event',
          lieu_id: 1,
          date: '2024-07-01',
          horraire: '14:30',
          epreuve_ids: [1, 2]
        })
      });
      expect(result).toEqual(mockCreatedEvent);
    });

    it('should create event with empty epreuves when not provided', async () => {
      const eventData = {
        description: 'New Event',
        lieuId: 1,
        date: '2024-07-01',
        horraire: '14:30'
      };
      
      const mockCreatedEvent = { id: 1, ...eventData };
      mockFetchApi.mockResolvedValue(mockCreatedEvent);

      await EvenementService.createEvenement(eventData);

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/create/', {
        method: 'POST',
        body: JSON.stringify({
          description: 'New Event',
          lieu_id: 1,
          date: '2024-07-01',
          horraire: '14:30',
          epreuve_ids: []
        })
      });
    });
  });

  describe('updateEvenement', () => {
    it('should update an existing event', async () => {
      const updateData = {
        id: 1,
        description: 'Updated Event',
        lieuId: 2,
        date: '2024-07-02',
        horraire: '15:30',
        epreuveIds: [3, 4]
      };
      
      const mockUpdatedEvent = { ...updateData };
      mockFetchApi.mockResolvedValue(mockUpdatedEvent);

      const result = await EvenementService.updateEvenement(updateData);

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/update/1/', {
        method: 'PUT',
        body: JSON.stringify({
          description: 'Updated Event',
          lieu_id: 2,
          date: '2024-07-02',
          horraire: '15:30',
          epreuve_ids: [3, 4]
        })
      });
      expect(result).toEqual(mockUpdatedEvent);
    });
  });

  describe('deleteEvenement', () => {
    it('should delete an event', async () => {
      mockFetchApi.mockResolvedValue(undefined);

      await EvenementService.deleteEvenement(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/delete/1/', {
        method: 'DELETE'
      });
    });
  });

  describe('searchEvenements', () => {
    it('should search events by query', async () => {
      const mockEvents = [{ id: 1, description: 'Search Result' }];
      mockFetchApi.mockResolvedValue(mockEvents);

      const result = await EvenementService.searchEvenements('test query');

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/?search=test%20query');
      expect(result).toEqual(mockEvents);
    });
  });

  describe('evenementApi (functional approach)', () => {
    it('should provide functional API wrapper', async () => {
      const mockEvents = [{ id: 1, description: 'Test' }];
      mockFetchApi.mockResolvedValue(mockEvents);

      const result = await evenementApi.getAll();

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/');
      expect(result).toEqual(mockEvents);
    });
  });
});
