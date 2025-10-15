/**
 * Configuration des sections du tableau de bord d'administration AdminJO
 *
 * Ce fichier définit les différentes sections disponibles dans le dashboard principal
 * de l'application d'administration des JO 2024, avec leurs propriétés visuelles et fonctionnelles.
 *
 * @module DashboardSections
 * @category Types
 */

/**
 * Interface représentant une section du tableau de bord
 *
 * Cette interface définit la structure d'une carte de navigation dans le dashboard.
 * Chaque section correspond à un module fonctionnel de l'application d'administration.
 *
 * @interface DashboardSection
 * @category Dashboard
 *
 */
export interface DashboardSection {
  /**
   * URL de destination de la section
   *
   * Route Next.js vers laquelle l'utilisateur sera redirigé lors du clic sur la carte.
   * Doit commencer par '/' et correspondre à une page existante dans l'application.
   *
   */
  url: string;

  /**
   * Titre affiché sur la carte de navigation
   *
   * Texte principal qui apparaît sur la carte. Doit être concis et descriptif
   * du module fonctionnel représenté.
   *
   */
  title: string;

  /**
   * Description détaillée de la fonctionnalité
   *
   * Texte explicatif qui apparaît sous le titre pour donner plus de contexte
   * sur les fonctionnalités disponibles dans cette section.
   *
   */
  description: string;

  /**
   * Icône représentative de la section
   *
   * Emoji ou caractère Unicode qui représente visuellement le domaine métier
   * de la section. Affiché en grande taille sur la carte.
   *
   */
  icon: string;

  /**
   * Classes CSS pour la couleur de fond de la carte
   *
   * Classes TailwindCSS définissant la couleur de base et la couleur au survol.
   * Utilise le format 'bg-{color}-{intensity} hover:bg-{color}-{intensity+100}'.
   *
   */
  color: string;
}

/**
 * Configuration complète des sections du dashboard
 *
 * Tableau contenant toutes les sections disponibles dans le tableau de bord
 * d'administration. Chaque section représente un module fonctionnel majeur
 * de l'application AdminJO.
 *
 * ## Modules disponibles
 *
 * - **Événements sportifs** : Gestion complète des événements, lieux, disciplines et épreuves
 * - **Offres de billeterie** : Configuration des offres et tarifications
 * - **Employés** : Administration du personnel et gestion RH
 * - **Utilisateurs** : Gestion de la clientèle et des comptes utilisateurs
 *
 * Configuration constante des sections du tableau de bord
 * @type {DashboardSection[]}
 *
 */
export const dashboardSections: DashboardSection[] = [
  {
    url: '/pagesEvenements',
    title: 'Gestion des événements sportifs',
    description: 'Gérer événements, lieux, disciplines et épreuves pour les JO 2024',
    icon: '📅',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    url: '/pageOffre',
    title: 'Gestion des Offres',
    description: 'Configurer les offres de billets et tarifications pour tous les événements',
    icon: '🎫',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    url: '/employees',
    title: 'Gestion des Employés',
    description: 'Administration du personnel, rôles et permissions des employés',
    icon: '👥',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    url: '/users',
    title: 'Gestion des Utilisateurs',
    description: 'Administration des comptes clients et gestion de la clientèle',
    icon: '🧑‍🤝‍🧑',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
];

/**
 * Type utilitaire pour extraire les URLs disponibles
 *
 * Type généré automatiquement à partir des URLs définies dans dashboardSections.
 * Utile pour la validation des routes et l'autocomplétion TypeScript.
 *
 * @type {string}
 *
 */
export type DashboardSectionUrl = (typeof dashboardSections)[number]['url'];

/**
 * Type utilitaire pour les couleurs de sections
 *
 * Union type de toutes les combinaisons de couleurs utilisées dans les sections.
 * Pratique pour valider les couleurs lors de l'ajout de nouvelles sections.
 *
 * @type {string}
 */
export type DashboardSectionColor = (typeof dashboardSections)[number]['color'];

/**
 * Fonction utilitaire pour récupérer une section par son URL
 *
 * Recherche et retourne la configuration d'une section du dashboard
 * basée sur son URL. Utile pour la navigation et la validation des routes.
 *
 * @param {string} url - L'URL de la section à rechercher
 * @returns {DashboardSection | undefined} La section trouvée ou undefined
 *
 *
 * @since 1.0.0
 */
export function getDashboardSectionByUrl(url: string): DashboardSection | undefined {
  return dashboardSections.find(section => section.url === url);
}
