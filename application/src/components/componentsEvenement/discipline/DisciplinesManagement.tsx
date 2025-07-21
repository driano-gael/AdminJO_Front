'use client';

import { useState } from 'react';
import { useDisciplinesManagement } from '@/hooks/useDisciplinesManagement';
import { useAuth } from '@/contexts/authContext';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Discipline } from '@/types/sportEvenement/discipline';
import Notification from '@/components/notification';
import DisciplinesHeader from './DisciplinesHeader';
import SearchAndFilters from './SearchAndFilters';
import DisciplinesTable from './DisciplinesTable';
import DisciplineModal from './DisciplineModal';

interface Props {
  onBack: () => void;
}

export default function DisciplinesManagement({ onBack }: Props) {
  const { isAuthenticated } = useAuth();
  useSessionExpiry();

  const {
    disciplines,
    searchTerm,
    loading,
    error,
    createLoading,
    createError,
    loadDisciplines,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
    handleSearch,
    setCreateError
  } = useDisciplinesManagement();

  const [showModal, setShowModal] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleOpenModal = (discipline?: Discipline) => {
    setEditingDiscipline(discipline || null);
    setShowModal(true);
  };

  // Fonction pour actualiser les données en gardant le terme de recherche actuel
  const handleRefresh = () => {
    if (searchTerm.trim()) {
      loadDisciplines(searchTerm);
    } else {
      loadDisciplines();
    }
  };

  const handleSaveDiscipline = async (disciplineData: any) => {
    try {
      if (editingDiscipline) {
        await updateDiscipline(editingDiscipline.id, disciplineData);
        setNotification({
          message: 'Discipline modifiée avec succès !',
          type: 'success'
        });
      } else {
        // Mode création
        await createDiscipline(disciplineData);
        setNotification({
          message: 'Discipline créée avec succès !',
          type: 'success'
        });
      }
      setShowModal(false);
      setEditingDiscipline(null);
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  // Fonction pour supprimer une discipline
  const handleDeleteDiscipline = async (id: number) => {
    try {
      await deleteDiscipline(id);
      setNotification({
        message: 'Discipline supprimée avec succès !',
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Erreur lors de la suppression de la discipline',
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
      <DisciplinesHeader 
        onBack={onBack}
        onCreateClick={() => handleOpenModal()}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />

        {/* Disciplines Table */}
        <DisciplinesTable
          disciplines={disciplines}
          loading={loading}
          searchTerm={searchTerm}
          onRefresh={handleRefresh}
          onDelete={handleDeleteDiscipline}
          onEdit={(discipline) => handleOpenModal(discipline)}
          error={error}
        />
      </main>
      
      <DisciplineModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingDiscipline(null);
          setCreateError(null);
        }}
        onSave={handleSaveDiscipline}
        loading={createLoading}
        error={createError}
        discipline={editingDiscipline || undefined}
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
