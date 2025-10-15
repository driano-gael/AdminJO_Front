/**
 * Service de gestion des clients pour l'application AdminJO
 *
 * Ce service encapsule toutes les opérations liées à la gestion des clients,
 * incluant la récupération de la liste des clients et la gestion de leur statut actif/inactif.
 *
 * @module services/clientService
 */

import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Client } from '@/types/client/client';

/**
 * Service pour la gestion des clients de l'application AdminJO.
 *
 * Cette classe fournit une interface unifiée pour toutes les opérations
 * CRUD (Create, Read, Update, Delete) relatives aux clients. Elle utilise
 * le wrapper fetchApi pour la communication avec l'API backend Django.
 *
 * Toutes les méthodes de ce service nécessitent une authentification
 * et gèrent automatiquement les tokens JWT via fetchApi.
 */
class ClientService {
  /** URL de base pour les endpoints clients */
  private readonly baseUrl = '/users';

  /**
   * Récupère la liste complète de tous les clients enregistrés.
   *
   * Cette méthode effectue une requête GET vers l'endpoint des clients
   * et retourne un tableau contenant tous les clients avec leurs informations complètes.
   *
   * @returns Promise résolvant vers un tableau de clients
   * @throws En cas d'erreur de communication avec l'API ou de droits insuffisants
   *
   * @example
   * ```typescript
   * try {
   *   const clients = await clientService.getClients();
   *   console.log(`${clients.length} clients trouvés`);
   *   clients.forEach(client => {
   *     console.log(`${client.nom} - ${client.email}`);
   *   });
   * } catch (error) {
   *   console.error('Erreur lors de la récupération des clients:', error.message);
   * }
   * ```
   */
  async getClients(): Promise<Client[]> {
    return await fetchApi<Client[]>(`${this.baseUrl}/client/`);
  }

  /**
   * Bascule l'état actif/inactif d'un client spécifique.
   *
   * Cette méthode permet d'activer ou de désactiver un client en modifiant
   * son statut dans la base de données. L'opération est une bascule :
   * - Si le client est actif, il devient inactif
   * - Si le client est inactif, il devient actif
   *
   * @param id - ID unique du client à modifier
   * @returns Promise résolvant vers le client mis à jour avec son nouveau statut
   * @throws En cas d'erreur de communication avec l'API, client introuvable, ou droits insuffisants
   *
   * @example
   * ```typescript
   * try {
   *   const updatedClient = await clientService.setUnsetClientActive(123);
   *   if (updatedClient.is_active) {
   *     console.log('Client activé avec succès');
   *   } else {
   *     console.log('Client désactivé avec succès');
   *   }
   * } catch (error) {
   *   if (error.message.includes('404')) {
   *     console.error('Client non trouvé');
   *   } else {
   *     console.error('Erreur lors de la modification:', error.message);
   *   }
   * }
   * ```
   */
  async setUnsetClientActive(id: number){
    return await fetchApi<Client>(`${this.baseUrl}/setInactive/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Instance singleton du service client.
 *
 * Cette instance partagée permet d'utiliser le service dans toute l'application
 * sans avoir à créer de nouvelles instances. Elle maintient la configuration
 * et l'état du service de manière cohérente.
 *
 * @example
 * ```typescript
 * import { clientService } from '@/lib/api/services/clientService';
 *
 * // Usage direct de l'instance
 * const clients = await clientService.getClients();
 * ```
 */
export const clientService = new ClientService();
