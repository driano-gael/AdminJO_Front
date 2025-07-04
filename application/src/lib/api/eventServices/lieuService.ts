import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Lieu } from '@/types/apiEvenement/lieu';

// Types pour les requêtes
export interface CreateLieuRequest {
  nom: string;
}

export interface UpdateLieuRequest {
  id: number;
  nom: string;
}

export interface LieuFilters {
  nom?: string;
  page?: number;
  limit?: number;
}

// Service pour la gestion des lieux
export class LieuService {
  private static readonly BASE_PATH = '/lieu';

  /**
   * Récupère tous les lieux
   * Route Django: path('lieu/', LieuListView.as_view(), name='lieu-list')
   */
  static async getAllLieux(filters?: LieuFilters): Promise<Lieu[]> {
    let url = `${this.BASE_PATH}/`;
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.nom) params.append('search', filters.nom);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return fetchApi<Lieu[]>(url);
  }

  /**
   * Récupère un lieu par son ID
   * Route Django: path('lieu/<int:pk>/', LieuDetailView.as_view(), name='lieu-detail')
   */
  static async getLieuById(id: number): Promise<Lieu> {
    return fetchApi<Lieu>(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Crée un nouveau lieu
   * Route Django: path('lieu/create/', LieuCreateView.as_view(), name='lieu-create')
   */
  static async createLieu(data: CreateLieuRequest): Promise<Lieu> {
    return fetchApi<Lieu>(`${this.BASE_PATH}/create/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Met à jour un lieu existant
   * Route Django: path('lieu/update/<int:pk>/', LieuUpdateView.as_view(), name='lieu-update')
   */
  static async updateLieu(data: UpdateLieuRequest): Promise<Lieu> {
    return fetchApi<Lieu>(`${this.BASE_PATH}/update/${data.id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprime un lieu
   * Route Django: path('lieu/delete/<int:pk>/', LieuDeleteView.as_view(), name='lieu-delete')
   */
  static async deleteLieu(id: number): Promise<void> {
    return fetchApi<void>(`${this.BASE_PATH}/delete/${id}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Recherche des lieux par nom (si implémentée côté backend)
   * Note: Cette route n'existe pas dans les routes Django fournies
   */
  static async searchLieux(query: string): Promise<Lieu[]> {
    return fetchApi<Lieu[]>(`${this.BASE_PATH}/?search=${encodeURIComponent(query)}`);
  }
}

// Fonctions utilitaires (approche fonctionnelle alternative)
export const lieuApi = {
  getAll: (filters?: LieuFilters) => LieuService.getAllLieux(filters),
  getById: (id: number) => LieuService.getLieuById(id),
  create: (data: CreateLieuRequest) => LieuService.createLieu(data),
  update: (data: UpdateLieuRequest) => LieuService.updateLieu(data),
  delete: (id: number) => LieuService.deleteLieu(id),
  search: (query: string) => LieuService.searchLieux(query),
};
