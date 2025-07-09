import { useState, useEffect } from 'react';
import { evenementApi } from '@/lib/api/services/evenementSports/evenementService';
import { lieuApi } from '@/lib/api/services/evenementSports/lieuService';
import { epreuveApi } from '@/lib/api/services/evenementSports/epreuveService';
import { Lieu } from '@/types/sportEvenement/lieu';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { CreateEvenementRequest } from '@/lib/api/services/evenementSports/evenementService';
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
      setLieux(apiLieux);
      console.log('Lieux chargés depuis l\'API:', apiLieux);
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
