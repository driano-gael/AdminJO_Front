'use client';

import { Employe } from '@/types/employe/employe';

interface Props {
  employe: Employe;
  onToggleActive: (employeId: number) => void;
}

/**
 * Composant pour afficher une ligne d'employé dans la table
 */
export default function EmployesTableRow({ employe, onToggleActive }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {employe.prenom.charAt(0)}{employe.nom.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {employe.prenom} {employe.nom}
            </div>
            <div className="text-sm text-gray-500">
              ID: {employe.id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {employe.matricule}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {employe.user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {employe.identifiant_telephone}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            employe.user.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {employe.user.is_active ? 'Actif' : 'Inactif'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onToggleActive(employe.id)}
          className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
            employe.user.is_active
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {employe.user.is_active ? 'Désactiver' : 'Activer'}
        </button>
      </td>
    </tr>
  );
}
