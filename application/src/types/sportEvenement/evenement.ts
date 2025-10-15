/**
 * Types et interfaces pour la gestion des événements sportifs AdminJO
 *
 * Ce module définit les structures de données pour la gestion complète des événements
 * sportifs des Jeux Olympiques 2024, incluant les événements de base et leurs
 * extensions avec métadonnées supplémentaires pour l'interface d'administration.
 *
 * @module EvenementTypes
 * @category Types - SportEvenement
 * @since 1.0.0
 */

import { Epreuve } from './epreuve';
import { Lieu } from './lieu';

/**
 * Interface de base pour un événement sportif des JO 2024
 *
 * Cette interface définit la structure minimale d'un événement sportif tel que
 * stocké dans la base de données. Elle contient les informations essentielles
 * requises pour identifier et planifier un événement olympique.
 *
 * ## Propriétés principales
 *
 * - **Identification** : ID unique et description de l'événement
 * - **Localisation** : Lieu de compétition avec toutes ses caractéristiques
 * - **Planification** : Date et horaire de l'événement
 * - **Épreuves** : Liste des compétitions incluses dans cet événement
 *
 * ## Utilisation typique
 *
 * Cette interface est utilisée pour :
 * - Les opérations CRUD via l'API backend
 * - Le stockage en base de données
 * - Les échanges de données entre services
 * - La validation des données d'entrée
 *
 * @interface Evenement
 * @category SportEvenement
 *
 * @example
 * ```typescript
 * const finaleNatation: Evenement = {
 *   id: 1,
 *   description: "Finale 100m Nage Libre Hommes",
 *   lieu: {
 *     id: 1,
 *     nom: "Centre Aquatique",
 *     adresse: "Saint-Denis, France",
 *     capacite: 15000
 *   },
 *   date: "2024-08-01",
 *   horraire: "20:30",
 *   epreuves: [
 *     {
 *       id: 5,
 *       libelle: "100m Nage Libre Hommes",
 *       discipline: { id: 2, nom: "Natation" }
 *     }
 *   ]
 * };
 * ```
 */
export interface Evenement {
  /**
   * Identifiant unique de l'événement
   *
   * Clé primaire auto-générée par la base de données.
   * Utilisée pour toutes les opérations CRUD et les références croisées.
   *
   * @example 1, 2, 3...
   */
  id: number;

  /**
   * Description détaillée de l'événement
   *
   * Texte libre décrivant l'événement sportif. Inclut généralement
   * le type de compétition, la catégorie et les spécificités.
   *
   * @example "Finale 100m Nage Libre Hommes", "Qualifications Basketball Femmes"
   */
  description: string;

  /**
   * Lieu de compétition
   *
   * Référence complète au site où se déroule l'événement, incluant
   * toutes les informations de capacité et de localisation.
   *
   * @see {@link Lieu} - Structure détaillée du lieu
   */
  lieu: Lieu;

  /**
   * Date de l'événement
   *
   * Date au format ISO (YYYY-MM-DD) indiquant le jour de l'événement.
   * Utilisée pour le filtrage temporel et la planification.
   *
   * @example "2024-08-01", "2024-07-26"
   */
  date: string;

  /**
   * Horaire de début de l'événement
   *
   * Heure au format HH:MM indiquant le début prévu de l'événement.
   * Permet la planification précise et la gestion des conflits.
   *
   * @example "20:30", "14:15", "09:00"
   */
  horraire: string;

  /**
   * Liste des épreuves incluses dans l'événement
   *
   * Un événement peut inclure plusieurs épreuves (ex: plusieurs courses
   * dans une même session). Chaque épreuve a sa propre discipline et
   * ses caractéristiques spécifiques.
   *
   * @see {@link Epreuve} - Structure détaillée d'une épreuve
   */
  epreuves: Epreuve[];
}

/**
 * Énumération des statuts possibles d'un événement sportif
 *
 * Ces statuts permettent de suivre l'état d'avancement des événements
 * et d'adapter l'interface utilisateur en conséquence.
 *
 * @enum {string}
 * @category SportEvenement
 */
export enum StatutEvenement {
  /** Événement planifié mais pas encore commencé */
  A_VENIR = 'à venir',
  /** Événement actuellement en cours */
  EN_COURS = 'en cours',
  /** Événement terminé avec résultats disponibles */
  TERMINE = 'terminé',
  /** Événement annulé pour cause exceptionnelle */
  ANNULE = 'annulé'
}

