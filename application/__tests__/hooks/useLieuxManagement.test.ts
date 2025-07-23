import { renderHook, act, waitFor } from '@testing-library/react';
import { useLieuxManagement } from '@/hooks/useLieuxManagement';
import { lieuApi } from '@/lib/api/services/evenementSports/lieuService';

// Mock du service lieuApi
jest.mock('@/lib/api/services/evenementSports/lieuService');

const mockLieuApi = lieuApi as jest.Mocked<typeof lieuApi>;

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

// Mock data
const mockLieux = [
  { id: 1, nom: 'Stade de France', adresse: 'Saint-Denis', capacite: 80000 },
  { id: 2, nom: 'AccorHotels Arena', adresse: 'Paris', capacite: 20000 },
  { id: 3, nom: 'Roland Garros', adresse: 'Paris', capacite: 15000 }
];

describe('useLieuxManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  it('should initialize with default state', () => {
    mockLieuApi.getAll.mockResolvedValue(mockLieux);

    const { result } = renderHook(() => useLieuxManagement());

    expect(result.current.lieux).toEqual([]);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.createLoading).toBe(false);
    expect(result.current.createError).toBe(null);
  });

  it('should load lieux on mount', async () => {
    mockLieuApi.getAll.mockResolvedValue(mockLieux);

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockLieuApi.getAll).toHaveBeenCalledWith(undefined);
    expect(result.current.lieux).toEqual(mockLieux.sort((a, b) => a.nom.localeCompare(b.nom)));
    expect(result.current.error).toBe(null);
  });

  it('should handle loading error', async () => {
    mockLieuApi.getAll.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Erreur lors du chargement des lieux');
    expect(result.current.lieux).toEqual([]);
  });

  it('should create new lieu successfully', async () => {
    const newLieu = { id: 4, nom: 'Nouveau Stade', adresse: 'Lyon', capacite: 50000 };
    const createData = { nom: 'Nouveau Stade', adresse: 'Lyon', capacite: 50000 };

    mockLieuApi.getAll.mockResolvedValue(mockLieux);
    mockLieuApi.create.mockResolvedValue(newLieu);

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const createdLieu = await result.current.createLieu(createData);
      expect(createdLieu).toEqual(newLieu);
    });

    expect(mockLieuApi.create).toHaveBeenCalledWith(createData);
    expect(result.current.lieux).toContainEqual(newLieu);
    expect(result.current.createError).toBe(null);
  });

  it('should handle create lieu error', async () => {
    const createData = { nom: 'Nouveau Stade', adresse: 'Lyon', capacite: 50000 };

    mockLieuApi.getAll.mockResolvedValue(mockLieux);
    mockLieuApi.create.mockRejectedValue(new Error('Create failed'));

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.createLieu(createData);
      } catch (error) {
        expect(error).toEqual(new Error('Create failed'));
      }
    });

    expect(result.current.createError).toBe('Erreur lors de la création du lieu');
  });

  it('should update lieu successfully', async () => {
    const updatedLieu = { id: 1, nom: 'Stade de France Modifié', adresse: 'Saint-Denis', capacite: 80000 };
    const updateData = { nom: 'Stade de France Modifié', adresse: 'Saint-Denis', capacite: 80000 };

    mockLieuApi.getAll.mockResolvedValue(mockLieux);
    mockLieuApi.update.mockResolvedValue(updatedLieu);

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const updated = await result.current.updateLieu(1, updateData);
      expect(updated).toEqual(updatedLieu);
    });

    expect(mockLieuApi.update).toHaveBeenCalledWith({
      id: 1,
      nom: 'Stade de France Modifié'
    });
    expect(result.current.lieux.find(l => l.id === 1)).toEqual(updatedLieu);
  });

  it('should handle update lieu error', async () => {
    const updateData = { nom: 'Stade de France Modifié', adresse: 'Saint-Denis', capacite: 80000 };

    mockLieuApi.getAll.mockResolvedValue(mockLieux);
    mockLieuApi.update.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.updateLieu(1, updateData);
      } catch (error) {
        expect(error).toEqual(new Error('Update failed'));
      }
    });

    expect(result.current.createError).toBe('Erreur lors de la modification du lieu');
  });

  it('should delete lieu successfully when confirmed', async () => {
    mockLieuApi.getAll.mockResolvedValue(mockLieux);
    mockLieuApi.delete.mockResolvedValue(undefined);
    mockConfirm.mockReturnValue(true);

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteLieu(1);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer ce lieu ?');
    expect(mockLieuApi.delete).toHaveBeenCalledWith(1);
    expect(result.current.lieux.find(l => l.id === 1)).toBeUndefined();
  });

  it('should not delete lieu when not confirmed', async () => {
    mockLieuApi.getAll.mockResolvedValue(mockLieux);
    mockConfirm.mockReturnValue(false);

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteLieu(1);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer ce lieu ?');
    expect(mockLieuApi.delete).not.toHaveBeenCalled();
    expect(result.current.lieux.find(l => l.id === 1)).toBeDefined();
  });

  it('should handle search functionality', async () => {
    mockLieuApi.getAll.mockResolvedValue(mockLieux);

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch('Stade');
    });

    expect(result.current.searchTerm).toBe('Stade');
    expect(mockLieuApi.getAll).toHaveBeenLastCalledWith({ nom: 'Stade' });
  });

  it('should handle empty search', async () => {
    mockLieuApi.getAll.mockResolvedValue(mockLieux);

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch('');
    });

    expect(result.current.searchTerm).toBe('');
    expect(mockLieuApi.getAll).toHaveBeenLastCalledWith(undefined);
  });

  it('should filter lieux based on search term', async () => {
    mockLieuApi.getAll.mockResolvedValue(mockLieux);

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch('stade');
    });

    // Le filtrage se fait côté client aussi
    const filteredResults = result.current.lieux.filter(lieu => 
      lieu.nom.toLowerCase().includes('stade')
    );
    expect(filteredResults.length).toBeGreaterThan(0);
  });

  it('should sort lieux alphabetically', async () => {
    const unsortedLieux = [
      { id: 3, nom: 'Zoo', adresse: 'Paris', capacite: 1000 },
      { id: 1, nom: 'Aquarium', adresse: 'Lyon', capacite: 2000 },
      { id: 2, nom: 'Musée', adresse: 'Marseille', capacite: 1500 }
    ];

    mockLieuApi.getAll.mockResolvedValue(unsortedLieux);

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const sortedNames = result.current.lieux.map(l => l.nom);
    expect(sortedNames).toEqual(['Aquarium', 'Musée', 'Zoo']);
  });

  it('should allow setting create error manually', async () => {
    mockLieuApi.getAll.mockResolvedValue(mockLieux);

    const { result } = renderHook(() => useLieuxManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setCreateError('Custom error message');
    });

    expect(result.current.createError).toBe('Custom error message');
  });
});
