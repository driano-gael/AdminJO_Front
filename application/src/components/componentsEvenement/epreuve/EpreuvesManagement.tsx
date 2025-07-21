'use client';

import { useState } from 'react';
import { useEpreuvesManagement } from '@/hooks/useEpreuvesManagement';
import { useAuth } from '@/contexts/authContext';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import Notification from '@/components/notification';
import EpreuvesHeader from './EpreuvesHeader';
import SearchAndFilters from './SearchAndFilters';
import EpreuvesTable from './EpreuvesTable';
import EpreuveModal from './EpreuveModal';

interface Props {
  onBack: () => void;
}

export default function EpreuvesManagement({ onBack }: Props) {
  const { isAuthenticated } = useAuth();
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

  const handleSaveEpreuve = async (epreuveData: any) => {
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
    } catch (err) {
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
    } catch (err) {
      setNotification({
        message: 'Erreur lors de la suppression de l\'épreuve',
        type: 'error'
      });
    }
  };

  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 mb-4">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <EpreuvesHeader 
        onBack={onBack}
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
