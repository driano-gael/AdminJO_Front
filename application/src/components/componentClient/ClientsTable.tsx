'use client';

import { Client } from '@/types/client/client';
import ClientsTableRow from './ClientsTableRow';
import Spinner from '@/components/spinner';

interface Props {
  clients: Client[];
  loading: boolean;
  searchTerm: string;
  onRefresh: () => void;
  error?: string | null;
}

export default function ClientsTable({
    clients,
    loading,
    searchTerm,
    onRefresh,
    error
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Clients ({clients.length})
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

      {/* Affichage des erreurs */}
      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <div className="text-sm text-red-600">
            {error}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prénom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Utilisateur
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Spinner />
                      Chargement des clients...
                    </div>
                  ) : searchTerm ? (
                    <div>
                      <p className="text-lg font-medium">Aucun client trouvé</p>
                      <p className="text-sm">Aucun client ne correspond à votre recherche &ldquo;{searchTerm}&rdquo;</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">Aucun client</p>
                      <p className="text-sm">Aucun client enregistré dans le système</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <ClientsTableRow
                  key={client.id}
                  client={client}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
