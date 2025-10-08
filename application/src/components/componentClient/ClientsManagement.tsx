'use client';

import { useState } from 'react';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Client } from '@/types/client/client';
import { useClientsManagement } from '@/hooks/useClientsManagement';
import Notification from '@/components/notification';
import ClientsHeader from './ClientsHeader';
import ClientsSearchAndFilters from './ClientsSearchAndFilters';
import ClientsTable from './ClientsTable';

/**
 * Composant ClientsManagement - Gestion complète des clients
 *
 * Fonctionnalités :
 * - Affichage de la liste des clients avec recherche
 * - Interface responsive avec design moderne
 */
export default function ClientsManagement() {
  useSessionExpiry();

  const {
    clients,
    loading,
    error,
    searchTerm,
    loadClients,
    handleSearch
  } = useClientsManagement();

  // États pour l'UI
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  return (
    <div className="min-h-screen bg-base-200">
      <ClientsHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <ClientsSearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
        />

        <ClientsTable
          clients={clients}
          loading={loading}
          searchTerm={searchTerm}
          onRefresh={loadClients}
          error={error}
        />
      </main>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
