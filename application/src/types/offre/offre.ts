/**
 * Types TypeScript pour la gestion des offres olympiques dans l'application AdminJO
 *
 * Ce module définit les interfaces pour les offres commerciales des Jeux Olympiques,
 * incluant les packages de billets, les formules d'hébergement et les services
 * proposés aux spectateurs.
 *
 * @module types/offre/offre
 */

/**
 * Interface représentant une offre commerciale olympique.
 *
 * Une offre est un package commercial proposé aux spectateurs, pouvant inclure
 * des billets pour les événements, des services d'hébergement, de restauration
 * ou d'autres prestations liées aux Jeux Olympiques.
 */
export interface Offre {
  /** Identifiant unique de l'offre */
  id: number;
  /** Nom commercial de l'offre (ex: "Pack Famille Natation", "VIP Athlétisme") */
  libelle: string;
  /** Nombre maximum de personnes couvertes par cette offre */
  nb_personne: number;
  /** Prix de l'offre en euros (TTC) */
  montant: number;
  /** Description détaillée des prestations incluses dans l'offre */
  description: string;
}