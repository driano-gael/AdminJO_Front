import { 
  EvenementService, 
  evenementApi, 
  CreateEvenementRequest, 
  UpdateEvenementRequest, 
  EvenementFilters 
} from '@/lib/api/services/evenementSports/evenementService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Evenement } from '@/types/sportEvenement/evenement';

// Mock du fetchApi
jest.mock('@/lib/api/core/fetchWrappers');
const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

describe('EvenementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllEvenements', () => {
    const mockEvenements: Evenement[] = [
      {
        id: 1,
        description: 'Finale 100m hommes',
        lieu: { id: 1, nom: 'Stade de France' },
        date: '2024-07-29',
        horraire: '14:30',
        epreuves: []
      },
      {
        id: 2,
        description: 'Demi-finale natation',
        lieu: { id: 2, nom: 'Centre Aquatique' },
        date: '2024-07-30',
        horraire: '10:00',
        epreuves: []
      }
    ];

    it('should fetch all evenements without filters', async () => {
      mockFetchApi.mockResolvedValue(mockEvenements);

      const result = await EvenementService.getAllEvenements();

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/');
      expect(result).toEqual(mockEvenements);
    });

    it('should fetch evenements with filters', async () => {
      const filters: EvenementFilters = {
        description: 'finale',
        lieuId: 1,
        dateDebut: '2024-07-01',
        dateFin: '2024-07-31',
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'asc'
      };

      mockFetchApi.mockResolvedValue(mockEvenements);

      const result = await EvenementService.getAllEvenements(filters);

      const expectedUrl = '/evenement/?description=finale&lieuId=1&dateDebut=2024-07-01&dateFin=2024-07-31&page=1&limit=10&sortBy=date&sortOrder=asc';
      expect(mockFetchApi).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockEvenements);
    });

    it('should handle partial filters', async () => {
      const filters: EvenementFilters = {
        description: 'natation',
        lieuId: 2
      };

      mockFetchApi.mockResolvedValue([mockEvenements[1]]);

      const result = await EvenementService.getAllEvenements(filters);

      const expectedUrl = '/evenement/?description=natation&lieuId=2';
      expect(mockFetchApi).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual([mockEvenements[1]]);
    });

    it('should handle empty filters object', async () => {
      mockFetchApi.mockResolvedValue(mockEvenements);

      const result = await EvenementService.getAllEvenements({});

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/');
      expect(result).toEqual(mockEvenements);
    });

    it('should throw error when API call fails', async () => {
      const errorMessage = 'Network error';
      mockFetchApi.mockRejectedValue(new Error(errorMessage));

      await expect(EvenementService.getAllEvenements()).rejects.toThrow(errorMessage);
    });
  });

  describe('getEvenementById', () => {
    const mockEvenement: Evenement = {
      id: 1,
      description: 'Finale 100m hommes',
      lieu: { id: 1, nom: 'Stade de France' },
      date: '2024-07-29',
      horraire: '14:30',
      epreuves: []
    };

    it('should fetch evenement by id successfully', async () => {
      mockFetchApi.mockResolvedValue(mockEvenement);

      const result = await EvenementService.getEvenementById(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/1/');
      expect(result).toEqual(mockEvenement);
    });

    it('should throw error when evenement not found', async () => {
      const errorMessage = 'Evenement not found';
      mockFetchApi.mockRejectedValue(new Error(errorMessage));

      await expect(EvenementService.getEvenementById(999)).rejects.toThrow(errorMessage);
    });

    it('should handle invalid id parameter', async () => {
      mockFetchApi.mockResolvedValue(mockEvenement);

      await EvenementService.getEvenementById(0);

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/0/');
    });
  });

  describe('createEvenement', () => {
    const createRequest: CreateEvenementRequest = {
      description: 'Nouvelle épreuve',
      lieuId: 1,
      date: '2024-08-01',
      horraire: '16:00',
      epreuveIds: [1, 2]
    };

    const mockCreatedEvenement: Evenement = {
      id: 3,
      description: 'Nouvelle épreuve',
      lieu: { id: 1, nom: 'Stade de France' },
      date: '2024-08-01',
      horraire: '16:00',
      epreuves: []
    };

    it('should create evenement successfully', async () => {
      mockFetchApi.mockResolvedValue(mockCreatedEvenement);

      const result = await EvenementService.createEvenement(createRequest);

      const expectedPayload = {
        description: 'Nouvelle épreuve',
        lieu_id: 1,
        date: '2024-08-01',
        horraire: '16:00',
        epreuve_ids: [1, 2]
      };

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/create/', {
        method: 'POST',
        body: JSON.stringify(expectedPayload)
      });
      expect(result).toEqual(mockCreatedEvenement);
    });

    it('should create evenement without epreuveIds', async () => {
      const requestWithoutEpreuves = {
        description: 'Épreuve sans épreuves',
        lieuId: 1,
        date: '2024-08-01',
        horraire: '16:00'
      };

      mockFetchApi.mockResolvedValue(mockCreatedEvenement);

      await EvenementService.createEvenement(requestWithoutEpreuves);

      const expectedPayload = {
        description: 'Épreuve sans épreuves',
        lieu_id: 1,
        date: '2024-08-01',
        horraire: '16:00',
        epreuve_ids: []
      };

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/create/', {
        method: 'POST',
        body: JSON.stringify(expectedPayload)
      });
    });

    it('should handle null epreuveIds', async () => {
      const requestWithNullEpreuves = {
        ...createRequest,
        epreuveIds: null
      };

      mockFetchApi.mockResolvedValue(mockCreatedEvenement);

      await EvenementService.createEvenement(requestWithNullEpreuves);

      const expectedPayload = {
        description: 'Nouvelle épreuve',
        lieu_id: 1,
        date: '2024-08-01',
        horraire: '16:00',
        epreuve_ids: []
      };

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/create/', {
        method: 'POST',
        body: JSON.stringify(expectedPayload)
      });
    });

    it('should throw error when creation fails', async () => {
      const errorMessage = 'Validation error';
      mockFetchApi.mockRejectedValue(new Error(errorMessage));

      await expect(EvenementService.createEvenement(createRequest)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateEvenement', () => {
    const updateRequest: UpdateEvenementRequest = {
      id: 1,
      description: 'Description mise à jour',
      lieuId: 2,
      date: '2024-08-02',
      horraire: '17:00',
      epreuveIds: [3, 4]
    };

    const mockUpdatedEvenement: Evenement = {
      id: 1,
      description: 'Description mise à jour',
      lieu: { id: 2, nom: 'Centre Aquatique' },
      date: '2024-08-02',
      horraire: '17:00',
      epreuves: []
    };

    it('should update evenement successfully', async () => {
      mockFetchApi.mockResolvedValue(mockUpdatedEvenement);

      const result = await EvenementService.updateEvenement(updateRequest);

      const expectedPayload = {
        description: 'Description mise à jour',
        lieu_id: 2,
        date: '2024-08-02',
        horraire: '17:00',
        epreuve_ids: [3, 4]
      };

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/update/1/', {
        method: 'PUT',
        body: JSON.stringify(expectedPayload)
      });
      expect(result).toEqual(mockUpdatedEvenement);
    });

    it('should update evenement without epreuveIds', async () => {
      const requestWithoutEpreuves = {
        id: 1,
        description: 'Description mise à jour',
        lieuId: 2,
        date: '2024-08-02',
        horraire: '17:00'
      };

      mockFetchApi.mockResolvedValue(mockUpdatedEvenement);

      await EvenementService.updateEvenement(requestWithoutEpreuves);

      const expectedPayload = {
        description: 'Description mise à jour',
        lieu_id: 2,
        date: '2024-08-02',
        horraire: '17:00'
      };

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/update/1/', {
        method: 'PUT',
        body: JSON.stringify(expectedPayload)
      });
    });

    it('should handle null epreuveIds in update', async () => {
      const requestWithNullEpreuves = {
        ...updateRequest,
        epreuveIds: null
      };

      mockFetchApi.mockResolvedValue(mockUpdatedEvenement);

      await EvenementService.updateEvenement(requestWithNullEpreuves);

      const expectedPayload = {
        description: 'Description mise à jour',
        lieu_id: 2,
        date: '2024-08-02',
        horraire: '17:00',
        epreuve_ids: []
      };

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/update/1/', {
        method: 'PUT',
        body: JSON.stringify(expectedPayload)
      });
    });

    it('should handle empty array epreuveIds', async () => {
      const requestWithEmptyEpreuves = {
        ...updateRequest,
        epreuveIds: []
      };

      mockFetchApi.mockResolvedValue(mockUpdatedEvenement);

      await EvenementService.updateEvenement(requestWithEmptyEpreuves);

      const expectedPayload = {
        description: 'Description mise à jour',
        lieu_id: 2,
        date: '2024-08-02',
        horraire: '17:00',
        epreuve_ids: []
      };

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/update/1/', {
        method: 'PUT',
        body: JSON.stringify(expectedPayload)
      });
    });

    it('should throw error when update fails', async () => {
      const errorMessage = 'Evenement not found';
      mockFetchApi.mockRejectedValue(new Error(errorMessage));

      await expect(EvenementService.updateEvenement(updateRequest)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteEvenement', () => {
    it('should delete evenement successfully', async () => {
      mockFetchApi.mockResolvedValue(undefined);

      await EvenementService.deleteEvenement(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/delete/1/', {
        method: 'DELETE'
      });
    });

    it('should throw error when deletion fails', async () => {
      const errorMessage = 'Evenement not found';
      mockFetchApi.mockRejectedValue(new Error(errorMessage));

      await expect(EvenementService.deleteEvenement(999)).rejects.toThrow(errorMessage);
    });

    it('should handle deletion of non-existent evenement', async () => {
      mockFetchApi.mockRejectedValue(new Error('404 Not Found'));

      await expect(EvenementService.deleteEvenement(0)).rejects.toThrow('404 Not Found');
    });
  });

  describe('searchEvenements', () => {
    const mockSearchResults: Evenement[] = [
      {
        id: 1,
        description: 'Finale 100m hommes',
        lieu: { id: 1, nom: 'Stade de France' },
        date: '2024-07-29',
        horraire: '14:30',
        epreuves: []
      }
    ];

    it('should search evenements successfully', async () => {
      const searchQuery = 'finale';
      mockFetchApi.mockResolvedValue(mockSearchResults);

      const result = await EvenementService.searchEvenements(searchQuery);

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/?search=finale');
      expect(result).toEqual(mockSearchResults);
    });

    it('should handle special characters in search query', async () => {
      const searchQuery = 'épreuve spéciale & complexe';
      mockFetchApi.mockResolvedValue([]);

      await EvenementService.searchEvenements(searchQuery);

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/?search=%C3%A9preuve%20sp%C3%A9ciale%20%26%20complexe');
    });

    it('should handle empty search query', async () => {
      mockFetchApi.mockResolvedValue(mockSearchResults);

      const result = await EvenementService.searchEvenements('');

      expect(mockFetchApi).toHaveBeenCalledWith('/evenement/?search=');
      expect(result).toEqual(mockSearchResults);
    });

    it('should throw error when search fails', async () => {
      const errorMessage = 'Search service unavailable';
      mockFetchApi.mockRejectedValue(new Error(errorMessage));

      await expect(EvenementService.searchEvenements('test')).rejects.toThrow(errorMessage);
    });
  });
});

