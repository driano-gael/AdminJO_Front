import { 
  DisciplineService, 
  disciplineApi, 
  CreateDisciplineRequest, 
  UpdateDisciplineRequest,
  DisciplineFilters 
} from '@/lib/api/services/evenementSports/disciplineService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Discipline } from '@/types/sportEvenement/discipline';

// Mock du module fetchWrappers
jest.mock('@/lib/api/core/fetchWrappers');

const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

// Mock data
const mockDiscipline: Discipline = {
  id: 1,
  nom: 'Natation'
};

const mockDisciplines: Discipline[] = [
  mockDiscipline,
  { id: 2, nom: 'Athlétisme' },
  { id: 3, nom: 'Gymnastique' }
];

describe('DisciplineService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllDisciplines', () => {
    it('should fetch all disciplines without filters', async () => {
      mockFetchApi.mockResolvedValue(mockDisciplines);

      const result = await DisciplineService.getAllDisciplines();

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/');
      expect(result).toEqual(mockDisciplines);
    });

    it('should fetch disciplines with search filter', async () => {
      const filters: DisciplineFilters = { nom: 'Natation' };
      mockFetchApi.mockResolvedValue([mockDiscipline]);

      const result = await DisciplineService.getAllDisciplines(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/?search=Natation');
      expect(result).toEqual([mockDiscipline]);
    });

    it('should fetch disciplines with pagination', async () => {
      const filters: DisciplineFilters = { page: 2, limit: 10 };
      mockFetchApi.mockResolvedValue(mockDisciplines);

      const result = await DisciplineService.getAllDisciplines(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/?page=2&limit=10');
      expect(result).toEqual(mockDisciplines);
    });

    it('should fetch disciplines with sorting', async () => {
      const filters: DisciplineFilters = { sortBy: 'nom', sortOrder: 'desc' };
      mockFetchApi.mockResolvedValue(mockDisciplines);

      const result = await DisciplineService.getAllDisciplines(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/?sortBy=nom&sortOrder=desc');
      expect(result).toEqual(mockDisciplines);
    });

    it('should fetch disciplines with all filters combined', async () => {
      const filters: DisciplineFilters = { 
        nom: 'test', 
        page: 1, 
        limit: 5, 
        sortBy: 'nom', 
        sortOrder: 'asc' 
      };
      mockFetchApi.mockResolvedValue(mockDisciplines);

      const result = await DisciplineService.getAllDisciplines(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/?search=test&page=1&limit=5&sortBy=nom&sortOrder=asc');
      expect(result).toEqual(mockDisciplines);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Network error');
      mockFetchApi.mockRejectedValue(error);

      await expect(DisciplineService.getAllDisciplines()).rejects.toThrow('Network error');
      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/');
    });
  });

  describe('getDisciplineById', () => {
    it('should fetch discipline by id', async () => {
      mockFetchApi.mockResolvedValue(mockDiscipline);

      const result = await DisciplineService.getDisciplineById(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/1/');
      expect(result).toEqual(mockDiscipline);
    });

    it('should handle fetch error for non-existent id', async () => {
      const error = new Error('Discipline not found');
      mockFetchApi.mockRejectedValue(error);

      await expect(DisciplineService.getDisciplineById(999)).rejects.toThrow('Discipline not found');
      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/999/');
    });
  });

  describe('createDiscipline', () => {
    it('should create new discipline', async () => {
      const createData: CreateDisciplineRequest = { nom: 'Nouvelle Discipline' };
      const createdDiscipline: Discipline = { 
        id: 4, 
        nom: 'Nouvelle Discipline'
      };
      
      mockFetchApi.mockResolvedValue(createdDiscipline);

      const result = await DisciplineService.createDiscipline(createData);

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/create/', {
        method: 'POST',
        body: JSON.stringify(createData),
      });
      expect(result).toEqual(createdDiscipline);
    });

    it('should handle creation error', async () => {
      const createData: CreateDisciplineRequest = { nom: 'Test' };
      const error = new Error('Validation error');
      mockFetchApi.mockRejectedValue(error);

      await expect(DisciplineService.createDiscipline(createData)).rejects.toThrow('Validation error');
      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/create/', {
        method: 'POST',
        body: JSON.stringify(createData),
      });
    });
  });

  describe('updateDiscipline', () => {
    it('should update existing discipline', async () => {
      const updateData: UpdateDisciplineRequest = { id: 1, nom: 'Natation Modifiée' };
      const updatedDiscipline: Discipline = { 
        id: 1, 
        nom: 'Natation Modifiée'
      };
      
      mockFetchApi.mockResolvedValue(updatedDiscipline);

      const result = await DisciplineService.updateDiscipline(updateData);

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/update/1/', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(updatedDiscipline);
    });

    it('should handle update error', async () => {
      const updateData: UpdateDisciplineRequest = { id: 999, nom: 'Test' };
      const error = new Error('Discipline not found');
      mockFetchApi.mockRejectedValue(error);

      await expect(DisciplineService.updateDiscipline(updateData)).rejects.toThrow('Discipline not found');
      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/update/999/', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    });
  });

  describe('deleteDiscipline', () => {
    it('should delete discipline', async () => {
      mockFetchApi.mockResolvedValue(undefined);

      await DisciplineService.deleteDiscipline(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/delete/1/', {
        method: 'DELETE',
      });
    });

    it('should handle delete error', async () => {
      const error = new Error('Discipline not found');
      mockFetchApi.mockRejectedValue(error);

      await expect(DisciplineService.deleteDiscipline(999)).rejects.toThrow('Discipline not found');
      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/delete/999/', {
        method: 'DELETE',
      });
    });
  });

  describe('searchDisciplines', () => {
    it('should search disciplines by query', async () => {
      const query = 'Natation';
      mockFetchApi.mockResolvedValue([mockDiscipline]);

      const result = await DisciplineService.searchDisciplines(query);

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/?search=Natation');
      expect(result).toEqual([mockDiscipline]);
    });

    it('should encode special characters in search query', async () => {
      const query = 'test & special';
      mockFetchApi.mockResolvedValue([]);

      const result = await DisciplineService.searchDisciplines(query);

      expect(mockFetchApi).toHaveBeenCalledWith('/discipline/?search=test%20%26%20special');
      expect(result).toEqual([]);
    });

    it('should handle search error', async () => {
      const error = new Error('Search error');
      mockFetchApi.mockRejectedValue(error);

      await expect(DisciplineService.searchDisciplines('test')).rejects.toThrow('Search error');
    });
  });
});

