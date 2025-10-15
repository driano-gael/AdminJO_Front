/**
 * Types TypeScript pour la gestion des employés dans l'application AdminJO
 *
 * Ce module définit les interfaces et types utilisés pour représenter
 * les employés des Jeux Olympiques, incluant leurs informations professionnelles,
 * leur matricule et leur association avec les comptes utilisateurs.
 *
 * @module types/employe/employe
 */

/**
 * Interface représentant un compte utilisateur dans le système.
 *
 * Cette interface définit la structure de base d'un utilisateur
 * qui peut avoir différents rôles (client, employé, admin).
 */
export interface User {
  /** Identifiant unique de l'utilisateur */
  id: number;
  /** Adresse email de l'utilisateur (utilisée pour la connexion) */
  email: string;
  /** Statut d'activation du compte utilisateur */
  is_active: boolean;
  /** Rôle de l'utilisateur dans le système (client, employe, admin) */
  role: string;
}

/**
 * Interface représentant un employé de l'organisation des Jeux Olympiques.
 *
 * Un employé est un membre du personnel qui a accès aux fonctionnalités
 * administratives de l'application. Cette interface contient les informations
 * professionnelles nécessaires pour l'identification et la gestion du personnel.
 */
export interface Employe {
  /** Identifiant unique de l'employé */
  id: number;
  /** Informations du compte utilisateur associé */
  user: User;
  /** Nom de famille de l'employé */
  nom: string;
  /** Prénom de l'employé */
  prenom: string;
  /** Matricule unique de l'employé dans l'organisation */
  matricule: string;
  /** Numéro de téléphone professionnel de l'employé */
  identifiant_telephone: string;
}

/**
 * Interface pour les données de création d'un nouveau compte employé.
 *
 * Cette interface définit toutes les informations requises pour créer
 * un nouveau compte employé, incluant les credentials de connexion
 * et les informations professionnelles.
 */
export interface CreateEmployeRequest {
  /** Adresse email professionnelle (utilisée pour la connexion) */
  email: string;
  /** Mot de passe initial du compte */
  password: string;
  /** Nom de famille de l'employé */
  nom: string;
  /** Prénom de l'employé */
  prenom: string;
  /** Matricule unique dans l'organisation */
  matricule: string;
  /** Numéro de téléphone professionnel */
  identifiant_telephone: string;
}

/**
 * Interface pour les filtres de recherche et pagination des employés.
 *
 * Cette interface définit les critères disponibles pour filtrer
 * et rechercher dans la liste des employés.
 */
export interface EmployeFilters {
  /** Terme de recherche libre (nom, prénom, matricule, email) */
  search?: string;
  /** Filtre par statut d'activation du compte */
  status?: 'all' | 'active' | 'inactive';
}
