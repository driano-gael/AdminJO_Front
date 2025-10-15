/**
 * Hook de gestion des lieux olympiques pour l'application AdminJO
 *
 * Ce hook centralise toute la logique de gestion des lieux olympiques des JO 2024.
 * Il fournit les opérations CRUD complètes, la recherche textuelle et la gestion
 * des états pour l'administration des sites olympiques.
 *
 * @module useLieuxManagement
 * @category Hooks
 * @since 1.0.0
 * @author AdminJO Team
 */

import { useState, useEffect } from 'react';
import { lieuApi } from '@/lib/api/services/evenementSports/lieuService';
import { Lieu } from '@/types/sportEvenement/lieu';
import { CreateLieuRequest, UpdateLieuRequest } from '@/lib/api/services/evenementSports/lieuService';

/**
 * Hook useLieuxManagement - Gestion complète des lieux olympiques
 *
 * Ce hook fournit une interface unifiée pour la gestion des lieux olympiques
 * des JO 2024. Il combine les opérations CRUD, la recherche textuelle et le tri
 * automatique pour une administration efficace des sites olympiques.
 *
 * @name useLieuxManagement
 *
 * ## Fonctionnalités principales
 *
 * ### Gestion des données lieux
 * - **Chargement automatique** : Récupération de tous les lieux olympiques au montage
 * - **Tri alphabétique** : Classement automatique par nom de lieu
 * - **Gestion d'état** : États de chargement et d'erreur pour chaque opération
 * - **Synchronisation** : Mise à jour temps réel avec les données backend
 *
 * ### Système de recherche
 * - **Recherche textuelle** : Filtrage par nom de lieu
 * - **Recherche API** : Délégation de la recherche au backend pour optimisation
 * - **Mise à jour dynamique** : Actualisation automatique lors des changements
 *
 * ### Opérations CRUD complètes
 * - **Création** : Ajout de nouveaux lieux olympiques avec validation
 * - **Lecture** : Récupération et affichage des lieux
 * - **Mise à jour** : Modification des lieux existants
 * - **Suppression** : Suppression sécurisée des lieux
 * - **Tri automatique** : Maintien de l'ordre alphabétique après chaque opération
 *
 * ## États gérés
 *
 * ### Données principales
 * - **lieux** : Liste des lieux olympiques triés alphabétiquement
 * - **searchTerm** : Terme de recherche textuelle actuel
 *
 * ### États des opérations
 * - **loading** : Indicateur de chargement pour les opérations de lecture
 * - **error** : Messages d'erreur pour les opérations principales
 * - **createLoading** : État de chargement spécifique aux opérations CRUD
 * - **createError** : Messages d'erreur spécifiques aux opérations CRUD
 *
 * ## Flux de fonctionnement
 *
 * 1. **Initialisation** : Chargement de tous les lieux avec tri alphabétique
 * 2. **Recherche** : Filtrage côté serveur avec mise à jour de la liste
 * 3. **CRUD** : Opérations avec mise à jour immédiate de l'état local
 * 4. **Tri** : Maintien automatique de l'ordre alphabétique
 * 5. **Gestion d'erreurs** : Capture et affichage des erreurs pour chaque opération
 *
 * ## Intégrations API
 *
 * - **lieuApi** : Service API principal pour les lieux olympiques
 * - **Recherche optimisée** : Délégation au backend avec paramètres de filtre
 * - **Validation** : Contrôles de cohérence avec les données serveur
 *
 * @returns {Object} Interface complète de gestion des lieux
 * @returns {Lieu[]} returns.lieux - Liste des lieux triés alphabétiquement
 * @returns {string} returns.searchTerm - Terme de recherche actuel
 * @returns {boolean} returns.loading - État de chargement principal
 * @returns {string | null} returns.error - Message d'erreur principal
 * @returns {boolean} returns.createLoading - État de chargement des opérations CRUD
 * @returns {string | null} returns.createError - Message d'erreur des opérations CRUD
 * @returns {Function} returns.setSearchTerm - Modifier le terme de recherche
 * @returns {Function} returns.setCreateError - Réinitialiser les erreurs de création
 * @returns {Function} returns.loadLieux - Recharger les lieux
 * @returns {Function} returns.createLieu - Créer un nouveau lieu
 * @returns {Function} returns.updateLieu - Modifier un lieu
 * @returns {Function} returns.deleteLieu - Supprimer un lieu
 * @returns {Function} returns.handleSearch - Effectuer une recherche
 *
 * @see {@link lieuApi} - Service API des lieux olympiques
 * @see {@link Lieu} - Interface TypeScript des données lieu
 * @see {@link CreateLieuRequest} - Interface de création de lieu
 * @see {@link UpdateLieuRequest} - Interface de mise à jour de lieu
 *
 * @example
 * ```tsx
 * function LieuxManagementPage() {
 *   const {
 *     lieux,
 *     loading,
 *     error,
 *     searchTerm,
 *     setSearchTerm,
 *     createLieu,
 *     updateLieu,
 *     deleteLieu,
 *     createLoading,
 *     createError
 *   } = useLieuxManagement();
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *
 *   return (
 *     <div>
 *       <SearchBar value={searchTerm} onChange={setSearchTerm} />
 *       <CreateLieuForm
 *         onSubmit={createLieu}
 *         loading={createLoading}
 *         error={createError}
 *       />
 *       <LieuxList
 *         lieux={lieux}
 *         onUpdate={updateLieu}
 *         onDelete={deleteLieu}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
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

export default useLieuxManagement;
