export interface DashboardSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const dashboardSections: DashboardSection[] = [
  {
    id: 'events',
    title: 'Gestion des Événements Sportifs',
    description: 'Créer, modifier et gérer les événements des JO 2024',
    icon: '🏟️',
    color: 'bg-blue-500 hover:bg-blue-600'
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

export const getDashboardSectionById = (id: string): DashboardSection | undefined => {
  return dashboardSections.find(section => section.id === id);
};

export const getAllDashboardSections = (): DashboardSection[] => {
  return dashboardSections;
};
