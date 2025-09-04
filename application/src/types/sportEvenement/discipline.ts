/**
 * Interface représentant une discipline sportive
 * 
 * Cette interface définit la structure des données pour les disciplines
 * telles qu'elles sont stockées et manipulées dans l'API backend Django.
 * 
 * Exemples de disciplines : Athlétisme, Natation, Basketball, etc.
 */
export interface Discipline {
  /** ID unique de la discipline (généré automatiquement par Django) */
  id: number;
  
  /** Nom de la discipline sportive */
  nom: string;
  icone: string | "";
}