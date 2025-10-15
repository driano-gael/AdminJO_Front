import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Lieu } from '@/types/sportEvenement/lieu';
import { Discipline } from '@/types/sportEvenement/discipline';
import { ExtendEvenement } from '@/types/sportEvenement/evenement';
import {JSX} from "react";

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

/**
 * Composant SearchAndFilters - Interface de recherche et filtrage avancé en cascade pour événements olympiques AdminJO
 *
 *
 * @name SearchAndFilters
 * Ce composant fournit une interface complète et sophistiquée de recherche et filtrage multicritères
 * pour les événements sportifs des Jeux Olympiques 2024. Il implémente un système de filtrage en cascade
 * intelligent où les options disponibles dans chaque filtre se mettent à jour dynamiquement selon les
 * sélections précédentes. Il combine recherche textuelle, filtrage temporel (dates JO), et filtres
 * relationnels (lieu → discipline → épreuve → statut) avec logique de réinitialisation automatique
 * des filtres dépendants. Conçu pour l'administration JO avec UX optimisée et performance.
 *
 * ## Fonctionnalités de recherche et filtrage avancées implémentées
 *
 * ### Recherche textuelle événements olympiques
 * - **Input contrôlé** : Champ de saisie entièrement contrôlé par état parent
 * - **Feedback immédiat** : onChange déclenche recherche instantanée
 * - **Placeholder contextuel** : "Rechercher un événement..." pour guidance spécifique
 * - **Synchronisation** : État searchTerm synchronisé avec hook parent
 *
 * ### Filtrage temporel JO 2024 (dates événements)
 * - **Dates par défaut** : '2024-07-01' à '2024-09-01' pour période JO Paris 2024
 * - **Input dates dédiés** : Date de début et date de fin séparés
 * - **Format natif** : type="date" pour sélecteurs natifs navigateur
 * - **Callbacks distincts** : onDateDebutChange et onDateFinChange séparés
 * - **Valeurs par défaut** : Dates JO automatiques si aucune sélection
 *
 * ### Filtrage en cascade lieu → discipline → épreuve → statut
 * - **Filtre lieu (racine)** : Sélection lieu olympique (Stade de France, etc.)
 * - **Disciplines dépendantes** : Liste disciplines disponibles selon lieu sélectionné
 * - **Épreuves dépendantes** : Liste épreuves filtrées par lieu ET discipline
 * - **Statuts dépendants** : Statuts disponibles selon tous filtres précédents
 * - **Réinitialisation automatique** : Filtres enfants reset si parent change
 *
 * ## Architecture filtrage en cascade complexe
 *
 * ### Logique de filtrage en cascade implémentée
 * - **Étape 1** : Filtrage événements par lieu si sélectionné
 * - **Étape 2** : Calcul disciplines disponibles selon lieu
 * - **Étape 3** : Calcul épreuves disponibles selon lieu ET discipline
 * - **Étape 4** : Calcul statuts disponibles selon tous filtres actifs
 *
 * ### Algorithmes de calcul options disponibles
 * - **disciplinesDisponibles** : Array.from(new Set()) pour disciplines uniques
 * - **epreuvesDisponibles** : Filtrage multicritères + tri alphabétique
 * - **statutsDisponibles** : Extraction statuts selon filtres en cascade
 *
 * ### Gestion relations complexes événements
 * - **Événements → Lieux** : Relation 1-1 via event.lieu.id
 * - **Événements → Épreuves** : Relation 1-N via event.epreuves array
 * - **Épreuves → Disciplines** : Relation 1-1 via epreuve.discipline.id
 * - **Événements → Statuts** : Propriété event.status calculée dynamiquement
 * - **Intégrité** : Vérifications conditionnelles pour relations manquantes
 * - **Performance** : Pas de jointures, données pré-chargées
 *
 * @param {SearchAndFiltersProps} props - Configuration recherche et filtres en cascade
 * @param {string} props.searchTerm - Terme de recherche textuelle actuel
 * @param {function} props.onSearch - Callback changement terme recherche
 * @param {Epreuve[]} props.epreuves - Array toutes épreuves pour calculs cascade
 * @param {Lieu[]} props.lieux - Array lieux olympiques pour filtre racine
 * @param {Discipline[]} props.disciplines - Array disciplines pour filtre cascade
 * @param {ExtendEvenement[]} props.events - Array événements pour calculs disponibilité
 * @param {boolean} [props.loading] - État chargement pour désactivation filtres
 * @param {number} [props.selectedLieu] - ID lieu sélectionné pour cascade
 * @param {number} [props.selectedDiscipline] - ID discipline sélectionnée
 * @param {number} [props.selectedEpreuve] - ID épreuve sélectionnée
 * @param {string} [props.selectedStatut] - Statut sélectionné
 * @param {string} [props.dateDebut] - Date début période filtrage
 * @param {string} [props.dateFin] - Date fin période filtrage
 * @param {function} props.onLieuChange - Callback changement lieu avec reset cascade
 * @param {function} props.onDisciplineChange - Callback changement discipline
 * @param {function} props.onEpreuveChange - Callback changement épreuve
 * @param {function} props.onStatutChange - Callback changement statut
 * @param {function} props.onDateDebutChange - Callback changement date début
 * @param {function} props.onDateFinChange - Callback changement date fin
 *
 * @returns {JSX.Element} Interface recherche et filtrage multicritères en cascade
 *
 * @see {@link EvenementsManagement} - Composant parent orchestrateur
 * @see {@link EvenementsTable} - Tableau affichant résultats filtrés
 * @see {@link ExtendEvenement} - Interface événements avec relations
 * @see {@link Lieu} - Interface lieux olympiques
 * @see {@link Discipline} - Interface disciplines sportives
 * @see {@link Epreuve} - Interface épreuves compétitives
 *
 */
export function SearchAndFilters({
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
}: SearchAndFiltersProps): JSX.Element {
  
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
export default SearchAndFilters;