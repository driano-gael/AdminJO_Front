/**
 * Configuration des sections du tableau de bord d'administration
 * 
 * Ce fichier définit les différentes sections disponibles dans le dashboard principal
 * de l'application d'administration des JO, avec leurs propriétés visuelles et fonctionnelles.
 */

/**
 * Interface représentant une section du tableau de bord
 */
export interface DashboardSection {
  /** ID unique de la section (utilisé pour la navigation) */
  id: string;
  
  /** Titre affiché pour la section */
  title: string;
  
  /** Description détaillée de la section */
  description: string;
  
  /** Icône emoji ou caractère Unicode à afficher */
  icon: string;
  
  /** Classes CSS pour les couleurs de fond et les effets hover */
  color: string;
}

/**
 * Configuration des sections du tableau de bord
 * 
 * Chaque section correspond à une fonctionnalité principale de l'application
 * avec ses propres couleurs et icônes pour une identification visuelle claire.
 */
export const dashboardSections: DashboardSection[] = [
  {
    id: 'management',
    title: 'Gestion Complète',
    description: 'Gérer événements, lieux, disciplines et épreuves',
    icon: '🏛️', // Correction de l'icône corrompue
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    id: 'users',
    title: 'Gestion des Utilisateurs',
    description: 'Administrer les comptes utilisateurs et leurs permissions',
    icon: '👥',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'offers',
    title: 'Gestion des Offres',
    description: 'Configurer les offres de billets et tarifications',
    icon: '🎫',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    id: 'employees',
    title: 'Gestion des Employés',
    description: 'Gérer le personnel et les équipes d\'organisation',
    icon: '👨‍💼',
    color: 'bg-orange-500 hover:bg-orange-600'
  }
];

/**
 * Fonction utilitaire pour récupérer une section par son ID
 * 
 * @param id - ID de la section recherchée
 * @returns La section correspondante ou undefined si non trouvée
 */
export const getDashboardSectionById = (id: string): DashboardSection | undefined => {
  return dashboardSections.find(section => section.id === id);
};

/**
 * Fonction utilitaire pour récupérer toutes les sections
 * 
 * @returns Tableau de toutes les sections du dashboard
 */
export const getAllDashboardSections = (): DashboardSection[] => {
  return dashboardSections;
};
