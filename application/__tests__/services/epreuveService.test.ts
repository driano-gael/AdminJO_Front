import { 
  EpreuveService, 
  epreuveApi, 
  CreateEpreuveRequest, 
  UpdateEpreuveRequest,
  EpreuveFilters 
} from '@/lib/api/services/evenementSports/epreuveService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Epreuve } from '@/types/sportEvenement/epreuve';

// Mock du module fetchWrappers
jest.mock('@/lib/api/core/fetchWrappers');

const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

// Mock data
const mockEpreuve: Epreuve = {
  id: 1,
  libelle: '100m nage libre',
  discipline: { id: 1, nom: 'Natation' },
  evenement: null
};

const mockEpreuves: Epreuve[] = [
  mockEpreuve,
  { 
    id: 2, 
    libelle: '100m sprint', 
    discipline: { id: 2, nom: 'Athlétisme' },
    evenement: null
  },
  { 
    id: 3, 
    libelle: '200m nage libre', 
    discipline: { id: 1, nom: 'Natation' },
    evenement: null
  }
];

describe('EpreuveService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllEpreuves', () => {
    it('should fetch all epreuves without filters', async () => {
      mockFetchApi.mockResolvedValue(mockEpreuves);

      const result = await EpreuveService.getAllEpreuves();

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/');
      expect(result).toEqual(mockEpreuves);
    });

    it('should fetch epreuves with search filter', async () => {
      const filters: EpreuveFilters = { libelle: '100m' };
      mockFetchApi.mockResolvedValue([mockEpreuve]);

      const result = await EpreuveService.getAllEpreuves(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/?search=100m');
      expect(result).toEqual([mockEpreuve]);
    });

    it('should fetch epreuves with discipline filter', async () => {
      const filters: EpreuveFilters = { disciplineId: 1 };
      mockFetchApi.mockResolvedValue([mockEpreuve]);

      const result = await EpreuveService.getAllEpreuves(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/?disciplineId=1');
      expect(result).toEqual([mockEpreuve]);
    });

    it('should fetch epreuves with pagination', async () => {
      const filters: EpreuveFilters = { page: 2, limit: 10 };
      mockFetchApi.mockResolvedValue(mockEpreuves);

      const result = await EpreuveService.getAllEpreuves(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/?page=2&limit=10');
      expect(result).toEqual(mockEpreuves);
    });

    it('should fetch epreuves with sorting', async () => {
      const filters: EpreuveFilters = { sortBy: 'discipline', sortOrder: 'desc' };
      mockFetchApi.mockResolvedValue(mockEpreuves);

      const result = await EpreuveService.getAllEpreuves(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/?sortBy=discipline&sortOrder=desc');
      expect(result).toEqual(mockEpreuves);
    });

    it('should fetch epreuves with all filters combined', async () => {
      const filters: EpreuveFilters = { 
        libelle: 'nage', 
        disciplineId: 1,
        page: 1, 
        limit: 5, 
        sortBy: 'nom', 
        sortOrder: 'asc' 
      };
      mockFetchApi.mockResolvedValue(mockEpreuves);

      const result = await EpreuveService.getAllEpreuves(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/?search=nage&disciplineId=1&page=1&limit=5&sortBy=nom&sortOrder=asc');
      expect(result).toEqual(mockEpreuves);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Network error');
      mockFetchApi.mockRejectedValue(error);

      await expect(EpreuveService.getAllEpreuves()).rejects.toThrow('Network error');
      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/');
    });
  });

  describe('getEpreuveById', () => {
    it('should fetch epreuve by id', async () => {
      mockFetchApi.mockResolvedValue(mockEpreuve);

      const result = await EpreuveService.getEpreuveById(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/1/');
      expect(result).toEqual(mockEpreuve);
    });

    it('should handle fetch error for non-existent id', async () => {
      const error = new Error('Epreuve not found');
      mockFetchApi.mockRejectedValue(error);

      await expect(EpreuveService.getEpreuveById(999)).rejects.toThrow('Epreuve not found');
      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/999/');
    });
  });

  describe('createEpreuve', () => {
    it('should create new epreuve', async () => {
      const createData: CreateEpreuveRequest = { libelle: '50m nage libre', disciplineId: 1 };
      const createdEpreuve: Epreuve = { 
        id: 4, 
        libelle: '50m nage libre',
        discipline: { id: 1, nom: 'Natation' },
        evenement: null
      };
      
      mockFetchApi.mockResolvedValue(createdEpreuve);

      const result = await EpreuveService.createEpreuve(createData);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/create/', {
        method: 'POST',
        body: JSON.stringify({
          libelle: '50m nage libre',
          discipline_id: 1,
          evenement_id: null
        }),
      });
      expect(result).toEqual(createdEpreuve);
    });

    it('should handle creation error', async () => {
      const createData: CreateEpreuveRequest = { libelle: 'Test', disciplineId: 1 };
      const error = new Error('Validation error');
      mockFetchApi.mockRejectedValue(error);

      await expect(EpreuveService.createEpreuve(createData)).rejects.toThrow('Validation error');
      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/create/', {
        method: 'POST',
        body: JSON.stringify({
          libelle: 'Test',
          discipline_id: 1,
          evenement_id: null
        }),
      });
    });
  });

  describe('updateEpreuve', () => {
    it('should update existing epreuve', async () => {
      const updateData: UpdateEpreuveRequest = { 
        id: 1, 
        libelle: '100m nage libre modifié', 
        disciplineId: 1 
      };
      const updatedEpreuve: Epreuve = { 
        id: 1, 
        libelle: '100m nage libre modifié',
        discipline: { id: 1, nom: 'Natation' },
        evenement: null
      };
      
      mockFetchApi.mockResolvedValue(updatedEpreuve);

      const result = await EpreuveService.updateEpreuve(updateData);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/update/1/', {
        method: 'PUT',
        body: JSON.stringify({
          libelle: '100m nage libre modifié',
          discipline_id: 1,
          evenement_id: null
        }),
      });
      expect(result).toEqual(updatedEpreuve);
    });

    it('should update epreuve with evenement', async () => {
      const updateData: UpdateEpreuveRequest = { 
        id: 1, 
        libelle: '100m nage libre', 
        disciplineId: 1,
        evenementId: 5
      };
      const updatedEpreuve: Epreuve = { 
        id: 1, 
        libelle: '100m nage libre',
        discipline: { id: 1, nom: 'Natation' },
        evenement: null
      };
      
      mockFetchApi.mockResolvedValue(updatedEpreuve);

      const result = await EpreuveService.updateEpreuve(updateData);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/update/1/', {
        method: 'PUT',
        body: JSON.stringify({
          libelle: '100m nage libre',
          discipline_id: 1,
          evenement_id: 5
        }),
      });
      expect(result).toEqual(updatedEpreuve);
    });

    it('should handle update error', async () => {
      const updateData: UpdateEpreuveRequest = { id: 999, libelle: 'Test', disciplineId: 1 };
      const error = new Error('Epreuve not found');
      mockFetchApi.mockRejectedValue(error);

      await expect(EpreuveService.updateEpreuve(updateData)).rejects.toThrow('Epreuve not found');
      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/update/999/', {
        method: 'PUT',
        body: JSON.stringify({
          libelle: 'Test',
          discipline_id: 1,
          evenement_id: null
        }),
      });
    });
  });

  describe('deleteEpreuve', () => {
    it('should delete epreuve', async () => {
      mockFetchApi.mockResolvedValue(undefined);

      await EpreuveService.deleteEpreuve(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/delete/1/', {
        method: 'DELETE',
      });
    });

    it('should handle delete error', async () => {
      const error = new Error('Epreuve not found');
      mockFetchApi.mockRejectedValue(error);

      await expect(EpreuveService.deleteEpreuve(999)).rejects.toThrow('Epreuve not found');
      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/delete/999/', {
        method: 'DELETE',
      });
    });
  });

  describe('searchEpreuves', () => {
    it('should search epreuves by query', async () => {
      const query = 'nage';
      mockFetchApi.mockResolvedValue([mockEpreuve]);

      const result = await EpreuveService.searchEpreuves(query);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/?search=nage');
      expect(result).toEqual([mockEpreuve]);
    });

    it('should encode special characters in search query', async () => {
      const query = 'test & special';
      mockFetchApi.mockResolvedValue([]);

      const result = await EpreuveService.searchEpreuves(query);

      expect(mockFetchApi).toHaveBeenCalledWith('/epreuve/?search=test%20%26%20special');
      expect(result).toEqual([]);
    });

    it('should handle search error', async () => {
      const error = new Error('Search error');
      mockFetchApi.mockRejectedValue(error);

      await expect(EpreuveService.searchEpreuves('test')).rejects.toThrow('Search error');
    });
  });
});

