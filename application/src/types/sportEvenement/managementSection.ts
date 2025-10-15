/**
 * Types TypeScript pour les sections de gestion des événements sportifs dans l'application AdminJO
 *
 * Ce module définit les interfaces et constantes pour les sections de navigation
 * du module de gestion des événements sportifs, incluant les lieux, disciplines,
 * épreuves et événements olympiques.
 *
 * @module types/sportEvenement/managementSection
 */

/**
 * Interface représentant une section de gestion des événements sportifs.
 *
 * Une section de gestion définit une carte de navigation dans l'interface
 * d'administration des événements sportifs. Chaque section correspond à
 * un module fonctionnel spécifique (lieux, disciplines, épreuves, événements).
 */
export interface ManagementSection {
    /** Identifiant unique de la section utilisé pour le routage et l'identification */
    id: string;
    /** Titre affiché sur la carte de navigation de la section */
    title: string;
    /** Description détaillée des fonctionnalités disponibles dans cette section */
    description: string;
    /** Emoji ou icône représentant visuellement la section */
    icon: string;
    /** Classes CSS Tailwind pour la couleur de fond et les effets de survol */
    color: string;
    /** URL de destination vers la page de gestion correspondante */
    href: string;
}

/**
 * Configuration prédéfinie des sections de gestion des événements sportifs.
 *
 * Cette constante définit toutes les sections disponibles dans le module
 * de gestion des événements sportifs avec leurs propriétés visuelles
 * et leurs routes de navigation.
 *
 * @readonly
 * @type {ManagementSection[]}
 */
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