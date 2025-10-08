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

  /**
   * Charge la liste des clients
   */
  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getClients();
      setClients(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des clients');
      console.error('Erreur chargement clients:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gère la recherche de clients
   */
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  /**
   * Filtre les clients selon le terme de recherche
   */
  const filteredClients = clients.filter(client => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      client.nom.toLowerCase().includes(searchLower) ||
      client.prenom.toLowerCase().includes(searchLower) ||
      client.telephone.includes(searchTerm)
    );
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
    loadClients,
    handleSearch
  };
}
