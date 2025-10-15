/**
 * Utilitaires de gestion des statuts d'événements sportifs AdminJO
 *
 * Ce module fournit des fonctions utilitaires pour calculer et formater les statuts
 * des événements sportifs des JO 2024. Il gère la logique temporelle et l'affichage
 * visuel des différents états d'avancement des événements.
 *
 * @module StatutEvenement
 * @category Utils - Evenement
 * @since 1.0.0
 */

import { ExtendEvenement, StatutEvenement } from "@/types/sportEvenement/evenement";

/**
 * Configuration des durées par défaut pour les événements
 *
 * @constant
 */
const DUREE_EVENEMENT_DEFAUT = 2 * 60 * 60 * 1000; // 2 heures en millisecondes

/**
 * Calcule le statut d'un événement basé sur sa date et son horaire
 *
 * Cette fonction détermine automatiquement le statut d'un événement sportif
 * en comparant la date/heure actuelle avec la période de l'événement.
 * Elle utilise une durée standard de 2 heures pour calculer la fin de l'événement.
 *
 * ## Logique de calcul
 *
 * 1. **À venir** : L'heure actuelle est antérieure au début de l'événement
 * 2. **En cours** : L'événement a commencé mais n'est pas encore terminé
 * 3. **Terminé** : L'heure actuelle dépasse la fin calculée de l'événement
 *
 * ## Gestion des fuseaux horaires
 *
 * La fonction utilise l'heure locale du navigateur pour les comparaisons.
 * Pour une application internationale, il serait recommandé d'utiliser
 * des timestamps UTC avec conversion appropriée.
 *
 * ## Performance
 *
 * Cette fonction est optimisée pour être appelée fréquemment :
 * - Calculs en millisecondes pour la précision
 * - Pas de dépendances externes lourdes
 * - Logique conditionnelle simple
 *
 * @param {string} eventDate - Date de l'événement au format ISO (YYYY-MM-DD)
 * @param {string} eventTime - Heure de début au format HH:MM
 * @returns {ExtendEvenement['status']} Le statut calculé de l'événement
 *
 * @example
 * ```typescript
 * // Événement futur
 * const status1 = getEventStatus('2024-08-01', '20:30');
 * console.log(status1); // 'à venir'
 *
 * // Événement en cours (si on est le 2024-08-01 à 21:00)
 * const status2 = getEventStatus('2024-08-01', '20:30');
 * console.log(status2); // 'en cours'
 *
 * // Événement terminé
 * const status3 = getEventStatus('2024-07-26', '09:00');
 * console.log(status3); // 'terminé'
 * ```
 *
 * @example
 * ```typescript
 * // Utilisation dans un composant React
 * function EventCard({ event }: { event: Evenement }) {
 *   const status = getEventStatus(event.date, event.horraire);
 *   const colorClass = getStatusColor(status);
 *
 *   return (
 *     <div className="event-card">
 *       <h3>{event.description}</h3>
 *       <span className={`badge ${colorClass}`}>
 *         {status}
 *       </span>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link ExtendEvenement} - Interface d'événement étendu
 * @see {@link getStatusColor} - Fonction compagnonne pour les couleurs
 *
 * @since 1.0.0
 */
export function getEventStatus(eventDate: string, eventTime: string): ExtendEvenement['status'] {
  const now = new Date();
  const eventDateTime = new Date(`${eventDate}T${eventTime}`);
  
  // Calculer la fin de l'événement (durée standard de 2 heures)
  const eventEndDateTime = new Date(eventDateTime.getTime() + DUREE_EVENEMENT_DEFAUT);

  if (now < eventDateTime) {
    return StatutEvenement.A_VENIR;
  } else if (now >= eventDateTime && now <= eventEndDateTime) {
    return StatutEvenement.EN_COURS;
  } else {
    return StatutEvenement.TERMINE;
  }
}

/**
 * Mapping des couleurs TailwindCSS pour chaque statut d'événement
 *
 * @constant
 */