/**
 * Interface étendue pour un événement sportif avec métadonnées d'administration
 *
 * Cette interface étend l'événement de base avec des propriétés supplémentaires
 * nécessaires pour l'interface d'administration. Elle inclut des informations
 * calculées, des statistiques et des métadonnées pour améliorer l'expérience
 * utilisateur dans l'application AdminJO.
 *
 * ## Extensions apportées
 *
 * ### 🏆 Informations sportives enrichies
 * - **Sports** : Libellé des disciplines regroupées
 * - **Statut calculé** : État automatique basé sur date/heure
 *
 * ### 📊 Données de billetterie
 * - **Capacité** : Nombre maximum de spectateurs
 * - **Billets vendus** : Statistiques de vente en temps réel
 * - **Taux d'occupation** : Calcul automatique du pourcentage
 *
 * ### 🎨 Améliorations d'interface
 * - **Indicateurs visuels** : Couleurs basées sur le statut
 * - **Tri et filtrage** : Propriétés optimisées pour l'affichage
 * - **Statistiques rapides** : Métriques calculées côté client
 *
 * ## Utilisation dans l'interface
 *
 * Cette interface est principalement utilisée dans :
 * - Les listes d'événements dans l'interface d'administration
 * - Les cartes de résumé avec statistiques
 * - Les filtres et systèmes de tri avancés
 * - Les tableaux de bord avec métriques
 *
 * @interface ExtendEvenement
 * @extends Evenement
 * @category SportEvenement
 *
 * @example
 * ```typescript
 * const evenementAvecStats: ExtendEvenement = {
 *   // Propriétés de base de Evenement
 *   id: 1,
 *   description: "Finale 100m Nage Libre Hommes",
 *   lieu: centreAquatique,
 *   date: "2024-08-01",
 *   horraire: "20:30",
 *   epreuves: [epreuve100mNL],
 *
 *   // Extensions pour l'administration
 *   sports: "Natation",
 *   status: StatutEvenement.A_VENIR,
 *   capacity: 15000,
 *   ticketsSold: 12500
 * };
 *
 * // Calcul du taux d'occupation
 * const tauxOccupation = evenementAvecStats.ticketsSold / evenementAvecStats.capacity * 100;
 * console.log(`Taux d'occupation: ${tauxOccupation}%`); // 83.33%
 * ```
 */
export interface ExtendEvenement extends Evenement {
  /**
   * Disciplines sportives présentes dans l'événement (format texte)
   *
   * Chaîne de caractères regroupant les noms des disciplines présentes
   * dans cet événement. Facilitie l'affichage et la recherche.
   * Cette propriété est optionnelle.
   *
   * @example "Natation", "Athlétisme", "Natation, Water-polo"
   */
  sports?: string;

  /**
   * Statut calculé de l'événement
   *
   * État automatiquement déterminé en fonction de la date, de l'heure
   * et de l'heure actuelle. Utilisé pour l'affichage conditionnel.
   * Cette propriété est optionnelle.
   *
   * @see {@link StatutEvenement} - Énumération des statuts possibles
   * @example StatutEvenement.A_VENIR, StatutEvenement.EN_COURS
   */
  status?: StatutEvenement;

  /**
   * Capacité maximale de spectateurs
   *
   * Nombre total de places disponibles pour cet événement.
   * Généralement hérité de la capacité du lieu, mais peut être
   * ajusté selon la configuration spécifique de l'événement.
   * Cette propriété est optionnelle.
   *
   * @example 15000, 80000, 5000
   */
  capacity?: number;

  /**
   * Nombre de billets vendus
   *
   * Compteur en temps réel des billets vendus pour cet événement.
   * Utilisé pour calculer le taux d'occupation et les statistiques
   * de vente. Cette propriété est optionnelle.
   *
   * @example 12500, 75000, 4200
   */
  ticketsSold?: number;
}

/**
 * Type utilitaire pour les filtres d'événements
 *
 * Interface utilisée pour les requêtes de filtrage et de recherche
 * dans les listes d'événements de l'interface d'administration.
 *
 * @interface EvenementFilters
 * @category SportEvenement
 */
export interface EvenementFilters {
  /** Filtrage par lieu de compétition */
  lieu_id?: number;
  /** Filtrage par discipline sportive */
  discipline_id?: number;
  /** Filtrage par épreuve spécifique */
  epreuve_id?: number;
  /** Filtrage par statut d'événement */
  status?: StatutEvenement;
  /** Filtrage par date de début (inclusif) */
  date_debut?: string;
  /** Filtrage par date de fin (inclusif) */
  date_fin?: string;
  /** Recherche textuelle dans la description */
  search?: string;
}

/**
 * Type pour les statistiques d'événements
 *
 * Structure des données statistiques calculées pour un ensemble
 * d'événements, utilisée dans les tableaux de bord.
 *
 * @interface EvenementStats
 * @category SportEvenement
 */
export interface EvenementStats {
  /** Nombre total d'événements */
  total: number;
  /** Nombre d'événements à venir */
  aVenir: number;
  /** Nombre d'événements en cours */
  enCours: number;
  /** Nombre d'événements terminés */
  termines: number;
  /** Nombre d'événements annulés */
  annules: number;
  /** Taux d'occupation moyen */
  tauxOccupationMoyen: number;
  /** Nombre total de billets vendus */
  billetsVendusTotal: number;
  /** Capacité totale de tous les événements */
  capaciteTotale: number;
}