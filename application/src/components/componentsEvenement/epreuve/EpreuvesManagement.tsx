'use client';

import { useState } from 'react';
import { useEpreuvesManagement } from '@/hooks/useEpreuvesManagement';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { CreateEpreuveRequest } from '@/lib/api/services/evenementSports/epreuveService';
import Notification from '@/components/notification';
import EpreuvesHeader from './EpreuvesHeader';
import SearchAndFilters from './SearchAndFilters';
import EpreuvesTable from './EpreuvesTable';
import EpreuveModal from './EpreuveModal';

export default function EpreuvesManagement() {
  useSessionExpiry();

  const {
    epreuves,
    disciplines,
    searchTerm,
    selectedDisciplineId,
    loading,
    error,
    createLoading,
    createError,
    loadEpreuves,
    createEpreuve,
    updateEpreuve,
    deleteEpreuve,
    handleSearch,
    handleDisciplineFilter,
    setCreateError
  } = useEpreuvesManagement();

  const [showModal, setShowModal] = useState(false);
  const [editingEpreuve, setEditingEpreuve] = useState<Epreuve | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleOpenModal = (epreuve?: Epreuve) => {
    setEditingEpreuve(epreuve || null);
    setShowModal(true);
  };

  // Fonction pour actualiser les données en gardant les filtres actuels
  const handleRefresh = () => {
    loadEpreuves(
      searchTerm.trim() || undefined, 
      selectedDisciplineId
    );
  };

  const handleSaveEpreuve = async (epreuveData: CreateEpreuveRequest) => {
    try {
      if (editingEpreuve) {
        await updateEpreuve(editingEpreuve.id, epreuveData);
        setNotification({
          message: 'Épreuve modifiée avec succès !',
          type: 'success'
        });
      } else {
        // Mode création
        await createEpreuve(epreuveData);
        setNotification({
          message: 'Épreuve créée avec succès !',
          type: 'success'
        });
      }
      setShowModal(false);
      setEditingEpreuve(null);
    } catch {
      // L'erreur est déjà gérée dans le hook
    }
  };

  // Fonction pour supprimer une épreuve
  const handleDeleteEpreuve = async (id: number) => {
    try {
      await deleteEpreuve(id);
      setNotification({
        message: 'Épreuve supprimée avec succès !',
        type: 'success'
      });
    } catch {
      setNotification({
        message: 'Erreur lors de la suppression de l\'épreuve',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <EpreuvesHeader 
        onCreateClick={() => handleOpenModal()}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          selectedDisciplineId={selectedDisciplineId}
          disciplines={disciplines}
          onSearch={handleSearch}
          onDisciplineFilter={handleDisciplineFilter}
        />

        {/* Epreuves Table */}
        <EpreuvesTable
          epreuves={epreuves}
          loading={loading}
          searchTerm={searchTerm}
          onRefresh={handleRefresh}
          onDelete={handleDeleteEpreuve}
          onEdit={(epreuve) => handleOpenModal(epreuve)}
          error={error}
        />
      </main>
      
      <EpreuveModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEpreuve(null);
          setCreateError(null);
        }}
        onSave={handleSaveEpreuve}
        loading={createLoading}
        error={createError}
        epreuve={editingEpreuve || undefined}
        disciplines={disciplines}
      />
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => {
            setNotification(null);
          }}
        />
      )}
    </div>
  );
}
