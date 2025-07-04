'use client';

import { useState, useEffect } from 'react';
import { evenementApi, lieuApi } from '@/lib/api/eventServices';
import { Evenement } from '@/types/apiEvenement/evenement';
import { Lieu } from '@/types/apiEvenement/lieu';
import { CreateEvenementRequest } from '@/lib/api/eventServices/evenementService';
import Notification from '@/components/notification';

/**
 * Interface étendue pour l'affichage des événements avec des champs supplémentaires
 * Hérite de Evenement et ajoute des propriétés pour l'affichage et les statistiques
 */
interface SportEvent extends Evenement {
  sport?: string; // Sport associé à l'événement
  status?: 'upcoming' | 'ongoing' | 'completed'; // Statut de l'événement
  capacity?: number; // Capacité maximale de l'événement
  ticketsSold?: number; // Nombre de billets vendus
}

/**
 * Props pour le composant EventsManagement
 */
interface EventsManagementProps {
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
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Le composant de gestion des événements
 */
export default function EventsManagement({ onBack }: EventsManagementProps) {
  // États pour la gestion des événements
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour la création d'événements
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
  // État pour les notifications
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  /**
   * Fonction pour charger les événements depuis l'API avec recherche
   * @param searchQuery - Terme de recherche optionnel
   */
  const loadEvents = async (searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Appel API réel pour récupérer les événements avec recherche
      const apiEvents = await evenementApi.getAll(searchQuery ? {
        description: searchQuery
      } : undefined);
      
      // Transforme les données API en SportEvent avec des champs supplémentaires
      const eventsWithExtras: SportEvent[] = apiEvents.map(event => ({
        ...event,
        // Détection automatique du sport basée sur la description
        sport: event.description.toLowerCase().includes('athlétisme') ? 'Athlétisme' :
               event.description.toLowerCase().includes('natation') ? 'Natation' :
               event.description.toLowerCase().includes('basketball') ? 'Basketball' : 'Autre',
        // Détermination du statut basée sur la date
        status: new Date(event.date) > new Date() ? 'upcoming' : 'completed',
        // Génération de données simulées pour les statistiques
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
   * Fonction pour effectuer une recherche côté serveur
   * @param query - Terme de recherche
   */
  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      await loadEvents(query);
    } else {
      await loadEvents();
    }
  };

  /**
   * Fonction pour charger les lieux depuis l'API
   * Nécessaire pour le formulaire de création d'événements
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
   * Fonction pour créer un nouvel événement
   * @param eventData - Données de l'événement à créer
   */
  const handleCreateEvent = async (eventData: CreateEvenementRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      
      const newEvent = await evenementApi.create(eventData);
      
      // Transforme le nouvel événement et l'ajoute à la liste
      const newEventWithExtras: SportEvent = {
        ...newEvent,
        sport: newEvent.description.toLowerCase().includes('athlétisme') ? 'Athlétisme' :
               newEvent.description.toLowerCase().includes('natation') ? 'Natation' :
               newEvent.description.toLowerCase().includes('basketball') ? 'Basketball' : 'Autre',
        status: new Date(newEvent.date) > new Date() ? 'upcoming' : 'completed',
        capacity: Math.floor(Math.random() * 50000) + 10000,
        ticketsSold: Math.floor(Math.random() * 40000) + 5000
      };
      
      setEvents(prev => [...prev, newEventWithExtras]);
      setShowCreateForm(false);
      setNotification({
        message: 'Événement créé avec succès !',
        type: 'success'
      });
      console.log('Événement créé avec succès:', newEvent);
    } catch (err) {
      setCreateError('Erreur lors de la création de l\'événement');
      console.error('Erreur création événement:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  /**
   * Fonction pour supprimer un événement
   * @param id - ID de l'événement à supprimer
   */
  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    
    try {
      await evenementApi.delete(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      setNotification({
        message: 'Événement supprimé avec succès !',
        type: 'success'
      });
      console.log('Événement supprimé avec succès:', id);
    } catch (err) {
      console.error('Erreur suppression événement:', err);
      setNotification({
        message: 'Erreur lors de la suppression de l\'événement',
        type: 'error'
      });
    }
  };

  // Charger les événements et lieux au montage du composant
  useEffect(() => {
    loadEvents();
    loadLieux();
  }, []);

  // Fonction pour filtrer les événements affichés (filtre local en plus de la recherche serveur)
  const filteredEvents = events.filter(event => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      event.description.toLowerCase().includes(searchLower) ||
      (event.sport && event.sport.toLowerCase().includes(searchLower)) ||
      event.lieu.nom.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: SportEvent['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: SportEvent['status']) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ← Retour au Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                🏟️ Gestion des Événements Sportifs
              </h1>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              + Nouvel Événement
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les sports</option>
                <option value="athlétisme">Athlétisme</option>
                <option value="natation">Natation</option>
                <option value="basketball">Basketball</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les statuts</option>
                <option value="upcoming">À venir</option>
                <option value="ongoing">En cours</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Événements ({filteredEvents.length})
              </h2>
              <div className="flex items-center space-x-2">
                {loading && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement...
                  </div>
                )}
                <button
                  onClick={() => loadEvents()}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  disabled={loading}
                >
                  🔄 Actualiser
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lieu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Chargement des événements...
                        </div>
                      ) : searchTerm ? (
                        <div>
                          <p className="text-lg font-medium">Aucun événement trouvé</p>
                          <p className="text-sm">Aucun événement ne correspond à votre recherche "{searchTerm}"</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium">Aucun événement</p>
                          <p className="text-sm">Commencez par créer votre premier événement</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{event.sport || 'Non spécifié'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-gray-500">{event.horraire}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{event.lieu.nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status || 'upcoming')}`}>
                          {getStatusText(event.status || 'upcoming')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.capacity && event.ticketsSold ? (
                          <>
                            <div className="text-sm text-gray-900">
                              {event.ticketsSold.toLocaleString()} / {event.capacity.toLocaleString()}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }}
                              ></div>
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">Non disponible</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal pour créer un événement */}
      {showCreateForm && (
        <CreateEventModal 
          lieux={lieux}
          onClose={() => {
            setShowCreateForm(false);
            setCreateError(null);
          }}
          onCreate={handleCreateEvent}
          loading={createLoading}
          error={createError}
        />
      )}

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

// Composant modal pour créer un événement
interface CreateEventModalProps {
  lieux: Lieu[];
  onClose: () => void;
  onCreate: (eventData: CreateEvenementRequest) => void;
  loading: boolean;
  error: string | null;
}

function CreateEventModal({ lieux, onClose, onCreate, loading, error }: CreateEventModalProps) {
  const [formData, setFormData] = useState<CreateEvenementRequest>({
    description: '',
    lieuId: 0,
    date: '',
    horraire: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.lieuId && formData.date && formData.horraire) {
      onCreate(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Créer un nouvel événement</h3>
        
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu
            </label>
            <select
              value={formData.lieuId}
              onChange={(e) => setFormData({ ...formData, lieuId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Sélectionnez un lieu</option>
              {lieux.map(lieu => (
                <option key={lieu.id} value={lieu.id}>
                  {lieu.nom}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horaire
            </label>
            <input
              type="time"
              value={formData.horraire}
              onChange={(e) => setFormData({ ...formData, horraire: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
