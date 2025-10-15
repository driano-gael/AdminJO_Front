'use client';

import React, {JSX, useState} from 'react';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { ExtendEvenement } from '@/types/sportEvenement/evenement';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Discipline } from '@/types/sportEvenement/discipline';
import { CreateEvenementRequest } from '@/lib/api/services/evenementSports/evenementService';
import Notification from '@/components/notification';
import EvenementsHeader from './EvenementsHeader';
import SearchAndFilters from './EvenementsSearchAndFilters';
import EvenementsTable from './EvenementsTable';
import EvenementModal from './EvenementModal';
import { useEvenementManagement } from '@/hooks/useEvenementManagement';

/**
 * Composant EvenementsManagement - Gestionnaire principal des événements sportifs olympiques AdminJO
 *
 * @name EvenementsManagement
 * Ce composant constitue le point central de gestion des événements sportifs des Jeux Olympiques 2024.
 * Il orchestre l'ensemble des fonctionnalités CRUD (Create, Read, Update, Delete) avec système de filtrage
 * avancé en cascade, recherche multicritères, interface utilisateur complète incluant tableau de données,
 * modal de saisie avec sélection d'épreuves hiérarchique, notifications de feedback et gestion d'état
 * centralisée. Il assure la coordination entre tous les sous-composants du module événements avec
 * navigation contextuelle, filtrage temporel JO 2024, et fonctionnalités de filtrage relationnel sophistiqué.
 *
 * ## Architecture et responsabilités avancées événements olympiques
 *
 * ### Composant orchestrateur central avec filtrage multicritères avancé
 * - **Coordination générale** : Gère tous les sous-composants événements complexes
 * - **État centralisé** : Point unique de vérité pour données événements + relations multiples
 * - **Flux d'événements** : Centralise callbacks et actions utilisateur sophistiquées
 * - **Session management** : Surveillance expiration session utilisateur
 * - **Layout complet** : Structure complète page gestion événements
 * - **Filtrage cascade** : Système recherche + filtres lieu → discipline → épreuve → statut
 * - **Relations multiples** : Gestion liens événements ↔ épreuves ↔ lieux ↔ disciplines
 * - **Dates JO** : Filtrage temporel période olympique Paris 2024
 *
 * ### Gestion des données et hooks spécialisés événements
 * - **useEventsManagement** : Hook métier pour opérations CRUD événements + filtres avancés
 * - **useSessionExpiry** : Protection contre expiration session
 * - **État local UI** : Gestion modal, édition, notifications
 * - **Synchronisation** : Coordination état local/distant avec filtres multiples
 * - **Error handling** : Gestion centralisée erreurs création/modification
 * - **Filter state** : 6 critères filtrage (lieu, discipline, épreuve, statut, dates)
 * - **Données relationnelles** : Événements + lieux + épreuves + disciplines chargées
 *
 * ## Fonctionnalités CRUD complètes avec relations multiples
 *
 * ### Création d'événements avec épreuves multiples (Create)
 * - **Déclenchement** : Bouton "Nouvel Événement" dans EvenementsHeader
 * - **Interface** : EvenementModal en mode création (editingEvent = null)
 * - **Validation** : Description + lieu + date + horaire + épreuves optionnelles
 * - **Sélection épreuves** : Interface hiérarchique par discipline avec disponibilité
 * - **Sauvegarde** : Appel createEvent() du hook avec CreateEvenementRequest étendu
 * - **Feedback** : Notification succès "Événement créé avec succès !"
 * - **Rafraîchissement** : Liste mise à jour avec filtres préservés
 * - **Relations** : Association événement ↔ épreuves multiples via modal
 *
 * ### Lecture et affichage avec filtrage multicritères
 * - **Source données** : Hook useEventsManagement fournit événements + relations
 * - **Affichage** : EvenementsTable avec colonnes spécialisées (description, épreuves, date, lieu, statut, actions)
 * - **États système** : Loading, error, empty gérés dans table
 * - **Recherche textuelle** : SearchAndFilters avec terme persistant
 * - **Filtres cascade** : Lieu → Discipline → Épreuve → Statut avec réinitialisation automatique
 * - **Filtres temporels** : Date début/fin pour période JO 2024 (juillet-septembre)
 * - **Refresh intelligent** : handleRefresh préserve recherche ET tous filtres
 * - **Sous-composants** : EvenementEpreuves et EventStatus intégrés dans lignes
 *
 * ### Modification d'événements avec épreuves (Update)
 * - **Déclenchement** : Bouton "Modifier" dans EvenementsTableRow
 * - **Interface** : EvenementModal pré-remplie avec données existantes + épreuves
 * - **Mode édition** : editingEvent contient événement ExtendEvenement complet
 * - **Épreuves assignées** : Gestion disponibilité + épreuves déjà assignées
 * - **Sauvegarde** : Appel updateEvent() avec ID et nouvelles données
 * - **Feedback** : Notification succès "Événement modifié avec succès !"
 * - **Préservation** : Recherche et filtres maintenus après modification
 * - **Relations** : Modification associations événement ↔ épreuves possible
 *
 * ### Suppression d'événements (Delete)
 * - **Déclenchement** : Bouton "Supprimer" dans EvenementsTableRow
 * - **Sécurité** : Confirmation implicite (gérée par composant table)
 * - **Suppression** : Appel deleteEvent() avec ID événement
 * - **Feedback** : Notification succès "Événement supprimé avec succès !"
 * - **Gestion erreur** : Notification erreur si échec suppression
 * - **État préservé** : Recherche et filtres maintenus après suppression
 * - **Libération épreuves** : Épreuves redeviennent disponibles pour autres événements
 *
 * ## Système de filtrage en cascade sophistiqué
 *
 * ### Filtres multicritères avec logique cascade
 * - **Recherche textuelle** : searchTerm via handleSearch()
 * - **Filtre lieu** : filterLieu avec setFilterLieu() (racine cascade)
 * - **Filtre discipline** : filterDiscipline dépendant lieu sélectionné
 * - **Filtre épreuve** : filterEpreuve dépendant lieu ET discipline
 * - **Filtre statut** : filterStatut dépendant tous filtres précédents
 * - **Dates JO** : filterDateDebut/filterDateFin pour période olympique
 * - **Réinitialisation automatique** : Filtres enfants reset si parent change
 *
 * ### Handlers de filtres coordonnés
 * - **handleLieuChange** : setFilterLieu() avec reset cascade automatique
 * - **handleDisciplineChange** : setFilterDiscipline() avec reset épreuve/statut
 * - **handleEpreuveChange** : setFilterEpreuve() avec reset statut
 * - **handleStatutChange** : setFilterStatut() (feuille cascade)
 * - **handleDateDebutChange/Fin** : Gestion période temporelle JO
 * - **Synchronisation** : Tous handlers coordonnés avec état hook
 *
 * ### Calcul disciplines depuis épreuves
 * - **Extraction unique** : Array.from(new Map()) pour disciplines uniques
 * - **Tri alphabétique** : sort((a, b) => a.nom.localeCompare(b.nom))
 * - **Relations dynamiques** : Disciplines dérivées des épreuves disponibles
 * - **Performance** : Calcul une fois, réutilisation dans composants
 * - **Cohérence** : Disciplines toujours synchronisées avec épreuves
 *
 * ## Gestion avancée des états d'interface
 *
 * ### États modaux avec gestion d'erreurs
 * - **showModal** : Contrôle visibilité EvenementModal
 * - **editingEvent** : Événement en cours d'édition ou null pour création
 * - **Ouverture** : handleOpenModal() avec événement optionnel
 * - **Fermeture** : Fermeture avec nettoyage état (setEditingEvent(null))
 * - **Mode dynamique** : Modal s'adapte selon editingEvent
 * - **Données complexes** : Transmission lieux, épreuves, événement complet
 *
 * ### Système de notifications contextuelles événements
 * - **notification state** : Objet {message, type} ou null
 * - **Types supportés** : 'success', 'error', 'info'
 * - **Messages contextuels** : Textes spécialisés par action événements
 * - **Auto-dismiss** : Fermeture manuelle par utilisateur
 * - **Feedback** : Confirmation visuelle de toutes les opérations CRUD
 *
 * ### États de chargement spécialisés événements
 * - **loading** : État chargement liste événements (lecture)
 * - **createLoading** : État chargement opérations CUD via hook
 * - **error** : Messages d'erreur de chargement données
 * - **Modal states** : Loading et error transmis à EvenementModal
 * - **Granularité** : États séparés pour différentes opérations
 * - **Feedback** : Désactivation contrôles pendant opérations async
 *
 * ## Filtrage temporel JO 2024 spécialisé
 *
 * ### Gestion période olympique Paris 2024
 * - **Dates par défaut** : Juillet-septembre 2024 pour JO + Paralympiques
 * - **Filtre début** : filterDateDebut avec handleDateDebutChange
 * - **Filtre fin** : filterDateFin avec handleDateFinChange
 * - **Format ISO** : Dates au format YYYY-MM-DD pour API
 * - **Validation** : Cohérence dates début < fin
 * - **Réinitialisation** : Retour aux dates JO par défaut
 *
 * ## Flux d'interactions utilisateur avancés événements
 *
 * ### Parcours création événement avec épreuves
 * 1. **Clic "Nouvel Événement"** → handleOpenModal() sans paramètre
 * 2. **Modal s'ouvre** → EvenementModal mode création (editingEvent = null)
 * 3. **Saisie données** → Description + lieu + date + horaire + épreuves multiples
 * 4. **Sélection épreuves** → Interface hiérarchique par discipline
 * 5. **Soumission** → handleSaveEvent() avec CreateEvenementRequest étendu
 * 6. **Création API** → createEvent() via hook spécialisé
 * 7. **Succès** → Modal ferme, notification succès, liste rafraîchie avec filtres
 * 8. **Erreur** → Erreur affichée, modal reste ouverte pour correction
 *
 * ### Parcours modification événement
 * 1. **Clic "Modifier"** → handleOpenModal(event) avec objet ExtendEvenement
 * 2. **Modal s'ouvre** → EvenementModal pré-remplie (editingEvent = event)
 * 3. **Modification données** → Tous champs modifiables + épreuves réassignables
 * 4. **Soumission** → handleSaveEvent() avec données modifiées
 * 5. **Update API** → updateEvent() avec ID et nouvelles données
 * 6. **Succès** → Modal ferme, notification succès, liste mise à jour
 * 7. **Erreur** → Gestion via hook, feedback utilisateur approprié
 *
 * ### Parcours suppression événement
 * 1. **Clic "Supprimer"** → handleDeleteEvent(id) avec identifiant
 * 2. **Suppression directe** → deleteEvent() via hook (confirmation dans table)
 * 3. **Succès** → Notification succès, liste automatiquement mise à jour
 * 4. **Erreur** → try/catch avec notification erreur générique
 * 5. **Filtres préservés** : Recherche et tous filtres maintenues après suppression
 * 6. **Épreuves libérées** : Épreuves assignées redeviennent disponibles
 *
 * ### Parcours filtrage cascade événement
 * 1. **Sélection lieu** → handleLieuChange() capture lieu olympique
 * 2. **Cascade disciplines** → Disciplines disponibles recalculées selon lieu
 * 3. **Sélection discipline** → handleDisciplineChange() avec reset épreuves/statut
 * 4. **Cascade épreuves** → Épreuves filtrées selon lieu ET discipline
 * 5. **Sélection épreuve** → handleEpreuveChange() avec reset statut
 * 6. **Filtre statut** → handleStatutChange() final cascade
 * 7. **Dates période** → handleDateDebutChange/Fin pour temporel JO
 * 8. **Mise à jour liste** → Événements filtrés selon critères multiples coordonnés
 *
 * @returns {JSX.Element} Interface complète de gestion des événements avec CRUD, filtrage avancé cascade et notifications
 *
 * @see {@link EvenementsHeader} - En-tête avec navigation et bouton création
 * @see {@link SearchAndFilters} - Composant de filtrage multicritères en cascade
 * @see {@link EvenementsTable} - Tableau d'affichage et actions des événements
 * @see {@link EvenementModal} - Modal de création/édition des événements avec épreuves
 * @see {@link useEventsManagement} - Hook métier pour opérations CRUD + filtres avancés
 * @see {@link useSessionExpiry} - Hook de surveillance de session
 * @see {@link Notification} - Composant de feedback utilisateur
 *
 */