describe('evenementApi (functional interface)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide functional interface for getAll', async () => {
    const mockEvenements: Evenement[] = [];
    mockFetchApi.mockResolvedValue(mockEvenements);

    const result = await evenementApi.getAll();

    expect(mockFetchApi).toHaveBeenCalledWith('/evenement/');
    expect(result).toEqual(mockEvenements);
  });

  it('should provide functional interface for getById', async () => {
    const mockEvenement = { id: 1 } as Evenement;
    mockFetchApi.mockResolvedValue(mockEvenement);

    const result = await evenementApi.getById(1);

    expect(mockFetchApi).toHaveBeenCalledWith('/evenement/1/');
    expect(result).toEqual(mockEvenement);
  });

  it('should provide functional interface for create', async () => {
    const createData: CreateEvenementRequest = {
      description: 'Test',
      lieuId: 1,
      date: '2024-08-01',
      horraire: '16:00'
    };
    const mockEvenement = { id: 1 } as Evenement;
    mockFetchApi.mockResolvedValue(mockEvenement);

    const result = await evenementApi.create(createData);

    expect(mockFetchApi).toHaveBeenCalledWith('/evenement/create/', {
      method: 'POST',
      body: JSON.stringify({
        description: 'Test',
        lieu_id: 1,
        date: '2024-08-01',
        horraire: '16:00',
        epreuve_ids: []
      })
    });
    expect(result).toEqual(mockEvenement);
  });

  it('should provide functional interface for update', async () => {
    const updateData: UpdateEvenementRequest = {
      id: 1,
      description: 'Test Updated',
      lieuId: 1,
      date: '2024-08-01',
      horraire: '16:00'
    };
    const mockEvenement = { id: 1 } as Evenement;
    mockFetchApi.mockResolvedValue(mockEvenement);

    const result = await evenementApi.update(updateData);

    expect(mockFetchApi).toHaveBeenCalledWith('/evenement/update/1/', {
      method: 'PUT',
      body: JSON.stringify({
        description: 'Test Updated',
        lieu_id: 1,
        date: '2024-08-01',
        horraire: '16:00'
      })
    });
    expect(result).toEqual(mockEvenement);
  });

  it('should provide functional interface for delete', async () => {
    mockFetchApi.mockResolvedValue(undefined);

    await evenementApi.delete(1);

    expect(mockFetchApi).toHaveBeenCalledWith('/evenement/delete/1/', {
      method: 'DELETE'
    });
  });

  it('should provide functional interface for search', async () => {
    const mockResults: Evenement[] = [];
    mockFetchApi.mockResolvedValue(mockResults);

    const result = await evenementApi.search('test');

    expect(mockFetchApi).toHaveBeenCalledWith('/evenement/?search=test');
    expect(result).toEqual(mockResults);
  });
});
