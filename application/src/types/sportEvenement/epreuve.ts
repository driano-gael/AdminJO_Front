import { Discipline } from './discipline';
import { Evenement } from './evenement';

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
  id: number;
  libelle: string;
  discipline: Discipline;
  evenement?: Evenement | null;
}