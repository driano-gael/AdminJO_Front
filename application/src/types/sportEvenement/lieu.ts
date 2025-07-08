/**
 * Interface représentant un lieu sportif
 * 
 * Cette interface définit la structure des données pour les lieux
 * où se déroulent les événements olympiques.
 * 
 * Exemples de lieux : Stade de France, Centre Aquatique, Palais des Sports, etc.
 */
export interface Lieu {
  /** ID unique du lieu (généré automatiquement par Django) */
  id: number;
  
  /** Nom du lieu sportif */
  nom: string;
}