const STATUS_COLOR_MAP = {
  'à venir': 'bg-blue-100 text-blue-800 border-blue-200',
  'en cours': 'bg-green-100 text-green-800 border-green-200',
  'terminé': 'bg-gray-100 text-gray-800 border-gray-200',
  'annulé': 'bg-red-100 text-red-800 border-red-200'
} as const;

/**
 * Retourne les classes CSS appropriées pour l'affichage d'un statut d'événement
 *
 * Cette fonction fournit un styling cohérent pour l'affichage des statuts
 * d'événements dans toute l'application AdminJO. Elle utilise la palette
 * de couleurs TailwindCSS pour assurer une harmonie visuelle.
 *
 * ## Palette de couleurs
 *
 * - **À venir** : Bleu - Indique l'anticipation et la planification
 * - **En cours** : Vert - Signale l'activité et le progrès
 * - **Terminé** : Gris - Représente la completion et l'archivage
 * - **Annulé** : Rouge - Alerte sur l'annulation (statut d'exception)
 *
 * ## Classes retournées
 *
 * Chaque statut retourne un ensemble de classes TailwindCSS :
 * - **Fond** : bg-{color}-100 pour un arrière-plan subtil
 * - **Texte** : text-{color}-800 pour un contraste optimal
 * - **Bordure** : border-{color}-200 pour la délimitation
 *
 * ## Utilisation recommandée
 *
 * ```tsx
 * <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
 *   {status}
 * </span>
 * ```
 *
 * @param {ExtendEvenement['status']} status - Le statut de l'événement
 * @returns {string} Classes CSS TailwindCSS pour le styling du statut
 *
 * @example
 * ```typescript
 * // Styling d'un badge de statut
 * const colorClasses = getStatusColor('en cours');
 * console.log(colorClasses); // 'bg-green-100 text-green-800 border-green-200'
 * ```
 *
 * @example
 * ```tsx
 * // Badge de statut complet
 * function StatusBadge({ status }: { status: ExtendEvenement['status'] }) {
 *   return (
 *     <span className={`
 *       inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
 *       ${getStatusColor(status)}
 *     `}>
 *       {status}
 *     </span>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Indicateur de statut avec icône
 * function StatusIndicator({ event }: { event: ExtendEvenement }) {
 *   const status = getEventStatus(event.date, event.horraire);
 *   const colorClass = getStatusColor(status);
 *
 *   return (
 *     <div className={`flex items-center gap-2 p-2 rounded ${colorClass}`}>
 *       <StatusIcon status={status} />
 *       <span className="capitalize">{status}</span>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link getEventStatus} - Fonction de calcul du statut
 * @see {@link ExtendEvenement} - Type d'événement avec statut
 *
 * @since 1.0.0
 */
export function getStatusColor(status: ExtendEvenement['status']): string {
  if (!status) return STATUS_COLOR_MAP['terminé'];
  return STATUS_COLOR_MAP[status] || STATUS_COLOR_MAP['terminé'];
}

/**
 * Fonction utilitaire pour formater l'affichage du statut avec capitalisation
 *
 * Standardise l'affichage textuel des statuts avec une capitalisation appropriée
 * pour l'interface utilisateur française.
 *
 * @param {ExtendEvenement['status']} status - Le statut à formater
 * @returns {string} Le statut formaté avec capitalisation
 *
 * @example
 * ```typescript
 * const formatted = formatStatusLabel('à venir');
 * console.log(formatted); // 'À venir'
 * ```
 *
 * @since 1.0.0
 */
export function formatStatusLabel(status: ExtendEvenement['status']): string {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Vérifie si un événement est actif (à venir ou en cours)
 *
 * Fonction utilitaire pour déterminer si un événement doit être considéré
 * comme "actif" dans l'interface utilisateur (pas terminé ni annulé).
 *
 * @param {ExtendEvenement['status']} status - Le statut à vérifier
 * @returns {boolean} True si l'événement est actif
 *
 * @example
 * ```typescript
 * const isActive = isEventActive('en cours'); // true
 * const isInactive = isEventActive('terminé'); // false
 * ```
 *
 * @since 1.0.0
 */
export function isEventActive(status: ExtendEvenement['status']): boolean {
  return status === 'à venir' || status === 'en cours';
}
