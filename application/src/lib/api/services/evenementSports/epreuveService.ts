/**
 * Service de gestion des épreuves sportives pour l'application AdminJO
 *
 * Ce service encapsule toutes les opérations CRUD pour la gestion des épreuves sportives.
 * Une épreuve représente une compétition spécifique au sein d'une discipline (ex: "100m masculin"
 * dans la discipline "Athlétisme").
 *
 * @module services/evenementSports/epreuveService
 */

import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Epreuve } from '@/types/sportEvenement/epreuve';

/**
 * Interface pour les données de création d'une nouvelle épreuve sportive.
 */
export interface CreateEpreuveRequest {
  /** Libellé descriptif de l'épreuve (ex: "100m masculin", "Relais 4x100m féminin") */
  libelle: string;
  /** ID de la discipline à laquelle appartient l'épreuve */
  disciplineId: number;
}

/**
 * Interface pour les données de mise à jour d'une épreuve existante.
 */
export interface UpdateEpreuveRequest {
  /** ID unique de l'épreuve à mettre à jour */
  id: number;
  /** Nouveau libellé de l'épreuve */
  libelle: string;
  /** Nouvel ID de discipline */
  disciplineId: number;
  /** ID de l'événement associé (optionnel, peut être null) */
  evenementId?: number | null;
}

/**
 * Interface pour les filtres de recherche et pagination des épreuves.
 */
export interface EpreuveFilters {
  /** Filtrage par libellé (recherche partielle, insensible à la casse) */
  libelle?: string;
  /** Filtrage par ID de discipline spécifique */
  disciplineId?: number;
  /** Numéro de page pour la pagination (commence à 1) */
  page?: number;
  /** Nombre d'éléments par page (défaut: 20) */
  limit?: number;
  /** Champ de tri des résultats */
  sortBy?: 'nom' | 'discipline';
  /** Ordre de tri (ascendant ou descendant) */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Service principal pour la gestion des épreuves sportives.
 *
 * Cette classe fournit une interface statique pour toutes les opérations CRUD
 * sur les épreuves sportives. Elle gère automatiquement l'authentification,
 * la validation des données et la gestion des erreurs HTTP.
 */
export class EpreuveService {
  /** Chemin de base pour tous les endpoints des épreuves */
  private static readonly BASE_PATH = '/epreuve';

  /**
   * Récupère toutes les épreuves avec options de filtrage et pagination.
   *
   * Cette méthode permet de récupérer la liste complète des épreuves
   * ou un sous-ensemble filtré selon les critères fournis.
   *
   * @param filters - Filtres optionnels pour la recherche et la pagination
   * @returns Promise résolvant vers la liste des épreuves
   * @throws En cas d'erreur de l'API, de réseau, ou de paramètres invalides
   *
   * @example
   * ```typescript
   * // Récupérer toutes les épreuves
   * const epreuves = await EpreuveService.getAllEpreuves();
   *
   * // Filtrer par discipline
   * const epreuvesAthlétisme = await EpreuveService.getAllEpreuves({
   *   disciplineId: 1,
   *   sortBy: 'nom',
   *   sortOrder: 'asc'
   * });
   * ```
   */
  static async getAllEpreuves(filters?: EpreuveFilters): Promise<Epreuve[]> {
    let url = `${this.BASE_PATH}/`;
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.libelle) params.append('search', filters.libelle);
      if (filters.disciplineId) params.append('disciplineId', filters.disciplineId.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return fetchApi<Epreuve[]>(url);
  }

  /**
   * Récupère une épreuve par son ID
   * Route Django: path('epreuve/<int:pk>/', EpreuveDetailView.as_view(), name='epreuve-detail')
   */
  static async getEpreuveById(id: number): Promise<Epreuve> {
    return fetchApi<Epreuve>(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Crée une nouvelle épreuve
   * Route Django: path('epreuve/create/', EpreuveCreateView.as_view(), name='epreuve-create')
   */
  static async createEpreuve(data: CreateEpreuveRequest): Promise<Epreuve> {
    const payload = {
      libelle: data.libelle,
      discipline_id: data.disciplineId,
      evenement_id: null
    };
    return fetchApi<Epreuve>(`${this.BASE_PATH}/create/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Met à jour une épreuve existante
   * Route Django: path('epreuve/update/<int:pk>/', EpreuveUpdateView.as_view(), name='epreuve-update')
   */
  static async updateEpreuve(data: UpdateEpreuveRequest): Promise<Epreuve> {
    const payload = {
      libelle: data.libelle,
      discipline_id: data.disciplineId,
      evenement_id: data.evenementId ?? null
    };
    return fetchApi<Epreuve>(`${this.BASE_PATH}/update/${data.id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Supprime une épreuve
   * Route Django: path('epreuve/delete/<int:pk>/', EpreuveDeleteView.as_view(), name='epreuve-delete')
   */
  static async deleteEpreuve(id: number): Promise<void> {
    return fetchApi<void>(`${this.BASE_PATH}/delete/${id}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Recherche des épreuves (si implémentée côté backend)
   * Note: Cette route n'existe pas dans les routes Django fournies
   */
  static async searchEpreuves(query: string): Promise<Epreuve[]> {
    return fetchApi<Epreuve[]>(`${this.BASE_PATH}/?search=${encodeURIComponent(query)}`);
  }
}

/**
 * API fonctionnelle pour les épreuves
 */
export const epreuveApi = {
  getAll: (filters?: EpreuveFilters) => EpreuveService.getAllEpreuves(filters),
  getById: (id: number) => EpreuveService.getEpreuveById(id),
  create: (data: CreateEpreuveRequest) => EpreuveService.createEpreuve(data),
  update: (data: UpdateEpreuveRequest) => EpreuveService.updateEpreuve(data),
  delete: (id: number) => EpreuveService.deleteEpreuve(id),
  search: (query: string) => EpreuveService.searchEpreuves(query),
};
