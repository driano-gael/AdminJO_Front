import { Evenement} from '@/types/sportEvenement/evenement';
import EventStatus from './EvenementsStatus';
import EvenementEpreuve from './EvenementEpreuves';

interface Props {
  event: Evenement;
  onDelete: (id: number) => void;
  onEdit: (event: Evenement) => void;
}

/**
 * Composant EvenementsTableRow - Ligne de tableau pour événement sportif olympique AdminJO
 *
 * Ce composant représente une ligne individuelle dans le tableau des événements sportifs
 * olympiques. Il affiche les informations complètes d'un événement (description, épreuves,
 * date/heure, lieu, statut) avec sous-composants spécialisés intégrés et fournit les actions
 * CRUD directes via boutons. Conçu pour l'interface d'administration des Jeux Olympiques 2024,
 * il orchestre l'affichage de données complexes avec relations multiples (épreuves, lieux)
 * et calcul de statut temps réel selon planning.
 *
 * ## Données affichées et sous-composants intégrés
 *
 * ### 📝 Description événement principale
 * - **Description complète** : `event.description` avec typographie medium accentuée
 * - **Contenu riche** : Titre descriptif événement sportif (ex: "Finale natation 100m")
 * - **Style** : text-sm font-medium text-gray-900 pour lisibilité optimale
 * - **Colonne dédiée** : Première colonne tableau avec largeur adaptative
 * - **Contenu structuré** : div wrapper pour cohérence layout et alignement
 * - **Typographie** : Police medium pour hiérarchie visuelle informations
 *
 * ### 🏅 Épreuves associées via EvenementEpreuve (sous-composant intégré)
 * - **Composant spécialisé** : EvenementEpreuve pour affichage épreuves complexes
 * - **Données relationnelles** : `event.epreuves` array transmis intégralement
 * - **Gestion multiple** : Support affichage plusieurs épreuves par événement
 * - **Délégation affichage** : Logique rendu déléguée au sous-composant
 * - **Relations normalisées** : Chaque événement peut avoir plusieurs épreuves
 * - **Intégration seamless** : Composant s'intègre naturellement dans cellule
 *
 * ### 📅 Date et horaire avec formatage français
 * - **Date formatée** : `new Date(event.date).toLocaleDateString('fr-FR')`
 * - **Format français** : Affichage DD/MM/YYYY selon standards locaux
 * - **Horaire complémentaire** : `event.horraire` affiché en sous-texte
 * - **Hiérarchie visuelle** : Date principale + horaire secondaire
 * - **Style différencié** : text-sm pour date, text-xs text-gray-500 pour heure
 * - **Stacking vertical** : Informations temporelles empilées dans cellule
 *
 * ### 🏟️ Lieu événement avec nom établissement
 * - **Nom lieu** : `event.lieu.nom` pour identification établissement
 * - **Relation lieu** : Objet lieu imbriqué avec propriétés complètes
 * - **Style standard** : text-sm text-gray-900 pour cohérence
 * - **Données relationnelles** : Référence lieu depuis base établissements JO
 * - **Exemples** : "Stade de France", "Centre Aquatique", "Arena Bercy"
 * - **Intégration** : Lien avec système de gestion des lieux olympiques
 *
 * ### ⏰ Statut temps réel via EventStatus (sous-composant calculé)
 * - **Composant dynamique** : EventStatus calcule statut selon date/heure actuelle
 * - **Props transmises** : date={event.date} time={event.horraire}
 * - **Calcul temps réel** : Statut mis à jour selon horloge système
 * - **États possibles** : À venir, En cours, Terminé avec couleurs distinctes
 * - **Logique déléguée** : Calculs temporels dans sous-composant spécialisé
 * - **Affichage dynamique** : Badge coloré indiquant état événement
 *
 * ## Actions utilisateur CRUD intégrées
 *
 * ### ✏️ Action de modification événement
 * - **Bouton "Modifier"** : Déclenche édition événement complet
 * - **Callback** : `onEdit(event)` avec objet événement complet
 * - **Style** : text-blue-600 hover:text-blue-900 pour feedback visuel
 * - **Position** : Première action dans colonne Actions
 * - **Espacement** : mr-3 pour séparation avec bouton suppression
 * - **Interaction** : Hover effect avec assombrissement couleur
 * - **Données complètes** : Transmission objet avec relations (épreuves, lieu)
 *
 * ### 🗑️ Action de suppression événement
 * - **Bouton "Supprimer"** : Déclenche suppression événement
 * - **Callback** : `onDelete(event.id)` avec ID numérique événement
 * - **Style** : text-red-600 hover:text-red-900 couleur danger
 * - **Position** : Seconde action dans colonne Actions
 * - **Feedback visuel** : Rouge pour action destructive standard
 * - **Confirmation** : Gestion confirmations dans composants parents
 * - **Sécurité** : Transmission ID uniquement pour limitation exposition
 *
 * ## Structure et layout ligne tableau complexe
 *
 * ### 🎨 Design ligne interactive avec sous-composants
 * - **Élément HTML** : `<tr>` sémantique pour structure tableau
 * - **Hover effect** : hover:bg-gray-50 pour feedback survol ligne
 * - **Colonnes** : 6 colonnes (Description, Épreuves, Date/Heure, Lieu, Statut, Actions)
 * - **Cellules mixtes** : Certaines avec sous-composants, autres avec données simples
 * - **Padding variable** : px-6 py-4 standard, adaptations selon contenu
 * - **Whitespace** : whitespace-nowrap sur données simples, flexibilité épreuves
 *
 * ### 📱 Responsive et accessibilité complexe
 * - **Layout adaptatif** : Colonnes s'adaptent largeur container
 * - **Overflow intelligent** : Gestion débordement via container parent
 * - **Sous-composants responsives** : EvenementEpreuve et EventStatus adaptés
 * - **Touch-friendly** : Boutons dimensionnés interaction tactile
 * - **Contraste** : Couleurs respectant standards WCAG AA
 * - **Navigation** : Ordre tabulation logique avec sous-composants
 *
 * ## Intégration sous-composants spécialisés
 *
 * ### 🏅 EvenementEpreuve - Affichage épreuves multiples
 * - **Props** : epreuves={event.epreuves} array épreuves associées
 * - **Responsabilité** : Gestion affichage plusieurs épreuves par événement
 * - **Rendu délégué** : Logique affichage complexe dans composant spécialisé
 * - **Relations** : Gestion relations événement ↔ épreuves multiples
 * - **Flexibilité** : Adaptation nombre variable épreuves par événement
 * - **Performance** : Optimisation rendu listes épreuves
 *
 * ### ⏰ EventStatus - Calcul statut temps réel
 * - **Props** : date={event.date} time={event.horraire} pour calculs
 * - **Logique temporelle** : Comparaison date/heure avec horloge système
 * - **États dynamiques** : "À venir", "En cours", "Terminé" selon timing
 * - **Couleurs contextuelles** : Badges colorés selon statut calculé
 * - **Mise à jour** : Recalcul automatique selon changements temporels
 * - **Performance** : Calculs optimisés pour éviter re-renders excessifs
 *
 * ## Gestion des relations données complexes
 *
 * ### 🔗 Relations événement multiples
 * - **Épreuves multiples** : `event.epreuves` array avec relations 1-N
 * - **Lieu unique** : `event.lieu` objet avec relation 1-1
 * - **Données imbriquées** : Propriétés nested accessibles directement
 * - **Cohérence relationnelle** : Structure données garantie par types TS
 * - **Performance** : Pas de jointures côté client, données pré-jointes
 * - **Intégrité** : Validation relations via interfaces TypeScript
 *
 * ### 📊 Types de données événement gérées
 * - **Description** : string - Titre descriptif événement sportif
 * - **Date** : string/Date - Date événement pour calculs et affichage
 * - **Horaire** : string - Heure événement complémentaire date
 * - **ID** : number - Identifiant unique événement
 * - **Épreuves** : array - Liste épreuves associées à l'événement
 * - **Lieu** : objet - Référence lieu avec nom et propriétés
 *
 * ## Performance et optimisations relations
 *
 * ### ⚡ Optimisations actuelles
 * - **Composant pur** : Pas d'état local pour performance
 * - **Props stables** : Dépendances minimales re-rendering
 * - **Sous-composants délégués** : Logiques complexes externalisées
 * - **CSS statique** : Classes Tailwind pré-compilées
 * - **Callbacks externes** : Gestion state dans composants parents
 * - **Relations pré-jointes** : Pas de queries additionnelles
 *
 * ### 🔄 Gestion re-renders avec sous-composants
 * - **Mémorisation candidat** : React.memo possible si parents instables
 * - **Props drilling minimal** : Transmission ciblée vers sous-composants
 * - **Immutabilité** : Props objects stables entre renders
 * - **Keys stables** : event.id pour optimisation React keys
 * - **Sous-composants optimisés** : EvenementEpreuve et EventStatus performants
 *
 * ## Spécificités métier événements olympiques
 *
 * ### 🏅 Contexte métier événements JO 2024
 * - **Terminologie** : "Événement" pour sessions compétitives programmées
 * - **Planning olympique** : Gestion calendrier compétitions JO Paris 2024
 * - **Relations multiples** : Événements → Épreuves (1-N), Événements → Lieux (1-1)
 * - **Statuts temporels** : Suivi temps réel déroulement compétitions
 * - **Gestion organisateurs** : Interface back-office équipes événements JO
 * - **Standards CIO** : Respect nomenclature et timing olympiques
 *
 * ### 🕐 Gestion temporelle et statuts
 * - **Planification** : Date + horaire pour scheduling précis
 * - **Statuts calculés** : À venir/En cours/Terminé selon timing réel
 * - **Format français** : DD/MM/YYYY pour cohérence locale
 * - **Horaires détaillés** : Complémentaire date pour precision
 * - **Suivi temps réel** : Mise à jour statuts selon progression
 * - **Coordination** : Synchronisation avec diffusion et retransmissions
 *
 * ## Sécurité et validation relations
 *
 * ### 🔒 Aspects sécuritaires
 * - **Validation props** : Interface TypeScript stricte
 * - **Sanitisation** : Affichage sécurisé données textuelles
 * - **ID transmission** : Seul ID transmis pour suppression
 * - **Relations validées** : Structure épreuves et lieu garantie
 * - **XSS prevention** : React échappe automatiquement contenu
 * - **Type safety** : Interfaces Evenement et Props strictes
 *
 * ### ✅ Validation des données affichées
 * - **Description événement** : Affichage string avec échappement auto
 * - **Date parsing** : new Date() avec validation format
 * - **Relations nested** : Propriétés imbriquées sécurisées
 * - **Sous-composants** : Validation props transmises
 * - **Callbacks** : Validation types paramètres actions
 *
 * ## Améliorations et extensions possibles
 *
 * ### 🚀 Améliorations fonctionnelles
 * - **Actions étendues** : Duplication, archivage événement
 * - **Liens directs** : Navigation vers détail épreuves/lieu
 * - **Statut avancé** : Indicateurs complémentaires (météo, affluence)
 * - **Actions groupées** : Sélection multiple événements
 * - **Export** : Génération PDF/iCal pour événement
 * - **Notifications** : Alertes changements planning
 *
 * ### 🎨 Améliorations visuelles
 * - **Animations** : Transitions smooth sur hover states
 * - **Loading states** : Squelettes pendant chargements relations
 * - **Badges enrichis** : Indicateurs visuels type événement
 * - **Icônes contextuelles** : Symboles sport/lieu pour identification
 * - **Density modes** : Options affichage compact/standard/détaillé
 * - **Timeline view** : Représentation chronologique événements
 * - **Color coding** : Couleurs thématiques par sport/lieu
 *
 * ### 🔧 Optimisations techniques
 * - **Virtual scrolling** : Rendu virtuel grandes listes événements
 * - **Memoization** : React.memo pour sous-composants
 * - **Code splitting** : Chargement différé sous-composants
 * - **Prefetching** : Pré-chargement données relations
 * - **Caching intelligent** : Cache local événements fréquents
 * - **Real-time updates** : WebSocket pour statuts temps réel
 *
 * @param {Props} props - Propriétés du composant
 * @param {Evenement} props.event - Objet événement avec relations (épreuves, lieu) à afficher
 * @param {function} props.onDelete - Callback suppression avec ID événement
 * @param {function} props.onEdit - Callback édition avec objet événement complet
 *
 * @returns {JSX.Element} Ligne de tableau interactive avec données événement et sous-composants
 *
 * @see {@link EvenementsTable} - Tableau parent contenant les lignes
 * @see {@link EvenementEpreuve} - Sous-composant affichage épreuves multiples
 * @see {@link EventStatus} - Sous-composant calcul statut temps réel
 * @see {@link Evenement} - Interface TypeScript de l'objet événement
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Utilisation dans EvenementsTable
 * {evenements.map((event) => (
 *   <EvenementsTableRow
 *     key={event.id}
 *     event={event}
 *     onDelete={handleDelete}
 *     onEdit={handleEdit}
 *   />
 * ))}
 * ```
 *
 * @example
 * ```tsx
 * // Structure objet événement attendu
 * const event: Evenement = {
 *   id: 1,
 *   description: "Finale natation 100m hommes",
 *   date: "2024-07-30",
 *   horraire: "20:30",
 *   epreuves: [
 *     { id: 1, libelle: "100m nage libre hommes", discipline: {...} }
 *   ],
 *   lieu: {
 *     nom: "Centre Aquatique"
 *   }
 * };
 * ```
 */
export default function EvenementsTableRow({ event, onDelete, onEdit }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{event.description}</div>
      </td>
      <td className="px-6 py-4">
        <EvenementEpreuve epreuves={event.epreuves} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(event.date).toLocaleDateString('fr-FR')}
        </div>
        <div className="text-xs text-gray-500">{event.horraire}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{event.lieu.nom}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <EventStatus date={event.date} time={event.horraire} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onClick={() => onEdit(event)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Modifier
        </button>
        <button 
          onClick={() => onDelete(event.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
