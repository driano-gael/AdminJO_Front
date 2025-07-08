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
  url: string;
  
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
    url: '/management',
    title: 'Gestion Complète',
    description: 'Gérer événements, lieux, disciplines et épreuves',
    icon: '🏛️', // Correction de l'icône corrompue
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    url: '/users',
    title: 'Gestion des Utilisateurs',
    description: 'Administrer les comptes utilisateurs et leurs permissions',
    icon: '👥',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    url: '/offers',
    title: 'Gestion des Offres',
    description: 'Configurer les offres de billets et tarifications',
    icon: '🎫',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    url: '/employees',
    title: 'Gestion des Employés',
    description: 'Gérer le personnel et les équipes d\'organisation',
    icon: '👨‍💼',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  
  {
    url: '/test',
    title: "ajout d'un test dashboard",
    description: 'Test de section pour le dashboard',
    icon: '👨‍💼',
    color: 'bg-orange-500 hover:bg-orange-600'
  }
];

/**
 * Fonction utilitaire pour récupérer une section par son url
 * 
 * @param url - url de la section recherchée
 * @returns La section correspondante ou undefined si non trouvée
 */
export const getDashboardSectionByUrl = (url: string): DashboardSection | undefined => {
  return dashboardSections.find(section => section.url === url);
};
