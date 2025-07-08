import { useState, useEffect } from 'react';
import { evenementApi, lieuApi, epreuveApi } from '@/lib/api/eventServices';
import { Lieu } from '@/types/sportEvenement/lieu';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { CreateEvenementRequest } from '@/lib/api/eventServices/evenementService';
import { SportEvent } from './types';

export function useEventsManagement() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  /**
   * Détermine le statut d'un événement basé sur la date et l'heure
   */
  const getEventStatus = (eventDate: string, eventTime: string): SportEvent['status'] => {
    const now = new Date();
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    
    // Créer une date pour la fin de l'événement (supposons 2 heures de durée)
    const eventEndDateTime = new Date(eventDateTime.getTime() + (2 * 60 * 60 * 1000));
    
    if (now < eventDateTime) {
      return 'à venir'; // L'événement n'a pas encore commencé
    } else if (now >= eventDateTime && now <= eventEndDateTime) {
      return 'en cours'; // L'événement est en cours
    } else {
      return 'terminé'; // L'événement est terminé
    }
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
      
      const eventsWithExtras: SportEvent[] = apiEvents.map(event => ({
        ...event,
        sports: event.epreuves.map(epreuve => epreuve.libelle).join(', ') || 'Non spécifié',
        status: getEventStatus(event.date, event.horraire),
        capacity: Math.floor(Math.random() * 50000) + 10000,
        ticketsSold: Math.floor(Math.random() * 40000) + 5000
      }));
      
      setEvents(eventsWithExtras);
      console.log('Événements chargés depuis l\'API:', eventsWithExtras);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error('Erreur chargement événements:', err);
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
      setLieux(apiLieux);
      console.log('Lieux chargés depuis l\'API:', apiLieux);
    } catch (err) {
      console.error('Erreur chargement lieux:', err);
    }
  };

  /**
   * Fonction pour charger les épreuves depuis l'API
   */
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
      
      const newEventWithExtras: SportEvent = {
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
    if (query.trim()) {
      await loadEvents(query);
    } else {
      await loadEvents();
    }
  };

  // Filtrer les événements affichés
  const filteredEvents = events.filter(event => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      event.description.toLowerCase().includes(searchLower) ||
      (event.sports && event.sports.toLowerCase().includes(searchLower)) ||
      event.lieu.nom.toLowerCase().includes(searchLower)
    );
  });

  // Charger les données au montage
  useEffect(() => {
    loadEvents();
    loadLieux();
    loadEpreuves();
  }, []);

  return {
    events: filteredEvents,
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
  };
}
