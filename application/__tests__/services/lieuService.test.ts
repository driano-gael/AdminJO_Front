import { 
  LieuService, 
  lieuApi, 
  CreateLieuRequest, 
  UpdateLieuRequest,
  LieuFilters 
} from '@/lib/api/services/evenementSports/lieuService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Lieu } from '@/types/sportEvenement/lieu';

// Mock du module fetchWrappers
jest.mock('@/lib/api/core/fetchWrappers');

const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

// Mock data
const mockLieu: Lieu = {
  id: 1,
  nom: 'Stade de France'
};

const mockLieux: Lieu[] = [
  mockLieu,
  { id: 2, nom: 'Centre Aquatique' },
  { id: 3, nom: 'Palais des Sports' }
];

describe('LieuService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLieux', () => {
    it('should fetch all lieux without filters', async () => {
      mockFetchApi.mockResolvedValue(mockLieux);

      const result = await LieuService.getAllLieux();

      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/');
      expect(result).toEqual(mockLieux);
    });

    it('should fetch lieux with search filter', async () => {
      const filters: LieuFilters = { nom: 'Stade' };
      mockFetchApi.mockResolvedValue([mockLieu]);

      const result = await LieuService.getAllLieux(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/?search=Stade');
      expect(result).toEqual([mockLieu]);
    });

    it('should fetch lieux with pagination', async () => {
      const filters: LieuFilters = { page: 2, limit: 10 };
      mockFetchApi.mockResolvedValue(mockLieux);

      const result = await LieuService.getAllLieux(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/?page=2&limit=10');
      expect(result).toEqual(mockLieux);
    });

    it('should fetch lieux with all filters combined', async () => {
      const filters: LieuFilters = { 
        nom: 'test', 
        page: 1, 
        limit: 5
      };
      mockFetchApi.mockResolvedValue(mockLieux);

      const result = await LieuService.getAllLieux(filters);

      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/?search=test&page=1&limit=5');
      expect(result).toEqual(mockLieux);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Network error');
      mockFetchApi.mockRejectedValue(error);

      await expect(LieuService.getAllLieux()).rejects.toThrow('Network error');
      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/');
    });
  });

  describe('getLieuById', () => {
    it('should fetch lieu by id', async () => {
      mockFetchApi.mockResolvedValue(mockLieu);

      const result = await LieuService.getLieuById(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/1/');
      expect(result).toEqual(mockLieu);
    });

    it('should handle fetch error for non-existent id', async () => {
      const error = new Error('Lieu not found');
      mockFetchApi.mockRejectedValue(error);

      await expect(LieuService.getLieuById(999)).rejects.toThrow('Lieu not found');
      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/999/');
    });
  });

  describe('createLieu', () => {
    it('should create new lieu', async () => {
      const createData: CreateLieuRequest = { nom: 'Nouveau Lieu' };
      const createdLieu: Lieu = { 
        id: 4, 
        nom: 'Nouveau Lieu'
      };
      
      mockFetchApi.mockResolvedValue(createdLieu);

      const result = await LieuService.createLieu(createData);

      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/create/', {
        method: 'POST',
        body: JSON.stringify(createData),
      });
      expect(result).toEqual(createdLieu);
    });

    it('should handle creation error', async () => {
      const createData: CreateLieuRequest = { nom: 'Test' };
      const error = new Error('Validation error');
      mockFetchApi.mockRejectedValue(error);

      await expect(LieuService.createLieu(createData)).rejects.toThrow('Validation error');
      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/create/', {
        method: 'POST',
        body: JSON.stringify(createData),
      });
    });
  });

  describe('updateLieu', () => {
    it('should update existing lieu', async () => {
      const updateData: UpdateLieuRequest = { id: 1, nom: 'Stade de France Modifié' };
      const updatedLieu: Lieu = { 
        id: 1, 
        nom: 'Stade de France Modifié'
      };
      
      mockFetchApi.mockResolvedValue(updatedLieu);

      const result = await LieuService.updateLieu(updateData);

      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/update/1/', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(updatedLieu);
    });

    it('should handle update error', async () => {
      const updateData: UpdateLieuRequest = { id: 999, nom: 'Test' };
      const error = new Error('Lieu not found');
      mockFetchApi.mockRejectedValue(error);

      await expect(LieuService.updateLieu(updateData)).rejects.toThrow('Lieu not found');
      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/update/999/', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    });
  });

  describe('deleteLieu', () => {
    it('should delete lieu', async () => {
      mockFetchApi.mockResolvedValue(undefined);

      await LieuService.deleteLieu(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/delete/1/', {
        method: 'DELETE',
      });
    });

    it('should handle delete error', async () => {
      const error = new Error('Lieu not found');
      mockFetchApi.mockRejectedValue(error);

      await expect(LieuService.deleteLieu(999)).rejects.toThrow('Lieu not found');
      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/delete/999/', {
        method: 'DELETE',
      });
    });
  });

  describe('searchLieux', () => {
    it('should search lieux by query', async () => {
      const query = 'Stade';
      mockFetchApi.mockResolvedValue([mockLieu]);

      const result = await LieuService.searchLieux(query);

      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/?search=Stade');
      expect(result).toEqual([mockLieu]);
    });

    it('should encode special characters in search query', async () => {
      const query = 'test & special';
      mockFetchApi.mockResolvedValue([]);

      const result = await LieuService.searchLieux(query);

      expect(mockFetchApi).toHaveBeenCalledWith('/lieu/?search=test%20%26%20special');
      expect(result).toEqual([]);
    });

    it('should handle search error', async () => {
      const error = new Error('Search error');
      mockFetchApi.mockRejectedValue(error);

      await expect(LieuService.searchLieux('test')).rejects.toThrow('Search error');
    });
  });
});

