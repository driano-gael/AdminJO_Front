'use client';

import { useState } from 'react';
import { useLieuxManagement } from '@/hooks/useLieuxManagement';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Lieu } from '@/types/sportEvenement/lieu';
import Notification from '@/components/notification';
import LieuxHeader from './LieuxHeader';
import SearchAndFilters from './SearchAndFilters';
import LieuxTable from './LieuxTable';
import LieuModal from './LieuModal';

interface Props {
  onBack: () => void;
}
export default function LieuxManagement({ onBack }: Props) {
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
