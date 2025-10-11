'use client';

import { useState } from 'react';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { useEmployesManagement } from '@/hooks/useEmployesManagement';
import { CreateEmployeRequest } from '@/types/employe/employe';
import Notification from '@/components/notification';
import EmployesHeader from './EmployesHeader';
import EmployesSearchAndFilters from './EmployesSearchAndFilters';
import EmployesTable from './EmployesTable';
import CreateEmployeForm from './CreateEmployeForm';

/**
 * Composant EmployesManagement - Gestion complète des employés
 *
 * Fonctionnalités :
 * - Affichage de la liste des employés avec recherche
 * - Création de nouveaux employés
 * - Interface responsive avec design moderne
 */
export default function EmployesManagement() {
  useSessionExpiry();

  const {
    employes,
    loading,
    error,
    searchTerm,
    statusFilter,
    isCreating,
    loadEmployes,
    createEmploye,
    handleSearch,
    handleStatusFilter,
    toggleEmployeActive
  } = useEmployesManagement();

  // États pour l'UI
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateEmploye = async (employeData: CreateEmployeRequest) => {
    const success = await createEmploye(employeData);
    if (success) {
      setNotification({
        message: 'Employé créé avec succès !',
        type: 'success'
      });
      setShowCreateForm(false);
    } else {
      setNotification({
        message: 'Erreur lors de la création de l\'employé',
        type: 'error'
      });
    }
    return success;
  };

  return (
    <div className="min-h-screen bg-base-200">
      <EmployesHeader onAddEmploye={() => setShowCreateForm(true)} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <EmployesSearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilter}
        />

        <EmployesTable
          employes={employes}
          loading={loading}
          searchTerm={searchTerm}
          onRefresh={loadEmployes}
          error={error}
          handleToggleActive={toggleEmployeActive}
        />
      </main>

      {/* Formulaire de création */}
      {showCreateForm && (
        <CreateEmployeForm
          onSubmit={handleCreateEmploye}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isCreating}
        />
      )}

      {/* Notifications */}
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
