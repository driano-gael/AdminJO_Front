/**
 * Types TypeScript pour la gestion des épreuves sportives dans l'application AdminJO
 *
 * Ce module définit les interfaces pour les épreuves olympiques,
 * représentant les compétitions spécifiques au sein de chaque discipline
 * avec leurs caractéristiques (genre, tour, association aux événements).
 *
 * @module types/sportEvenement/epreuve
 */

import { Discipline } from './discipline';
import { Evenement } from './evenement';

/**
 * Interface représentant une épreuve sportive olympique.
 *
 * Une épreuve est une compétition spécifique au sein d'une discipline
 * (ex: "100m masculin" dans l'Athlétisme, "50m nage libre féminin" dans la Natation).
 * Chaque épreuve peut être associée à un événement programmé et possède
 * des caractéristiques définissant le type de compétition.
 */
export interface Epreuve {
  /** Identifiant unique de l'épreuve */
  id: number;
  /** Libellé descriptif de l'épreuve (ex: "100m masculin", "Relais 4x100m féminin") */
  libelle: string;
  /** Genre des participants (masculin, féminin, mixte) */
  genre: string | "mixte";
  /** Tour de compétition (qualifications, demi-finale, finale, etc.) */
  tour: string | "inconnu";
  /** Discipline sportive à laquelle appartient l'épreuve */
  discipline: Discipline;
  /** Événement programmé associé à cette épreuve (optionnel) */
  evenement?: Evenement | null;
}