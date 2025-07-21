import { Discipline } from '@/types/sportEvenement/discipline';

interface SearchAndFiltersProps {
  searchTerm: string;
  selectedDisciplineId: number | null;
  disciplines: Discipline[];
  onSearch: (query: string) => void;
  onDisciplineFilter: (disciplineId: number | null) => void;
}

export default function SearchAndFilters({ 
  searchTerm, 
  selectedDisciplineId, 
  disciplines, 
  onSearch, 
  onDisciplineFilter 
}: SearchAndFiltersProps) {
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
