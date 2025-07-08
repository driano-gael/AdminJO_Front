import { Discipline } from './discipline';

/**
 * Interface représentant une épreuve sportive
 * 
 * Cette interface définit la structure des données pour les épreuves
 * olympiques, qui sont des compétitions spécifiques au sein d'une discipline.
 * 
 * Une épreuve est toujours associée à une discipline.
 * Exemples : "100m sprint" (Athlétisme), "50m nage libre" (Natation), etc.
 */
export interface Epreuve {
  /** ID unique de l'épreuve (généré automatiquement par Django) */
  id: number;
  
  /** Libellé descriptif de l'épreuve (ex: "100m sprint", "Saut en hauteur") */
  libelle: string;
  
  /** Discipline à laquelle appartient cette épreuve (relation avec l'entité Discipline) */
  discipline: Discipline;
}