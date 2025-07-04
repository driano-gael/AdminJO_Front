import {Lieu} from './lieu';

export interface Evenement {
  id: number;
  description: string;
  lieu: Lieu;
  date: string;
  horraire: string;
}