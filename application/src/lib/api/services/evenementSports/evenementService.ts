/**
 * Service API pour la gestion des événements sportifs
 * 
 * Ce service encapsule toutes les opérations CRUD pour les événements
 * et fournit une interface simple pour interagir avec l'API backend Django.
 * 
 * Un événement représente une compétition sportive avec une description,
 * un lieu, une date et un horaire spécifiques.
 * 
 * Authentification : Toutes les opérations nécessitent une authentification
 * via le token JWT géré automatiquement par fetchApi.
 */

import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Evenement } from '@/types/sportEvenement/evenement';

/**
 * Interface pour les données de création d'un événement
 */
export interface CreateEvenementRequest {
  description: string; // Description de l'événement (ex: "Finale 100m hommes")
  lieuId: number; // ID du lieu où se déroule l'événement
  date: string; // Date de l'événement au format ISO (YYYY-MM-DD)
  horraire: string; // Horaire de l'événement (ex: "14:30")
  epreuveIds?: number[] | null; // IDs des épreuves associées (optionnel, peut être null)
}

/**
 * Interface pour les données de mise à jour d'un événement
 */
export interface UpdateEvenementRequest {
  id: number; // ID de l'événement à mettre à jour
  description: string; // Nouvelle description
  lieuId: number; // Nouveau lieu
  date: string; // Nouvelle date
  horraire: string; // Nouvel horaire
  epreuveIds?: number[] | null; // IDs des épreuves associées (optionnel, peut être null)
}

/**
 * Interface pour les filtres de recherche des événements
 */
export interface EvenementFilters {
  description?: string; // Filtrage par description (recherche partielle)
  lieuId?: number; // Filtrage par lieu
  dateDebut?: string; // Date de début pour filtrer par période
  dateFin?: string; // Date de fin pour filtrer par période
  page?: number; // Numéro de page pour la pagination
  limit?: number; // Nombre d'éléments par page
  sortBy?: 'date' | 'description' | 'lieu'; // Champ de tri
  sortOrder?: 'asc' | 'desc'; // Ordre de tri
}

/**
 * Service pour la gestion des événements sportifs
 * 
 * Fournit une interface pour toutes les opérations CRUD sur les événements
 * avec gestion automatique de l'authentification et des erreurs.
 */
export class EvenementService {
  // Chemin de base pour les endpoints des événements
  private static readonly BASE_PATH = '/evenement';

  /**
   * Récupère tous les événements avec filtres optionnels
   * 
   * @param filters - Filtres optionnels pour la recherche et la pagination
   * @returns Promise<Evenement[]> - Liste des événements
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * 
   * Route Django: path('evenement/', EvenementListView.as_view(), name='evenement-list')
   */
  static async getAllEvenements(filters?: EvenementFilters): Promise<Evenement[]> {
    let url = `${this.BASE_PATH}/`;
    
    // Construction des paramètres de requête si des filtres sont fournis
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
      
      // Ajout des paramètres à l'URL
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return fetchApi<Evenement[]>(url);
  }

  /**
   * Récupère un événement par son ID
   * 
   * @param id - ID de l'événement à récupérer
   * @returns Promise<Evenement> - L'événement correspondant à l'ID
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * 
   * Route Django: path('evenement/<int:pk>/', EvenementDetailView.as_view(), name='evenement-detail')
   */
  static async getEvenementById(id: number): Promise<Evenement> {
    return fetchApi<Evenement>(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Crée un nouvel événement
   * 
   * @param data - Données de l'événement à créer
   * @returns Promise<Evenement> - L'événement créé avec son ID généré
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * 
   * Route Django: path('evenement/create/', EvenementCreateView.as_view(), name='evenement-create')
   */
  static async createEvenement(data: CreateEvenementRequest): Promise<Evenement> {
    // Transformer les champs pour correspondre à l'API Django
    const payload = {
      description: data.description,
      lieu_id: data.lieuId,        // lieuId → lieu_id
      date: data.date,
      horraire: data.horraire,
      epreuve_ids: data.epreuveIds || []  // epreuveIds → epreuve_ids (tableau vide si null/undefined)
    };
    
    return fetchApi<Evenement>(`${this.BASE_PATH}/create/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Met à jour un événement existant
   * 
   * @param data - Données mises à jour de l'événement
   * @returns Promise<Evenement> - L'événement mis à jour
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * 
   * Route Django: path('evenement/update/<int:pk>/', EvenementUpdateView.as_view(), name='evenement-update')
   */
  static async updateEvenement(data: UpdateEvenementRequest): Promise<Evenement> {
    // Transformer les champs pour correspondre à l'API Django
    const payload: Record<string, unknown> = {
      description: data.description,
      lieu_id: data.lieuId,        // lieuId → lieu_id
      date: data.date,
      horraire: data.horraire
    };
    
    // Inclure epreuve_ids si fourni (même si c'est null ou un tableau vide)
    if (data.epreuveIds !== undefined) {
      payload.epreuve_ids = data.epreuveIds || [];
    }
    
    return fetchApi<Evenement>(`${this.BASE_PATH}/update/${data.id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Supprime un événement
   * 
   * Les épreuves associées sont automatiquement libérées par Django
   * grâce à la configuration on_delete=models.SET_NULL dans le modèle Epreuve.
   * 
   * @param id - ID de l'événement à supprimer
   * @returns Promise<void> - Résultat de l'opération de suppression
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * 
   * Route Django: path('evenement/delete/<int:pk>/', EvenementDeleteView.as_view(), name='evenement-delete')
   */
  static async deleteEvenement(id: number): Promise<void> {
    return fetchApi<void>(`${this.BASE_PATH}/delete/${id}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Recherche des événements (si implémentée côté backend)
   * 
   * @param query - Terme de recherche
   * @returns Promise<Evenement[]> - Liste des événements correspondants
   * @throws Error - En cas d'erreur de l'API ou de réseau
   * 
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