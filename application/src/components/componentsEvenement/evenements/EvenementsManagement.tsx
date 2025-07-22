'use client';

import { useState } from 'react';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { ExtendEvenement } from '@/types/sportEvenement/evenement';
import Notification from '@/components/notification';
import EvenementsHeader from './EvenementsHeader';
import SearchAndFilters from './EvenementsSearchAndFilters';
import EvenementsTable from './EvenementsTable';
import EvenementModal from './EvenementModal';
import { useEventsManagement } from '../../../hooks/useEvenementManagement';

/**
 * Props pour le composant EvenementsManagement
 */
interface Props {
  // Plus de prop onBack nécessaire, gérée par BackToEventsButton
}

/**
 * Composant EvenementsManagement - Gestion complète des événements sportifs
 * 
 * Fonctionnalités similaires au LieuxManagement :
 * - Affichage de la liste des événements avec recherche
 * - Création de nouveaux événements
 * - Modification d'événements existants  
 * - Suppression d'événements avec confirmation
 * - Gestion des erreurs et notifications
 * - Interface responsive avec design moderne
 */
export default function EvenementsManagement({}: Props) {
  useSessionExpiry();

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
    updateEvent,
    deleteEvent,
    handleSearch,
    setCreateError,
    // Fonctions de filtrage
    setLieuFilter,
    setDisciplineFilter,
    setEpreuveFilter,
    setStatutFilter,
    setDateDebutFilter,
    setDateFinFilter,
    // États de filtrage
    filterLieu,
    filterDiscipline,
    filterEpreuve,
    filterStatut,
    filterDateDebut,
    filterDateFin
  } = useEventsManagement();

  // États pour l'UI
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ExtendEvenement | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleOpenModal = (event?: ExtendEvenement) => {
    setEditingEvent(event || null);
    setShowModal(true);
  };

  // Fonctions de gestion des filtres
  const handleLieuChange = (lieuId: number | undefined) => {
    setLieuFilter(lieuId);
  };

  const handleDisciplineChange = (disciplineId: number | undefined) => {
    setDisciplineFilter(disciplineId);
  };

  const handleEpreuveChange = (epreuveId: number | undefined) => {
    setEpreuveFilter(epreuveId);
  };

  const handleStatutChange = (statut: string | undefined) => {
    setStatutFilter(statut);
  };

  const handleDateDebutChange = (date: string | undefined) => {
    setDateDebutFilter(date || '');
  };

  const handleDateFinChange = (date: string | undefined) => {
    setDateFinFilter(date || '');
  };

  // Obtenir les disciplines uniques depuis les épreuves
  const disciplines = Array.from(
    new Map(epreuves.map(e => e.discipline).filter(Boolean).map(d => [d!.id, d!])).values()
  ).sort((a, b) => a.nom.localeCompare(b.nom));

  const handleSaveEvent = async (eventData: any) => {
    try {
      if (editingEvent) {
        await updateEvent({
          id: editingEvent.id,
          ...eventData
        });
        setNotification({
          message: 'Événement modifié avec succès !',
          type: 'success'
        });
      } else {
        await createEvent(eventData);
        setNotification({
          message: 'Événement créé avec succès !',
          type: 'success'
        });
      }
      setShowModal(false);
      setEditingEvent(null);
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
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

  // Fonction pour actualiser les données en gardant le terme de recherche actuel
  const handleRefresh = () => {
    if (searchTerm.trim()) {
      loadEvents(searchTerm);
    } else {
      loadEvents();
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <EvenementsHeader 
        onCreateEvent={() => handleOpenModal()} 
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <SearchAndFilters 
          searchTerm={searchTerm} 
          onSearch={handleSearch}
          events={events}
          epreuves={epreuves}
          lieux={lieux}
          disciplines={disciplines}
          loading={loading}
          selectedLieu={filterLieu}
          selectedDiscipline={filterDiscipline}
          selectedEpreuve={filterEpreuve}
          selectedStatut={filterStatut}
          dateDebut={filterDateDebut}
          dateFin={filterDateFin}
          onLieuChange={handleLieuChange}
          onDisciplineChange={handleDisciplineChange}
          onEpreuveChange={handleEpreuveChange}
          onStatutChange={handleStatutChange}
          onDateDebutChange={handleDateDebutChange}
          onDateFinChange={handleDateFinChange}
        />

        {/* Événements Table */}
        <EvenementsTable
          events={events}
          loading={loading}
          searchTerm={searchTerm}
          onDeleteEvent={handleDeleteEvent}
          onRefresh={handleRefresh}
          onEdit={(event) => handleOpenModal(event)}
          error={error}
        />
      </main>
      
      {/* Modal */}
      <EvenementModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEvent(null);
          setCreateError(null);
        }}
        onSave={handleSaveEvent}
        loading={createLoading}
        error={createError}
        evenement={editingEvent || undefined}
      />

      {/* Notification */}
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
