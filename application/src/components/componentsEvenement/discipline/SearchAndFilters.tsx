import {JSX} from "react";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearch: (query: string) => void;
}

/**
 * Composant SearchAndFilters - Interface de recherche des disciplines sportives AdminJO
 *
 * @name SearchAndFilters
 *
 * Ce composant fournit une interface de recherche dédiée pour filtrer les disciplines
 * sportives des Jeux Olympiques. Il présente un champ de saisie optimisé avec feedback
 * temps réel, intégration transparente avec le système de gestion d'état parent, et
 * design cohérent avec l'écosystème AdminJO. Bien que nommé "SearchAndFilters", il se
 * concentre actuellement sur la recherche textuelle pure avec possibilité d'extension
 * future pour des filtres avancés.
 *
 * ## Fonctionnalités de recherche implémentées
 *
 * ### Recherche textuelle temps réel
 * - **Input contrôlé** : Champ de saisie entièrement contrôlé par état parent
 * - **Feedback immédiat** : onChange déclenche recherche instantanée
 * - **Placeholder contextuel** : "Rechercher une discipline..." pour guidance
 * - **Synchronisation** : État searchTerm synchronisé avec hook parent
 * - **Performance** : Pas de debouncing, délégué au hook de gestion
 *
 *
 * ## Architecture et intégration
 *
 * ### Composant contrôlé simple
 * - **Props minimales** : searchTerm et onSearch pour interface claire
 * - **État externe** : Pas d'état interne, entièrement contrôlé
 * - **Callback direct** : onSearch(e.target.value) sans transformation
 * - **Type safety** : Interface SearchAndFiltersProps stricte
 * - **Responsabilité unique** : Focus exclusif sur l'interface de recherche
 *
 * ### Intégration avec DisciplinesManagement
 * - **Parent** : DisciplinesManagement fournit searchTerm et handleSearch
 * - **Hook backend** : useDisciplinesManagement gère logique recherche
 * - **Synchronisation** : État bidirectionnel entre input et hook
 * - **Position** : Placé avant DisciplinesTable dans layout principal
 *
 * ## Interactions et comportements
 *
 * ### Gestion de la saisie utilisateur
 * - **onChange handler** : (e) => onSearch(e.target.value) direct
 * - **Pas de debouncing** : Recherche immédiate à chaque caractère
 * - **Value controlled** : value={searchTerm} pour contrôle total
 * - **Pas de validation** : Toute saisie acceptée pour recherche libre
 * - **Clear naturel** : Effacement input vide automatiquement recherche
 *
 * ### États et feedback
 * - **Aucun état interne** : Composant stateless pour simplicité
 * - **Synchronisation** : Affichage toujours cohérent avec état parent
 *
 * ## Intégration système de recherche
 *
 * ### Flux de recherche complet
 * 1. **Saisie utilisateur** → onChange dans SearchAndFilters
 * 2. **Callback parent** → onSearch(query) vers DisciplinesManagement
 * 3. **Hook métier** → handleSearch() via useDisciplinesManagement
 * 4. **État mis à jour** → disciplines filtrées dans tableau
 *
 *
 * @param {SearchAndFiltersProps} props - Configuration du composant de recherche
 * @param {string} props.searchTerm - Terme de recherche actuel synchronisé
 * @param {Function} props.onSearch - Callback mise à jour terme de recherche
 *
 * @returns {JSX.Element} Interface de recherche avec champ de saisie optimisé
 *
 * @see {@link DisciplinesManagement} - Composant parent utilisant cette recherche
 * @see {@link useDisciplinesManagement} - Hook gérant la logique de recherche
 * @see {@link DisciplinesTable} - Table affichant résultats filtrés
 *
 */
export function SearchAndFilters({ searchTerm, onSearch }: SearchAndFiltersProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Rechercher une discipline..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
export default SearchAndFilters;
