import { fetchApi } from '@/lib/api/core/fetchWrappers';
import {Offre} from '@/types/offre/offre';


export class OffreService {
  private static readonly BASE_PATH = '/offre';

  static async getAll(): Promise<Offre[]> {
    return fetchApi<Offre[]>(`${this.BASE_PATH}/`, {}, false);
  }

  static async getById(id: number): Promise<Offre> {
    return fetchApi<Offre>(`${this.BASE_PATH}/${id}/`);
  }

  static async create(data: Offre): Promise<Offre> {
    return fetchApi<Offre>(`${this.BASE_PATH}/create/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async update(data: Offre): Promise<Offre> {
    return fetchApi<Offre>(`${this.BASE_PATH}/update/${data.id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete(id: number): Promise<void> {
    return fetchApi<void>(`${this.BASE_PATH}/delete/${id}/`, {
      method: 'DELETE',
    });
  }
}
