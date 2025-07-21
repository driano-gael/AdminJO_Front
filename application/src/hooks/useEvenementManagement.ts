import { useState, useEffect } from 'react';
import { evenementApi } from '@/lib/api/services/evenementSports/evenementService';
import { lieuApi } from '@/lib/api/services/evenementSports/lieuService';
import { epreuveApi } from '@/lib/api/services/evenementSports/epreuveService';
import { Lieu } from '@/types/sportEvenement/lieu';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { CreateEvenementRequest, UpdateEvenementRequest } from '@/lib/api/services/evenementSports/evenementService';
import { ExtendEvenement } from '@/types/sportEvenement/evenement';
import { getEventStatus } from '@/utils/evenement/statutEvenement';

export function useEventsManagement() {
  const [events, setEvents] = useState<ExtendEvenement[]>([]);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // États pour les filtres
  const [filterLieu, setFilterLieu] = useState<number | undefined>(undefined);
  const [filterDiscipline, setFilterDiscipline] = useState<number | undefined>(undefined);
  const [filterEpreuve, setFilterEpreuve] = useState<number | undefined>(undefined);
  const [filterStatut, setFilterStatut] = useState<string | undefined>(undefined);
  const [filterDateDebut, setFilterDateDebut] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterDateFin, setFilterDateFin] = useState<string>('');

  /**
   * Fonction pour filtrer les événements selon tous les critères
   */
  const getFilteredEvents = () => {
    let filteredEvents = events;

    // Filtrage par terme de recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.description.toLowerCase().includes(searchLower) ||
        event.lieu.nom.toLowerCase().includes(searchLower) ||
        (event.sports && event.sports.toLowerCase().includes(searchLower))
      );
    }

    // Filtrage par lieu
    if (filterLieu) {
      filteredEvents = filteredEvents.filter(event => event.lieu.id === filterLieu);
    }

    // Filtrage par discipline
    if (filterDiscipline) {
      filteredEvents = filteredEvents.filter(event => 
        event.epreuves.some(epreuve => epreuve.discipline?.id === filterDiscipline)
      );
    }

    // Filtrage par épreuve
    if (filterEpreuve) {
      filteredEvents = filteredEvents.filter(event => 
        event.epreuves.some(epreuve => epreuve.id === filterEpreuve)
      );
    }

    // Filtrage par statut
    if (filterStatut) {
      filteredEvents = filteredEvents.filter(event => event.status === filterStatut);
    }

    // Filtrage par date de début
    if (filterDateDebut) {
      filteredEvents = filteredEvents.filter(event => event.date >= filterDateDebut);
    }

    // Filtrage par date de fin
    if (filterDateFin) {
      filteredEvents = filteredEvents.filter(event => event.date <= filterDateFin);
    }

    return filteredEvents;
  };


  /**
   * Fonction pour charger les événements depuis l'API avec recherche
   */
  const loadEvents = async (searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiEvents = await evenementApi.getAll(searchQuery ? {
        description: searchQuery
      } : undefined);
      
      const eventsWithExtras: ExtendEvenement[] = apiEvents.map(event => ({
        ...event,
        sports: event.epreuves.map(epreuve => epreuve.libelle).join(', ') || 'Non spécifié',
        status: getEventStatus(event.date, event.horraire),
        // Ajout de données fictives pour la capacité et les tickets vendus
        capacity: Math.floor(Math.random() * 50000) + 10000,
        ticketsSold: Math.floor(Math.random() * 40000) + 5000
      }));
      
      setEvents(eventsWithExtras);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction pour charger les lieux depuis l'API
   */
  const loadLieux = async () => {
    try {
      const apiLieux = await lieuApi.getAll();
      const sortedLieux = apiLieux.sort((a, b) => a.nom.localeCompare(b.nom));
      setLieux(sortedLieux);
      console.log('Lieux chargés depuis l\'API:', sortedLieux);
    } catch (err) {
      console.error('Erreur chargement lieux:', err);
    }
  };

  const loadEpreuves = async () => {
    try {
      const apiEpreuves = await epreuveApi.getAll();
      setEpreuves(apiEpreuves);
      console.log('Épreuves chargées depuis l\'API:', apiEpreuves);
    } catch (err) {
      console.error('Erreur chargement épreuves:', err);
    }
  };

  /**
   * Fonction pour créer un nouvel événement
   */
  const createEvent = async (eventData: CreateEvenementRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      
      const newEvent = await evenementApi.create(eventData);
      
      const newEventWithExtras: ExtendEvenement = {
        ...newEvent,
        sports: newEvent.description.toLowerCase().includes('athlétisme') ? 'Athlétisme' :
               newEvent.description.toLowerCase().includes('natation') ? 'Natation' :
               newEvent.description.toLowerCase().includes('basketball') ? 'Basketball' : 'Autre',
        status: getEventStatus(newEvent.date, newEvent.horraire),
        capacity: Math.floor(Math.random() * 50000) + 10000,
        ticketsSold: Math.floor(Math.random() * 40000) + 5000
      };
      
      setEvents(prev => [...prev, newEventWithExtras]);
      console.log('Événement créé avec succès:', newEvent);
      return newEvent;
    } catch (err) {
      setCreateError('Erreur lors de la création de l\'événement');
      console.error('Erreur création événement:', err);
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };

  /**
   * Fonction pour mettre à jour un événement
   */
  const updateEvent = async (eventData: UpdateEvenementRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      
      const updatedEvent = await evenementApi.update(eventData);
      
      const updatedEventWithExtras: ExtendEvenement = {
        ...updatedEvent,
        sports: updatedEvent.description.toLowerCase().includes('athlétisme') ? 'Athlétisme' :
               updatedEvent.description.toLowerCase().includes('natation') ? 'Natation' :
               updatedEvent.description.toLowerCase().includes('basketball') ? 'Basketball' : 'Autre',
        status: getEventStatus(updatedEvent.date, updatedEvent.horraire),
        capacity: Math.floor(Math.random() * 50000) + 10000,
        ticketsSold: Math.floor(Math.random() * 40000) + 5000
      };
      
      setEvents(prev => prev.map(event => 
        event.id === eventData.id ? updatedEventWithExtras : event
      ));
      console.log('Événement mis à jour avec succès:', updatedEvent);
      return updatedEvent;
    } catch (err) {
      setCreateError('Erreur lors de la mise à jour de l\'événement');
      console.error('Erreur mise à jour événement:', err);
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };

  /**
   * Fonction pour supprimer un événement
   */
  const deleteEvent = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    
    try {
      await evenementApi.delete(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      console.log('Événement supprimé avec succès:', id);
    } catch (err) {
      console.error('Erreur suppression événement:', err);
      throw err;
    }
  };

  /**
   * Fonction pour effectuer une recherche
   */
  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    // Note: On ne recharge plus les événements depuis l'API car le filtrage se fait côté client
  };

  /**
   * Fonctions pour mettre à jour les filtres
   */
  const setLieuFilter = (lieuId: number | undefined) => {
    setFilterLieu(lieuId);
  };

  const setDisciplineFilter = (disciplineId: number | undefined) => {
    setFilterDiscipline(disciplineId);
  };

  const setEpreuveFilter = (epreuveId: number | undefined) => {
    setFilterEpreuve(epreuveId);
  };

  const setStatutFilter = (statut: string | undefined) => {
    setFilterStatut(statut);
  };

  const setDateDebutFilter = (date: string) => {
    setFilterDateDebut(date);
  };

  const setDateFinFilter = (date: string) => {
    setFilterDateFin(date);
  };

  // Charger les données au montage
  useEffect(() => {
    loadEvents();
    loadLieux();
    loadEpreuves();
  }, []);

  return {
    events: getFilteredEvents(), // Utiliser les événements filtrés
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
  };
}
