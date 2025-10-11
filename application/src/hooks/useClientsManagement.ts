import { useState, useEffect } from 'react';
import { Client } from '@/types/client/client';
import { clientService } from '@/lib/api/services/clientService';

/**
 * Hook personnalisé pour la gestion des clients
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
