import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Discipline } from '@/types/sportEvenement/discipline';
import { Evenement } from '@/types/sportEvenement/evenement';

// Types pour les requêtes
export interface CreateEpreuveRequest {
  libelle: string;
  disciplineId: number;
}

export interface UpdateEpreuveRequest {
  id: number;
  libelle: string;
  disciplineId: number;
  evenementId?: number | null;
}

export interface EpreuveFilters {
  libelle?: string;
  disciplineId?: number;
  page?: number;
  limit?: number;
  sortBy?: 'nom' | 'discipline';
  sortOrder?: 'asc' | 'desc';
}

// Service pour la gestion des épreuves
export class EpreuveService {
  private static readonly BASE_PATH = '/epreuve';

  /**
   * Récupère toutes les épreuves avec filtres optionnels
   * Route Django: path('epreuve/', EpreuveListView.as_view(), name='epreuve-list')
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

// Fonctions utilitaires (approche fonctionnelle alternative)
export const epreuveApi = {
  getAll: (filters?: EpreuveFilters) => EpreuveService.getAllEpreuves(filters),
  getById: (id: number) => EpreuveService.getEpreuveById(id),
  create: (data: CreateEpreuveRequest) => EpreuveService.createEpreuve(data),
  update: (data: UpdateEpreuveRequest) => EpreuveService.updateEpreuve(data),
  delete: (id: number) => EpreuveService.deleteEpreuve(id),
  search: (query: string) => EpreuveService.searchEpreuves(query),
};
