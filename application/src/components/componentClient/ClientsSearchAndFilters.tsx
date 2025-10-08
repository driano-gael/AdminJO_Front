'use client';

interface Props {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

/**
 * Composant de recherche et filtres pour les clients
 */
export default function ClientsSearchAndFilters({
  searchTerm,
  onSearchChange
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
              placeholder="Rechercher par nom, prénom ou téléphone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
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
