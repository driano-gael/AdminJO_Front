import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Employe, CreateEmployeRequest } from '@/types/employe/employe';

/**
 * Service pour la gestion des employés
 */
class EmployeService {
  private readonly baseUrl = '/users';
  private readonly authUrl = '/auth';

  /**
   * Récupère la liste de tous les employés
   */
  async getEmployes(): Promise<Employe[]> {
    return await fetchApi<Employe[]>(`${this.baseUrl}/employe/`);
  }

  /**
   * Crée un nouvel employé
   * @param employeData Données de l'employé à créer
   */
  async createEmploye(employeData: CreateEmployeRequest): Promise<Employe> {
    return await fetchApi<Employe>(`${this.authUrl}/register/employe/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeData)
    });
  }

  /**
   * Met à jour l'état Actif - inactif d'un employé
   * @param employeId ID de l'employé
   */
  async setUnsetEmployeActive(id: number): Promise<Employe> {
    return await fetchApi<Employe>(`${this.baseUrl}/setEmployeeInactive/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const employeService = new EmployeService();
