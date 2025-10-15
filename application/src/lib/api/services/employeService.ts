/**
 * Service de gestion des employés pour l'application AdminJO
 *
 * Ce service encapsule toutes les opérations liées à la gestion des employés,
 * incluant la récupération, la création et la gestion du statut actif/inactif.
 *
 * @module services/employeService
 */

import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { Employe, CreateEmployeRequest } from '@/types/employe/employe';

/**
 * Service pour la gestion des employés de l'application AdminJO.
 *
 * Cette classe fournit une interface complète pour toutes les opérations
 * CRUD relatives aux employés. Elle gère à la fois les opérations de
 * gestion des utilisateurs existants et la création de nouveaux comptes employés.
 *
 * Le service utilise deux endpoints différents :
 * - `/users` pour les opérations de gestion (lecture, modification)
 * - `/auth` pour les opérations d'inscription (création de comptes)
 */
class EmployeService {
  /** URL de base pour les endpoints de gestion des utilisateurs */
  private readonly baseUrl = '/users';
  /** URL de base pour les endpoints d'authentification */
  private readonly authUrl = '/auth';

  /**
   * Récupère la liste complète de tous les employés enregistrés.
   *
   * Cette méthode effectue une requête GET vers l'endpoint des employés
   * et retourne un tableau contenant tous les employés avec leurs informations complètes.
   *
   * @returns Promise résolvant vers un tableau d'employés
   * @throws En cas d'erreur de communication avec l'API ou de droits insuffisants
   *
   * @example
   * ```typescript
   * try {
   *   const employes = await employeService.getEmployes();
   *   console.log(`${employes.length} employés trouvés`);
   *   employes.forEach(employe => {
   *     console.log(`${employe.nom} ${employe.prenom} - ${employe.role}`);
   *   });
   * } catch (error) {
   *   console.error('Erreur lors de la récupération des employés:', error.message);
   * }
   * ```
   */
  async getEmployes(): Promise<Employe[]> {
    return await fetchApi<Employe[]>(`${this.baseUrl}/employe/`);
  }

  /**
   * Crée un nouvel employé dans le système.
   *
   * Cette méthode utilise l'endpoint d'inscription pour créer un nouveau compte employé
   * avec toutes les informations nécessaires. Elle gère automatiquement la création
   * du compte utilisateur et l'assignation du rôle employé.
   *
   * @param employeData - Données complètes de l'employé à créer
   * @returns Promise résolvant vers l'employé créé avec son ID généré
   * @throws En cas d'erreur de validation, d'email déjà existant, ou d'erreur serveur
   *
   * @example
   * ```typescript
   * const nouvelEmploye = {
   *   nom: 'Martin',
   *   prenom: 'Sophie',
   *   email: 'sophie.martin@adminjo.fr',
   *   password: 'MotDePasseSecurise123!',
   *   role: 'employe',
   *   telephone: '0123456789'
   * };
   *
   * try {
   *   const employe = await employeService.createEmploye(nouvelEmploye);
   *   console.log(`Employé créé avec l'ID: ${employe.id}`);
   * } catch (error) {
   *   if (error.message.includes('400')) {
   *     console.error('Données invalides ou email déjà utilisé');
   *   } else {
   *     console.error('Erreur lors de la création:', error.message);
   *   }
   * }
   * ```
   */
  async createEmploye(employeData: CreateEmployeRequest): Promise<Employe> {
    return await fetchApi<Employe>(`${this.authUrl}/register/employe/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeData)
    });
  }

  /**
   * Bascule l'état actif/inactif d'un employé spécifique.
   *
   * Cette méthode permet d'activer ou de désactiver un employé en modifiant
   * son statut dans la base de données. L'opération est une bascule :
   * - Si l'employé est actif, il devient inactif
   * - Si l'employé est inactif, il devient actif
   *
   * Désactiver un employé empêche sa connexion sans supprimer son compte.
   *
   * @param id - ID unique de l'employé à modifier
   * @returns Promise résolvant vers l'employé mis à jour avec son nouveau statut
   * @throws En cas d'erreur de communication avec l'API, employé introuvable, ou droits insuffisants
   *
   * @example
   * ```typescript
   * try {
   *   const updatedEmploye = await employeService.setUnsetEmployeActive(456);
   *   if (updatedEmploye.is_active) {
   *     console.log('Employé réactivé avec succès');
   *   } else {
   *     console.log('Employé désactivé avec succès');
   *   }
   * } catch (error) {
   *   if (error.message.includes('404')) {
   *     console.error('Employé non trouvé');
   *   } else {
   *     console.error('Erreur lors de la modification:', error.message);
   *   }
   * }
   * ```
   */
  async setUnsetEmployeActive(id: number): Promise<Employe> {
    return await fetchApi<Employe>(`${this.baseUrl}/setEmployeeInactive/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Instance singleton du service employé.
 *
 * Cette instance partagée permet d'utiliser le service dans toute l'application
 * sans avoir à créer de nouvelles instances. Elle maintient la configuration
 * et l'état du service de manière cohérente.
 *
 * @example
 * ```typescript
 * import { employeService } from '@/lib/api/services/employeService';
 *
 * // Usage direct de l'instance
 * const employes = await employeService.getEmployes();
 * const nouvelEmploye = await employeService.createEmploye(employeData);
 * ```
 */
export const employeService = new EmployeService();
