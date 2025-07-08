import { Epreuve } from './epreuve';
import {Lieu} from './lieu';

export interface Evenement {
  id: number;
  description: string;
  lieu: Lieu;
  date: string;
  horraire: string;
  epreuves: Epreuve[];
}

export interface ExtendEvenement extends Evenement {
  sports?: string; // Sport associé à l'événement
  status?: 'à venir' | 'en cours' | 'terminé'; // Statut de l'événement
  capacity?: number; // Capacité maximale de l'événement
  ticketsSold?: number; // Nombre de billets vendus
}