import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Client } from '@/types/client/client';

/**
 * Service pour la gestion des clients
 */
class ClientService {
  private readonly baseUrl = '/users';

  /**
   * Récupère la liste de tous les clients
   */
  async getClients(): Promise<Client[]> {
    return await fetchApi<Client[]>(`${this.baseUrl}/client/`);
  }

  /**
   * Met a jour l'etat Actif - inactif d'un client
   * @param clientId ID du client
   */
  async setUnsetClientActive(id: number){
    return await fetchApi<Client>(`${this.baseUrl}/setInactive/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const clientService = new ClientService();

