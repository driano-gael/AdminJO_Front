'use client';

import { useState } from 'react';
import Notification from '@/components/notification';
import EventsHeader from './EvenementsHeader';
import SearchAndFilters from './EvenementsSearchAndFilters';
import EventsTable from './EvenementsTable';
import EvenementModal from './CreateEvenementModal';
import { useEventsManagement } from '../../../hooks/useEvenementManagement';

/**
 * Props pour le composant EventsManagement
 */
interface Props {
  onBack: () => void; // Fonction pour revenir au dashboard de gestion
}

/**
 * Composant EventsManagement - Gestion complète des événements sportifs
 * 
 * Fonctionnalités :
 * - Affichage de la liste des événements avec recherche
 * - Création de nouveaux événements avec formulaire
 * - Suppression d'événements avec confirmation
 * - Recherche côté serveur
 * - Affichage des statistiques et du statut des événements
 * - Gestion des erreurs et notifications
 * - Interface responsive avec design moderne
 */
export default function EventsManagement({ onBack }: Props) {
  const {
    events,
    lieux,
    epreuves,
    searchTerm,
    loading,
    error,
    createLoading,
    createError,
    loadEvents,
    createEvent,
    deleteEvent,
    handleSearch,
    setCreateError
  } = useEventsManagement();

  // États pour l'UI
  const [showEvenementForm, setShowEvenementForm] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleCreateEvent = async (eventData: any) => {
    try {
      await createEvent(eventData);
      setShowEvenementForm(false);
      setNotification({
        message: "Événement créé avec succès !",
        type: "success"
      });
    } catch (err) {
      setNotification({
        message: "Erreur lors de la création de l'évenement!",
        type: 'error'
      });
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      setNotification({
        message: 'Événement supprimé avec succès !',
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Erreur lors de la suppression de l\'événement',
        type: 'error'
      });
    }
  };

  const handleCloseModal = () => {
    setShowEvenementForm(false);
    setCreateError(null);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <EventsHeader 
        onBack={onBack} 
        onCreateEvent={() => setShowEvenementForm(true)} 
      />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <SearchAndFilters 
          searchTerm={searchTerm} 
          onSearch={handleSearch}
          epreuves={epreuves}
          loading={loading}
        />

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <EventsTable
          events={events}
          loading={loading}
          searchTerm={searchTerm}
          onDeleteEvent={handleDeleteEvent}
          onRefresh={() => loadEvents()}
        />
      </main>

      {showEvenementForm && (
        <EvenementModal 
          onClose={handleCloseModal}
          onCreate={handleCreateEvent}
          loading={createLoading}
          error={createError}
        />
      )}

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
