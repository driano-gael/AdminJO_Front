'use client';

import { Client } from '@/types/client/client';

interface Props {
  client: Client;
  onToggleActive: (clientId: number) => void;
}

/**
 * Composant pour afficher une ligne de client dans la table
 */
export default function ClientsTableRow({ client, onToggleActive }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{client.id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{client.nom}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{client.prenom}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{client.telephone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{client.user.email}</div>
      </td>
      <td className="text-center">
        <span
          className={`inline-flex text-xs leading-5 font-semibold rounded-full ${
            client.user.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {client.user.is_active ? 'Actif' : 'Inactif'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-xs text-gray-500">
          Créé le : {new Date(client.user.date_joined).toLocaleDateString('fr-FR')}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <button
          className={`px-3 py-1 rounded text-xs font-semibold shadow ${
            client.user.is_active
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          onClick={() => onToggleActive(client.id)}
        >
          {client.user.is_active ? 'Désactiver' : 'Activer'}
        </button>
      </td>
    </tr>
  );
}
