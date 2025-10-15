/**
 * Types TypeScript pour la gestion des disciplines sportives dans l'application AdminJO
 *
 * Ce module définit les interfaces pour les disciplines olympiques,
 * représentant les différents sports organisés lors des Jeux Olympiques
 * avec leurs icônes et métadonnées associées.
 *
 * @module types/sportEvenement/discipline
 */

/**
 * Interface représentant une discipline sportive olympique.
 *
 * Une discipline est une catégorie sportive officielle des Jeux Olympiques
 * (ex: Athlétisme, Natation, Basketball). Chaque discipline peut contenir
 * plusieurs épreuves et est associée à une icône pour l'affichage.
 */
export interface Discipline {
  /** Identifiant unique de la discipline (généré automatiquement par Django) */
  id: number;
  /** Nom officiel de la discipline sportive (ex: "Athlétisme", "Natation") */
  nom: string;
  /** Nom du fichier d'icône SVG représentant la discipline */
  icone: string;
}