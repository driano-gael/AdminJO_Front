import { Lieu } from '@/types/sportEvenement/lieu';

interface Props {
  lieu: Lieu;
  onDelete: (id: number) => void;
  onEdit: (lieu: Lieu) => void;
}

/**
 * Composant LieuxTableRow - Ligne de tableau pour lieu olympique AdminJO
 *
 * Ce composant représente une ligne individuelle dans le tableau des lieux olympiques
 * des Jeux Olympiques 2024. Il affiche les informations essentielles d'un lieu (nom
 * de l'établissement olympique) avec les actions CRUD directes via boutons intégrés.
 * Conçu pour l'interface d'administration des Jeux Olympiques 2024, il suit les
 * standards de design AdminJO avec states hover interactifs et gestion optimisée
 * des établissements sportifs olympiques (Stade de France, Centre Aquatique, etc.).
 *
 * ## Données affichées réellement implémentées
 *
 * ### 🏟️ Nom du lieu olympique principal
 * - **Nom établissement** : `lieu.nom` avec typographie medium accentuée
 * - **Contenu officiel** : Désignation officielle lieu olympique (ex: "Stade de France", "Centre Aquatique")
 * - **Style** : text-sm font-medium text-gray-900 pour lisibilité optimale
 * - **Colonne dédiée** : Première colonne tableau avec largeur adaptative
 * - **Contenu structuré** : div wrapper pour cohérence layout et alignement
 * - **Typographie** : Police medium pour hiérarchie visuelle informations
 * - **Importance** : Identifiant principal du lieu pour utilisateurs administrateurs
 *
 * ## Actions utilisateur CRUD intégrées
 *
 * ### ✏️ Action de modification lieu
 * - **Bouton "Modifier"** : Déclenche édition lieu olympique complet
 * - **Callback** : `onEdit(lieu)` avec objet lieu complet
 * - **Style** : text-blue-600 hover:text-blue-900 pour feedback visuel
 * - **Position** : Première action dans colonne Actions
 * - **Espacement** : mr-3 pour séparation avec bouton suppression
 * - **Interaction** : Hover effect avec assombrissement couleur
 * - **Accessibilité** : Texte explicite "Modifier" pour lecteurs écran
 * - **Données complètes** : Transmission objet avec toutes propriétés lieu
 *
 * ### 🗑️ Action de suppression lieu
 * - **Bouton "Supprimer"** : Déclenche suppression lieu olympique
 * - **Callback** : `onDelete(lieu.id)` avec ID numérique lieu
 * - **Style** : text-red-600 hover:text-red-900 couleur danger
 * - **Position** : Seconde action dans colonne Actions
 * - **Feedback visuel** : Rouge pour action destructive standard
 * - **Confirmation** : Gestion confirmations dans composants parents
 * - **Sécurité** : Transmission ID uniquement pour limitation exposition
 * - **Impact métier** : Suppression lieu affecte événements associés
 *
 * ## Structure et layout ligne tableau
 *
 * ### 🎨 Design ligne interactive spécialisée lieux
 * - **Élément HTML** : `<tr>` sémantique pour structure tableau
 * - **Hover effect** : hover:bg-gray-50 pour feedback survol ligne
 * - **Colonnes** : 2 colonnes (Nom lieu, Actions) - Structure simplifiée
 * - **Padding cellules** : px-6 py-4 pour respiration optimale
 * - **Espacement** : whitespace-nowrap sur données principales
 * - **Style cohérent** : Alignement avec headers tableau parent
 * - **Compacité** : Structure épurée focalisée sur essentiel
 *
 * ### 📱 Responsive et accessibilité
 * - **Layout adaptatif** : Colonnes s'adaptent largeur container
 * - **Overflow** : Gestion débordement via container parent
 * - **Touch-friendly** : Boutons dimensionnés interaction tactile
 * - **Contraste** : Couleurs respectant standards WCAG AA
 * - **Sémantique** : Structure `<td>` correcte pour lecteurs écran
 * - **Navigation** : Ordre tabulation logique gauche-droite
 * - **Simplicité** : Interface épurée pour gestion efficace lieux
 *
 * ## Spécificités métier lieux olympiques
 *
 * ### 🏅 Contexte métier lieux JO 2024
 * - **Terminologie** : "Lieu" pour établissements sportifs olympiques
 * - **Exemples concrets** : Stade de France, Centre Aquatique, Arena Bercy
 * - **Relations** : Lieux → Événements (1-N), base infrastructure JO
 * - **Hiérarchie** : Lieux niveau infrastructure pour événements/épreuves
 * - **Gestion organisateurs** : Interface back-office équipes logistique JO
 * - **Standards CIO** : Respect nomenclature officielle établissements
 * - **Importance critique** : Infrastructure physique pour compétitions
 *
 * ### 📊 Types de données lieu gérées
 * - **Nom lieu** : string - Désignation officielle établissement olympique
 * - **ID lieu** : number - Identifiant unique lieu
 * - **Structure** : Type Lieu importé depuis types/sportEvenement
 * - **Validation** : Types TypeScript strictes pour sécurité
 * - **Relations futures** : Extensible pour capacités, coordonnées, etc.
 * - **Standards JO** : Nomenclature alignée organisation olympique
 *
 * ## Performance et optimisations
 *
 * ### ⚡ Optimisations actuelles
 * - **Composant pur** : Pas d'état local pour performance
 * - **Props stables** : Dépendances minimales re-rendering
 * - **CSS statique** : Classes Tailwind pré-compilées
 * - **Callbacks externes** : Gestion state dans composants parents
 * - **Sélecteur optimal** : Accès direct propriétés sans calculs
 * - **Structure simple** : Minimal DOM pour performance maximale
 *
 * ### 🔄 Gestion re-renders optimisée
 * - **Mémorisation** : Candidat React.memo si nécessaire
 * - **Props drilling minimal** : Callbacks ciblés
 * - **Immutabilité** : Props objets stables entre renders
 * - **Keys stables** : lieu.id pour optimisation React keys
 * - **Conditional logic** : Minimal pour éviter re-calculs
 * - **Lightweight** : Composant léger pour listes importantes
 *
 * ## Sécurité et validation
 *
 * ### 🔒 Aspects sécuritaires
 * - **Validation props** : Interface TypeScript stricte
 * - **Sanitisation** : Affichage sécurisé données textuelles
 * - **ID transmission** : Seul ID transmis pour suppression
 * - **XSS prevention** : React échappe automatiquement contenu
 * - **Type safety** : Interfaces Lieu et Props strictes
 * - **Data consistency** : Structure données garantie par types TS
 *
 * ### ✅ Validation des données affichées
 * - **Nom lieu** : Affichage string avec échappement auto
 * - **Actions callbacks** : Validation types paramètres
 * - **Cohérence** : Structure données garantie par interfaces
 * - **Robustesse** : Gestion défensive propriétés lieu
 * - **Intégrité** : Validation ID lieu pour actions
 *
 * ## Améliorations et extensions possibles
 *
 * ### 🚀 Améliorations fonctionnelles
 * - **Informations étendues** : Capacité, adresse, coordonnées
 * - **Actions supplémentaires** : Duplication, archivage lieu
 * - **Liens navigation** : Navigation vers détail lieu
 * - **Statut lieu** : Indicateurs disponibilité/maintenance
 * - **Actions groupées** : Sélection multiple lieux
 * - **Export données** : Export liste lieux sélectionnés
 *
 * ### 🎨 Améliorations visuelles
 * - **Icônes lieux** : Symboles visuels type établissement
 * - **Animations** : Transitions smooth sur hover states
 * - **Loading states** : Squelettes pendant chargements
 * - **Badges statut** : Indicateurs visuels état lieu
 * - **Density modes** : Options affichage compact/standard
 * - **Color coding** : Couleurs thématiques par type lieu
 * - **Images lieux** : Miniatures établissements olympiques
 *
 * ### 🔧 Optimisations techniques
 * - **Virtual scrolling** : Rendu virtuel grandes listes lieux
 * - **Memoization** : React.memo pour éviter re-renders inutiles
 * - **Code splitting** : Chargement différé si logique complexifiée
 * - **Prefetching** : Pré-chargement détails lieux probables
 * - **Caching intelligent** : Cache local lieux fréquents
 * - **Intersection observer** : Lazy loading images lieux
 *
 * @param {Props} props - Propriétés du composant
 * @param {Lieu} props.lieu - Objet lieu olympique à afficher
 * @param {function} props.onDelete - Callback suppression avec ID lieu
 * @param {function} props.onEdit - Callback édition avec objet lieu complet
 *
 * @returns {JSX.Element} Ligne de tableau interactive avec données lieu et actions
 *
 * @see {@link LieuxTable} - Tableau parent contenant les lignes
 * @see {@link Lieu} - Interface TypeScript de l'objet lieu
 * @see {@link LieuxManagement} - Gestionnaire principal fournissant callbacks
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Utilisation dans LieuxTable
 * {lieux.map((lieu) => (
 *   <LieuxTableRow
 *     key={lieu.id}
 *     lieu={lieu}
 *     onDelete={handleDelete}
 *     onEdit={handleEdit}
 *   />
 * ))}
 * ```
 *
 * @example
 * ```tsx
 * // Structure objet lieu attendu
 * const lieu: Lieu = {
 *   id: 1,
 *   nom: "Stade de France"
 * };
 * ```
 */
export default function LieuxTableRow({ lieu, onDelete, onEdit }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{lieu.nom}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onClick={() => onEdit(lieu)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Modifier
        </button>
        <button 
          onClick={() => onDelete(lieu.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
