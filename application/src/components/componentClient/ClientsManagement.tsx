'use client';

import {JSX, useState} from 'react';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { useClientsManagement } from '@/hooks/useClientsManagement';
import Notification from '@/components/notification';
import ClientsHeader from './ClientsHeader';
import ClientsSearchAndFilters from './ClientsSearchAndFilters';
import ClientsTable from './ClientsTable';

/**
 * Composant ClientsManagement - Interface de consultation et gestion des clients AdminJO
 *
 * Ce composant orchestre l'interface complète de gestion des clients pour l'application
 * d'administration des JO 2024. Contrairement aux autres interfaces Management qui offrent
 * un CRUD complet, celui-ci est limité à la consultation, recherche, filtrage et
 * activation/désactivation des comptes clients.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Consultation des clients
 * - **Affichage de liste** : Tableau des clients existants avec informations complètes
 * - **Activation/Désactivation** : Toggle du statut actif/inactif des comptes
 * - **Actualisation** : Rechargement manuel des données clients
 * - **Pas de création** : Aucun formulaire d'ajout de nouveaux clients
 * - **Pas de modification** : Aucune édition des informations clients
 * - **Pas de suppression** : Seulement gestion des statuts
 *
 * ### Outils de recherche et filtrage
 * - **Recherche textuelle** : Par nom, prénom, téléphone ou email
 * - **Filtre par statut** : Tous, Actif, Inactif
 * - **Persistance des filtres** : Maintien des critères de recherche
 *
 * ### Gestion des états et notifications
 * - **États de chargement** : Spinners pendant les opérations
 * - **Gestion d'erreurs** : Affichage des erreurs réseau
 * - **Notifications** : Messages de succès/erreur pour les actions
 * - **États vides** : Messages contextuels quand aucun client trouvé
 *
 * ## Architecture des composants
 *
 * ### Composants intégrés
 * - **ClientsHeader** : En-tête simple sans bouton d'ajout
 * - **ClientsSearchAndFilters** : Barre de recherche + filtres par statut
 * - **ClientsTable** : Tableau avec ClientsTableRow pour chaque client
 * - **Notification** : Système de messages utilisateur
 *
 * ### Hooks utilisés
 * - **useClientsManagement** : Logique métier et appels API
 * - **useSessionExpiry** : Gestion automatique de l'expiration de session
 *
 * ## Workflow utilisateur
 *
 * 1. **Chargement initial** : Affichage automatique de tous les clients
 * 2. **Recherche** : Saisie dans la barre de recherche pour filtrer
 * 3. **Filtrage** : Sélection d'un statut (Tous/Actif/Inactif)
 * 4. **Consultation** : Visualisation des informations clients dans le tableau
 * 5. **Gestion des statuts** : Activation/désactivation via boutons d'action
 * 6. **Actualisation** : Rechargement des données via bouton refresh
 *
 * ## États gérés localement
 *
 * - **notification** : Messages de succès/erreur pour l'interface utilisateur
 * - Tous les autres états (clients, loading, error, searchTerm, statusFilter)
 *   sont gérés par le hook useClientsManagement
 *
 * @returns {JSX.Element} Interface complète de consultation et gestion limitée des clients
 *
 * @see {@link ClientsHeader} - En-tête simple sans bouton d'ajout
 * @see {@link ClientsSearchAndFilters} - Outils de recherche et filtrage par statut
 * @see {@link ClientsTable} - Tableau d'affichage avec actions limitées
 * @see {@link useClientsManagement} - Hook gérant la logique métier
 * @see {@link useSessionExpiry} - Hook de gestion de session
 *
 */
export function ClientsManagement(): JSX.Element {
  useSessionExpiry();

  const {
    clients,
    loading,
    error,
    searchTerm,
    statusFilter,
    loadClients,
    handleSearch,
    handleStatusFilter,
    toggleClientActive
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
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilter}
        />

        <ClientsTable
          clients={clients}
          loading={loading}
          searchTerm={searchTerm}
          onRefresh={loadClients}
          error={error}
          handleToggleActive={toggleClientActive}
        />
      </main>

      {notification && (
        <Notification
          title="Gestion Clients"
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
export default ClientsManagement;
