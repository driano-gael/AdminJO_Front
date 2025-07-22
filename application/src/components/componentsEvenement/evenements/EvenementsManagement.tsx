'use client';

import { useState } from 'react';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { ExtendEvenement } from '@/types/sportEvenement/evenement';
import { CreateEvenementRequest } from '@/lib/api/services/evenementSports/evenementService';
import Notification from '@/components/notification';
import EvenementsHeader from './EvenementsHeader';
import SearchAndFilters from './EvenementsSearchAndFilters';
import EvenementsTable from './EvenementsTable';
import EvenementModal from './EvenementModal';
import { useEventsManagement } from '../../../hooks/useEvenementManagement';

/**
 * Composant EvenementsManagement - Gestion complète des événements sportifs
 * 
 * Fonctionnalités :
 * - Affichage de la liste des événements avec recherche
 * - Création de nouveaux événements
 * - Modification d'événements existants  
 * - Suppression d'événements avec confirmation
 * - Gestion des erreurs et notifications
 * - Interface responsive avec design moderne
 */
export default function EvenementsManagement() {
  useSessionExpiry();

  const {
    events,
    lieux,
    epreuves,
    searchTerm,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    loadEvents,
    handleSearch,
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

  // Disciplines uniques extraites des épreuves
  const disciplines = Array.from(
    new Map(epreuves.map(e => e.discipline).filter(Boolean).map(d => [d!.id, d!])).values()
  ).sort((a, b) => a.nom.localeCompare(b.nom));

  const handleSaveEvent = async (eventData: CreateEvenementRequest) => {
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
    } catch {
      setNotification({
        message: 'Erreur lors de la sauvegarde',
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
    } catch {
      setNotification({
        message: 'Erreur lors de la suppression',
        type: 'error'
      });
    }
  };

  // Fonction de rafraîchissement
  const handleRefresh = () => {
    if (searchTerm.trim()) {
      loadEvents(searchTerm);
    } else {
      loadEvents();
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <EvenementsHeader onCreateEvent={() => handleOpenModal()} />
        
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearch={handleSearch}
          lieux={lieux}
          disciplines={disciplines}
          epreuves={epreuves}
          events={events}
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

        <EvenementsTable
          events={events}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          onEdit={handleOpenModal}
          onDeleteEvent={handleDeleteEvent}
          onRefresh={handleRefresh}
        />

        {showModal && (
          <EvenementModal
            isOpen={showModal}
            evenement={editingEvent || undefined}
            loading={loading}
            error={error}
            onSave={handleSaveEvent}
            onClose={() => {
              setShowModal(false);
              setEditingEvent(null);
            }}
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
    </div>
  );
}
