import { Epreuve } from '@/types/sportEvenement/epreuve';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearch: (query: string) => void;
  epreuves: Epreuve[];
  loading?: boolean;
}

export default function SearchAndFilters({ searchTerm, onSearch, epreuves, loading = false }: SearchAndFiltersProps) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-4">
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              disabled={loading}
            >
              <option value="">
                {loading ? 'Chargement...' : 'Toutes les épreuves'}
              </option>
              {epreuves.map(epreuve => (
                <option key={epreuve.id} value={epreuve.libelle}>
                  {epreuve.libelle}
                </option>
              ))}
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Tous les statuts</option>
              <option value="upcoming">À venir</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
        </div>
      </div>
    );
}
