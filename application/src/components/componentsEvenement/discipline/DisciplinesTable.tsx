import { Discipline } from '@/types/sportEvenement/discipline';
import DisciplinesTableRow from './DisciplinesTableRow';
import Spinner from '@/components/spinner';
import {JSX} from "react";

interface Props {
  disciplines: Discipline[];
  loading: boolean;
  searchTerm: string;
  onRefresh: () => void;
  onDelete: (id: number) => void;
  onEdit: (discipline: Discipline) => void;
  error: string | null;
}

/**
 * Composant DisciplinesTable - Tableau d'affichage des disciplines sportives olympiques AdminJO
 *
 * @name DisciplinesTable
 *
 * Ce composant fournit une interface complète de visualisation et gestion des disciplines
 * sportives des Jeux Olympiques sous forme de tableau responsive. Il gère l'affichage
 * des données avec états multiples (chargement, erreur, vide, recherche), intègre des
 * fonctionnalités de rafraîchissement, et orchestre les actions CRUD via les lignes
 * individuelles. Il présente une expérience utilisateur riche avec feedback contextuel
 * et gestion intelligente des différents scénarios d'affichage.
 *
 * ## Fonctionnalités d'affichage avancées
 *
 * ### Header avec contrôles et feedback
 * - **Titre contextuel** : "Disciplines" avec compteur temps réel
 * - **Bouton refresh** : "🔄 Actualiser" avec état disabled pendant loading
 * - **Indicateur loading** : Spinner + "Chargement..." pendant opérations
 *
 * ## Gestion des états d'affichage intelligente
 *
 * ### États de chargement multiples
 * - **Loading global** : Spinner header pendant chargement initial/refresh
 * - **Bouton disabled** : Actualiser désactivé pendant loading
 * - **Feedback textuel** : "Chargement des disciplines..." explicite
 * - **États combinés** : loading + empty state géré intelligemment
 *
 * ### Gestion d'erreurs contextuelles
 * - **Error display** : Zone erreur dédiée sous header si error !== null
 * - **Persistance** : Erreur reste jusqu'à nouvelle tentative réussie
 * - **Rafraîchissement** : Bouton actualiser permet retry après erreur
 *
 * ### États vides contextuels (Empty States)
 * - **Pas de données** : "Aucune discipline" + "Commencez par créer votre première discipline"
 * - **Recherche vide** : "Aucune discipline trouvée" + terme recherche affiché
 * - **Loading empty** : Spinner + "Chargement des disciplines..." pendant fetch
 *
 * ## Architecture et intégration système
 *
 * ### Props interface complète
 * - **disciplines** : Array<Discipline> données à afficher
 * - **loading** : boolean état chargement global
 * - **searchTerm** : string terme recherche pour empty states contextuels
 * - **onRefresh** : Function callback bouton actualiser
 * - **onDelete** : Function callback suppression discipline (délégué aux rows)
 * - **onEdit** : Function callback édition discipline (délégué aux rows)
 * - **error** : string | null message erreur à afficher
 *
 * ### Intégration avec DisciplinesTableRow
 * - **Mapping données** : disciplines.map() pour rendu lignes individuelles
 * - **Key optimization** : discipline.id comme clé React pour performance
 * - **Props delegation** : onDelete et onEdit transmis aux lignes
 * - **Responsabilité** : Table gère structure, rows gèrent contenu individuel
 * - **Performance** : Rendu conditionnel avec lazy evaluation
 *
 * ## Logique d'affichage conditionnel
 *
 * ### Empty states contextuels avancés
 * - **Condition principale** : disciplines.length === 0 pour détecter vide
 * - **Loading priority** : Si loading, affiche spinner même si vide
 * - **Search context** : Si searchTerm, message "Aucune discipline trouvée"
 * - **Initial state** : Sinon, message encourageant création première discipline
 *
 * ### Rendu données avec performance
 * - **Props drilling** : Callbacks transmis efficacement
 * - **Lazy evaluation** : Pas de calculs inutiles si tableau vide
 *
 * ## Interactions utilisateur
 *
 * ### Fonctionnalité de rafraîchissement
 * - **Bouton refresh** : "🔄 Actualiser" avec emoji pour reconnaissance
 * - **onClick handler** : onRefresh() callback vers parent component
 * - **État disabled** : disabled={loading} pendant opérations
 * - **Feedback visuel** : Spinner adjacent pendant loading
 *
 * ### Délégation actions CRUD
 * - **Edit action** : onEdit(discipline) transmis via props aux rows
 * - **Delete action** : onDelete(id) transmis via props aux rows
 * - **Event bubbling** : Callbacks remontent vers DisciplinesManagement
 * - **State management** : Pas d'état local, tout géré par parent
 *
 * ## Intégration avec écosystème
 *
 * ### 🔗 Relations parent-enfant
 * - **Parent** : DisciplinesManagement fournit données et callbacks
 * - **Enfants** : DisciplinesTableRow pour chaque ligne données
 * - **Siblings** : SearchAndFilters pour filtrage, DisciplineModal pour CRUD
 * - **Props flow** : Unidirectionnel depuis management vers table vers rows
 *
 * @param {Props} props - Configuration du tableau des disciplines
 * @param {Discipline[]} props.disciplines - Array des disciplines à afficher
 * @param {boolean} props.loading - État de chargement pour spinner et disabled states
 * @param {string} props.searchTerm - Terme de recherche pour empty states contextuels
 * @param {Function} props.onRefresh - Callback pour bouton actualiser
 * @param {Function} props.onDelete - Callback suppression discipline (délégué aux rows)
 * @param {Function} props.onEdit - Callback édition discipline (délégué aux rows)
 * @param {string | null} props.error - Message d'erreur à afficher si présent
 *
 * @returns {JSX.Element} Tableau responsive avec disciplines et contrôles
 *
 * @see {@link DisciplinesManagement} - Composant parent gérant ce tableau
 * @see {@link DisciplinesTableRow} - Composant de ligne individuelle
 * @see {@link SearchAndFilters} - Composant de recherche associé
 * @see {@link Discipline} - Interface TypeScript des données de discipline
 * @see {@link Spinner} - Composant d'indicateur de chargement
 *
 */
export function DisciplinesTable({
  disciplines, 
  loading, 
  searchTerm, 
  onRefresh, 
  onDelete, 
  onEdit,
  error 
}: Props): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Disciplines ({disciplines.length})
          </h2>
          <div className="flex items-center space-x-2">
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <Spinner size="small" />
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
        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom de la Discipline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {disciplines.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="medium" />
                      Chargement des disciplines...
                    </div>
                  ) : searchTerm ? (
                    <div>
                      <p className="text-lg font-medium">Aucune discipline trouvée</p>
                      <p className="text-sm">Aucune discipline ne correspond à votre recherche &ldquo;{searchTerm}&rdquo;</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">Aucune discipline</p>
                      <p className="text-sm">Commencez par créer votre première discipline</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              disciplines.map((discipline) => (
                <DisciplinesTableRow
                  key={discipline.id}
                  discipline={discipline}
                  onDelete={onDelete}
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
export default DisciplinesTable;