describe('lieuApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call LieuService.getAllLieux via getAll', async () => {
    const spy = jest.spyOn(LieuService, 'getAllLieux').mockResolvedValue(mockLieux);
    const filters: LieuFilters = { nom: 'test' };

    const result = await lieuApi.getAll(filters);

    expect(spy).toHaveBeenCalledWith(filters);
    expect(result).toEqual(mockLieux);
  });

  it('should call LieuService.getLieuById via getById', async () => {
    const spy = jest.spyOn(LieuService, 'getLieuById').mockResolvedValue(mockLieu);

    const result = await lieuApi.getById(1);

    expect(spy).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockLieu);
  });

  it('should call LieuService.createLieu via create', async () => {
    const createData: CreateLieuRequest = { nom: 'Test' };
    const spy = jest.spyOn(LieuService, 'createLieu').mockResolvedValue(mockLieu);

    const result = await lieuApi.create(createData);

    expect(spy).toHaveBeenCalledWith(createData);
    expect(result).toEqual(mockLieu);
  });

  it('should call LieuService.updateLieu via update', async () => {
    const updateData: UpdateLieuRequest = { id: 1, nom: 'Test' };
    const spy = jest.spyOn(LieuService, 'updateLieu').mockResolvedValue(mockLieu);

    const result = await lieuApi.update(updateData);

    expect(spy).toHaveBeenCalledWith(updateData);
    expect(result).toEqual(mockLieu);
  });

  it('should call LieuService.deleteLieu via delete', async () => {
    const spy = jest.spyOn(LieuService, 'deleteLieu').mockResolvedValue(undefined);

    await lieuApi.delete(1);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should call LieuService.searchLieux via search', async () => {
    const query = 'test';
    const spy = jest.spyOn(LieuService, 'searchLieux').mockResolvedValue([mockLieu]);

    const result = await lieuApi.search(query);

    expect(spy).toHaveBeenCalledWith(query);
    expect(result).toEqual([mockLieu]);
  });
});
