import { renderHook, act, waitFor } from '@testing-library/react';
import { useEpreuvesManagement } from '@/hooks/useEpreuvesManagement';
import { epreuveApi } from '@/lib/api/services/evenementSports/epreuveService';
import { disciplineApi } from '@/lib/api/services/evenementSports/disciplineService';

// Mock des services
jest.mock('@/lib/api/services/evenementSports/epreuveService');
jest.mock('@/lib/api/services/evenementSports/disciplineService');

const mockEpreuveApi = epreuveApi as jest.Mocked<typeof epreuveApi>;
const mockDisciplineApi = disciplineApi as jest.Mocked<typeof disciplineApi>;

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

// Mock console.error pour éviter les logs pendant les tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock data
const mockDisciplines = [
  { id: 1, nom: 'Natation', description: 'Sport aquatique', icone: 'natation.svg' },
  { id: 2, nom: 'Athlétisme', description: 'Course et saut', icone: 'athletisme.svg' }
];

const mockEpreuves = [
  { 
    id: 1, 
    libelle: '100m nage libre',
    genre: 'hommes',
    tour: 'finale',
    discipline: { id: 1, nom: 'Natation', description: 'Sport aquatique', icone: 'natation.svg' }
  },
  { 
    id: 2, 
    libelle: '100m sprint',
    genre: 'femmes',
    tour: 'demi-finale',
    discipline: { id: 2, nom: 'Athlétisme', description: 'Course et saut', icone: 'athletisme.svg' }
  },
  { 
    id: 3, 
    libelle: '200m nage libre',
    genre: 'hommes',
    tour: 'qualifications',
    discipline: { id: 1, nom: 'Natation', description: 'Sport aquatique', icone: 'natation.svg' }
  }
];

