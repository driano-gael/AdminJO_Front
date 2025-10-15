import Spinner from '@/components/spinner';
import {Offre} from "@/types/offre/offre";
import OffresTableRow from "@/components/componentOffre/OffresTableRaw";
import {JSX} from "react";

interface Props {
  offres: Offre[];
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (offre: Offre) => void;
  error: string | null;
}

/**
 * Composant OffresTable - Table de gestion des offres olympiques AdminJO
 *
 * @name OffresTable
 *
 * Ce composant affiche la liste complète des offres sous forme de tableau responsive
 * avec gestion des états de chargement/erreur, et actions d'édition/suppression.
 * Il gère l'affichage optimisé des données d'offres olympiques avec colonnes
 * spécialisées pour nom, capacité, prix et actions administratives.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Affichage tabulaire des offres
 * - **Colonnes spécialisées** : Nom, Nombre de personnes, Prix, Actions
 * - **Compteur dynamique** : "Disciplines (X)" avec nombre d'offres
 *
 * ### Gestion des états système
 * - **État loading** : Spinner intégré avec message "Chargement des offres..."
 * - **État error** : Bandeau rouge
 * - **État vide** : Message encourageant "Commencez par créer votre première offre"
 * - **Conditional rendering** : Logique claire entre états loading/empty/data
 * - **Feedback utilisateur** : Messages explicites pour chaque situation
 *
 * ### Actions offres intégrées
 * - **Édition** : Callback onEdit(offre) avec objet complet
 * - **Suppression** : Callback onDelete(id) avec identifiant
 * - **Délégation** : Actions gérées via OffresTableRow
 * - **Props drilling** : Transmission callbacks vers composants enfants
 * - **Gestion async** : Callbacks compatibles opérations asynchrones
 *
 * ## Colonnes spécialisées offres
 *
 * ### Colonne "Nom de l'offre"
 * - **Contenu** : Nom descriptif de l'offre olympique
 * - **Importance** : Colonne principale d'identification
 *
 * ### Colonne "nombre de personnes"
 * - **Contenu** : Capacité/limite participants de l'offre
 * - **Contexte** : Information critique pour gestion olympique
 * - **Type** : Probablement numérique (nombre entier)
 * - **Usage** : Planification capacité événements
 *
 * ### Colonne "Prix"
 * - **Contenu** : Tarification de l'offre
 * - **Format** : Probablement devise (€, $)
 * - **Importance** : Données commerciales essentielles
 * - **Gestion** : Information pour administration billets
 *
 * ### Colonne "Actions"
 * - **Contenu** : Boutons d'édition et suppression
 * - **Implémentation** : Gérée par OffresTableRow
 * - **Callbacks** : onEdit et onDelete transmis
 * - **Interface** : Probablement icônes ou boutons
 *
 * ## États d'interface
 *
 * ### État de chargement
 * - **Condition** : loading && offres.length === 0
 * - **Spinner** : Composant Spinner avec size="medium"
 * - **Message** : "Chargement des offres..." pour clarté
 *
 * ### État vide
 * - **Condition** : !loading && offres.length === 0
 * - **Message principal** : "Aucune offre"
 * - **Message secondaire** : "Commencez par créer votre première offre"
 * - **Encouragement** : Guidage utilisateur vers action création
 *
 * ### État avec données
 * - **Condition** : offres.length > 0
 * - **Rendu** : Map sur offres avec OffresTableRow
 * - **Key** : offre.id pour performance React
 * - **Props** : offre, onDelete, onEdit transmises
 * - **Délégation** : Logique d'affichage dans composant enfant
 *
 * ## Gestion d'erreur
 *
 * ### Affichage d'erreur
 * - **Position** : Entre titre et tableau
 * - **Style** : Bandeau rouge
 * - **Contenu** : Message d'erreur exact du parent
 * - **Persistance** : Reste affiché jusqu'à résolution
 * - **Non-bloquant** : N'empêche pas interaction avec données
 *
 * ## Problèmes identifiés
 *
 * ### Erreur terminologique critique
 * - **Problème** : Titre "Disciplines" au lieu d'"Offres"
 * - **Impact** : Confusion utilisateur majeure
 * - **Localisation** : Ligne titre h2
 * - **Solution** : Changer "Disciplines" → "Offres"
 * - **Cohérence** : Alignement avec nom du composant
 *
 * ## Intégration composants
 *
 * ### Dépendances externes
 * - **Spinner** : Composant réutilisable pour loading
 * - **OffresTableRow** : Composant ligne spécialisé
 * - **Offre type** : Interface TypeScript des données
 *
 * ### Interface parent
 * - **offres** : Array des données à afficher
 * - **loading** : Boolean état chargement
 * - **error** : String message d'erreur ou null
 * - **onDelete/onEdit** : Callbacks pour actions utilisateur
 *
 * ## Performance
 *
 * ### ⚡ Optimisations actuelles
 * - **Conditional rendering** : Évite rendu inutile selon états
 * - **Key prop** : offre.id pour reconciliation React optimale
 * - **Composant délégué** : OffresTableRow pour réutilisabilité
 * - **Props minimales** : Transmission ciblée des données nécessaires
 *
 * @param {Props} props - Configuration de la table des offres
 * @param {Offre[]} props.offres - Liste des offres à afficher dans le tableau
 * @param {boolean} props.loading - État de chargement pour affichage spinner
 * @param {Function} props.onDelete - Callback pour supprimer une offre par ID
 * @param {Function} props.onEdit - Callback pour éditer une offre (objet complet)
 * @param {string | null} props.error - Message d'erreur à afficher si présent
 *
 * @returns {JSX.Element} Table responsive avec liste des offres et gestion d'états
 *
 * @see {@link OffresManagement} - Composant parent fournissant données et callbacks
 * @see {@link OffresTableRow} - Composant ligne gérant affichage et actions individuelles
 * @see {@link Offre} - Interface TypeScript des données d'offre olympique
 * @see {@link Spinner} - Composant loading réutilisable
 */
export function OffresTable({
                                          offres,
                                          loading,
                                          onDelete,
                                          onEdit,
                                          error
                                        }: Props): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Disciplines ({offres.length})
          </h2>
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
                Nom de l&apos;offre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                nombre de personnes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offres.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="medium" />
                      Chargement des offres...
                    </div>
                  ) :(
                    <div>
                      <p className="text-lg font-medium">Aucune offre</p>
                      <p className="text-sm">Commencez par créer votre première offre</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              offres.map((offre) => (
                <OffresTableRow
                  key={offre.id}
                  offre={offre}
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
export default OffresTable;
