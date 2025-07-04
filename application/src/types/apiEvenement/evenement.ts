import {Lieu} from './lieu';

/**
 * Interface représentant un événement sportif
 * 
 * Cette interface définit la structure des données pour les événements
 * olympiques, incluant leur description, leur lieu, leur date et leur horaire.
 * 
 * Un événement est associé à un lieu spécifique et a une date/heure précise.
 */
export interface Evenement {
  /** ID unique de l'événement (généré automatiquement par Django) */
  id: number;
  
  /** Description de l'événement (ex: "Finale 100m hommes", "Demi-finale natation") */
  description: string;
  
  /** Lieu où se déroule l'événement (relation avec l'entité Lieu) */
  lieu: Lieu;
  
  /** Date de l'événement au format ISO 8601 (YYYY-MM-DD) */
  date: string;
  
  /** Horaire de l'événement (ex: "14:30", "09:00") */
  horraire: string;
}