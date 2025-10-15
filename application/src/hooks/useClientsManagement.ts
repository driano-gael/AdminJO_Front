/**
 * Hook de gestion des clients pour l'application AdminJO
 *
 * Ce hook centralise toute la logique de gestion des clients dans l'application
 * d'administration des JO 2024. Il fournit les opérations CRUD, le filtrage,
 * la recherche et la gestion des états d'activation des comptes clients.
 *
 * @module useClientsManagement
 * @category Hooks
 */

import { useState, useEffect } from 'react';
import { Client } from '@/types/client/client';
import { clientService } from '@/lib/api/services/clientService';

/**
 * Hook useClientsManagement - Gestion complète des clients
 *
 * Ce hook fournit une interface unifiée pour la gestion des clients de l'application
 * AdminJO. Il combine les opérations de lecture, filtrage, recherche et modification
 * des états d'activation des comptes utilisateurs clients.
 *
 * @name useClientsManagement
 *
 * ## Fonctionnalités principales
 *
 * ### Gestion des données clients
 * - **Chargement automatique** : Récupération de tous les clients au montage
 * - **Gestion d'état** : États de chargement et d'erreur pour les opérations
 * - **Mise à jour optimiste** : Modification immédiate de l'UI avant confirmation serveur
 * - **Synchronisation** : Maintien de la cohérence avec les données backend
 *
 * ### Système de filtrage et recherche
 * - **Recherche textuelle** : Filtrage par nom, email ou autres champs
 * - **Filtrage par statut** : Clients actifs, inactifs ou tous
 * - **Filtres combinés** : Application simultanée de plusieurs critères
 * - **Mise à jour temps réel** : Filtrage immédiat lors des changements
 *
 * ### Gestion des statuts d'activation
 * - **Toggle activation** : Activation/désactivation des comptes clients
 * - **Mise à jour optimiste** : Changement immédiat d'état dans l'UI
 * - **Gestion d'erreurs** : Rollback en cas d'échec de l'opération
 * - **Feedback visuel** : Indicateurs de statut en temps réel
 *
 * ## États gérés
 *
 * ### Données principales
 * - **clients** : Liste complète des clients avec informations utilisateur
 * - **loading** : État de chargement pour les opérations principales
 * - **error** : Messages d'erreur pour les opérations échouées
 *
 * ### Filtres et recherche
 * - **searchTerm** : Terme de recherche textuelle actuel
 * - **statusFilter** : Filtre par statut ('all', 'active', 'inactive')
 *
 * ## Opérations disponibles
 *
 * ### Chargement des données
 * - **loadClients()** : Récupération de tous les clients depuis l'API
 * - **Gestion d'erreurs** : Capture et affichage des erreurs de chargement
 * - **États de chargement** : Indicateurs visuels pendant les opérations
 *
 * ### Modification des statuts
 * - **toggleClientActive()** : Basculer l'état actif/inactif d'un client
 * - **Mise à jour optimiste** : Changement immédiat avant confirmation serveur
 * - **Gestion cohérence** : Maintien de la synchronisation des données
 *
 * ## Intégrations
 *
 * - **clientService** : Service API pour les opérations sur les clients
 * - **Client type** : Interface TypeScript pour la structure des données
 *
 * @returns {Object} Interface complète de gestion des clients
 * @returns {Client[]} returns.clients - Liste des clients filtrés
 * @returns {boolean} returns.loading - État de chargement
 * @returns {string | null} returns.error - Message d'erreur
 * @returns {string} returns.searchTerm - Terme de recherche
 * @returns {string} returns.statusFilter - Filtre de statut actuel
 * @returns {Function} returns.loadClients - Recharger les clients
 * @returns {Function} returns.handleSearch - Modifier le terme de recherche
 * @returns {Function} returns.handleStatusFilter - Modifier le filtre de statut
 * @returns {Function} returns.toggleClientActive - Basculer l'état d'un client
 *
 * @see {@link clientService} - Service API des clients
 * @see {@link Client} - Interface TypeScript des données client
 *
 */
export function useClientsManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  /**
   * Charge la liste des clients
   */
  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getClients();
      setClients(data);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des clients';
      setError(errorMessage);
      console.error('Erreur chargement clients:', err);
    } finally {
      setLoading(false);
    }
  };
    /**
   * change l'etat actif/inactif d'un client
   */
  const toggleClientActive = async (clientId: number) => {
    try {
      setError(null);

      // Mise à jour optimiste : on met à jour l'état local immédiatement
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === clientId
            ? {
                ...client,
                user: {
                  ...client.user,
                  is_active: !client.user.is_active
                }
              }
            : client
        )
      );

      // Appel API
      await clientService.setUnsetClientActive(clientId);

    } catch (err: Error | unknown) {
      // En cas d'erreur, on recharge la liste pour récupérer l'état correct
      await loadClients();
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification du statut du client';
      setError(errorMessage);
      console.error('Erreur modification statut client:', err);
    }
  };

  /**
   * Gère la recherche de clients
   */
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  /**
   * Gère le filtre par statut
   */
  const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
  };

  /**
   * Filtre les clients selon le terme de recherche et le statut
   */
  const filteredClients = clients.filter(client => {
    // Filtre par terme de recherche
    const matchesSearch = !searchTerm || (() => {
      const searchLower = searchTerm.toLowerCase();
      return (
        client.nom.toLowerCase().includes(searchLower) ||
        client.prenom.toLowerCase().includes(searchLower) ||
        client.telephone.includes(searchTerm) ||
        client.user.email.toLowerCase().includes(searchLower)
      );
    })();

    // Filtre par statut
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && client.user.is_active) ||
      (statusFilter === 'inactive' && !client.user.is_active);

    return matchesSearch && matchesStatus;
  });

  // Chargement initial
  useEffect(() => {
    loadClients();
  }, []);

  return {
    clients: filteredClients,
    loading,
    error,
    searchTerm,
    statusFilter,
    loadClients,
    handleSearch,
    handleStatusFilter,
    toggleClientActive
  };
}