describe('epreuveApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call EpreuveService.getAllEpreuves via getAll', async () => {
    const spy = jest.spyOn(EpreuveService, 'getAllEpreuves').mockResolvedValue(mockEpreuves);
    const filters: EpreuveFilters = { libelle: 'test' };

    const result = await epreuveApi.getAll(filters);

    expect(spy).toHaveBeenCalledWith(filters);
    expect(result).toEqual(mockEpreuves);
  });

  it('should call EpreuveService.getEpreuveById via getById', async () => {
    const spy = jest.spyOn(EpreuveService, 'getEpreuveById').mockResolvedValue(mockEpreuve);

    const result = await epreuveApi.getById(1);

    expect(spy).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockEpreuve);
  });

  it('should call EpreuveService.createEpreuve via create', async () => {
    const createData: CreateEpreuveRequest = { libelle: 'Test', disciplineId: 1 };
    const spy = jest.spyOn(EpreuveService, 'createEpreuve').mockResolvedValue(mockEpreuve);

    const result = await epreuveApi.create(createData);

    expect(spy).toHaveBeenCalledWith(createData);
    expect(result).toEqual(mockEpreuve);
  });

  it('should call EpreuveService.updateEpreuve via update', async () => {
    const updateData: UpdateEpreuveRequest = { id: 1, libelle: 'Test', disciplineId: 1 };
    const spy = jest.spyOn(EpreuveService, 'updateEpreuve').mockResolvedValue(mockEpreuve);

    const result = await epreuveApi.update(updateData);

    expect(spy).toHaveBeenCalledWith(updateData);
    expect(result).toEqual(mockEpreuve);
  });

  it('should call EpreuveService.deleteEpreuve via delete', async () => {
    const spy = jest.spyOn(EpreuveService, 'deleteEpreuve').mockResolvedValue(undefined);

    await epreuveApi.delete(1);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should call EpreuveService.searchEpreuves via search', async () => {
    const query = 'test';
    const spy = jest.spyOn(EpreuveService, 'searchEpreuves').mockResolvedValue([mockEpreuve]);

    const result = await epreuveApi.search(query);

    expect(spy).toHaveBeenCalledWith(query);
    expect(result).toEqual([mockEpreuve]);
  });
});
