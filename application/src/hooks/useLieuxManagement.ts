import { useState, useEffect } from 'react';
import { lieuApi } from '@/lib/api/services/evenementSports/lieuService';
import { Lieu } from '@/types/sportEvenement/lieu';
import { CreateLieuRequest, UpdateLieuRequest } from '@/lib/api/services/evenementSports/lieuService';

export function useLieuxManagement() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);


  const loadLieux = async (searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      const apiLieux = await lieuApi.getAll(searchQuery ? {
        nom: searchQuery
      } : undefined);
      const sortedLieux = apiLieux.sort((a, b) => a.nom.localeCompare(b.nom));
      setLieux(sortedLieux);
    } catch {
      setError('Erreur lors du chargement des lieux');
    } finally {
      setLoading(false);
    }
  };

  const createLieu = async (lieuData: CreateLieuRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      const newLieu = await lieuApi.create(lieuData);
      setLieux(prev => [...prev, newLieu].sort((a, b) => a.nom.localeCompare(b.nom)));
      return newLieu;
    } catch (err) {
      setCreateError('Erreur lors de la création du lieu');
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };


  const updateLieu = async (id: number, lieuData: CreateLieuRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      const updateData: UpdateLieuRequest = {
        id: id,
        nom: lieuData.nom
      };
      const updatedLieu = await lieuApi.update(updateData);
      setLieux(prev => prev.map(lieu => 
        lieu.id === id ? updatedLieu : lieu
      ).sort((a, b) => a.nom.localeCompare(b.nom)));
      return updatedLieu;
    } catch (err) {
      setCreateError('Erreur lors de la modification du lieu');
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };


  const deleteLieu = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) return;
    try {
      await lieuApi.delete(id);
      setLieux(prev => prev.filter(lieu => lieu.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      await loadLieux(query);
    } else {
      await loadLieux();
    }
  };

  const filteredLieux = lieux.filter(lieu => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return lieu.nom.toLowerCase().includes(searchLower);
  }).sort((a, b) => a.nom.localeCompare(b.nom));

  useEffect(() => {
    loadLieux();
  }, []);

  return {
    lieux: filteredLieux,
    searchTerm,
    loading,
    error,
    createLoading,
    createError,
    loadLieux,
    createLieu,
    updateLieu,
    deleteLieu,
    handleSearch,
    setCreateError
  };
}
