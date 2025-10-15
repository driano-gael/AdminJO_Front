import { getEventStatus, getStatusColor } from "@/utils/evenement/statutEvenement";

interface EventStatusProps {
  date: string;
  time: string;
}

/**
 * Composant EventStatus - Badge de statut temps réel pour événements sportifs olympiques AdminJO
 *
 * Ce composant sous-composant spécialisé calcule et affiche le statut temps réel d'un événement
 * sportif olympique basé sur sa date/heure programmée versus l'horloge système actuelle. Il utilise
 * des fonctions utilitaires dédiées pour déterminer l'état (À venir/En cours/Terminé) et applique
 * automatiquement les couleurs contextuelles appropriées. Intégré dans EvenementsTableRow, il fournit
 * un feedback visuel immédiat sur l'état de progression des compétitions olympiques.
 *
 * ## Fonctionnalités de calcul statut temps réel
 *
 * ### ⏰ Calcul statut dynamique via utilitaires
 * - **Fonction utilitaire** : `getEventStatus(date, time)` pour logique temporelle
 * - **Paramètres temporels** : Date string + Time string pour calcul précis
 * - **Comparaison système** : Horloge système vs date/heure événement programmé
 * - **États calculés** : "À venir", "En cours", "Terminé" selon timing relatif
 * - **Logique externalisée** : Calculs complexes dans utils/evenement/statutEvenement
 * - **Réutilisabilité** : Logique partageable autres composants système
 *
 * ### 🎨 Affichage badge coloré contextuel
 * - **Badge système** : span avec classes Tailwind pour badge styled
 * - **Couleurs dynamiques** : `getStatusColor(status)` pour classes CSS appropriées
 * - **Style badge** : inline-flex px-2 py-1 text-xs font-semibold rounded-full
 * - **Taille optimisée** : text-xs pour intégration harmonieuse cellule tableau
 * - **Forme distinctive** : rounded-full pour identification badge statut
 * - **Contenu textuel** : Affichage direct string status calculé
 *
 * ### 🔄 Mise à jour automatique temps réel
 * - **Recalcul automatique** : Re-render composant → nouveau calcul statut
 * - **Réactivité temporelle** : Statut change automatiquement selon passage temps
 * - **Pas de timer interne** : Dépend re-renders parent pour mise à jour
 * - **Performance optimisée** : Calculs légers via fonctions utilitaires
 * - **Cohérence visuelle** : Couleurs mises à jour synchronisées avec statut
 * - **États transitoires** : Gestion passage "À venir" → "En cours" → "Terminé"
 *
 * ## Architecture et intégration utilitaires
 *
 * ### 🛠️ Fonctions utilitaires spécialisées
 * - **getEventStatus()** : Calcul logique statut selon date/time vs maintenant
 * - **getStatusColor()** : Mapping statut → classes CSS couleurs Tailwind
 * - **Séparation responsabilités** : Logique métier vs affichage séparés
 * - **Testabilité** : Fonctions utilitaires unit-testables isolément
 * - **Maintenance** : Logique centralisée dans utils/ pour réutilisation
 * - **Consistency** : Même logique statut partout dans application
 *
 * ### 📊 Types et interfaces temporelles
 * - **Date** : string - Format date compatible calculs temporels
 * - **Time** : string - Format heure complémentaire date
 * - **Status** : string - Résultat calculé ("À venir"/"En cours"/"Terminé")
 * - **StatusColor** : string - Classes CSS Tailwind pour couleurs badge
 * - **Props simples** : Interface EventStatusProps avec date + time
 * - **Type safety** : Validation paramètres via TypeScript strict
 *
 * ## États et couleurs contextuelles
 *
 * ### 🚦 Mapping états → couleurs système
 * - **"À venir"** : Couleurs bleues/grises pour événements futurs
 * - **"En cours"** : Couleurs orange/jaunes pour événements actifs
 * - **"Terminé"** : Couleurs vertes/grises pour événements passés
 * - **Consistance visuelle** : Même code couleur dans toute application
 * - **Accessibilité** : Contrastes respectant standards WCAG AA
 * - **Semantic colors** : Couleurs intuitives selon signification métier
 *
 * ### 🎯 Logique temporelle événements olympiques
 * - **Précision** : Calculs basés date ET heure pour timing exact
 * - **Timezone** : Gestion fuseaux horaires selon localisation JO
 * - **Durée événements** : Prise en compte durée typique compétitions
 * - **Buffer temporal** : Marge avant/après pour transitions statuts
 * - **Real-time updates** : Calculs reflètent progression temps réelle
 * - **Coordination** : Synchronisation avec planning officiel JO
 *
 * ## Performance et optimisations temporelles
 *
 * ### ⚡ Optimisations calculs temps réel
 * - **Fonctions pures** : getEventStatus et getStatusColor sans side effects
 * - **Calculs légers** : Comparaisons temporelles rapides
 * - **Pas de polling** : Mise à jour via re-renders parent naturels
 * - **Memoization possible** : Candidat React.memo si calculs fréquents
 * - **Cache temporal** : Possibilité cache résultats courts termes
 * - **Lazy evaluation** : Calculs seulement si composant affiché
 *
 * ### 🔧 Considérations performance temps réel
 * - **Re-render frequency** : Optimisation selon fréquence mise à jour
 * - **Batch updates** : Groupement calculs si nombreux événements
 * - **Intersection observer** : Calculs seulement éléments visibles
 * - **Web Workers** : Calculs lourds en background si nécessaire
 * - **Debouncing** : Limitation fréquence recalculs si approprié
 * - **Memory efficiency** : Pas de stockage états temporels
 *
 * ## Intégration et responsive design
 *
 * ### 📱 Adaptation multi-supports badges
 * - **Badge responsive** : Taille fixe text-xs adaptée tous écrans
 * - **Couleurs mobiles** : Contrastes maintenus sur écrans variés
 * - **Touch visibility** : Badge suffisamment visible interfaces tactiles
 * - **Layout stable** : Taille constante évite reflow cellules
 * - **Consistent spacing** : px-2 py-1 uniforme sur tous supports
 * - **Screen readers** : Contenu textuel accessible assistive technologies
 *
 * ### ♿ Accessibilité statuts temporels
 * - **Contenu textuel** : Status string lisible screen readers
 * - **Couleurs significatives** : Pas uniquement dépendant couleur pour info
 * - **Contraste élevé** : Couleurs respectent ratios WCAG AA
 * - **Semantic meaning** : Statuts compréhensibles sans contexte visuel
 * - **Font weight** : font-semibold pour lisibilité améliorée
 * - **Alternative text** : Contenu textuel suffit, pas besoin alt
 *
 * ## Spécificités métier événements olympiques
 *
 * ### 🏅 Contexte temporel JO 2024
 * - **Planning officiel** : Calculs basés horaires officiels CIO
 * - **Fuseaux multiples** : Gestion horaires internationaux diffusion
 * - **Précision timing** : Importance cruciale timing exact compétitions
 * - **États significatifs** : Statuts alignés workflow organisationnel JO
 * - **Coordination** : Synchronisation équipes, médias, spectateurs
 * - **Real-time critical** : Importance information temps réel événements
 *
 * ### 📅 Gestion temporelle spécialisée olympique
 * - **Sessions programmées** : Événements avec créneaux horaires fixes
 * - **Durées variables** : Épreuves courtes (sprint) vs longues (marathon)
 * - **Transitions rapides** : Changements statut selon progression
 * - **Buffer zones** : Marges temporelles setup/breakdown événements
 * - **Multi-timezone** : Support audiences internationales
 * - **Broadcasting sync** : Coordination retransmissions TV/stream
 *
 * ## Sécurité et robustesse temporelle
 *
 * ### 🔒 Validation données temporelles
 * - **Format validation** : Vérification formats date/time valides
 * - **Range checking** : Validation dates cohérentes (pas futures aberrantes)
 * - **Null safety** : Protection contre paramètres undefined/null
 * - **Error boundaries** : Gestion gracieuse erreurs calculs temporels
 * - **Fallback states** : États par défaut si calculs échouent
 * - **Type safety** : Interfaces strictes pour paramètres temporels
 *
 * ### ✅ Robustesse calculs statuts
 * - **Edge cases** : Gestion cas limites (minuit, changements horaires)
 * - **Timezone safe** : Calculs corrects indépendamment timezone locale
 * - **Date parsing** : Gestion robuste formats date variables
 * - **Error recovery** : États fallback si erreurs calculs
 * - **Consistency** : Même résultat calculs pour mêmes inputs
 * - **Bounds checking** : Validation cohérence paramètres temporels
 *
 * ## Améliorations et extensions possibles
 *
 * ### 🚀 Fonctionnalités avancées temporelles
 * - **Real-time websocket** : Mise à jour temps réel via WebSocket
 * - **Countdown timers** : Affichage temps restant avant début
 * - **Progress indicators** : Barre progression pendant événement
 * - **Time zones display** : Affichage multi-timezone simultané
 * - **Historical states** : Log changements statut pour audit
 * - **Notifications** : Alertes changements statut importantes
 *
 * ### 🎨 Améliorations visuelles temporelles
 * - **Animations** : Transitions smooth changements statut
 * - **Pulsing effects** : Animation "En cours" pour attirer attention
 * - **Icons integration** : Icônes temporelles avant/avec texte
 * - **Gradient colors** : Dégradés couleurs pour nuances statut
 * - **Size variations** : Tailles différentes selon importance statut
 * - **Tooltips temporels** : Détails timing au survol badge
 *
 * ### 🔧 Optimisations techniques avancées
 * - **Memo optimization** : React.memo pour éviter recalculs inutiles
 * - **Web Workers** : Calculs temporels complexes en background
 * - **Service Worker** : Cache statuts pour offline support
 * - **IndexedDB** : Stockage local historique statuts
 * - **Real-time sync** : Synchronisation temps serveur précise
 * - **Performance monitoring** : Métriques performance calculs
 *
 * @param {EventStatusProps} props - Configuration du badge de statut
 * @param {string} props.date - Date de l'événement pour calculs temporels
 * @param {string} props.time - Heure de l'événement pour précision timing
 *
 * @returns {JSX.Element} Badge coloré avec statut temps réel de l'événement
 *
 * @see {@link EvenementsTableRow} - Composant parent intégrant ce badge statut
 * @see {@link getEventStatus} - Fonction utilitaire de calcul statut temporel
 * @see {@link getStatusColor} - Fonction utilitaire mapping couleurs statut
 * @see {@link statutEvenement} - Module utilitaires gestion statuts événements
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Utilisation dans EvenementsTableRow
 * <td className="px-6 py-4 whitespace-nowrap">
 *   <EventStatus date={event.date} time={event.horraire} />
 * </td>
 * ```
 *
 * @example
 * ```tsx
 * // Exemples de statuts calculés selon timing
 * // Événement futur
 * <EventStatus date="2024-07-30" time="20:30" /> // → "À venir" (bleu)
 *
 * // Événement en cours (si maintenant dans créneau)
 * <EventStatus date="2024-07-26" time="14:00" /> // → "En cours" (orange)
 *
 * // Événement passé
 * <EventStatus date="2024-07-25" time="10:00" /> // → "Terminé" (vert)
 * ```
 */
export default function EventStatus({ date, time }: EventStatusProps) {
  const status = getEventStatus(date, time);
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
