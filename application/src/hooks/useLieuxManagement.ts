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

  /**
   * Fonction pour charger les lieux depuis l'API avec recherche
   */
  const loadLieux = async (searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiLieux = await lieuApi.getAll(searchQuery ? {
        nom: searchQuery
      } : undefined);
      
      setLieux(apiLieux);
      console.log('Lieux chargés depuis l\'API:', apiLieux);
    } catch (err) {
      setError('Erreur lors du chargement des lieux');
      console.error('Erreur chargement lieux:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction pour créer un nouveau lieu
   */
  const createLieu = async (lieuData: CreateLieuRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      
      const newLieu = await lieuApi.create(lieuData);
      
      setLieux(prev => [...prev, newLieu]);
      console.log('Lieu créé avec succès:', newLieu);
      return newLieu;
    } catch (err) {
      setCreateError('Erreur lors de la création du lieu');
      console.error('Erreur création lieu:', err);
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };

  /**
   * Fonction pour modifier un lieu existant
   */
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
      ));
      console.log('Lieu modifié avec succès:', updatedLieu);
      return updatedLieu;
    } catch (err) {
      setCreateError('Erreur lors de la modification du lieu');
      console.error('Erreur modification lieu:', err);
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };

  /**
   * Fonction pour supprimer un lieu
   */
  const deleteLieu = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) return;
    
    try {
      await lieuApi.delete(id);
      setLieux(prev => prev.filter(lieu => lieu.id !== id));
      console.log('Lieu supprimé avec succès:', id);
    } catch (err) {
      console.error('Erreur suppression lieu:', err);
      throw err;
    }
  };

  /**
   * Fonction pour effectuer une recherche
   */
  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      await loadLieux(query);
    } else {
      await loadLieux();
    }
  };

  // Filtrer les lieux affichés
  const filteredLieux = lieux.filter(lieu => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return lieu.nom.toLowerCase().includes(searchLower);
  });

  // Charger les données au montage
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