export function EvenementsManagement(): JSX.Element {
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
    createEvent,
    updateEvent,
    deleteEvent,
    loadEvents,
    setSearchTerm,
    handleSearch,
    // Fonctions de filtrage - utilisation des bons noms exportés par le hook
    setFilterLieu,
    setFilterDiscipline,
    setFilterEpreuve,
    setFilterStatut,
    setFilterDateDebut,
    setFilterDateFin,
    // États de filtrage
    filterLieu,
    filterDiscipline,
    filterEpreuve,
    filterStatut,
    filterDateDebut,
    filterDateFin,
    // Fonction pour obtenir les événements filtrés
    getFilteredEvents
  } = useEvenementManagement();

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
    setFilterLieu(lieuId);
  };

  const handleDisciplineChange = (disciplineId: number | undefined) => {
    setFilterDiscipline(disciplineId);
  };

  const handleEpreuveChange = (epreuveId: number | undefined) => {
    setFilterEpreuve(epreuveId);
  };

  const handleStatutChange = (statut: string | undefined) => {
    setFilterStatut(statut);
  };

  const handleDateDebutChange = (date: string | undefined) => {
    setFilterDateDebut(date || '');
  };

  const handleDateFinChange = (date: string | undefined) => {
    setFilterDateFin(date || '');
  };

  // Disciplines uniques extraites des épreuves
  const disciplines: Discipline[] = Array.from(
    new Map(
      epreuves
        .map(e => e.discipline)
        .filter((d): d is Discipline => d !== undefined)
        .map(d => [d.id, d])
    ).values()
  ).sort((a, b) => a.nom.localeCompare(b.nom));

  const handleSaveEvent = async (eventData: CreateEvenementRequest) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
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

  // Obtenir les événements filtrés
  const filteredEvents = getFilteredEvents();

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
          events={filteredEvents}
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
          events={filteredEvents}
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
            loading={createLoading}
            error={createError}
            onSave={handleSaveEvent}
            onClose={() => {
              setShowModal(false);
              setEditingEvent(null);
            }}
          />
        )}

        {notification && (
          <Notification
            title="Gestion Événements"
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
}
export default EvenementsManagement;
