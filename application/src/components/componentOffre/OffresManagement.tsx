'use client';

import { useState } from 'react';
import { useOffresManagement } from '@/hooks/useOffreManagement';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Offre } from '@/types/offre/offre';
import Notification from '@/components/notification';
import OffresHeader from "@/components/componentOffre/OffresHeader";
import OffreModal from "@/components/componentOffre/OffresModal";
import OffresTable from "@/components/componentOffre/OffresTable";

export default function OffresManagement() {
  useSessionExpiry();

  const {
    offres,
    loading,
    error,
    formLoading,
    formNotification,
    createOffre,
    updateOffre,
    deleteOffre,
    setFormNotification,
  } = useOffresManagement();

  const [showModal, setShowModal] = useState(false);
  const [editingOffre, setEditingOffre] = useState<Offre | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleOpenModal = (offre?: Offre) => {
    setEditingOffre(offre || null);
    setShowModal(true);
  };

  const handleSaveOffre = async (offreData: Offre) => {
    try {
      if (editingOffre) {
        await updateOffre(editingOffre.id, offreData);
      } else {
        await createOffre(offreData);
      }
      setShowModal(false);
      setEditingOffre(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOffre = async (id: number) => {
    try {
      await deleteOffre(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOffre(null);

    // Afficher la notification si elle existe
    if (formNotification) {
      setNotification({
        message: formNotification.message,
        type: formNotification.type
      });
      setFormNotification(null);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <OffresHeader
        onCreateClick={() => handleOpenModal()}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Offres Table */}
        <OffresTable
          offres={offres}
          loading={loading}
          onDelete={handleDeleteOffre}
          onEdit={(offre: Offre) => handleOpenModal(offre)}
          error={error}
        />
      </main>

      <OffreModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveOffre}
        loading={formLoading}
        offre={editingOffre || undefined}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          duration={3000}
        />
      )}
    </div>
  );
}
