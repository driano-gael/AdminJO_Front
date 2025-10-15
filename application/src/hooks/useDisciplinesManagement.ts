/**
 * Hook de gestion des disciplines sportives pour l'application AdminJO
 *
 * Ce hook centralise toute la logique de gestion des disciplines sportives des JO 2024.
 * Il fournit les opérations CRUD complètes, la recherche textuelle et la gestion
 * des états pour l'administration des disciplines olympiques.
 *
 * @module useDisciplinesManagement
 * @category Hooks
 * @since 1.0.0
 * @author AdminJO Team
 */

import { useState, useEffect } from 'react';
import { disciplineApi } from '@/lib/api/services/evenementSports/disciplineService';
import { Discipline } from '@/types/sportEvenement/discipline';
import { CreateDisciplineRequest, UpdateDisciplineRequest } from '@/lib/api/services/evenementSports/disciplineService';

/**
 * Hook useDisciplinesManagement - Gestion complète des disciplines sportives
 *
 * Ce hook fournit une interface unifiée pour la gestion des disciplines sportives
 * des JO 2024. Il combine les opérations CRUD, la recherche textuelle et le tri
 * automatique pour une administration efficace des disciplines olympiques.
 *
 * @name useDisciplinesManagement
 *
 * ## Fonctionnalités principales
 *
 * ### Gestion des données disciplines
 * - **Chargement automatique** : Récupération de toutes les disciplines au montage
 * - **Tri alphabétique** : Classement automatique par nom de discipline
 * - **Gestion d'état** : États de chargement et d'erreur pour chaque opération
 * - **Synchronisation** : Mise à jour temps réel avec les données backend
 *
 * ### Système de recherche
 * - **Recherche textuelle** : Filtrage par nom de discipline
 * - **Recherche API** : Délégation de la recherche au backend pour optimisation
 * - **Mise à jour dynamique** : Actualisation automatique lors des changements
 *
 * ### Opérations CRUD complètes
 * - **Création** : Ajout de nouvelles disciplines avec validation
 * - **Lecture** : Récupération et affichage des disciplines
 * - **Mise à jour** : Modification des disciplines existantes
 * - **Suppression** : Suppression sécurisée des disciplines
 * - **Tri automatique** : Maintien de l'ordre alphabétique après chaque opération
 *
 * ## États gérés
 *
 * ### Données principales
 * - **disciplines** : Liste des disciplines triées alphabétiquement
 * - **searchTerm** : Terme de recherche textuelle actuel
 *
 * ### États des opérations
 * - **loading** : Indicateur de chargement pour les opérations de lecture
 * - **error** : Messages d'erreur pour les opérations principales
 * - **createLoading** : État de chargement spécifique aux opérations de création/modification
 * - **createError** : Messages d'erreur spécifiques aux opérations de création/modification
 *
 * ## Flux de fonctionnement
 *
 * 1. **Initialisation** : Chargement de toutes les disciplines avec tri alphabétique
 * 2. **Recherche** : Filtrage côté serveur avec mise à jour de la liste
 * 3. **CRUD** : Opérations avec mise à jour immédiate de l'état local
 * 4. **Tri** : Maintien automatique de l'ordre alphabétique
 * 5. **Gestion d'erreurs** : Capture et affichage des erreurs pour chaque opération
 *
 * ## Intégrations API
 *
 * - **disciplineApi** : Service API principal pour les disciplines
 * - **Recherche optimisée** : Délégation au backend avec paramètres de filtre
 * - **Validation** : Contrôles de cohérence avec les données serveur
 *
 * @returns {Object} Interface complète de gestion des disciplines
 * @returns {Discipline[]} returns.disciplines - Liste des disciplines triées
 * @returns {string} returns.searchTerm - Terme de recherche actuel
 * @returns {boolean} returns.loading - État de chargement principal
 * @returns {string | null} returns.error - Message d'erreur principal
 * @returns {boolean} returns.createLoading - État de chargement des opérations CRUD
 * @returns {string | null} returns.createError - Message d'erreur des opérations CRUD
 * @returns {Function} returns.setSearchTerm - Modifier le terme de recherche
 * @returns {Function} returns.setCreateError - Réinitialiser les erreurs de création
 * @returns {Function} returns.loadDisciplines - Recharger les disciplines
 * @returns {Function} returns.createDiscipline - Créer une nouvelle discipline
 * @returns {Function} returns.updateDiscipline - Modifier une discipline
 * @returns {Function} returns.deleteDiscipline - Supprimer une discipline
 * @returns {Function} returns.handleSearch - Effectuer une recherche
 *
 * @see {@link disciplineApi} - Service API des disciplines
 * @see {@link Discipline} - Interface TypeScript des données discipline
 * @see {@link CreateDisciplineRequest} - Interface de création de discipline
 * @see {@link UpdateDisciplineRequest} - Interface de mise à jour de discipline
 *
 * @example
 * ```tsx
 * function DisciplinesManagementPage() {
 *   const {
 *     disciplines,
 *     loading,
 *     error,
 *     searchTerm,
 *     setSearchTerm,
 *     createDiscipline,
 *     updateDiscipline,
 *     deleteDiscipline,
 *     createLoading,
 *     createError
 *   } = useDisciplinesManagement();
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *
 *   return (
 *     <div>
 *       <SearchBar value={searchTerm} onChange={setSearchTerm} />
 *       <CreateDisciplineForm
 *         onSubmit={createDiscipline}
 *         loading={createLoading}
 *         error={createError}
 *       />
 *       <DisciplinesList
 *         disciplines={disciplines}
 *         onUpdate={updateDiscipline}
 *         onDelete={deleteDiscipline}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
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

export default useDisciplinesManagement;
