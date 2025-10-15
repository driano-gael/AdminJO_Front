/**
 * Composant SearchAndFilters - Barre de recherche des lieux olympiques AdminJO
 *
 * Ce composant fournit l'interface de recherche pour filtrer les lieux olympiques
 * des Jeux Olympiques 2024. Il offre une barre de recherche en temps réel permettant
 * aux administrateurs de localiser rapidement des établissements sportifs spécifiques
 * parmi la liste complète des lieux olympiques (Stade de France, Centre Aquatique,
 * Arena Bercy, etc.). Conçu pour l'efficacité opérationnelle, il suit les standards
 * AdminJO avec feedback visuel immédiat, états de focus optimisés, et intégration
 * harmonieuse dans l'écosystème de gestion des infrastructures olympiques.
 *
 * ## Fonctionnalités de recherche réellement implémentées
 *
 * ### Barre de recherche temps réel lieux olympiques
 * - **Input principal** : Champ texte avec placeholder "Rechercher un lieu..."
 * - **Recherche instantanée** : onChange déclenche onSearch(e.target.value)
 * - **Valeur contrôlée** : value={searchTerm} pour synchronisation état
 *
 *
 * ## Architecture et intégration système lieux
 *
 * ### Gestion d'état contrôlé
 * - **Props descendantes** : searchTerm depuis composant parent
 * - **Callbacks ascendants** : onSearch vers LieuxManagement
 * - **Synchronisation** : Valeur input synchronisée avec état global
 * - **Réactivité** : Re-render automatique sur changement searchTerm
 * - **Pas d'état local** : Composant entièrement contrôlé parent
 * - **Performance** : onChange directe sans state intermédiaire
 * - **Consistance** : Source de vérité unique dans parent
 *
 * @param {SearchAndFiltersProps} props - Propriétés composant recherche lieux
 * @param {string} props.searchTerm - Terme recherche actuel synchronisé
 * @param {function} props.onSearch - Callback changement terme recherche
 *
 * @returns {JSX.Element} Interface recherche lieux olympiques temps réel
 *
 * @see {@link LieuxManagement} - Composant parent orchestrateur
 * @see {@link LieuxTable} - Composant tableau utilisant filtrage
 *
 */
interface SearchAndFiltersProps {
  searchTerm: string;
  onSearch: (query: string) => void;
}

export function SearchAndFilters({ searchTerm, onSearch }: SearchAndFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Rechercher un lieu..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
export default SearchAndFilters;
