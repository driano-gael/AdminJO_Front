import { Lieu } from '@/types/sportEvenement/lieu';
import LieuxTableRow from './LieuxTableRow';
import Spinner from '@/components/spinner';

interface LieuxTableProps {
  lieux: Lieu[];
  loading: boolean;
  searchTerm: string;
  onRefresh: () => void;
  onDelete: (id: number) => void;
  onEdit: (lieu: Lieu) => void;
  error: string | null;
}

/**
 * Composant LieuxTable - Tableau principal d'affichage des lieux olympiques AdminJO
 *
 * @name LieuxTable
 * Ce composant constitue l'interface centrale de visualisation des lieux olympiques
 * des Jeux Olympiques 2024. Il orchestre l'affichage sous forme de tableau structuré
 * avec colonnes spécialisées (nom lieu, actions), gestion complète des états
 * (chargement, erreurs, vide), système de rafraîchissement intelligent, et intégration
 * des actions CRUD via lignes interactives. Conçu pour l'administration JO, il suit
 * les standards AdminJO avec responsive design, feedback utilisateur riche, et gestion
 * optimisée des établissements sportifs olympiques.
 *
 * ## Structure et affichage tableau spécialisé lieux olympiques
 *
 * ### Architecture tableau simplifiée lieux
 * - **Header tableau** : Section avec titre + compteur + actions refresh
 * - **Colonnes spécialisées** : Nom du Lieu, Actions (structure épurée)
 *
 * ### Colonnes tableau optimisées métier lieux olympiques
 * - **Colonne 1 - Nom lieu** : "Nom du Lieu" avec établissements olympiques
 * - **Colonne 2 - Actions** : "Actions" avec boutons Modifier/Supprimer
 *
 *
 * ## Intégration lignes et actions CRUD lieux
 *
 * ### Rendu dynamique des lignes lieux
 * - **Mapping optimisé** : `lieux.map((lieu) => ...)` avec key stable
 * - **Composant ligne** : LieuxTableRow pour chaque lieu
 * - **Props transmission** : lieu, onDelete, onEdit vers lignes
 * - **Callbacks bubbling** : Remontée actions ligne vers composant parent
 * - **Données complètes** : Objet lieu transmis intégralement
 *
 * ### Actions tableau et callbacks lieux
 * - **Refresh intelligent** : onRefresh() préserve contexte recherche
 * - **Suppression lieu** : onDelete(id) avec ID numérique pour sécurité
 * - **Édition lieu** : onEdit(lieu) avec objet Lieu complet
 * - **Délégation logique** : Actions gérées par composants parents
 * - **État préservé** : Callbacks n'affectent pas état local tableau
 * - **Feedback externe** : Notifications gérées par LieuxManagement
 * - **Synchronisation** : Mise à jour automatique via props lieux
 *
 * @param {LieuxTableProps} props - Propriétés du composant tableau lieux
 * @param {Lieu[]} props.lieux - Array des lieux olympiques à afficher
 * @param {boolean} props.loading - État de chargement pour feedback UI
 * @param {string} props.searchTerm - Terme de recherche pour messages contextuels
 * @param {function} props.onRefresh - Callback actualisation données
 * @param {function} props.onDelete - Callback suppression lieu par ID
 * @param {function} props.onEdit - Callback édition lieu avec objet complet
 * @param {string|null} props.error - Message d'erreur à afficher si présent
 *
 * @returns {JSX.Element} Tableau complet gestion lieux olympiques avec états
 *
 * @see {@link LieuxTableRow} - Composant ligne individuelle tableau
 * @see {@link Spinner} - Composant loading states réutilisable
 * @see {@link Lieu} - Interface TypeScript définition lieu
 * @see {@link LieuxManagement} - Composant parent orchestrateur
 *
 */
export function LieuxTable({
  lieux, 
  loading, 
  searchTerm, 
  onRefresh, 
  onDelete, 
  onEdit,
  error 
}: LieuxTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Lieux ({lieux.length})
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
                Nom du Lieu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lieux.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="medium" />
                      Chargement des lieux...
                    </div>
                  ) : searchTerm ? (
                    <div>
                      <p className="text-lg font-medium">Aucun lieu trouvé</p>
                      <p className="text-sm">Aucun lieu ne correspond à votre recherche &ldquo;{searchTerm}&rdquo;</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">Aucun lieu</p>
                      <p className="text-sm">Commencez par créer votre premier lieu</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              lieux.map((lieu) => (
                <LieuxTableRow
                  key={lieu.id}
                  lieu={lieu}
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
export default LieuxTable;
