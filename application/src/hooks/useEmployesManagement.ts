import { useState, useEffect } from 'react';
import { Employe, CreateEmployeRequest } from '@/types/employe/employe';
import { employeService } from '@/lib/api/services/employeService';

/**
 * Hook personnalisé pour la gestion des employés
 */
export function useEmployesManagement() {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Charge la liste des employés
   */
  const loadEmployes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeService.getEmployes();
      setEmployes(data);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des employés';
      setError(errorMessage);
      console.error('Erreur chargement employés:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crée un nouvel employé
   */
  const createEmploye = async (employeData: CreateEmployeRequest): Promise<boolean> => {
    try {
      setIsCreating(true);
      setError(null);

      await employeService.createEmploye(employeData);

      // Recharger la liste complète pour s'assurer d'avoir les vraies données de l'API
      // (y compris le statut is_active correct)
      await loadEmployes();

      return true;
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de l\'employé';
      setError(errorMessage);
      console.error('Erreur création employé:', err);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Change l'état actif/inactif d'un employé
   */
  const toggleEmployeActive = async (employeId: number) => {
    try {
      setError(null);

      // Mise à jour optimiste : on met à jour l'état local immédiatement
      setEmployes(prevEmployes =>
        prevEmployes.map(employe =>
          employe.id === employeId
            ? {
                ...employe,
                user: {
                  ...employe.user,
                  is_active: !employe.user.is_active
                }
              }
            : employe
        )
      );

      // Appel API
      await employeService.setUnsetEmployeActive(employeId);

    } catch (err: Error | unknown) {
      // En cas d'erreur, on recharge la liste pour récupérer l'état correct
      await loadEmployes();
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification du statut de l\'employé';
      setError(errorMessage);
      console.error('Erreur modification statut employé:', err);
    }
  };

  /**
   * Gère la recherche d'employés
   */
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  /**
   * Gère le filtre par statut
   */
  const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
  };

  /**
   * Filtre les employés selon le terme de recherche et le statut
   */
  const filteredEmployes = employes.filter(employe => {
    // Filtre par terme de recherche
    const matchesSearch = !searchTerm || (() => {
      const searchLower = searchTerm.toLowerCase();
      return (
        employe.nom.toLowerCase().includes(searchLower) ||
        employe.prenom.toLowerCase().includes(searchLower) ||
        employe.matricule.toLowerCase().includes(searchLower) ||
        employe.identifiant_telephone.includes(searchTerm) ||
        employe.user.email.toLowerCase().includes(searchLower)
      );
    })();

    // Filtre par statut
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && employe.user.is_active) ||
      (statusFilter === 'inactive' && !employe.user.is_active);

    return matchesSearch && matchesStatus;
  });

  // Chargement initial
  useEffect(() => {
    loadEmployes();
  }, []);

  return {
    employes: filteredEmployes,
    loading,
    error,
    searchTerm,
    statusFilter,
    isCreating,
    loadEmployes,
    createEmploye,
    handleSearch,
    handleStatusFilter,
    toggleEmployeActive
  };
}