describe('disciplineApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call DisciplineService.getAllDisciplines via getAll', async () => {
    const spy = jest.spyOn(DisciplineService, 'getAllDisciplines').mockResolvedValue(mockDisciplines);
    const filters: DisciplineFilters = { nom: 'test' };

    const result = await disciplineApi.getAll(filters);

    expect(spy).toHaveBeenCalledWith(filters);
    expect(result).toEqual(mockDisciplines);
  });

  it('should call DisciplineService.getDisciplineById via getById', async () => {
    const spy = jest.spyOn(DisciplineService, 'getDisciplineById').mockResolvedValue(mockDiscipline);

    const result = await disciplineApi.getById(1);

    expect(spy).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockDiscipline);
  });

  it('should call DisciplineService.createDiscipline via create', async () => {
    const createData: CreateDisciplineRequest = { nom: 'Test' };
    const spy = jest.spyOn(DisciplineService, 'createDiscipline').mockResolvedValue(mockDiscipline);

    const result = await disciplineApi.create(createData);

    expect(spy).toHaveBeenCalledWith(createData);
    expect(result).toEqual(mockDiscipline);
  });

  it('should call DisciplineService.updateDiscipline via update', async () => {
    const updateData: UpdateDisciplineRequest = { id: 1, nom: 'Test' };
    const spy = jest.spyOn(DisciplineService, 'updateDiscipline').mockResolvedValue(mockDiscipline);

    const result = await disciplineApi.update(updateData);

    expect(spy).toHaveBeenCalledWith(updateData);
    expect(result).toEqual(mockDiscipline);
  });

  it('should call DisciplineService.deleteDiscipline via delete', async () => {
    const spy = jest.spyOn(DisciplineService, 'deleteDiscipline').mockResolvedValue(undefined);

    await disciplineApi.delete(1);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should call DisciplineService.searchDisciplines via search', async () => {
    const query = 'test';
    const spy = jest.spyOn(DisciplineService, 'searchDisciplines').mockResolvedValue([mockDiscipline]);

    const result = await disciplineApi.search(query);

    expect(spy).toHaveBeenCalledWith(query);
    expect(result).toEqual([mockDiscipline]);
  });
});
