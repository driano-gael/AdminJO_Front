/**
 * Service de gestion des disciplines sportives pour l'application AdminJO
 *
 * Ce service encapsule toutes les opérations CRUD pour la gestion des disciplines sportives
 * des Jeux Olympiques. Une discipline représente une catégorie sportive comme l'athlétisme,
 * la natation, etc., avec son icône associée.
 *
 * @module services/evenementSports/disciplineService
 */

import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Discipline } from '@/types/sportEvenement/discipline';

/**
 * Interface pour les données de création d'une nouvelle discipline sportive.
 */
export interface CreateDisciplineRequest {
  /** Nom officiel de la discipline (ex: "Athlétisme", "Natation", "Gymnastique") */
  nom: string;
  /** Nom du fichier SVG de l'icône représentant la discipline (ex: "ath.svg", "nat.svg") */
  icone: string;
}

/**
 * Interface pour les données de mise à jour d'une discipline existante.
 */
export interface UpdateDisciplineRequest {
  /** ID unique de la discipline à mettre à jour */
  id: number;
  /** Nouveau nom de la discipline */
  nom: string;
  /** Nouveau nom du fichier SVG de l'icône */
  icone: string;
}

/**
 * Interface pour les filtres de recherche et pagination des disciplines.
 */
export interface DisciplineFilters {
  /** Filtrage par nom (recherche partielle, insensible à la casse) */
  nom?: string;
  /** Numéro de page pour la pagination (commence à 1) */
  page?: number;
  /** Nombre d'éléments par page (défaut: 20) */
  limit?: number;
  /** Champ de tri des résultats (actuellement seul 'nom' est supporté) */
  sortBy?: 'nom';
  /** Ordre de tri (ascendant ou descendant) */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Service principal pour la gestion des disciplines sportives.
 *
 * Cette classe fournit une interface statique pour toutes les opérations CRUD
 * sur les disciplines sportives. Elle gère automatiquement l'authentification,
 * la validation des données et la gestion des erreurs HTTP.
 */
export class DisciplineService {
  /** Chemin de base pour tous les endpoints des disciplines */
  private static readonly BASE_PATH = '/discipline';

  /**
   * Récupère toutes les disciplines avec filtres optionnels
   * 
   * @param filters - Filtres optionnels pour la recherche et la pagination
   * @returns Promise<Discipline[]> - Liste des disciplines
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * 
   * Route Django: path('discipline/', DisciplineListView.as_view(), name='discipline-list')
   */
  static async getAllDisciplines(filters?: DisciplineFilters): Promise<Discipline[]> {
    let url = `${this.BASE_PATH}/`;
    
    // Construction des paramètres de requête si des filtres sont fournis
    if (filters) {
      const params = new URLSearchParams();
      if (filters.nom) params.append('search', filters.nom);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return fetchApi<Discipline[]>(url);
  }

  /**
   * Récupère une discipline par son ID
   * 
   * @param id - ID de la discipline à récupérer
   * @returns Promise<Discipline> - La discipline correspondante
   * @throws Error - En cas d'erreur de l'API ou si la discipline n'existe pas
   * 
   * Route Django: path('discipline/<int:pk>/', DisciplineDetailView.as_view(), name='discipline-detail')
   */
  static async getDisciplineById(id: number): Promise<Discipline> {
    return fetchApi<Discipline>(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Crée une nouvelle discipline
   * 
   * @param data - Données de la discipline à créer
   * @returns Promise<Discipline> - La discipline créée
   * @throws Error - En cas d'erreur de l'API ou de validation
   * 
   * Route Django: path('discipline/create/', DisciplineCreateView.as_view(), name='discipline-create')
   */
  static async createDiscipline(data: CreateDisciplineRequest): Promise<Discipline> {
    return fetchApi<Discipline>(`${this.BASE_PATH}/create/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Met à jour une discipline existante
   * 
   * @param data - Données de la discipline à mettre à jour (incluant l'ID)
   * @returns Promise<Discipline> - La discipline mise à jour
   * @throws Error - En cas d'erreur de l'API ou si la discipline n'existe pas
   * 
   * Route Django: path('discipline/update/<int:pk>/', DisciplineUpdateView.as_view(), name='discipline-update')
   */
  static async updateDiscipline(data: UpdateDisciplineRequest): Promise<Discipline> {
    return fetchApi<Discipline>(`${this.BASE_PATH}/update/${data.id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprime une discipline
   * 
   * @param id - ID de la discipline à supprimer
   * @returns Promise<void> - Promesse qui se résout quand la suppression est terminée
   * @throws Error - En cas d'erreur de l'API ou si la discipline n'existe pas
   * 
   * Route Django: path('discipline/delete/<int:pk>/', DisciplineDeleteView.as_view(), name='discipline-delete')
   */
  static async deleteDiscipline(id: number): Promise<void> {
    return fetchApi<void>(`${this.BASE_PATH}/delete/${id}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Recherche des disciplines par nom
   * 
   * @param query - Terme de recherche
   * @returns Promise<Discipline[]> - Liste des disciplines correspondantes
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * 
   * Note: Cette méthode utilise le paramètre 'search' de l'endpoint principal
   */
  static async searchDisciplines(query: string): Promise<Discipline[]> {
    return fetchApi<Discipline[]>(`${this.BASE_PATH}/?search=${encodeURIComponent(query)}`);
  }
}

/**
 * API fonctionnelle pour les disciplines
 * 
 * Interface alternative utilisant des fonctions plutôt que des méthodes statiques
 * pour une utilisation plus simple et une meilleure testabilité.
 */
export const disciplineApi = {
  /**
   * Récupère toutes les disciplines avec filtres optionnels
   */
  getAll: (filters?: DisciplineFilters) => DisciplineService.getAllDisciplines(filters),
  
  /**
   * Récupère une discipline par son ID
   */
  getById: (id: number) => DisciplineService.getDisciplineById(id),
  
  /**
   * Crée une nouvelle discipline
   */
  create: (data: CreateDisciplineRequest) => DisciplineService.createDiscipline(data),
  
  /**
   * Met à jour une discipline existante
   */
  update: (data: UpdateDisciplineRequest) => DisciplineService.updateDiscipline(data),
  
  /**
   * Supprime une discipline
   */
  delete: (id: number) => DisciplineService.deleteDiscipline(id),
  
  /**
   * Recherche des disciplines par nom
   */
  search: (query: string) => DisciplineService.searchDisciplines(query)
};
