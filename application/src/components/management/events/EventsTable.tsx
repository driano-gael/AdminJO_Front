'use client';

import { ExtendEvenement } from '@/types/sportEvenement/evenement';
import EventsTableRow from './EventsTableRow';
import Spinner from '@/components/spinner';

interface EventsTableProps {
  events: ExtendEvenement[];
  loading: boolean;
  searchTerm: string;
  onDeleteEvent: (id: number) => void;
  onRefresh: () => void;
}

export default function EventsTable({ 
    events, 
    loading, 
    searchTerm, 
    onDeleteEvent, 
    onRefresh 
}: EventsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Événements ({events.length})
          </h2>
          <div className="flex items-center space-x-2">
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <Spinner />
                Chargement...
              </div>
            )}
            <button
              onClick={onRefresh}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={loading}
            >
              🔄 Actualiser
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Épreuves
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
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Spinner />
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
              events.map((event) => (
                <EventsTableRow
                  key={event.id}
                  event={event}
                  onDelete={onDeleteEvent}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
