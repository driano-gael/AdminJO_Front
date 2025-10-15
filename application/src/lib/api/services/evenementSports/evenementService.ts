/**
 * Service de gestion des événements sportifs pour l'application AdminJO
 *
 * Ce service encapsule toutes les opérations CRUD pour la gestion des événements sportifs
 * des Jeux Olympiques. Il fournit une interface simple pour interagir avec l'API backend Django
 * et gère automatiquement la transformation des données entre le frontend et le backend.
 *
 * Un événement représente une compétition sportive avec une description,
 * un lieu, une date et un horaire spécifiques, pouvant être associé à plusieurs épreuves.
 *
 * @module services/evenementSports/evenementService
 */

import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Evenement } from '@/types/sportEvenement/evenement';

/**
 * Interface pour les données de création d'un nouvel événement sportif.
 */
export interface CreateEvenementRequest {
  /** Description détaillée de l'événement (ex: "Finale 100m hommes") */
  description: string;
  /** ID du lieu où se déroule l'événement */
  lieuId: number;
  /** Date de l'événement au format ISO (YYYY-MM-DD) */
  date: string;
  /** Horaire de début de l'événement (format HH:MM, ex: "14:30") */
  horraire: string;
  /** IDs des épreuves associées (optionnel, peut être null) */
  epreuveIds?: number[] | null;
}

/**
 * Interface pour les données de mise à jour d'un événement existant.
 */
export interface UpdateEvenementRequest {
  /** ID unique de l'événement à mettre à jour */
  id: number;
  /** Nouvelle description de l'événement */
  description: string;
  /** Nouveau lieu de l'événement */
  lieuId: number;
  /** Nouvelle date de l'événement */
  date: string;
  /** Nouvel horaire de l'événement */
  horraire: string;
  /** Nouveaux IDs des épreuves associées */
  epreuveIds?: number[] | null;
}

/**
 * Interface pour les filtres de recherche et pagination des événements.
 */
export interface EvenementFilters {
  /** Filtrage par description (recherche partielle, insensible à la casse) */
  description?: string;
  /** Filtrage par ID du lieu spécifique */
  lieuId?: number;
  /** Date de début pour filtrer par période (format YYYY-MM-DD) */
  dateDebut?: string;
  /** Date de fin pour filtrer par période (format YYYY-MM-DD) */
  dateFin?: string;
  /** Numéro de page pour la pagination (commence à 1) */
  page?: number;
  /** Nombre d'éléments par page (défaut: 20, max: 100) */
  limit?: number;
  /** Champ de tri des résultats */
  sortBy?: 'date' | 'description' | 'lieu';
  /** Ordre de tri (ascendant ou descendant) */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Service principal pour la gestion des événements sportifs.
 *
 * Cette classe fournit une interface statique pour toutes les opérations CRUD
 * sur les événements sportifs. Elle gère automatiquement :
 * - L'authentification via les tokens JWT
 * - La transformation des noms de champs (camelCase ↔ snake_case)
 * - La validation des données
 * - La gestion des erreurs HTTP
 * - La pagination et le filtrage
 */
export class EvenementService {
  /** Chemin de base pour tous les endpoints des événements */
  private static readonly BASE_PATH = '/evenement';

