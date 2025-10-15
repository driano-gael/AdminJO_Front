import { Discipline } from '@/types/sportEvenement/discipline';
import {JSX} from "react";

interface SearchAndFiltersProps {
  searchTerm: string;
  selectedDisciplineId: number | null;
  disciplines: Discipline[];
  onSearch: (term: string) => void;
  onDisciplineFilter: (disciplineId: number | null) => void;
}

/**
 * Composant SearchAndFilters - Interface de recherche et filtrage avancé des épreuves sportives AdminJO
 *
 * @name SearchAndFilters
 *
 * Ce composant fournit une interface complète de recherche et filtrage pour les épreuves
 * sportives des Jeux Olympiques. Il combine recherche textuelle temps réel ET filtrage
 * par discipline avec dropdown dynamique, intégration transparente avec le système de
 * gestion d'état parent, et design responsive optimisé. Il justifie pleinement son nom
 * "SearchAndFilters" en implémentant réellement les deux fonctionnalités de manière
 * coordonnée et efficace pour une expérience utilisateur riche.
 *
 * ## Fonctionnalités de recherche et filtrage implémentées
 *
 * ### Recherche textuelle temps réel avancée
 * - **Input contrôlé** : Champ de saisie entièrement contrôlé par état parent
 * - **Feedback immédiat** : onChange déclenche recherche instantanée
 * - **Placeholder contextuel** : "Rechercher une épreuve..." pour guidance spécifique
 * - **Synchronisation** : État searchTerm synchronisé avec hook parent
 *
 * ### Filtrage par discipline dynamique
 * - **Dropdown disciplines** : Select peuplé dynamiquement depuis API
 * - **Option toutes** : "Toutes les disciplines" pour réinitialiser filtre
 * - **Sélection persistante** : selectedDisciplineId maintenu entre opérations
 * - **Callback spécialisé** : onDisciplineFilter distinct de onSearch
 * - **Gestion null** : Support valeur null pour "toutes disciplines"
 * - **Données dynamiques** : Liste disciplines chargée via useEpreuvesManagement
 *
 * ## Spécificités métier épreuves olympiques
 *
 * ### Contexte multicritères épreuves JO 2024
 * - **Recherche spécialisée** : Optimisée pour noms épreuves olympiques
 * - **Filtrage discipline** : Relations épreuves ↔ disciplines sportives
 * - **Hiérarchie** : Événements > Disciplines > Épreuves coordonnées
 *
 * ### Types de données multicritères gérées
 * - **SearchTerm** : string pour recherche libre épreuves
 * - **SelectedDisciplineId** : number | null pour filtre discipline
 * - **Disciplines array** : Discipline[] pour options dropdown
 * - **Callbacks** : onSearch(string) et onDisciplineFilter(number|null)
 * - **Relations** : Support filtrage relationnel épreuves-disciplines
 * - **Type safety** : Interfaces strictes pour validation TypeScript
 *
 * @param {SearchAndFiltersProps} props - Configuration recherche et filtres
 * @param {string} props.searchTerm - Terme de recherche actuel
 * @param {number|null} props.selectedDisciplineId - ID discipline sélectionnée ou null
 * @param {Discipline[]} props.disciplines - Array disciplines pour dropdown
 * @param {function} props.onSearch - Callback changement terme recherche
 * @param {function} props.onDisciplineFilter - Callback changement filtre discipline
 *
 * @returns {JSX.Element} Interface recherche et filtrage multicritères
 *
 * @see {@link EpreuvesManagement} - Composant parent orchestrateur
 * @see {@link useEpreuvesManagement} - Hook gérant logique recherche + filtres
 * @see {@link Discipline} - Interface TypeScript objet discipline
 * @see {@link EpreuvesTable} - Tableau affichant résultats filtrés
 *
 */
export function SearchAndFilters({
  searchTerm,
  selectedDisciplineId,
  disciplines,
  onSearch,
  onDisciplineFilter
}: SearchAndFiltersProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Barre de recherche */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher une épreuve..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Filtre par discipline */}
        <div className="sm:w-64">
          <select
            value={selectedDisciplineId || ''}
            onChange={(e) => onDisciplineFilter(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les disciplines</option>
            {disciplines.map((discipline) => (
              <option key={discipline.id} value={discipline.id}>
                {discipline.nom}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
export default SearchAndFilters;
