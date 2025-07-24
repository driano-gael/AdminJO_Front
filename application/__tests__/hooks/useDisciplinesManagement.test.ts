import { renderHook, act, waitFor } from '@testing-library/react';
import { useDisciplinesManagement } from '@/hooks/useDisciplinesManagement';
import { disciplineApi } from '@/lib/api/services/evenementSports/disciplineService';

// Mock du service disciplineApi
jest.mock('@/lib/api/services/evenementSports/disciplineService');

const mockDisciplineApi = disciplineApi as jest.Mocked<typeof disciplineApi>;

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

// Mock data
const mockDisciplines = [
  { id: 1, nom: 'Natation', description: 'Sport aquatique' },
  { id: 2, nom: 'Athlétisme', description: 'Course et saut' },
  { id: 3, nom: 'Basketball', description: 'Sport collectif' }
];

describe('useDisciplinesManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  it('should initialize with default state', () => {
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useDisciplinesManagement());

    expect(result.current.disciplines).toEqual([]);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.createLoading).toBe(false);
    expect(result.current.createError).toBe(null);
  });

  it('should load disciplines on mount', async () => {
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockDisciplineApi.getAll).toHaveBeenCalledWith(undefined);
    expect(result.current.disciplines).toEqual(mockDisciplines.sort((a, b) => a.nom.localeCompare(b.nom)));
    expect(result.current.error).toBe(null);
  });

  it('should handle loading error', async () => {
    mockDisciplineApi.getAll.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Erreur lors du chargement des disciplines');
    expect(result.current.disciplines).toEqual([]);
  });

  it('should create new discipline successfully', async () => {
    const newDiscipline = { id: 4, nom: 'Tennis', description: 'Sport de raquette' };
    const createData = { nom: 'Tennis', description: 'Sport de raquette' };

    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockDisciplineApi.create.mockResolvedValue(newDiscipline);

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const createdDiscipline = await result.current.createDiscipline(createData);
      expect(createdDiscipline).toEqual(newDiscipline);
    });

    expect(mockDisciplineApi.create).toHaveBeenCalledWith(createData);
    expect(result.current.disciplines).toContainEqual(newDiscipline);
    expect(result.current.createError).toBe(null);
  });

  it('should handle create discipline error', async () => {
    const createData = { nom: 'Tennis', description: 'Sport de raquette' };

    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockDisciplineApi.create.mockRejectedValue(new Error('Create failed'));

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.createDiscipline(createData);
      } catch (error) {
        expect(error).toEqual(new Error('Create failed'));
      }
    });

    expect(result.current.createError).toBe('Erreur lors de la création de la discipline');
  });

  it('should update discipline successfully', async () => {
    const updatedDiscipline = { id: 1, nom: 'Natation Modifiée', description: 'Sport aquatique modifié' };
    const updateData = { nom: 'Natation Modifiée', description: 'Sport aquatique modifié' };

    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockDisciplineApi.update.mockResolvedValue(updatedDiscipline);

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const updated = await result.current.updateDiscipline(1, updateData);
      expect(updated).toEqual(updatedDiscipline);
    });

    expect(mockDisciplineApi.update).toHaveBeenCalledWith({
      id: 1,
      nom: 'Natation Modifiée'
    });
    expect(result.current.disciplines.find(d => d.id === 1)).toEqual(updatedDiscipline);
  });

  it('should handle update discipline error', async () => {
    const updateData = { nom: 'Natation Modifiée', description: 'Sport aquatique modifié' };

    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockDisciplineApi.update.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.updateDiscipline(1, updateData);
      } catch (error) {
        expect(error).toEqual(new Error('Update failed'));
      }
    });

    expect(result.current.createError).toBe('Erreur lors de la modification de la discipline');
  });

  it('should delete discipline successfully when confirmed', async () => {
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockDisciplineApi.delete.mockResolvedValue(undefined);
    mockConfirm.mockReturnValue(true);

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteDiscipline(1);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer cette discipline ?');
    expect(mockDisciplineApi.delete).toHaveBeenCalledWith(1);
    expect(result.current.disciplines.find(d => d.id === 1)).toBeUndefined();
  });

  it('should not delete discipline when not confirmed', async () => {
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockConfirm.mockReturnValue(false);

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteDiscipline(1);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer cette discipline ?');
    expect(mockDisciplineApi.delete).not.toHaveBeenCalled();
    expect(result.current.disciplines.find(d => d.id === 1)).toBeDefined();
  });

  it('should handle search functionality', async () => {
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch('Natation');
    });

    expect(result.current.searchTerm).toBe('Natation');
    expect(mockDisciplineApi.getAll).toHaveBeenLastCalledWith({ nom: 'Natation' });
  });

  it('should handle empty search', async () => {
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch('');
    });

    expect(result.current.searchTerm).toBe('');
    expect(mockDisciplineApi.getAll).toHaveBeenLastCalledWith(undefined);
  });

  it('should filter disciplines based on search term', async () => {
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch('ball');
    });

    // Le filtrage se fait côté client aussi
    const filteredResults = result.current.disciplines.filter(discipline => 
      discipline.nom.toLowerCase().includes('ball')
    );
    expect(filteredResults.length).toBeGreaterThan(0);
  });

  it('should sort disciplines alphabetically', async () => {
    const unsortedDisciplines = [
      { id: 3, nom: 'Volleyball', description: 'Sport collectif' },
      { id: 1, nom: 'Athlétisme', description: 'Course et saut' },
      { id: 2, nom: 'Natation', description: 'Sport aquatique' }
    ];

    mockDisciplineApi.getAll.mockResolvedValue(unsortedDisciplines);

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const sortedNames = result.current.disciplines.map(d => d.nom);
    expect(sortedNames).toEqual(['Athlétisme', 'Natation', 'Volleyball']);
  });

  it('should allow setting create error manually', async () => {
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useDisciplinesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setCreateError('Custom error message');
    });

    expect(result.current.createError).toBe('Custom error message');
  });
});
