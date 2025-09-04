import { useState, useEffect } from 'react';
import { disciplineApi } from '@/lib/api/services/evenementSports/disciplineService';
import { Discipline } from '@/types/sportEvenement/discipline';
import { CreateDisciplineRequest, UpdateDisciplineRequest } from '@/lib/api/services/evenementSports/disciplineService';

export function useDisciplinesManagement() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadDisciplines = async (searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      const apiDisciplines = await disciplineApi.getAll(searchQuery ? {
        nom: searchQuery
      } : undefined);
      const sortedDisciplines = apiDisciplines.sort((a, b) => a.nom.localeCompare(b.nom));
      setDisciplines(sortedDisciplines);
    } catch {
      setError('Erreur lors du chargement des disciplines');
    } finally {
      setLoading(false);
    }
  };

  const createDiscipline = async (disciplineData: CreateDisciplineRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      const newDiscipline = await disciplineApi.create(disciplineData);
      setDisciplines(prev => [...prev, newDiscipline].sort((a, b) => a.nom.localeCompare(b.nom)));
      return newDiscipline;
    } catch (err) {
      setCreateError('Erreur lors de la création de la discipline');
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateDiscipline = async (id: number, disciplineData: CreateDisciplineRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);

      const updateData: UpdateDisciplineRequest = {
        id: id,
        nom: disciplineData.nom,
        icone: disciplineData.icone
      };

      const updatedDiscipline = await disciplineApi.update(updateData);

      setDisciplines(prev => prev.map(discipline =>
        discipline.id === id ? updatedDiscipline : discipline
      ).sort((a, b) => a.nom.localeCompare(b.nom)));
      return updatedDiscipline;
    } catch (err) {
      setCreateError('Erreur lors de la modification de la discipline');
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteDiscipline = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette discipline ?')) return;
    try {
      await disciplineApi.delete(id);
      setDisciplines(prev => prev.filter(discipline => discipline.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      await loadDisciplines(query);
    } else {
      await loadDisciplines();
    }
  };

  const filteredDisciplines = disciplines.filter(discipline => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return discipline.nom.toLowerCase().includes(searchLower);
  }).sort((a, b) => a.nom.localeCompare(b.nom));

  useEffect(() => {
    loadDisciplines();
  }, []);

  return {
    disciplines: filteredDisciplines,
    searchTerm,
    loading,
    error,
    createLoading,
    createError,
    loadDisciplines,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
    handleSearch,
    setCreateError
  };
}
