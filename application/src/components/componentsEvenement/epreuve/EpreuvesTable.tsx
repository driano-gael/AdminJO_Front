import { Epreuve } from '@/types/sportEvenement/epreuve';
import EpreuvesTableRow from './EpreuvesTableRow';
import Spinner from '@/components/spinner';
import {JSX} from "react";

interface Props {
  epreuves: Epreuve[];
  loading: boolean;
  searchTerm: string;
  onRefresh: () => void;
  onDelete: (id: number) => void;
  onEdit: (epreuve: Epreuve) => void;
  error: string | null;
}

/**
 * Composant EpreuvesTable - Tableau principal d'affichage des épreuves sportives olympiques AdminJO
 *
 * @name EpreuvesTable
 *
 * Ce composant constitue l'interface centrale de visualisation des épreuves sportives
 * des Jeux Olympiques 2024. Il orchestre l'affichage sous forme de tableau structuré
 * avec colonnes spécialisées, gestion complète des états (chargement, erreurs, vide),
 * système de rafraîchissement intelligent, et intégration des actions CRUD via lignes
 * interactives. Conçu pour l'administration JO, il suit les standards AdminJO avec
 * responsive design, feedback utilisateur riche, et gestion contextuelle des données.
 *
 * ## Structure et affichage tableau réellement implémentés
 *
 * ### Architecture tableau spécialisée épreuves
 * - **Header tableau** : Section avec titre + compteur + actions refresh
 * - **Corps tableau** : Structure HTML sémantique avec thead/tbody
 * - **Colonnes spécialisées** : Libellé épreuve, Discipline, Actions
 *
 * ### En-tête tableau avec métadonnées dynamiques
 * - **Titre contextuel** : "Épreuves" avec compteur dynamique `(${epreuves.length})`
 * - **Indicateur de chargement** : Spinner + "Chargement..." pendant loading
 * - **Bouton actualisation** : "🔄 Actualiser" avec callback onRefresh
 * - **État bouton** : Désactivation automatique pendant chargement
 * - **Feedback visuel** : Spinner small size
 *
 * ### Colonnes tableau optimisées métier épreuves
 * - **Colonne 1 - Libellé** : "Libellé de l'Épreuve" avec nom complet
 * - **Colonne 2 - Discipline** : "Discipline" avec nom + icône associée
 * - **Colonne 3 - Actions** : "Actions" avec boutons Modifier/Supprimer
 *
 * ## Gestion des états d'interface avancée
 *
 * ### États de chargement multicouches
 * - **Loading global** : Spinner dans header + désactivation refresh
 * - **Loading initial** : Message "Chargement des épreuves..." avec spinner medium
 * - **Désactivation actions** : disabled={loading} sur bouton refresh
 * - **Cohérence visuelle** : Spinners small/medium selon contexte
 * - **Non-intrusion** : Loading header n'affecte pas structure tableau
 *
 * ### Gestion d'erreurs contextuelles
 * - **Affichage erreur** : Bandeau rouge en haut tableau si error présent
 * - **Position** : Sous header, au-dessus tableau pour visibilité
 * - **Conditional rendering** : `{error && ...}` pour affichage conditionnel
 * - **Message brut** : Affichage direct contenu error string
 * - **Persistance** : Erreur reste affichée jusqu'à nouvel appel API
 *
 * ### États vide avec messages contextuels intelligents
 * - **Vide + recherche** : "Aucune épreuve trouvée" + terme recherche affiché
 * - **Vide initial** : "Aucune épreuve" + "Commencez par créer votre première épreuve"
 * - **Vide + loading** : "Chargement des épreuves..." avec spinner medium
 * - **Colspan complet** : colSpan={3} pour occuper toutes colonnes
 *
 * ## Intégration lignes et actions CRUD
 *
 * ### Rendu dynamique des lignes épreuves
 * - **Mapping optimisé** : `epreuves.map((epreuve) => ...)` avec key stable
 * - **Composant ligne** : EpreuvesTableRow pour chaque épreuve
 * - **Props transmission** : epreuve, onDelete, onEdit vers lignes
 * - **Key unique** : epreuve.id pour optimisation React reconciliation
 * - **Callbacks bubbling** : Remontée actions ligne vers composant parent
 * - **Données complètes** : Objet épreuve + discipline transmis intégralement
 * - **Performance** : Re-render optimisé avec keys stables
 *
 * ### Actions tableau et callbacks
 * - **Refresh intelligent** : onRefresh() préserve contexte recherche/filtres
 * - **Suppression épreuve** : onDelete(id) avec ID numérique pour sécurité
 * - **Édition épreuve** : onEdit(epreuve) avec objet complet pour modal
 * - **Délégation logique** : Actions gérées par composants parents
 * - **État préservé** : Callbacks n'affectent pas état local tableau
 * - **Feedback externe** : Notifications gérées par EpreuvesManagement
 * - **Synchronisation** : Mise à jour automatique via props epreuves
 *
 * ## Intégrations et dépendances
 *
 * ### Composants intégrés spécialisés
 * - **EpreuvesTableRow** : Composant ligne individuelle avec actions
 * - **Spinner** : Composant loading réutilisable avec tailles (small/medium)
 * - **Epreuve type** : Interface TypeScript pour validation données
 * - **Props interface** : Contrat strict avec composant parent
 * - **Callbacks externes** : Fonctions handler fournies par parents
 * - **État externe** : Pas d'état local, données via props uniquement
 *
 * ### Communication parent-enfant optimisée
 * - **Props descendantes** : epreuves, loading, error, searchTerm depuis parent
 * - **Callbacks ascendantes** : onRefresh, onDelete, onEdit vers parent
 * - **Transmission ciblée** : Props spécifiques transmises aux lignes
 * - **État centralisé** : Gestion state dans EpreuvesManagement parent
 * - **Réactivité** : Re-render automatique sur changement props
 * - **Performance** : Minimal props drilling avec callbacks stables
 *
 *
 * @param {Props} props - Propriétés du composant tableau
 * @param {Epreuve[]} props.epreuves - Array des épreuves à afficher
 * @param {boolean} props.loading - État de chargement pour feedback UI
 * @param {string} props.searchTerm - Terme de recherche pour messages contextuels
 * @param {function} props.onRefresh - Callback actualisation données
 * @param {function} props.onDelete - Callback suppression épreuve par ID
 * @param {function} props.onEdit - Callback édition épreuve avec objet complet
 * @param {string|null} props.error - Message d'erreur à afficher ou null
 *
 * @returns {JSX.Element} Tableau complet avec gestion états et actions CRUD
 *
 * @see {@link EpreuvesTableRow} - Composant ligne individuelle avec actions
 * @see {@link Spinner} - Composant loading pour feedback chargement
 * @see {@link Epreuve} - Interface TypeScript objet épreuve
 * @see {@link EpreuvesManagement} - Composant parent orchestrateur
 *
 */
export function EpreuvesTable({
  epreuves, 
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
            Épreuves ({epreuves.length})
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
                Libellé de l&apos;Épreuve
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discipline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {epreuves.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="medium" />
                      Chargement des épreuves...
                    </div>
                  ) : searchTerm ? (
                    <div>
                      <p className="text-lg font-medium">Aucune épreuve trouvée</p>
                      <p className="text-sm">Aucune épreuve ne correspond à votre recherche &ldquo;{searchTerm}&rdquo;</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">Aucune épreuve</p>
                      <p className="text-sm">Commencez par créer votre première épreuve</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              epreuves.map((epreuve) => (
                <EpreuvesTableRow
                  key={epreuve.id}
                  epreuve={epreuve}
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
export default EpreuvesTable;
