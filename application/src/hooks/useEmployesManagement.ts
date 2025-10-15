/**
 * Hook de gestion des employés pour l'application AdminJO
 *
 * Ce hook centralise toute la logique de gestion des employés dans l'application
 * d'administration des JO 2024. Il fournit les opérations CRUD, le filtrage,
 * la recherche et la gestion des états d'activation des comptes employés.
 *
 * @module useEmployesManagement
 * @category Hooks
 * @since 1.0.0
 * @author AdminJO Team
 */

import { useState, useEffect } from 'react';
import { Employe, CreateEmployeRequest } from '@/types/employe/employe';
import { employeService } from '@/lib/api/services/employeService';

/**
 * Hook useEmployesManagement - Gestion complète des employés
 *
 * Ce hook fournit une interface unifiée pour la gestion des employés de l'application
 * AdminJO. Il combine les opérations de création, lecture, filtrage, recherche et
 * modification des états d'activation des comptes employés.
 *
 * @name useEmployesManagement
 *
 * ## Fonctionnalités principales
 *
 * ### Gestion des données employés
 * - **Chargement automatique** : Récupération de tous les employés au montage
 * - **Gestion d'état** : États de chargement et d'erreur pour les opérations
 * - **Mise à jour synchrone** : Rechargement complet après création pour cohérence
 * - **Synchronisation** : Maintien de la cohérence avec les données backend
 *
 * ### Système de filtrage et recherche
 * - **Recherche textuelle** : Filtrage par nom, prénom, email ou téléphone
 * - **Filtrage par statut** : Employés actifs, inactifs ou tous
 * - **Filtres combinés** : Application simultanée de plusieurs critères
 * - **Mise à jour temps réel** : Filtrage immédiat lors des changements
 *
 * ### Gestion des opérations CRUD
 * - **Création d'employés** : Ajout de nouveaux employés avec validation
 * - **Lecture des données** : Récupération et affichage des employés
 * - **Gestion des statuts** : Activation/désactivation des comptes
 * - **États de création** : Indicateurs spécifiques pour les opérations de création
 *
 * ## États gérés
 *
 * ### Données principales
 * - **employes** : Liste complète des employés avec informations utilisateur
 * - **loading** : État de chargement pour les opérations principales
 * - **error** : Messages d'erreur pour les opérations échouées
 * - **isCreating** : État de chargement spécifique à la création
 *
 * ### Filtres et recherche
 * - **searchTerm** : Terme de recherche textuelle actuel
 * - **statusFilter** : Filtre par statut ('all', 'active', 'inactive')
 *
 * ## Opérations disponibles
 *
 * ### Chargement des données
 * - **loadEmployes()** : Récupération de tous les employés depuis l'API
 * - **Gestion d'erreurs** : Capture et affichage des erreurs de chargement
 * - **États de chargement** : Indicateurs visuels pendant les opérations
 *
 * ### Création d'employés
 * - **createEmploye()** : Création de nouveaux employés avec rechargement
 * - **Validation** : Contrôle des données avant envoi à l'API
 * - **Feedback** : Retour booléen de succès/échec de l'opération
 *
 * ### Modification des statuts
 * - **toggleEmployeActive()** : Basculer l'état actif/inactif d'un employé
 * - **Mise à jour optimiste** : Changement immédiat avant confirmation serveur
 * - **Rollback** : Restauration en cas d'échec de l'opération
 *
 * ## Intégrations
 *
 * - **employeService** : Service API pour les opérations sur les employés
 * - **Employe type** : Interface TypeScript pour la structure des données
 * - **CreateEmployeRequest** : Interface pour les données de création
 *
 * @returns {Object} Interface complète de gestion des employés
 * @returns {Employe[]} returns.employes - Liste des employés filtrés
 * @returns {boolean} returns.loading - État de chargement principal
 * @returns {string | null} returns.error - Message d'erreur
 * @returns {string} returns.searchTerm - Terme de recherche
 * @returns {string} returns.statusFilter - Filtre de statut actuel
 * @returns {boolean} returns.isCreating - État de création en cours
 * @returns {Function} returns.setSearchTerm - Modifier le terme de recherche
 * @returns {Function} returns.setStatusFilter - Modifier le filtre de statut
 * @returns {Function} returns.loadEmployes - Recharger les employés
 * @returns {Function} returns.createEmploye - Créer un nouvel employé
 * @returns {Function} returns.toggleEmployeActive - Basculer l'état d'un employé
 * @returns {Function} returns.getFilteredEmployes - Obtenir les employés filtrés
 *
 * @see {@link employeService} - Service API des employés
 * @see {@link Employe} - Interface TypeScript des données employé
 * @see {@link CreateEmployeRequest} - Interface de création d'employé
 *
 * @example
 * ```tsx
 * function EmployesManagementPage() {
 *   const {
 *     employes,
 *     loading,
 *     error,
 *     searchTerm,
 *     setSearchTerm,
 *     statusFilter,
 *     setStatusFilter,
 *     createEmploye,
 *     toggleEmployeActive,
 *     isCreating
 *   } = useEmployesManagement();
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *
 *   return (
 *     <div>
 *       <SearchBar value={searchTerm} onChange={setSearchTerm} />
 *       <StatusFilter value={statusFilter} onChange={setStatusFilter} />
 *       <CreateEmployeForm
 *         onSubmit={createEmploye}
 *         loading={isCreating}
 *       />
 *       <EmployesList
 *         employes={employes}
 *         onToggleActive={toggleEmployeActive}
 *       />
 *     </div>
 *   );
 * }
 * ```
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

export default useEmployesManagement;