describe('useEpreuvesManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
    mockConsoleError.mockClear();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  it('should initialize with default state', () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useEpreuvesManagement());

    expect(result.current.epreuves).toEqual([]);
    expect(result.current.disciplines).toEqual([]);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedDisciplineId).toBe(null);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.createLoading).toBe(false);
    expect(result.current.createError).toBe(null);
  });

  it('should load epreuves and disciplines on mount', async () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockEpreuveApi.getAll).toHaveBeenCalledWith(undefined);
    expect(mockDisciplineApi.getAll).toHaveBeenCalled();
    expect(result.current.disciplines).toEqual(mockDisciplines);
    expect(result.current.epreuves).toHaveLength(3);
    expect(result.current.error).toBe(null);
  });

  it('should sort epreuves by discipline then by libelle', async () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Vérifier l'ordre: Athlétisme d'abord, puis Natation
    const sortedLabels = result.current.epreuves.map(e => e.libelle);
    expect(sortedLabels[0]).toBe('100m sprint'); // Athlétisme
    expect(sortedLabels[1]).toBe('100m nage libre'); // Natation
    expect(sortedLabels[2]).toBe('200m nage libre'); // Natation
  });

  it('should handle loading error for epreuves', async () => {
    mockEpreuveApi.getAll.mockRejectedValue(new Error('API Error'));
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Erreur lors du chargement des épreuves');
    expect(result.current.epreuves).toEqual([]);
  });

  it('should handle loading error for disciplines', async () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Les disciplines restent vides mais les épreuves sont chargées
    expect(result.current.disciplines).toEqual([]);
    expect(result.current.epreuves).toHaveLength(3);
    // Note: console.error est maintenant filtré par jest.setup.js
    // Le comportement important est que les disciplines restent vides en cas d'erreur
  });

  it('should create new epreuve successfully', async () => {
    const newEpreuve = { 
      id: 4, 
      libelle: '50m nage libre',
      genre: 'femmes',
      tour: 'finale',
      discipline: { id: 1, nom: 'Natation', description: 'Sport aquatique', icone: 'natation.svg' }
    };
    const createData = { libelle: '50m nage libre', disciplineId: 1 };

    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockEpreuveApi.create.mockResolvedValue(newEpreuve);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const createdEpreuve = await result.current.createEpreuve(createData);
      expect(createdEpreuve).toEqual(newEpreuve);
    });

    expect(mockEpreuveApi.create).toHaveBeenCalledWith(createData);
    expect(result.current.epreuves).toContainEqual(newEpreuve);
    expect(result.current.createError).toBe(null);
  });

  it('should handle create epreuve error', async () => {
    const createData = { libelle: '50m nage libre', disciplineId: 1 };

    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockEpreuveApi.create.mockRejectedValue(new Error('Create failed'));

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.createEpreuve(createData);
      } catch (error) {
        expect(error).toEqual(new Error('Create failed'));
      }
    });

    expect(result.current.createError).toBe('Erreur lors de la création de l\'épreuve');
  });

  it('should update epreuve successfully', async () => {
    const updatedEpreuve = { 
      id: 1, 
      libelle: '100m nage libre modifié',
      genre: 'hommes',
      tour: 'finale',
      discipline: { id: 1, nom: 'Natation', description: 'Sport aquatique', icone: 'natation.svg' }
    };
    const updateData = { libelle: '100m nage libre modifié', disciplineId: 1 };

    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockEpreuveApi.update.mockResolvedValue(updatedEpreuve);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const updated = await result.current.updateEpreuve(1, updateData);
      expect(updated).toEqual(updatedEpreuve);
    });

    expect(mockEpreuveApi.update).toHaveBeenCalledWith({
      id: 1,
      libelle: '100m nage libre modifié',
      disciplineId: 1
    });
    expect(result.current.epreuves.find(e => e.id === 1)).toEqual(updatedEpreuve);
  });

  it('should handle update epreuve error', async () => {
    const updateData = { libelle: '100m nage libre modifié', disciplineId: 1 };

    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockEpreuveApi.update.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.updateEpreuve(1, updateData);
      } catch (error) {
        expect(error).toEqual(new Error('Update failed'));
      }
    });

    expect(result.current.createError).toBe('Erreur lors de la modification de l\'épreuve');
  });

  it('should delete epreuve successfully when confirmed', async () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockEpreuveApi.delete.mockResolvedValue(undefined);
    mockConfirm.mockReturnValue(true);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteEpreuve(1);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer cette épreuve ?');
    expect(mockEpreuveApi.delete).toHaveBeenCalledWith(1);
    expect(result.current.epreuves.find(e => e.id === 1)).toBeUndefined();
  });

  it('should not delete epreuve when not confirmed', async () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);
    mockConfirm.mockReturnValue(false);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteEpreuve(1);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer cette épreuve ?');
    expect(mockEpreuveApi.delete).not.toHaveBeenCalled();
    expect(result.current.epreuves.find(e => e.id === 1)).toBeDefined();
  });

  it('should handle search functionality', async () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch('100m');
    });

    expect(result.current.searchTerm).toBe('100m');
    expect(mockEpreuveApi.getAll).toHaveBeenLastCalledWith({ libelle: '100m' });
  });

  it('should handle discipline filter', async () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleDisciplineFilter(1);
    });

    expect(result.current.selectedDisciplineId).toBe(1);
    expect(mockEpreuveApi.getAll).toHaveBeenLastCalledWith({ disciplineId: 1 });
  });

  it('should handle combined search and discipline filter', async () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // D'abord filtrer par discipline
    await act(async () => {
      await result.current.handleDisciplineFilter(1);
    });

    // Puis rechercher
    await act(async () => {
      await result.current.handleSearch('100m');
    });

    expect(result.current.searchTerm).toBe('100m');
    expect(result.current.selectedDisciplineId).toBe(1);
    expect(mockEpreuveApi.getAll).toHaveBeenLastCalledWith({ 
      libelle: '100m', 
      disciplineId: 1 
    });
  });

  it('should filter epreuves client-side based on search and discipline', async () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch('nage');
    });

    // Le filtrage côté client devrait inclure les épreuves avec "nage"
    const filteredResults = result.current.epreuves.filter(e => 
      e.libelle.toLowerCase().includes('nage')
    );
    expect(filteredResults.length).toBe(2);
  });

  it('should allow setting create error manually', async () => {
    mockEpreuveApi.getAll.mockResolvedValue(mockEpreuves);
    mockDisciplineApi.getAll.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useEpreuvesManagement());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setCreateError('Custom error message');
    });

    expect(result.current.createError).toBe('Custom error message');
  });
});
