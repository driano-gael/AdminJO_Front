import { useState, useEffect } from 'react';
import { Offre } from '@/types/offre/offre';
import { OffreService } from '@/lib/api/services/offres/offreService';
import { Notification } from "@/types/common/notification";

export function useOffresManagement() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formNotification, setFormNotification] = useState<Notification | null>(null);

  // Charger les offres
  const loadOffres = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiOffres = await OffreService.getAll();
      setOffres(apiOffres);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des offres';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Créer une offre
  const createOffre = async (offreData: Offre) => {
    try {
      setFormLoading(true);
      setFormNotification(null);

      const newOffre = await OffreService.create(offreData);
      setOffres(prev => [...prev, newOffre]);
      setFormNotification({
        message: 'Offre créée avec succès',
        type: 'success'
      });
      return newOffre;
    } catch (err) {
      setFormNotification({
        message: "Erreur lors de la création de l'offre",
        type: 'error'
      });
      console.log(err)
    } finally {
      setFormLoading(false);
    }
  };

  // Modifier une offre
  const updateOffre = async (id: number, offreData: Offre) => {
    try {
      setFormLoading(true);
      setFormNotification(null);

      const updatedOffre = await OffreService.update({ ...offreData, id });
      setOffres(prev => prev.map(offre => offre.id === id ? updatedOffre : offre));
      setFormNotification({
        message: 'Offre modifiée avec succès',
        type: 'success'
      });
      return updatedOffre;
    } catch (err) {
      setFormNotification({
        message: "Erreur lors de la modification de l'offre",
        type: 'error'
      });
      console.log(err)
    } finally {
      setFormLoading(false);
    }
  };

  const deleteOffre = async (id: number) => {
    try {
      await OffreService.delete(id);
      setOffres(prev => prev.filter(offre => offre.id !== id));

      // Notification de succès pour suppression
      setFormNotification({
        message: 'Offre supprimée avec succès',
        type: 'success'
      });
    } catch (err) {
      setFormNotification({
        message: "Erreur lors de la suppression de l'offre",
        type: 'error'
      });
      console.log(err)
    }
  };

  useEffect(() => {
    loadOffres();
  }, []);

  return {
    offres,
    loading,
    error,
    formLoading,
    formNotification,
    createOffre,
    updateOffre,
    deleteOffre,
    setFormLoading,
    setFormNotification,
    loadOffres
  };
}
