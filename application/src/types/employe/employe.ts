/**
 * Types pour la gestion des employés
 */

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  role: string;
}

export interface Employe {
  id: number;
  user: User;
  nom: string;
  prenom: string;
  matricule: string;
  identifiant_telephone: string;
}

export interface CreateEmployeRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  matricule: string;
  identifiant_telephone: string;
}

export interface EmployeFilters {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
}
