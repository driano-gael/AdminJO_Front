import { getEventStatus, getStatusColor } from "@/utils/evenement/statutEvenement";
import {JSX} from "react";

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
 * ### Calcul statut dynamique via utilitaires
 * - **Fonction utilitaire** : `getEventStatus(date, time)` pour logique temporelle
 * - **Paramètres temporels** : Date string + Time string pour calcul précis
 * - **Comparaison système** : Horloge système vs date/heure événement programmé
 * - **États calculés** : "À venir", "En cours", "Terminé" selon timing relatif
 * - **Logique externalisée** : Calculs complexes dans utils/evenement/statutEvenement
 * - **Réutilisabilité** : Logique partageable autres composants système
 *
 *
 * ### Mise à jour automatique temps réel
 * - **Recalcul automatique** : Re-render composant → nouveau calcul statut
 * - **Réactivité temporelle** : Statut change automatiquement selon passage temps
 * - **Pas de timer interne** : Dépend re-renders parent pour mise à jour
 * - **Performance optimisée** : Calculs légers via fonctions utilitaires
 * - **Cohérence visuelle** : Couleurs mises à jour synchronisées avec statut
 * - **États transitoires** : Gestion passage "À venir" → "En cours" → "Terminé"
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
 */
export function EventStatus({ date, time }: EventStatusProps): JSX.Element {
  const status = getEventStatus(date, time);
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
export default EventStatus;
