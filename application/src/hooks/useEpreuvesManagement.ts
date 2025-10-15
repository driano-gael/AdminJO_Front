/**
 * Hook de gestion des épreuves sportives pour l'application AdminJO
 *
 * Ce hook centralise toute la logique de gestion des épreuves sportives des JO 2024.
 * Il fournit les opérations CRUD complètes, le filtrage par discipline, la recherche
 * textuelle et la synchronisation avec les référentiels de disciplines.
 *
 * @module useEpreuvesManagement
 * @category Hooks
 * @since 1.0.0
 * @author AdminJO Team
 */

import { useState, useEffect } from 'react';
import { epreuveApi } from '@/lib/api/services/evenementSports/epreuveService';
import { disciplineApi } from '@/lib/api/services/evenementSports/disciplineService';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Discipline } from '@/types/sportEvenement/discipline';
import { CreateEpreuveRequest, UpdateEpreuveRequest } from '@/lib/api/services/evenementSports/epreuveService';

/**
 * Hook useEpreuvesManagement - Gestion complète des épreuves sportives
 *
 * Ce hook fournit une interface unifiée pour la gestion des épreuves sportives
 * des JO 2024. Il combine les opérations CRUD, le filtrage par discipline,
 * la recherche textuelle et le tri hiérarchique pour une administration
 * efficace des épreuves olympiques.
 *
 * @name useEpreuvesManagement
 *
 * ## Fonctionnalités principales
 *
 * ### Gestion des données épreuves
 * - **Chargement automatique** : Récupération de toutes les épreuves et disciplines au montage
 * - **Tri hiérarchique** : Classement par discipline puis par nom d'épreuve
 * - **Gestion d'état** : États de chargement et d'erreur pour chaque opération
 * - **Synchronisation** : Mise à jour temps réel avec les données backend
 *
 * ### Système de filtrage avancé
 * - **Recherche textuelle** : Filtrage par libellé d'épreuve
 * - **Filtrage par discipline** : Restriction aux épreuves d'une discipline spécifique
 * - **Filtres combinés** : Application simultanée de recherche et filtrage disciplinaire
 * - **Recherche API** : Délégation optimisée au backend pour performance
 *
 * ### Opérations CRUD complètes
 * - **Création** : Ajout de nouvelles épreuves avec association discipline
 * - **Lecture** : Récupération et affichage des épreuves avec données discipline
 * - **Mise à jour** : Modification des épreuves existantes
 * - **Suppression** : Suppression sécurisée des épreuves
 * - **Tri automatique** : Maintien de l'ordre hiérarchique après chaque opération
 *
 * ## États gérés
 *
 * ### Données principales
 * - **epreuves** : Liste des épreuves triées par discipline et nom
 * - **disciplines** : Référentiel complet des disciplines pour association
 * - **searchTerm** : Terme de recherche textuelle actuel
 * - **selectedDisciplineId** : ID de la discipline sélectionnée pour filtrage
 *
 * ### États des opérations
 * - **loading** : Indicateur de chargement pour les opérations de lecture
 * - **error** : Messages d'erreur pour les opérations principales
 * - **createLoading** : État de chargement spécifique aux opérations CRUD
 * - **createError** : Messages d'erreur spécifiques aux opérations CRUD
 *
 * ## Flux de fonctionnement
 *
 * 1. **Initialisation** : Chargement des épreuves et disciplines avec tri hiérarchique
 * 2. **Filtrage** : Application des filtres de recherche et discipline côté serveur
 * 3. **CRUD** : Opérations avec mise à jour immédiate et recharge des disciplines
 * 4. **Tri** : Maintien automatique de l'ordre discipline > épreuve
 * 5. **Gestion d'erreurs** : Capture et affichage des erreurs pour chaque opération
 *
 * ## Intégrations API
 *
 * - **epreuveApi** : Service API principal pour les épreuves
 * - **disciplineApi** : Service API pour le référentiel des disciplines
 * - **Filtrage optimisé** : Délégation au backend avec paramètres combinés
 * - **Synchronisation** : Rechargement des disciplines après modifications d'épreuves
 *
 * @returns {Object} Interface complète de gestion des épreuves
 * @returns {Epreuve[]} returns.epreuves - Liste des épreuves triées hiérarchiquement
 * @returns {Discipline[]} returns.disciplines - Référentiel des disciplines
 * @returns {string} returns.searchTerm - Terme de recherche actuel
 * @returns {number | null} returns.selectedDisciplineId - ID discipline sélectionnée pour filtre
 * @returns {boolean} returns.loading - État de chargement principal
 * @returns {string | null} returns.error - Message d'erreur principal
 * @returns {boolean} returns.createLoading - État de chargement des opérations CRUD
 * @returns {string | null} returns.createError - Message d'erreur des opérations CRUD
 * @returns {Function} returns.setSearchTerm - Modifier le terme de recherche
 * @returns {Function} returns.setSelectedDisciplineId - Modifier le filtre discipline
 * @returns {Function} returns.setCreateError - Réinitialiser les erreurs de création
 * @returns {Function} returns.loadEpreuves - Recharger les épreuves avec filtres
 * @returns {Function} returns.loadDisciplines - Recharger le référentiel disciplines
 * @returns {Function} returns.createEpreuve - Créer une nouvelle épreuve
 * @returns {Function} returns.updateEpreuve - Modifier une épreuve
 * @returns {Function} returns.deleteEpreuve - Supprimer une épreuve
 * @returns {Function} returns.handleSearch - Effectuer une recherche
 * @returns {Function} returns.handleDisciplineFilter - Appliquer filtre discipline
 *
 * @see {@link epreuveApi} - Service API des épreuves
 * @see {@link disciplineApi} - Service API des disciplines
 * @see {@link Epreuve} - Interface TypeScript des données épreuve
 * @see {@link Discipline} - Interface TypeScript des données discipline
 * @see {@link CreateEpreuveRequest} - Interface de création d'épreuve
 * @see {@link UpdateEpreuveRequest} - Interface de mise à jour d'épreuve
 *
 * @example
 * ```tsx
 * function EpreuvesManagementPage() {
 *   const {
 *     epreuves,
 *     disciplines,
 *     loading,
 *     error,
 *     searchTerm,
 *     setSearchTerm,
 *     selectedDisciplineId,
 *     setSelectedDisciplineId,
 *     createEpreuve,
 *     updateEpreuve,
 *     deleteEpreuve,
 *     createLoading,
 *     createError
 *   } = useEpreuvesManagement();
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *
 *   return (
 *     <div>
 *       <SearchBar value={searchTerm} onChange={setSearchTerm} />
 *       <DisciplineFilter
 *         value={selectedDisciplineId}
 *         options={disciplines}
 *         onChange={setSelectedDisciplineId}
 *       />
 *       <CreateEpreuveForm
 *         disciplines={disciplines}
 *         onSubmit={createEpreuve}
 *         loading={createLoading}
 *         error={createError}
 *       />
 *       <EpreuvesList
 *         epreuves={epreuves}
 *         onUpdate={updateEpreuve}
 *         onDelete={deleteEpreuve}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
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
      const filters: Record<string, string | number> = {};
      
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
    } catch {
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

export default useEpreuvesManagement;
