import { useState, useEffect } from 'react';
import { epreuveApi } from '@/lib/api/services/evenementSports/epreuveService';
import { disciplineApi } from '@/lib/api/services/evenementSports/disciplineService';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Discipline } from '@/types/sportEvenement/discipline';
import { CreateEpreuveRequest, UpdateEpreuveRequest } from '@/lib/api/services/evenementSports/epreuveService';

export function useEpreuvesManagement() {
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadEpreuves = async (searchQuery?: string, disciplineId?: number | null) => {
    try {
      setLoading(true);
      setError(null);
      const filters: any = {};
      
      if (searchQuery) {
        filters.libelle = searchQuery;
      }
      
      if (disciplineId) {
        filters.disciplineId = disciplineId;
      }
      
      const apiEpreuves = await epreuveApi.getAll(Object.keys(filters).length > 0 ? filters : undefined);
      // Trier d'abord par discipline, puis par libellé de l'épreuve
      const sortedEpreuves = apiEpreuves.sort((a, b) => {
        // Tri principal par nom de discipline
        const disciplineComparison = a.discipline.nom.localeCompare(b.discipline.nom);
        if (disciplineComparison !== 0) {
          return disciplineComparison;
        }
        // Tri secondaire par libellé de l'épreuve
        return a.libelle.localeCompare(b.libelle);
      });
      setEpreuves(sortedEpreuves);
    } catch (err) {
      setError('Erreur lors du chargement des épreuves');
    } finally {
      setLoading(false);
    }
  };

  const loadDisciplines = async () => {
    try {
      const apiDisciplines = await disciplineApi.getAll();
      const sortedDisciplines = apiDisciplines.sort((a, b) => a.nom.localeCompare(b.nom));
      setDisciplines(sortedDisciplines);
    } catch (err) {
      console.error('Erreur lors du chargement des disciplines:', err);
    }
  };

  const createEpreuve = async (epreuveData: CreateEpreuveRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      const newEpreuve = await epreuveApi.create(epreuveData);
      // Ajouter la nouvelle épreuve et trier par discipline puis par libellé
      setEpreuves(prev => [...prev, newEpreuve].sort((a, b) => {
        const disciplineComparison = a.discipline.nom.localeCompare(b.discipline.nom);
        if (disciplineComparison !== 0) {
          return disciplineComparison;
        }
        return a.libelle.localeCompare(b.libelle);
      }));
      return newEpreuve;
    } catch (err) {
      setCreateError('Erreur lors de la création de l\'épreuve');
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateEpreuve = async (id: number, epreuveData: CreateEpreuveRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      const updateData: UpdateEpreuveRequest = {
        id: id,
        libelle: epreuveData.libelle,
        disciplineId: epreuveData.disciplineId
      };
      const updatedEpreuve = await epreuveApi.update(updateData);
      // Mettre à jour l'épreuve et trier par discipline puis par libellé
      setEpreuves(prev => prev.map(epreuve => 
        epreuve.id === id ? updatedEpreuve : epreuve
      ).sort((a, b) => {
        const disciplineComparison = a.discipline.nom.localeCompare(b.discipline.nom);
        if (disciplineComparison !== 0) {
          return disciplineComparison;
        }
        return a.libelle.localeCompare(b.libelle);
      }));
      return updatedEpreuve;
    } catch (err) {
      setCreateError('Erreur lors de la modification de l\'épreuve');
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteEpreuve = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette épreuve ?')) return;
    try {
      await epreuveApi.delete(id);
      setEpreuves(prev => prev.filter(epreuve => epreuve.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    await loadEpreuves(query.trim() || undefined, selectedDisciplineId);
  };

  const handleDisciplineFilter = async (disciplineId: number | null) => {
    setSelectedDisciplineId(disciplineId);
    await loadEpreuves(searchTerm.trim() || undefined, disciplineId);
  };

  const filteredEpreuves = epreuves.filter(epreuve => {
    let matches = true;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      matches = matches && (
        epreuve.libelle.toLowerCase().includes(searchLower) ||
        epreuve.discipline.nom.toLowerCase().includes(searchLower)
      );
    }
    
    if (selectedDisciplineId) {
      matches = matches && epreuve.discipline.id === selectedDisciplineId;
    }
    
    return matches;
  }).sort((a, b) => {
    // Trier d'abord par discipline, puis par libellé de l'épreuve
    const disciplineComparison = a.discipline.nom.localeCompare(b.discipline.nom);
    if (disciplineComparison !== 0) {
      return disciplineComparison;
    }
    return a.libelle.localeCompare(b.libelle);
  });

  useEffect(() => {
    loadEpreuves();
    loadDisciplines();
  }, []);

  return {
    epreuves: filteredEpreuves,
    disciplines,
    searchTerm,
    selectedDisciplineId,
    loading,
    error,
    createLoading,
    createError,
    loadEpreuves,
    createEpreuve,
    updateEpreuve,
    deleteEpreuve,
    handleSearch,
    handleDisciplineFilter,
    setCreateError
  };
}
