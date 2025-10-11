/**
 * Types pour la gestion des clients
 */

export interface User {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  date_joined: string;
}

export interface Client {
  id: number;
  user: User;
  nom: string;
  prenom: string;
  telephone: string;
  cle_chiffree?: string;
}

export interface CreateClientRequest {
  nom: string;
  prenom: string;
  telephone: string;
}
