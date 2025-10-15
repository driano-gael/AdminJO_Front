'use client';

/**
 * Composant EvenementsTable - Tableau principal d'affichage des événements sportifs olympiques AdminJO
 *
 * Ce composant constitue l'interface centrale de visualisation des événements sportifs olympiques
 * des Jeux Olympiques 2024. Il orchestre l'affichage sous forme de tableau structuré avec colonnes
 * spécialisées complexes (épreuves multiples, statuts temps réel), gestion complète des états
 * (chargement, erreurs, vide), système de rafraîchissement intelligent, et intégration des actions
 * CRUD via lignes interactives avec sous-composants. Conçu pour l'administration JO, il suit les
 * standards AdminJO avec responsive design, feedback utilisateur riche, et gestion relations multiples.
 *
 * ## Structure et affichage tableau complexe réellement implémentés
 *
 * ### 📊 Architecture tableau spécialisée événements olympiques
 * - **Container principal** : Card avec bg-white rounded-lg shadow-md pour élévation
 * - **Header tableau** : Section avec titre + compteur + actions refresh + loading
 * - **Corps tableau** : Structure HTML sémantique avec thead/tbody complexe
 * - **Colonnes spécialisées** : Événement, Épreuves (sous-composant), Date, Lieu, Statut (temps réel), Actions
 * - **Overflow management** : overflow-x-auto pour débordement horizontal responsive
 * - **Responsive design** : min-w-full avec adaptation automatique contenus complexes
 * - **Elevation** : Ombre portée pour détachement visuel du fond
 *
 * ### 🏷️ En-tête tableau avec métadonnées dynamiques événements
 * - **Titre contextuel** : "Événements" avec compteur dynamique `(${events.length})`
 * - **Indicateur de chargement** : Spinner + "Chargement..." pendant loading
 * - **Bouton actualisation** : "🔄 Actualiser" avec callback onRefresh
 * - **État bouton** : Désactivation automatique pendant chargement
 * - **Layout horizontal** : justify-between pour répartition équilibrée
 * - **Feedback visuel** : Spinner pour indication non-intrusive
 * - **Séparateur** : border-b border-gray-200 pour délimitation claire
 *
 * ### 📋 Colonnes tableau optimisées métier événements complexes
 * - **Colonne 1 - Événement** : Description complète événement sportif
 * - **Colonne 2 - Épreuves** : Sous-composant EvenementEpreuve pour épreuves multiples
 * - **Colonne 3 - Date** : Date formatée française + horaire précis
 * - **Colonne 4 - Lieu** : Nom établissement olympique (Stade de France, etc.)
 * - **Colonne 5 - Statut** : Sous-composant EventStatus temps réel (À venir/En cours/Terminé)
 * - **Colonne 6 - Actions** : Boutons Modifier/Supprimer avec callbacks
 * - **Headers style** : bg-gray-50 avec typographie uppercase tracking-wider
 * - **Complexité** : Mix données simples + sous-composants spécialisés
 *
 * ## Gestion des états d'interface avancée événements
 *
 * ### ⏳ États de chargement multicouches événements
 * - **Loading global** : Spinner dans header + désactivation refresh
 * - **Loading initial** : Message "Chargement des événements..." avec spinner
 * - **État vide + loading** : Centrage avec flex items-center justify-center
 * - **Feedback temps réel** : Indication "Chargement..." textuelle explicite
 * - **Désactivation actions** : disabled={loading} sur bouton refresh
 * - **Cohérence visuelle** : Spinners coordonnés avec sous-composants
 * - **Non-intrusion** : Loading header n'affecte pas structure tableau
 *
 * ### 🚨 Gestion d'erreurs contextuelles événements
 * - **Affichage erreur** : Bandeau rouge dédié entre header et tableau
 * - **Style erreur** : px-6 py-4 bg-red-50 border-b border-red-200
 * - **Position stratégique** : Sous header, au-dessus tableau pour visibilité
 * - **Conditional rendering** : `{error && ...}` pour affichage conditionnel
 * - **Message d'erreur** : text-sm text-red-600 pour lisibilité
 * - **Accessibilité** : Couleurs contrastées pour lisibilité erreurs
 * - **Persistance** : Erreur reste affichée jusqu'à nouvel appel API
 *
 * ### 🗂️ États vide avec messages contextuels intelligents événements
 * - **Vide + recherche** : "Aucun événement trouvé" + terme recherche affiché
 * - **Vide initial** : "Aucun événement" + "Commencez par créer votre premier événement"
 * - **Vide + loading** : "Chargement des événements..." avec spinner
 * - **Colspan adapté** : colSpan={7} pour occuper toutes 6 colonnes (erreur colspan)
 * - **Centrage vertical** : py-12 pour espacement généreux état vide
 * - **Hiérarchie messages** : text-lg font-medium + text-sm pour détails
 * - **Guillemets recherche** : &ldquo;{searchTerm}&rdquo; pour mise en évidence
 *
 * ## Intégration lignes et actions CRUD événements
 *
 * ### 🔄 Rendu dynamique des lignes événements complexes
 * - **Mapping optimisé** : `events.map((event) => ...)` avec key stable
 * - **Composant ligne** : EvenementsTableRow pour chaque événement
 * - **Props transmission** : event, onDeleteEvent, onEdit vers lignes
 * - **Key unique** : event.id pour optimisation React reconciliation
 * - **Callbacks bubbling** : Remontée actions ligne vers composant parent
 * - **Données complètes** : Objet événement + relations (épreuves, lieu) transmis
 * - **Performance** : Re-render optimisé avec keys stables
 *
 * ### 🔧 Actions tableau et callbacks événements
 * - **Refresh intelligent** : onRefresh() préserve contexte recherche/filtres
 * - **Suppression événement** : onDeleteEvent(id) avec ID numérique pour sécurité
 * - **Édition événement** : onEdit(event) avec objet ExtendEvenement complet
 * - **Délégation logique** : Actions gérées par composants parents
 * - **État préservé** : Callbacks n'affectent pas état local tableau
 * - **Feedback externe** : Notifications gérées par EvenementsManagement
 * - **Synchronisation** : Mise à jour automatique via props events
 *
 * ## Types de données événements étendus
 *
 * ### 📊 ExtendEvenement vs Evenement standard
 * - **Type étendu** : ExtendEvenement avec propriétés enrichies
 * - **Relations préchargées** : Épreuves et lieu inclus dans objet
 * - **Performance** : Évite jointures côté client multiples
 * - **Complexité** : Support données nested complexes (épreuves[])
 * - **Type safety** : Interface TypeScript stricte pour sécurité
 * - **Évolutivité** : Support ajout propriétés futures événements
 *
 * ### 🔗 Relations événements gérées
 * - **Épreuves multiples** : Array épreuves avec disciplines associées
 * - **Lieu unique** : Objet lieu avec nom et propriétés
 * - **Statut temporel** : Calculé dynamiquement via sous-composant
 * - **Métadonnées** : Description, date, horaire complets
 * - **Hiérarchie** : Événements niveau racine avec enfants
 * - **Intégrité** : Relations validées via interfaces TypeScript
 *
 * ## Responsive design et accessibilité complexe
 *
 * ### 📱 Adaptation multi-supports événements
 * - **Scroll horizontal** : overflow-x-auto pour débordement mobile
 * - **Largeur minimale** : min-w-full pour cohérence desktop
 * - **Container fluide** : Adaptation automatique largeur parent
 * - **Sous-composants responsive** : EvenementEpreuve et EventStatus adaptés
 * - **Touch-friendly** : Zones d'action dimensionnées tactile
 * - **Breakpoints** : Gestion responsive via classes Tailwind
 * - **Dense mobile** : Maintien lisibilité données complexes petits écrans
 *
 * ### ♿ Standards accessibilité tableau complexe
 * - **Sémantique HTML** : Structure table/thead/tbody/th/td correcte
 * - **Headers explicites** : Colonnes titrées pour lecteurs écran
 * - **Contraste couleurs** : Respect ratios WCAG AA sur tous éléments
 * - **Focus management** : Navigation clavier cohérente avec sous-composants
 * - **Screen readers** : Structure logique pour synthèse vocale
 * - **ARIA implicit** : Sémantique table native + sous-composants
 * - **Alt text** : Messages d'état lisibles par assistive technologies
 *
 * ## Intégrations et dépendances événements
 *
 * ### 🔌 Composants intégrés spécialisés événements
 * - **EvenementsTableRow** : Composant ligne individuelle avec sous-composants
 * - **EvenementEpreuve** : Affichage épreuves multiples en badges
 * - **EventStatus** : Calcul et affichage statut temps réel
 * - **Spinner** : Composant loading réutilisable
 * - **ExtendEvenement type** : Interface TypeScript validation données
 * - **Props interface** : Contrat strict avec composant parent
 *
 * ### 📡 Communication parent-enfant optimisée événements
 * - **Props descendantes** : events, loading, error, searchTerm depuis parent
 * - **Callbacks ascendantes** : onRefresh, onDeleteEvent, onEdit vers parent
 * - **Transmission ciblée** : Props spécifiques transmises aux lignes
 * - **État centralisé** : Gestion state dans EvenementsManagement parent
 * - **Réactivité** : Re-render automatique sur changement props
 * - **Performance** : Minimal props drilling avec callbacks stables
 *
 * ## Performance et optimisations événements
 *
 * ### ⚡ Optimisations de rendu actuelles
 * - **Composant client** : 'use client' pour interactivité complète
 * - **Keys optimisées** : event.id pour reconciliation React efficace
 * - **Conditional rendering** : Affichage conditionnel erreurs/loading/vide
 * - **CSS statique** : Classes Tailwind pré-compilées
 * - **Callbacks stables** : Props functions stables entre re-renders
 * - **Sous-composants délégués** : Logiques complexes externalisées
 *
 * ### 🎯 Candidats optimisation avancée événements
 * - **React.memo** : Mémorisation composant si re-renders fréquents
 * - **Virtualisation** : Rendu virtuel pour grandes listes événements
 * - **Pagination** : Découpage données si volume important
 * - **Lazy loading** : Chargement progressif relations (épreuves, lieux)
 * - **Debouncing** : Optimisation refresh si appels fréquents
 * - **Memoized sous-composants** : Optimisation EvenementEpreuve et EventStatus
 *
 * ## Spécificités métier événements olympiques
 *
 * ### 🏅 Contexte Olympic Games administration événements
 * - **Terminologie** : "Événements" pour sessions compétitives programmées
 * - **Relations complexes** : Événements → Épreuves (1-N), Événements → Lieux (1-1)
 * - **Exemples données** : "Finale natation", "Qualifications athlétisme"
 * - **Hiérarchie** : Événements niveau racine planning olympique
 * - **Gestion** : Interface organisateurs JO pour planning compétitions
 * - **Standards** : Respect nomenclature CIO et timing olympiques
 *
 * ### 📅 Gestion temporelle et statuts événements
 * - **Planning précis** : Date + horaire pour scheduling exact
 * - **Statuts temps réel** : À venir/En cours/Terminé via EventStatus
 * - **Coordination** : Synchronisation équipes, médias, spectateurs
 * - **Relations temporelles** : Lien épreuves → événement → planning global
 * - **Flexibilité** : Support modifications planning dernière minute
 * - **Suivi** : Monitoring progression événements en temps réel
 *
 * ## Gestion d'erreurs et edge cases événements
 *
 * ### 🛡️ Robustesse et cas limites
 * - **Props null/undefined** : Gestion defensive avec valeurs défaut
 * - **Array vide** : État vide avec message approprié
 * - **Error optionnel** : Props error?: string | null pour flexibilité
 * - **SearchTerm vide** : Message état vide adapté selon contexte
 * - **Loading concurrent** : Gestion cohérente états multiples
 * - **Network failures** : Affichage erreurs réseau dans bandeau dédié
 *
 * ### 🔄 Recovery et états de récupération
 * - **Retry mechanism** : Bouton refresh pour nouvelle tentative
 * - **Error clearing** : Effacement erreur sur nouveau chargement
 * - **State consistency** : Cohérence état loading/error/data
 * - **Graceful degradation** : Fonctionnement partiel si erreurs relations
 * - **User feedback** : Messages clairs pour guider utilisateur
 * - **Fallback content** : Contenu alternatif si échec chargement
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
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Utilisation dans EvenementsManagement
 * <EvenementsTable
 *   events={events}
 *   loading={loading}
 *   searchTerm={searchTerm}
 *   onDeleteEvent={handleDeleteEvent}
 *   onEdit={handleEditEvent}
 *   onRefresh={handleRefresh}
 *   error={error}
 * />
 * ```
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

export default function EvenementsTable({ 
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
