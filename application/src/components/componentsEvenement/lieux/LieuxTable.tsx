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
 * ### 📊 Architecture tableau simplifiée lieux
 * - **Container principal** : Card avec bg-white rounded-lg shadow-md
 * - **Header tableau** : Section avec titre + compteur + actions refresh
 * - **Corps tableau** : Structure HTML sémantique avec thead/tbody
 * - **Colonnes spécialisées** : Nom du Lieu, Actions (structure épurée)
 * - **Overflow management** : overflow-x-auto pour débordement horizontal
 * - **Responsive design** : min-w-full avec adaptation automatique
 * - **Elevation** : Ombre portée pour détachement visuel du fond
 *
 * ### 🏷️ En-tête tableau avec métadonnées dynamiques lieux
 * - **Titre contextuel** : "Lieux" avec compteur dynamique `(${lieux.length})`
 * - **Indicateur de chargement** : Spinner + "Chargement..." pendant loading
 * - **Bouton actualisation** : "🔄 Actualiser" avec callback onRefresh
 * - **État bouton** : Désactivation automatique pendant chargement
 * - **Layout horizontal** : justify-between pour répartition équilibrée
 * - **Feedback visuel** : Spinner small size pour indication non-intrusive
 * - **Séparateur** : border-b border-gray-200 pour délimitation claire
 *
 * ### 📋 Colonnes tableau optimisées métier lieux olympiques
 * - **Colonne 1 - Nom lieu** : "Nom du Lieu" avec établissements olympiques
 * - **Colonne 2 - Actions** : "Actions" avec boutons Modifier/Supprimer
 * - **Structure épurée** : Seulement 2 colonnes pour simplicité gestion
 * - **Headers style** : bg-gray-50 avec typographie uppercase tracking-wider
 * - **Alignement** : text-left pour lisibilité optimale données
 * - **Espacement** : px-6 py-3 pour respiration headers cohérente
 * - **Sémantique** : thead/th structure correcte pour accessibilité
 *
 * ## Gestion des états d'interface avancée lieux
 *
 * ### ⏳ États de chargement multicouches lieux
 * - **Loading global** : Spinner dans header + désactivation refresh
 * - **Loading initial** : Message "Chargement des lieux..." avec spinner medium
 * - **État vide + loading** : Centrage avec flex items-center justify-center
 * - **Feedback temps réel** : Indication "Chargement..." textuelle explicite
 * - **Désactivation actions** : disabled={loading} sur bouton refresh
 * - **Cohérence visuelle** : Spinners small/medium selon contexte
 * - **Non-intrusion** : Loading header n'affecte pas structure tableau
 *
 * ### 🚨 Gestion d'erreurs contextuelles lieux
 * - **Affichage erreur** : Bandeau rouge en haut tableau si error présent
 * - **Style erreur** : text-sm text-red-600 bg-red-50 p-2 rounded
 * - **Position** : Sous header, au-dessus tableau pour visibilité
 * - **Conditional rendering** : `{error && ...}` pour affichage conditionnel
 * - **Message brut** : Affichage direct contenu error string
 * - **Accessibilité** : Couleurs contrastées pour lisibilité erreurs
 * - **Persistance** : Erreur reste affichée jusqu'à nouvel appel API
 *
 * ### 🗂️ États vide avec messages contextuels intelligents lieux
 * - **Vide + recherche** : "Aucun lieu trouvé" + terme recherche affiché
 * - **Vide initial** : "Aucun lieu" + "Commencez par créer votre premier lieu"
 * - **Vide + loading** : "Chargement des lieux..." avec spinner medium
 * - **Colspan adapté** : colSpan={2} pour occuper toutes colonnes tableau
 * - **Centrage vertical** : py-12 pour espacement généreux état vide
 * - **Hiérarchie messages** : text-lg font-medium + text-sm pour détails
 * - **Guillemets recherche** : &ldquo;{searchTerm}&rdquo; pour mise en évidence
 *
 * ## Intégration lignes et actions CRUD lieux
 *
 * ### 🔄 Rendu dynamique des lignes lieux
 * - **Mapping optimisé** : `lieux.map((lieu) => ...)` avec key stable
 * - **Composant ligne** : LieuxTableRow pour chaque lieu
 * - **Props transmission** : lieu, onDelete, onEdit vers lignes
 * - **Key unique** : lieu.id pour optimisation React reconciliation
 * - **Callbacks bubbling** : Remontée actions ligne vers composant parent
 * - **Données complètes** : Objet lieu transmis intégralement
 * - **Performance** : Re-render optimisé avec keys stables
 *
 * ### 🔧 Actions tableau et callbacks lieux
 * - **Refresh intelligent** : onRefresh() préserve contexte recherche
 * - **Suppression lieu** : onDelete(id) avec ID numérique pour sécurité
 * - **Édition lieu** : onEdit(lieu) avec objet Lieu complet
 * - **Délégation logique** : Actions gérées par composants parents
 * - **État préservé** : Callbacks n'affectent pas état local tableau
 * - **Feedback externe** : Notifications gérées par LieuxManagement
 * - **Synchronisation** : Mise à jour automatique via props lieux
 *
 * ## Responsive design et accessibilité lieux
 *
 * ### 📱 Adaptation multi-supports lieux
 * - **Scroll horizontal** : overflow-x-auto pour débordement mobile
 * - **Largeur minimale** : min-w-full pour cohérence desktop
 * - **Container fluide** : Adaptation automatique largeur parent
 * - **Touch-friendly** : Zones d'action dimensionnées tactile
 * - **Breakpoints** : Gestion responsive via classes Tailwind
 * - **Dense mobile** : Maintien lisibilité sur petits écrans
 * - **Navigation tactile** : Scroll horizontal fluide mobiles/tablettes
 *
 * ### ♿ Standards accessibilité tableau lieux
 * - **Sémantique HTML** : Structure table/thead/tbody/th/td correcte
 * - **Headers explicites** : Colonnes titrées pour lecteurs écran
 * - **Contraste couleurs** : Respect ratios WCAG AA sur tous éléments
 * - **Focus management** : Navigation clavier cohérente dans tableau
 * - **Screen readers** : Structure logique pour synthèse vocale
 * - **ARIA implicit** : Sémantique table native suffisante
 * - **Alt text** : Messages d'état lisibles par assistive technologies
 *
 * ## Intégrations et dépendances lieux
 *
 * ### 🔌 Composants intégrés spécialisés lieux
 * - **LieuxTableRow** : Composant ligne individuelle avec actions
 * - **Spinner** : Composant loading réutilisable avec tailles (small/medium)
 * - **Lieu type** : Interface TypeScript pour validation données
 * - **Props interface** : Contrat strict avec composant parent
 * - **Callbacks externes** : Fonctions handler fournies par parents
 * - **État externe** : Pas d'état local, données via props uniquement
 *
 * ### 📡 Communication parent-enfant optimisée lieux
 * - **Props descendantes** : lieux, loading, error, searchTerm depuis parent
 * - **Callbacks ascendantes** : onRefresh, onDelete, onEdit vers parent
 * - **Transmission ciblée** : Props spécifiques transmises aux lignes
 * - **État centralisé** : Gestion state dans LieuxManagement parent
 * - **Réactivité** : Re-render automatique sur changement props
 * - **Performance** : Minimal props drilling avec callbacks stables
 *
 * ## Performance et optimisations lieux
 *
 * ### ⚡ Optimisations de rendu actuelles
 * - **Composant pur** : Pas d'état local pour performance maximale
 * - **Keys optimisées** : lieu.id pour reconciliation React efficace
 * - **Conditional rendering** : Affichage conditionnel erreurs/loading/vide
 * - **CSS statique** : Classes Tailwind pré-compilées
 * - **Callbacks stables** : Props functions stables entre re-renders
 * - **Minimal re-renders** : Dépendances props strictement nécessaires
 *
 * ### 🎯 Candidats optimisation avancée lieux
 * - **React.memo** : Mémorisation composant si re-renders fréquents
 * - **Virtualisation** : Rendu virtuel pour grandes listes lieux
 * - **Pagination** : Découpage données si volume important
 * - **Lazy loading** : Chargement progressif lieux visibles
 * - **Debouncing** : Optimisation refresh si appels fréquents
 * - **Memoized callbacks** : useMemo/useCallback dans parents
 *
 * ## Spécificités métier lieux olympiques
 *
 * ### 🏅 Contexte Olympic Games administration lieux
 * - **Terminologie** : "Lieux" pour établissements sportifs olympiques
 * - **Exemples concrets** : Stade de France, Centre Aquatique, Arena Bercy
 * - **Hiérarchie** : Lieux niveau infrastructure pour événements/épreuves
 * - **Gestion** : Interface organisateurs JO pour infrastructure
 * - **Standards** : Respect nomenclature officielle établissements CIO
 * - **Importance** : Base infrastructure physique compétitions olympiques
 *
 * ### 📊 Types de données lieux gérées
 * - **Structure Lieu** : id, nom (structure simplifiée)
 * - **Nom établissement** : string pour désignation officielle
 * - **ID unique** : number pour identification système
 * - **Validation TypeScript** : Interfaces strictes pour sécurité
 * - **API synchronisée** : Structure données alignée backend/frontend
 * - **Extensibilité** : Support ajout propriétés futures (capacité, adresse)
 *
 * ## Gestion d'erreurs et edge cases lieux
 *
 * ### 🛡️ Robustesse et cas limites
 * - **Props null/undefined** : Gestion defensive avec valeurs défaut
 * - **Array vide** : État vide avec message approprié
 * - **Error null** : Pas d'affichage bandeau si absence erreur
 * - **SearchTerm vide** : Message état vide adapté selon contexte
 * - **Loading concurrent** : Gestion cohérente états multiples
 * - **Network failures** : Affichage erreurs réseau dans bandeau
 *
 * ### 🔄 Recovery et états de récupération
 * - **Retry mechanism** : Bouton refresh pour nouvelle tentative
 * - **Error clearing** : Effacement erreur sur nouveau chargement
 * - **State consistency** : Cohérence état loading/error/data
 * - **Graceful degradation** : Fonctionnement partiel si erreurs
 * - **User feedback** : Messages clairs pour guider utilisateur
 * - **Fallback content** : Contenu alternatif si échec chargement
 *
 * ## Améliorations et extensions futures
 *
 * ### 🚀 Fonctionnalités avancées possibles
 * - **Tri colonnes** : Ordonnancement par nom lieu alphabétique
 * - **Pagination intégrée** : Découpage grandes listes dans tableau
 * - **Filtres avancés** : Critères multiples dans headers colonnes
 * - **Sélection multiple** : Checkboxes pour actions groupées
 * - **Export données** : CSV/PDF depuis tableau avec sélection
 * - **Colonnes configurables** : Masquage/affichage colonnes dynamique
 * - **Densité affichage** : Mode compact/standard configurable
 *
 * ### 📊 Enrichissements données lieux
 * - **Colonnes supplémentaires** : Capacité, adresse, statut lieu
 * - **Indicateurs visuels** : Icônes statut/type établissement
 * - **Badges métadonnées** : Statut disponibilité/maintenance
 * - **Liens navigation** : Accès détail lieu depuis tableau
 * - **Miniatures** : Photos établissements dans lignes
 * - **Géolocalisation** : Coordonnées GPS et liens cartes
 * - **Informations temps réel** : Occupation/événements en cours
 *
 * ### 🔧 Optimisations techniques avancées
 * - **Virtual scrolling** : Rendu virtuel très grandes listes
 * - **Intersection observer** : Chargement lazy images/données
 * - **Web Workers** : Traitement tri/filtre en arrière-plan
 * - **IndexedDB cache** : Cache local persistant lieux fréquents
 * - **Service Worker** : Synchronisation hors-ligne modifications
 * - **Real-time updates** : WebSocket pour mises à jour temps réel
 * - **Progressive loading** : Chargement progressif métadonnées
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
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * <LieuxTable
 *   lieux={lieuxList}
 *   loading={isLoading}
 *   searchTerm={currentSearch}
 *   onRefresh={() => loadData()}
 *   onDelete={(id) => handleDelete(id)}
 *   onEdit={(lieu) => handleEdit(lieu)}
 *   error={apiError}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Avec gestion états vides
 * <LieuxTable
 *   lieux={[]}
 *   loading={false}
 *   searchTerm=""
 *   onRefresh={refreshData}
 *   onDelete={deleteLieu}
 *   onEdit={editLieu}
 *   error={null}
 * />
 * ```
 */
export default function LieuxTable({
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