  /**
   * Récupère tous les événements avec options de filtrage et pagination.
   *
   * Cette méthode permet de récupérer la liste complète des événements
   * ou un sous-ensemble filtré selon les critères fournis. Elle construit
   * automatiquement les paramètres de requête et gère la pagination.
   *
   * @param filters - Filtres optionnels pour la recherche et la pagination
   * @returns Promise résolvant vers la liste des événements
   * @throws En cas d'erreur de l'API, de réseau, ou de paramètres invalides
   *
   * @example
   * ```typescript
   * // Récupérer tous les événements
   * const evenements = await EvenementService.getAllEvenements();
   *
   * // Filtrer par lieu et période
   * const evenementsFiltres = await EvenementService.getAllEvenements({
   *   lieuId: 1,
   *   dateDebut: '2024-07-26',
   *   dateFin: '2024-08-11',
   *   sortBy: 'date',
   *   sortOrder: 'asc'
   * });
   * ```
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
   * Récupère un événement spécifique par son ID unique.
   *
   * @param id - ID unique de l'événement à récupérer
   * @returns Promise résolvant vers l'événement correspondant
   * @throws En cas d'événement introuvable (404) ou d'erreur de l'API
   *
   * @example
   * ```typescript
   * try {
   *   const evenement = await EvenementService.getEvenementById(123);
   *   console.log(`Événement: ${evenement.description} le ${evenement.date}`);
   * } catch (error) {
   *   if (error.message.includes('404')) {
   *     console.error('Événement non trouvé');
   *   }
   * }
   * ```
   */
  static async getEvenementById(id: number): Promise<Evenement> {
    return fetchApi<Evenement>(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Crée un nouvel événement sportif.
   *
   * Cette méthode transforme automatiquement les noms de champs du format
   * camelCase (frontend) vers snake_case (backend Django) et gère l'association
   * avec les épreuves existantes.
   *
   * @param data - Données complètes de l'événement à créer
   * @returns Promise résolvant vers l'événement créé avec son ID généré
   * @throws En cas de données invalides, de conflit horaire, ou d'erreur serveur
   *
   * @example
   * ```typescript
   * const nouvelEvenement = {
   *   description: 'Finale 100m masculin',
   *   lieuId: 1,
   *   date: '2024-08-04',
   *   horraire: '20:00',
   *   epreuveIds: [15, 16]
   * };
   *
   * const evenement = await EvenementService.createEvenement(nouvelEvenement);
   * ```
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
   * Met à jour un événement sportif existant.
   *
   * Cette méthode permet de modifier tous les champs d'un événement,
   * y compris la réassignation des épreuves. Elle gère automatiquement
   * la transformation des formats de données.
   *
   * @param data - Données mises à jour de l'événement
   * @returns Promise résolvant vers l'événement mis à jour
   * @throws En cas d'événement introuvable, de données invalides, ou d'erreur serveur
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
   * Supprime définitivement un événement sportif.
   *
   * Cette opération supprime l'événement de manière définitive. Les épreuves
   * qui étaient associées à cet événement sont automatiquement libérées
   * (leur référence à l'événement est mise à NULL) grâce à la configuration
   * Django on_delete=models.SET_NULL.
   *
   * @param id - ID unique de l'événement à supprimer
   * @returns Promise résolvant sans valeur en cas de succès
   * @throws En cas d'événement introuvable ou d'erreur de suppression
   *
   * @example
   * ```typescript
   * await EvenementService.deleteEvenement(123);
   * console.log('Événement supprimé avec succès');
   * ```
   */
  static async deleteEvenement(id: number): Promise<void> {
    return fetchApi<void>(`${this.BASE_PATH}/delete/${id}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Effectue une recherche textuelle dans les événements.
   *
   * Cette méthode permet une recherche libre dans la description des événements.
   * Elle utilise les paramètres de requête pour filtrer les résultats côté serveur.
   *
   * Note: Cette fonctionnalité dépend de l'implémentation côté backend.
   *
   * @param query - Terme de recherche pour filtrer les événements
   * @returns Promise résolvant vers les événements correspondants
   * @throws En cas d'erreur de l'API ou de réseau
   *
   * @example
   * ```typescript
   * const evenementsNatation = await EvenementService.searchEvenements('natation');
   * ```
   */
  static async searchEvenements(query: string): Promise<Evenement[]> {
    return fetchApi<Evenement[]>(`${this.BASE_PATH}/?search=${encodeURIComponent(query)}`);
  }
}

/**
 * API fonctionnelle alternative pour les événements.
 *
 * Cette interface propose une approche fonctionnelle pour utiliser
 * le service des événements, offrant des noms de méthodes plus courts
 * et une syntaxe plus concise pour les développeurs qui préfèrent
 * cette approche.
 */
export const evenementApi = {
  /** Alias pour getAllEvenements */
  getAll: (filters?: EvenementFilters) => EvenementService.getAllEvenements(filters),
  /** Alias pour getEvenementById */
  getById: (id: number) => EvenementService.getEvenementById(id),
  /** Alias pour createEvenement */
  create: (data: CreateEvenementRequest) => EvenementService.createEvenement(data),
  /** Alias pour updateEvenement */
  update: (data: UpdateEvenementRequest) => EvenementService.updateEvenement(data),
  /** Alias pour deleteEvenement */
  delete: (id: number) => EvenementService.deleteEvenement(id),
  /** Alias pour searchEvenements */
  search: (query: string) => EvenementService.searchEvenements(query)
};