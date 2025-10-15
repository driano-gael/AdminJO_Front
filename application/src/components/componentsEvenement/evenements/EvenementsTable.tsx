'use client';

/**
 * Composant EvenementsTable - Tableau principal d'affichage des événements sportifs olympiques AdminJO
 *
 * @name EvenementsTable
 * Ce composant constitue l'interface centrale de visualisation des événements sportifs olympiques
 * des Jeux Olympiques 2024. Il orchestre l'affichage sous forme de tableau structuré avec colonnes
 * spécialisées complexes (épreuves multiples, statuts temps réel), gestion complète des états
 * (chargement, erreurs, vide), système de rafraîchissement intelligent, et intégration des actions
 * CRUD via lignes interactives avec sous-composants. Conçu pour l'administration JO, il suit les
 * standards AdminJO avec responsive design, feedback utilisateur riche, et gestion relations multiples.
 *
 * ## Structure et affichage tableau complexe réellement implémentés
 *
 * ### Architecture tableau spécialisée événements olympiques
 * - **Header tableau** : Section avec titre + compteur + actions refresh + loading
 *
 * ### 🏷En-tête tableau avec métadonnées dynamiques événements
 * - **Titre contextuel** : "Événements" avec compteur dynamique `(${events.length})`
 * - **Indicateur de chargement** : Spinner + "Chargement..." pendant loading
 * - **Bouton actualisation** : "🔄 Actualiser" avec callback onRefresh
 * - **État bouton** : Désactivation automatique pendant chargement
 *
 * ### Colonnes tableau optimisées métier événements complexes
 * - **Colonne 1 - Événement** : Description complète événement sportif
 * - **Colonne 2 - Épreuves** : Sous-composant EvenementEpreuve pour épreuves multiples
 * - **Colonne 3 - Date** : Date formatée française + horaire précis
 * - **Colonne 4 - Lieu** : Nom établissement olympique (Stade de France, etc.)
 * - **Colonne 5 - Statut** : Sous-composant EventStatus temps réel (À venir/En cours/Terminé)
 * - **Colonne 6 - Actions** : Boutons Modifier/Supprimer avec callbacks
 *
 * @param {Props} props - Propriétés du composant tableau événements
 * @param {ExtendEvenement[]} props.events - Array des événements étendus à afficher
 * @param {boolean} props.loading - État de chargement pour feedback UI
 * @param {string} props.searchTerm - Terme de recherche pour messages contextuels
 * @param {function} props.onDeleteEvent - Callback suppression événement par ID
 * @param {function} props.onEdit - Callback édition événement avec objet complet
 * @param {function} props.onRefresh - Callback actualisation données
 * @param {string|null} [props.error] - Message d'erreur optionnel à afficher
 *
 * @returns {JSX.Element} Tableau complet avec gestion états et actions CRUD événements
 *
 * @see {@link EvenementsTableRow} - Composant ligne individuelle avec sous-composants
 * @see {@link EvenementEpreuve} - Sous-composant affichage épreuves multiples
 * @see {@link EventStatus} - Sous-composant statut temps réel
 * @see {@link ExtendEvenement} - Interface TypeScript objet événement étendu
 * @see {@link EvenementsManagement} - Composant parent orchestrateur
 *
 */

import { ExtendEvenement } from '@/types/sportEvenement/evenement';
import EvenementsTableRow from './EvenementsTableRow';
import Spinner from '@/components/spinner';

interface Props {
  events: ExtendEvenement[];
  loading: boolean;
  searchTerm: string;
  onDeleteEvent: (id: number) => void;
  onEdit: (event: ExtendEvenement) => void;
  onRefresh: () => void;
  error?: string | null;
}

export function EvenementsTable({
    events, 
    loading, 
    searchTerm, 
    onDeleteEvent,
    onEdit, 
    onRefresh,
    error
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Événements ({events.length})
          </h2>
          <div className="flex items-center space-x-2">
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <Spinner />
                Chargement...
              </div>
            )}
            <button
              onClick={onRefresh}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={loading}
            >
              🔄 Actualiser
            </button>
          </div>
        </div>
      </div>
      
      {/* Affichage des erreurs */}
      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <div className="text-sm text-red-600">
            {error}
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Épreuves
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lieu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Spinner />
                      Chargement des événements...
                    </div>
                  ) : searchTerm ? (
                    <div>
                      <p className="text-lg font-medium">Aucun événement trouvé</p>
                      <p className="text-sm">Aucun événement ne correspond à votre recherche &ldquo;{searchTerm}&rdquo;</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">Aucun événement</p>
                      <p className="text-sm">Commencez par créer votre premier événement</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <EvenementsTableRow
                  key={event.id}
                  event={event}
                  onDelete={onDeleteEvent}
                  onEdit={onEdit}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default EvenementsTable;
