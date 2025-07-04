import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Discipline } from '@/types/apiEvenement/discipline';

// Types pour les requêtes
export interface CreateDisciplineRequest {
  nom: string;
}

export interface UpdateDisciplineRequest {
  id: number;
  nom: string;
}

// Service pour la gestion des disciplines
export class DisciplineService {
  private static readonly BASE_PATH = '/discipline';

  /**
   * Récupère toutes les disciplines
   * Route Django: path('discipline/', DisciplineListView.as_view(), name='discipline-list')
   */
  static async getAllDisciplines(): Promise<Discipline[]> {
    return fetchApi<Discipline[]>(`${this.BASE_PATH}/`);
  }

  /**
   * Récupère une discipline par son ID
   * Route Django: path('discipline/<int:pk>/', DisciplineDetailView.as_view(), name='discipline-detail')
   */
  static async getDisciplineById(id: number): Promise<Discipline> {
    return fetchApi<Discipline>(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Crée une nouvelle discipline
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
   * Route Django: path('discipline/delete/<int:pk>/', DisciplineDeleteView.as_view(), name='discipline-delete')
   */
  static async deleteDiscipline(id: number): Promise<void> {
    return fetchApi<void>(`${this.BASE_PATH}/delete/${id}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Recherche des disciplines par nom (si implémentée côté backend)
   * Note: Cette route n'existe pas dans les routes Django fournies
   */
  static async searchDisciplines(query: string): Promise<Discipline[]> {
    return fetchApi<Discipline[]>(`${this.BASE_PATH}/?search=${encodeURIComponent(query)}`);
  }
}

// Fonctions utilitaires (approche fonctionnelle alternative)
export const disciplineApi = {
  getAll: () => DisciplineService.getAllDisciplines(),
  getById: (id: number) => DisciplineService.getDisciplineById(id),
  create: (data: CreateDisciplineRequest) => DisciplineService.createDiscipline(data),
  update: (data: UpdateDisciplineRequest) => DisciplineService.updateDiscipline(data),
  delete: (id: number) => DisciplineService.deleteDiscipline(id),
  search: (query: string) => DisciplineService.searchDisciplines(query),
};
