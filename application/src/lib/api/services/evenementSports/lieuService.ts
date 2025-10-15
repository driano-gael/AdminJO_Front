/**
 * Service de gestion des lieux pour l'application AdminJO
 *
 * Ce service encapsule toutes les opérations CRUD pour la gestion des lieux
 * où se déroulent les événements sportifs des Jeux Olympiques.
 *
 * @module services/evenementSports/lieuService
 */

import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Lieu } from '@/types/sportEvenement/lieu';

/**
 * Interface pour les données de création d'un nouveau lieu.
 */
export interface CreateLieuRequest {
  /** Nom du lieu (ex: "Stade de France", "Aquatics Centre") */
  nom: string;
}

/**
 * Interface pour les données de mise à jour d'un lieu existant.
 */
export interface UpdateLieuRequest {
  /** ID unique du lieu à mettre à jour */
  id: number;
  /** Nouveau nom du lieu */
  nom: string;
}

/**
 * Interface pour les filtres de recherche et pagination des lieux.
 */
export interface LieuFilters {
  /** Filtrage par nom (recherche partielle, insensible à la casse) */
  nom?: string;
  /** Numéro de page pour la pagination (commence à 1) */
  page?: number;
  /** Nombre d'éléments par page (défaut: 20) */
  limit?: number;
}

/**
 * Service principal pour la gestion des lieux olympiques.
 *
 * Cette classe fournit une interface statique pour toutes les opérations CRUD
 * sur les lieux. Elle gère automatiquement l'authentification, la validation
 * des données et la gestion des erreurs HTTP.
 */
export class LieuService {
  /** Chemin de base pour tous les endpoints des lieux */
  private static readonly BASE_PATH = '/lieu';

  /**
   * Récupère tous les lieux avec options de filtrage et pagination.
   *
   * @param filters - Filtres optionnels pour la recherche et la pagination
   * @returns Promise résolvant vers la liste des lieux
   * @throws En cas d'erreur de l'API ou de réseau
   *
   * @example
   * ```typescript
   * // Récupérer tous les lieux
   * const lieux = await LieuService.getAllLieux();
   *
   * // Recherche par nom avec pagination
   * const lieuxStade = await LieuService.getAllLieux({
   *   nom: 'Stade',
   *   page: 1,
   *   limit: 10
   * });
   * ```
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
   * Récupère un lieu spécifique par son ID unique.
   *
   * @param id - ID unique du lieu à récupérer
   * @returns Promise résolvant vers le lieu correspondant
   * @throws En cas de lieu introuvable (404) ou d'erreur de l'API
   *
   * @example
   * ```typescript
   * try {
   *   const lieu = await LieuService.getLieuById(1);
   *   console.log(`Lieu: ${lieu.nom}`);
   * } catch (error) {
   *   console.error('Lieu non trouvé ou erreur:', error.message);
   * }
   * ```
   */
  static async getLieuById(id: number): Promise<Lieu> {
    return fetchApi<Lieu>(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Crée un nouveau lieu.
   *
   * @param data - Données du lieu à créer
   * @returns Promise résolvant vers le lieu créé avec son ID généré
   * @throws En cas de données invalides ou d'erreur serveur
   *
   * @example
   * ```typescript
   * const nouveauLieu = await LieuService.createLieu({
   *   nom: 'Nouveau Stade Olympique'
   * });
   * console.log(`Lieu créé avec l'ID: ${nouveauLieu.id}`);
   * ```
   */
  static async createLieu(data: CreateLieuRequest): Promise<Lieu> {
    return fetchApi<Lieu>(`${this.BASE_PATH}/create/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Met à jour un lieu existant.
   *
   * @param data - Données mises à jour du lieu
   * @returns Promise résolvant vers le lieu mis à jour
   * @throws En cas de lieu introuvable ou d'erreur de mise à jour
   *
   * @example
   * ```typescript
   * const lieuModifie = await LieuService.updateLieu({
   *   id: 1,
   *   nom: 'Stade de France - Rénové'
   * });
   * ```
   */
  static async updateLieu(data: UpdateLieuRequest): Promise<Lieu> {
    return fetchApi<Lieu>(`${this.BASE_PATH}/update/${data.id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprime définitivement un lieu.
   *
   * @param id - ID unique du lieu à supprimer
   * @returns Promise résolvant sans valeur en cas de succès
   * @throws En cas de lieu introuvable ou d'erreur de suppression
   *
   * @example
   * ```typescript
   * await LieuService.deleteLieu(1);
   * console.log('Lieu supprimé avec succès');
   * ```
   */
  static async deleteLieu(id: number): Promise<void> {
    return fetchApi<void>(`${this.BASE_PATH}/delete/${id}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Effectue une recherche textuelle dans les lieux.
   *
   * @param query - Terme de recherche pour filtrer les lieux
   * @returns Promise résolvant vers les lieux correspondants
   * @throws En cas d'erreur de l'API ou de réseau
   *
   * @example
   * ```typescript
   * const lieuxStade = await LieuService.searchLieux('stade');
   * const lieuxPiscine = await LieuService.searchLieux('aquatic');
   * ```
   */
  static async searchLieux(query: string): Promise<Lieu[]> {
    return fetchApi<Lieu[]>(`${this.BASE_PATH}/?search=${encodeURIComponent(query)}`);
  }
}

/**
 * API fonctionnelle alternative pour les lieux.
 *
 * Interface proposant une approche fonctionnelle pour utiliser le service
 * des lieux avec des noms de méthodes plus concis.
 */
export const lieuApi = {
  /** Alias pour getAllLieux */
  getAll: (filters?: LieuFilters) => LieuService.getAllLieux(filters),
  /** Alias pour getLieuById */
  getById: (id: number) => LieuService.getLieuById(id),
  /** Alias pour createLieu */
  create: (data: CreateLieuRequest) => LieuService.createLieu(data),
  /** Alias pour updateLieu */
  update: (data: UpdateLieuRequest) => LieuService.updateLieu(data),
  /** Alias pour deleteLieu */
  delete: (id: number) => LieuService.deleteLieu(id),
  /** Alias pour searchLieux */
  search: (query: string) => LieuService.searchLieux(query)
};
