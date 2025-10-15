/**
 * Types TypeScript pour la gestion des clients dans l'application AdminJO
 *
 * Ce module définit les interfaces et types utilisés pour représenter
 * les clients des Jeux Olympiques, incluant leurs informations personnelles
 * et leur association avec les comptes utilisateurs.
 *
 * @module types/client/client
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
  /** Rôle de l'utilisateur dans le système (client, employe, admin) */
  role: string;
  /** Statut d'activation du compte utilisateur */
  is_active: boolean;
  /** Date de création du compte au format ISO string */
  date_joined: string;
}

/**
 * Interface représentant un client des Jeux Olympiques.
 *
 * Un client est un utilisateur final qui peut acheter des offres
 * et des billets pour les événements olympiques. Cette interface
 * étend les informations de base de l'utilisateur avec des données
 * personnelles spécifiques aux clients.
 */
export interface Client {
  /** Identifiant unique du client */
  id: number;
  /** Informations du compte utilisateur associé */
  user: User;
  /** Nom de famille du client */
  nom: string;
  /** Prénom du client */
  prenom: string;
  /** Numéro de téléphone de contact */
  telephone: string;
  /** Clé de chiffrement pour les données sensibles (optionnel) */
  cle_chiffree?: string;
}

/**
 * Interface pour les données de création d'un nouveau client.
 *
 * Cette interface définit les informations minimales requises
 * pour créer un nouveau client dans le système. Le compte utilisateur
 * et l'ID sont générés automatiquement par le backend.
 */
export interface CreateClientRequest {
  /** Nom de famille du nouveau client */
  nom: string;
  /** Prénom du nouveau client */
  prenom: string;
  /** Numéro de téléphone de contact */
  telephone: string;
}
