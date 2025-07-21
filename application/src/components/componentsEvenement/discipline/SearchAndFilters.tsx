interface SearchAndFiltersProps {
  searchTerm: string;
  onSearch: (query: string) => void;
}

export default function SearchAndFilters({ searchTerm, onSearch }: SearchAndFiltersProps) {
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
