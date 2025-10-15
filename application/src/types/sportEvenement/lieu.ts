/**
 * Types TypeScript pour la gestion des lieux sportifs dans l'application AdminJO
 *
 * Ce module définit les interfaces pour les sites et installations
 * où se déroulent les événements olympiques, incluant leurs caractéristiques
 * et informations logistiques.
 *
 * @module types/sportEvenement/lieu
 */

/**
 * Interface représentant un lieu sportif olympique.
 *
 * Un lieu est un site physique où se déroulent les événements olympiques
 * (ex: Stade de France, Centre Aquatique, Palais des Sports).
 * Chaque lieu peut accueillir plusieurs événements et possède
 * des caractéristiques spécifiques pour l'organisation.
 */
export interface Lieu {
  /** Identifiant unique du lieu (généré automatiquement par Django) */
  id: number;
  /** Nom officiel du lieu sportif (ex: "Stade de France", "Centre Aquatique") */
  nom: string;
}