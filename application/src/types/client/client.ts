/**
 * Types pour la gestion des clients
 */

export interface Client {
  id: number;
  user: number;
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
