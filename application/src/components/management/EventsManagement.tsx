'use client';

import { useState, useEffect } from 'react';
// Interface mise à jour pour correspondre aux types de l'API
interface SportEvent {
  id: number;
  description: string;
  lieu: {
    id: number;
    nom: string;
  };
  date: string;
  horraire: string;
  // Champs additionnels pour l'affichage
  sport?: string;
  venue?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  capacity?: number;
  ticketsSold?: number;
}

// Données mockées adaptées à la nouvelle interface
const mockEvents: SportEvent[] = [
  {
    id: 1,
    description: 'Finale 100m Hommes',
    lieu: {
      id: 1,
      nom: 'Stade de France'
    },
    date: '2024-08-15',
    horraire: '20:00',
    sport: 'Athlétisme',
    status: 'upcoming',
    capacity: 80000,
    ticketsSold: 75000
  },
  {
    id: 2,
    description: 'Finale Natation 50m Libre',
    lieu: {
      id: 2,
      nom: 'Centre Aquatique'
    },
    date: '2024-08-12',
    horraire: '19:30',
    sport: 'Natation',
    status: 'completed',
    capacity: 15000,
    ticketsSold: 15000
  },
  {
    id: 3,
    description: 'Match de Basketball - Finale',
    lieu: {
      id: 3,
      nom: 'Bercy Arena'
    },
    date: '2024-08-20',
    horraire: '21:00',
    sport: 'Basketball',
    status: 'ongoing',
    capacity: 20000,
    ticketsSold: 18500
  }
];

interface EventsManagementProps {
  onBack: () => void;
}

export default function EventsManagement({ onBack }: EventsManagementProps) {
  const [events, setEvents] = useState<SportEvent[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les événements depuis l'API
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Appel API - décommentez quand l'API sera prête
      // const apiEvents = await evenementApi.getAll();
      // setEvents(apiEvents);
      
      // Pour l'instant, on utilise les données mockées
      console.log('Événements chargés (données mockées)');
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error('Erreur chargement événements:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les événements au montage du composant
  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.sport && event.sport.toLowerCase().includes(searchTerm.toLowerCase())) ||
    event.lieu.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
              {loading && (
                <div className="text-sm text-gray-500">Chargement...</div>
              )}
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
                {filteredEvents.map((event) => (
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
                      <button className="text-red-600 hover:text-red-900">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
