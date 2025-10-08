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
}

export const clientService = new ClientService();
