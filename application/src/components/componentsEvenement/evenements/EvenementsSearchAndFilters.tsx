import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Lieu } from '@/types/sportEvenement/lieu';
import { Discipline } from '@/types/sportEvenement/discipline';
import { ExtendEvenement } from '@/types/sportEvenement/evenement';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearch: (query: string) => void;
  epreuves: Epreuve[];
  lieux: Lieu[];
  disciplines: Discipline[];
  events: ExtendEvenement[];
  loading?: boolean;
  selectedLieu?: number;
  selectedDiscipline?: number;
  selectedEpreuve?: number;
  selectedStatut?: string;
  dateDebut?: string;
  dateFin?: string;
  onLieuChange: (lieuId: number | undefined) => void;
  onDisciplineChange: (disciplineId: number | undefined) => void;
  onEpreuveChange: (epreuveId: number | undefined) => void;
  onStatutChange: (statut: string | undefined) => void;
  onDateDebutChange: (date: string | undefined) => void;
  onDateFinChange: (date: string | undefined) => void;
}

export default function SearchAndFilters({ 
  searchTerm, 
  onSearch, 
  epreuves, 
  lieux, 
  disciplines, 
  events,
  loading = false,
  selectedLieu,
  selectedDiscipline,
  selectedEpreuve,
  selectedStatut,
  dateDebut,
  dateFin,
  onLieuChange,
  onDisciplineChange,
  onEpreuveChange,
  onStatutChange,
  onDateDebutChange,
  onDateFinChange
}: SearchAndFiltersProps) {
  
  // Logique de filtrage en cascade
  
  // 1. Filtrer les événements par lieu si sélectionné
  const eventsFilteredByLieu = selectedLieu 
    ? events.filter(event => event.lieu.id === selectedLieu)
    : events;

  // 2. Obtenir les disciplines disponibles selon le lieu sélectionné
  const disciplinesDisponibles = selectedLieu
    ? Array.from(new Set(
        eventsFilteredByLieu
          .flatMap(event => event.epreuves)
          .map(epreuve => epreuve.discipline)
          .filter(Boolean)
          .map(d => d!.id)
      )).map(id => disciplines.find(d => d.id === id)).filter(Boolean) as Discipline[]
    : disciplines;

  // 3. Obtenir les épreuves disponibles selon lieu et discipline sélectionnés
  const epreuvesDisponibles = (() => {
    let filteredEvents = eventsFilteredByLieu;
    
    if (selectedDiscipline) {
      filteredEvents = filteredEvents.filter(event => 
        event.epreuves.some(epreuve => epreuve.discipline?.id === selectedDiscipline)
      );
    }
    
    const uniqueEpreuves = Array.from(new Set(
      filteredEvents
        .flatMap(event => event.epreuves)
        .filter(epreuve => !selectedDiscipline || epreuve.discipline?.id === selectedDiscipline)
        .map(e => e.id)
    )).map(id => epreuves.find(e => e.id === id)).filter(Boolean) as Epreuve[];

    // Tri par discipline (ordre alphabétique) puis par épreuve (ordre alphabétique)
    return uniqueEpreuves.sort((a, b) => {
      const disciplineA = a.discipline?.nom || '';
      const disciplineB = b.discipline?.nom || '';
      
      // D'abord par discipline
      if (disciplineA !== disciplineB) {
        return disciplineA.localeCompare(disciplineB);
      }
      
      // Puis par libellé d'épreuve
      return a.libelle.localeCompare(b.libelle);
    });
  })();

  // 4. Obtenir les statuts disponibles selon les filtres
  const statutsDisponibles = (() => {
    let filteredEvents = eventsFilteredByLieu;
    
    if (selectedDiscipline) {
      filteredEvents = filteredEvents.filter(event => 
        event.epreuves.some(epreuve => epreuve.discipline?.id === selectedDiscipline)
      );
    }
    
    if (selectedEpreuve) {
      filteredEvents = filteredEvents.filter(event => 
        event.epreuves.some(epreuve => epreuve.id === selectedEpreuve)
      );
    }
    
    return Array.from(new Set(filteredEvents.map(event => event.status).filter(Boolean)));
  })();

  // Dates par défaut pour les JO de Paris 2024
  const defaultStartDate = '2024-07-01';
  const defaultEndDate = '2024-09-01';

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="space-y-4">
          {/* Barre de recherche */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Filtres par date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                value={dateDebut || defaultStartDate}
                onChange={(e) => onDateDebutChange(e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                value={dateFin || defaultEndDate}
                onChange={(e) => onDateFinChange(e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
              />
            </div>
          </div>
          
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Filtre par lieu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
              <select 
                value={selectedLieu || ''}
                onChange={(e) => {
                  const lieuId = e.target.value ? Number(e.target.value) : undefined;
                  onLieuChange(lieuId);
                  // Réinitialiser les filtres dépendants
                  if (lieuId !== selectedLieu) {
                    onDisciplineChange(undefined);
                    onEpreuveChange(undefined);
                    onStatutChange(undefined);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Chargement...' : 'Tous les lieux'}
                </option>
                {lieux.map(lieu => (
                  <option key={lieu.id} value={lieu.id}>
                    {lieu.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par discipline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discipline {selectedLieu && `(${disciplinesDisponibles.length} disponibles)`}
              </label>
              <select 
                value={selectedDiscipline || ''}
                onChange={(e) => {
                  const disciplineId = e.target.value ? Number(e.target.value) : undefined;
                  onDisciplineChange(disciplineId);
                  // Réinitialiser les filtres dépendants
                  if (disciplineId !== selectedDiscipline) {
                    onEpreuveChange(undefined);
                    onStatutChange(undefined);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Chargement...' : 'Toutes les disciplines'}
                </option>
                {disciplinesDisponibles.map(discipline => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par épreuve */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Épreuve {(selectedLieu || selectedDiscipline) && `(${epreuvesDisponibles.length} disponibles)`}
              </label>
              <select 
                value={selectedEpreuve || ''}
                onChange={(e) => {
                  const epreuveId = e.target.value ? Number(e.target.value) : undefined;
                  onEpreuveChange(epreuveId);
                  // Réinitialiser le statut si épreuve change
                  if (epreuveId !== selectedEpreuve) {
                    onStatutChange(undefined);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Chargement...' : 'Toutes les épreuves'}
                </option>
                {epreuvesDisponibles.map(epreuve => (
                  <option key={epreuve.id} value={epreuve.id}>
                    {epreuve.libelle} {epreuve.discipline && `(${epreuve.discipline.nom})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut {(selectedLieu || selectedDiscipline || selectedEpreuve) && `(${statutsDisponibles.length} disponibles)`}
              </label>
              <select 
                value={selectedStatut || ''}
                onChange={(e) => onStatutChange(e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
              >
                <option value="">Tous les statuts</option>
                {statutsDisponibles.map(statut => (
                  <option key={statut} value={statut}>
                    {statut}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton de réinitialisation */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  onSearch('');
                  onLieuChange(undefined);
                  onDisciplineChange(undefined);
                  onEpreuveChange(undefined);
                  onStatutChange(undefined);
                  onDateDebutChange(defaultStartDate);
                  onDateFinChange(defaultEndDate);
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
