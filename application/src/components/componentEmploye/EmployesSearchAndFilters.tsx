'use client';

/**
 * Composant EmployesSearchAndFilters - Interface de recherche et filtrage des employés AdminJO
 *
 * @name EmployesSearchAndFilters
 *
 * Ce composant fournit une interface complète de recherche textuelle et de filtrage par statut
 * pour la gestion des employés. Il s'agit d'un composant contrôlé qui gère la saisie utilisateur
 * et les sélections de filtre via des callbacks vers le composant parent. Version spécialisée
 * pour les employés avec critères de recherche étendus incluant le matricule.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Recherche textuelle multifonctions
 * - **Champ de recherche** : Input avec placeholder explicite et icône de loupe
 * - **Recherche étendue** : Nom, prénom, matricule, téléphone ou email
 * - **Temps réel** : Mise à jour instantanée lors de la saisie
 *
 * ## Gestion des états
 *
 * ### Composant contrôlé
 * - **Search term** : Valeur contrôlée par le parent
 * - **Status filter** : Sélection gérée par le parent
 * - **Callbacks** : Remontée des changements via props
 * - **Réactivité** : Mise à jour immédiate sur interaction
 *
 * ### Types de filtres employé
 * - **'all'** : Affiche tous les employés sans distinction
 * - **'active'** : Filtre sur employe.user.is_active = true
 * - **'inactive'** : Filtre sur employe.user.is_active = false
 * - **Union type** : Typage strict pour éviter les erreurs
 * - **Cohérence** : Même logique que les autres entités
 *
 * ## Interactions utilisateur
 *
 * ### Saisie de recherche employé
 * - **Event handling** : onChange avec e.target.value
 * - **Callback immédiat** : onSearchChange appelé à chaque keystroke
 * - **Critères étendus** : Recherche dans nom, prénom, matricule, téléphone, email
 * - **Debouncing** : Non implémenté (géré par le parent si nécessaire)
 * - **Vide autorisé** : Possibilité de vider la recherche
 *
 * ### Sélection de filtre statut
 * - **Click handlers** : onClick sur chaque bouton de statut
 * - **État exclusif** : Un seul filtre actif à la fois
 * - **Feedback visuel** : Changement immédiat d'apparence
 * - **Hover effects** : Amélioration de l'UX sur survol
 * - **Logique métier** : Adaptation aux spécificités employé
 *
 * @param {Props} props - Configuration du composant de recherche et filtre employés
 * @param {string} props.searchTerm - Terme de recherche actuel (contrôlé)
 * @param {Function} props.onSearchChange - Callback appelé lors du changement de recherche
 * @param {'all' | 'active' | 'inactive'} props.statusFilter - Filtre de statut actuel
 * @param {Function} props.onStatusFilterChange - Callback pour changement de filtre statut
 *
 * @returns {JSX.Element} Interface de recherche et filtrage avec layout responsive pour employés
 *
 * @see {@link EmployesManagement} - Composant parent gérant l'état et la logique
 * @see {@link EmployesTable} - Composant affichant les résultats filtrés
 * @see {@link Employe} - Type des données employé recherchées et filtrées
 *
 */

interface Props {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive') => void;
}

export function EmployesSearchAndFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Barre de recherche */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Rechercher par nom, prénom, matricule, téléphone ou email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Filtre par statut */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Statut:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => onStatusFilterChange('active')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                statusFilter === 'active'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Actifs
            </button>
            <button
              onClick={() => onStatusFilterChange('inactive')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Inactifs
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Recherche en temps réel</span>
        </div>
      </div>
    </div>
  );
}
export default EmployesSearchAndFilters;
