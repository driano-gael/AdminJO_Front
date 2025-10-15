/**
 * Types TypeScript pour les notifications système dans l'application AdminJO
 *
 * Ce module définit les interfaces pour les notifications utilisateur,
 * incluant les messages de succès, d'erreur et d'information affichés
 * dans l'interface utilisateur.
 *
 * @module types/common/notification
 */

/**
 * Interface représentant une notification utilisateur.
 *
 * Une notification est un message temporaire affiché à l'utilisateur
 * pour l'informer du résultat d'une action (succès, erreur) ou
 * pour lui communiquer des informations importantes.
 */
export interface Notification {
  /** Contenu textuel du message à afficher à l'utilisateur */
  message: string;
  /** Type de notification déterminant le style et l'icône d'affichage */
  type: 'success' | 'error' | 'info';
}