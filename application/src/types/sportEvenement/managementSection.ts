
    // Définition des sections de gestion
   export interface ManagementSection {
        id: string; // Identifiant unique de la section
        title: string; // Titre de la section
        description: string; // Description de la section
        icon: string; // Icône associée à la section
        color: string; // Couleur de fond de la section
        href: string; // URL de la sections
    }
   
    export const managementSections:ManagementSection[] = [
        
        {
            id: 'lieux',
            title: 'Gestion des Lieux',
            description: 'Administrer les sites et venues olympiques',
            icon: '🏟️',
            color: 'bg-green-600 hover:bg-green-700',
            href: '/pagesEvenements/lieux'
        },
        {
            id: 'disciplines',
            title: 'Gestion des Disciplines',
            description: 'Organiser les disciplines sportives',
            icon: '🏃‍♂️⚽🚴🥋',
            color: 'bg-purple-600 hover:bg-purple-700',
            href: '/pagesEvenements/disciplines'
        },
        {
            id: 'epreuves',
            title: 'Gestion des Épreuves par discipline',
            description: 'Configurer les épreuves et compétitions',
            icon: '🥇🥈🥉',
            color: 'bg-orange-600 hover:bg-orange-700',
            href: '/pagesEvenements/epreuves'
        },
        {
            id: 'evenements',
            title: 'Gestion des Événements pour un lieu et une période',
            description: 'Créer, modifier et supprimer les événements olympiques',
            icon: '🏆📅',
            color: 'bg-blue-600 hover:bg-blue-700',
            href: '/pagesEvenements/evenements'
        }
    ];