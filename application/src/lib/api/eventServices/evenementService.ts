import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Evenement } from '@/types/apiEvenement/evenement';
import { Lieu } from '@/types/apiEvenement/lieu';

// Types pour les requêtes
export interface CreateEvenementRequest {
  description: string;
  lieuId: number;
  date: string;
  horraire: string;
}

export interface UpdateEvenementRequest {
  id: number;
  description: string;
  lieuId: number;
  date: string;
  horraire: string;
}

export interface EvenementFilters {
  description?: string;
  lieuId?: number;
  dateDebut?: string;
  dateFin?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'description' | 'lieu';
  sortOrder?: 'asc' | 'desc';
}

// Service pour la gestion des événements
export class EvenementService {
  private static readonly BASE_PATH = '/evenement';

  /**
   * Récupère tous les événements
   * Route Django: path('evenement/', EvenementListView.as_view(), name='evenement-list')
   */
  static async getAllEvenements(filters?: EvenementFilters): Promise<Evenement[]> {
    let url = `${this.BASE_PATH}/`;
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.description) params.append('description', filters.description);
      if (filters.lieuId) params.append('lieuId', filters.lieuId.toString());
      if (filters.dateDebut) params.append('dateDebut', filters.dateDebut);
      if (filters.dateFin) params.append('dateFin', filters.dateFin);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return fetchApi<Evenement[]>(url);
  }

  /**
   * Récupère un événement par son ID
   * Route Django: path('evenement/<int:pk>/', EvenementDetailView.as_view(), name='evenement-detail')
   */
  static async getEvenementById(id: number): Promise<Evenement> {
    return fetchApi<Evenement>(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Crée un nouveau événement
   * Route Django: path('evenement/create/', EvenementCreateView.as_view(), name='evenement-create')
   */
  static async createEvenement(data: CreateEvenementRequest): Promise<Evenement> {
    return fetchApi<Evenement>(`${this.BASE_PATH}/create/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Met à jour un événement existant
   * Route Django: path('evenement/update/<int:pk>/', EvenementUpdateView.as_view(), name='evenement-update')
   */
  static async updateEvenement(data: UpdateEvenementRequest): Promise<Evenement> {
    return fetchApi<Evenement>(`${this.BASE_PATH}/update/${data.id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprime un événement
   * Route Django: path('evenement/delete/<int:pk>/', EvenementDeleteView.as_view(), name='evenement-delete')
   */
  static async deleteEvenement(id: number): Promise<void> {
    return fetchApi<void>(`${this.BASE_PATH}/delete/${id}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Recherche des événements (si implémentée côté backend)
   * Note: Cette route n'existe pas dans les routes Django fournies
   */
  static async searchEvenements(query: string): Promise<Evenement[]> {
    return fetchApi<Evenement[]>(`${this.BASE_PATH}/?search=${encodeURIComponent(query)}`);
  }
}

// Fonctions utilitaires (approche fonctionnelle alternative)
export const evenementApi = {
  getAll: (filters?: EvenementFilters) => EvenementService.getAllEvenements(filters),
  getById: (id: number) => EvenementService.getEvenementById(id),
  create: (data: CreateEvenementRequest) => EvenementService.createEvenement(data),
  update: (data: UpdateEvenementRequest) => EvenementService.updateEvenement(data),
  delete: (id: number) => EvenementService.deleteEvenement(id),
  search: (query: string) => EvenementService.searchEvenements(query),
};
