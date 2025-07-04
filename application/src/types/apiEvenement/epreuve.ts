import { Discipline } from './discipline';
import { Evenement } from './evenement';

export interface Epreuve {
  id: number;
  libelle: string;
  discipline: Discipline;
  evenement: Evenement;
}