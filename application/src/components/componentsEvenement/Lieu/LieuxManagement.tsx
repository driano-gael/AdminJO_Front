'use client';

import { useState } from 'react';
import { useLieuxManagement } from '@/hooks/useLieuxManagement';
import { useAuth } from '@/contexts/authContext';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Lieu } from '@/types/sportEvenement/lieu';
import Notification from '@/components/notification';
import LieuxHeader from './lieux/LieuxHeader';
import SearchAndFilters from './lieux/SearchAndFilters';
import LieuxTable from './lieux/LieuxTable';
import LieuModal from './lieux/LieuModal';

interface Props {
  onBack: () => void;
}
export default function LieuxManagement({ onBack }: Props) {
      const { isAuthenticated } = useAuth();
      useSessionExpiry();

      const {
        lieux,
        searchTerm,
        loading,
        error,
        createLoading,
        createError,
        loadLieux,
        createLieu,
        updateLieu,
        deleteLieu,
        handleSearch,
        setCreateError
      } = useLieuxManagement();

      const [showModal, setShowModal] = useState(false);
      const [editingLieu, setEditingLieu] = useState<Lieu | null>(null);
      const [notification, setNotification] = useState<{
          message: string;
          type: 'success' | 'error' | 'info';
      } | null>(null);

      const handleOpenModal = (lieu?: Lieu) => {
        setEditingLieu(lieu || null);
        setShowModal(true);
      };
    const handleSaveLieu = async (lieuData: any) => {
      try {
        if (editingLieu) {
          await updateLieu(editingLieu.id, lieuData);
          setNotification({
            message: 'Lieu modifié avec succès !',
            type: 'success'
          });
        } else {
          // Mode création
          await createLieu(lieuData);
          setNotification({
            message: 'Lieu créé avec succès !',
            type: 'success'
          });
        }
        setShowModal(false);
        setEditingLieu(null);
      } catch (err) {
        // L'erreur est déjà gérée dans le hook
      }
    };

    // Fonction pour supprimer un lieu
    const handleDeleteLieu = async (id: number) => {
      try {
        await deleteLieu(id);
        setNotification({
          message: 'Lieu supprimé avec succès !',
          type: 'success'
        });
      } catch (err) {
        setNotification({
          message: 'Erreur lors de la suppression du lieu',
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
        <LieuxHeader 
          onBack={onBack}
          onCreateClick={()=>handleOpenModal()}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearch={handleSearch}
          />

          {/* Lieux Table */}
          <LieuxTable
            lieux={lieux}
            loading={loading}
            searchTerm={searchTerm}
            onRefresh={loadLieux}
            onDelete={handleDeleteLieu}
            onEdit={(lieux)=>handleOpenModal(lieux)}
            error={error}
          />
        </main>
        <LieuModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingLieu(null);
            setCreateError(null);
          }}
          onSave={handleSaveLieu}
          loading={createLoading}
          error={createError}
          lieu={editingLieu || undefined}
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
