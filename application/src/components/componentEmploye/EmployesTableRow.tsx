'use client';

import { Employe } from '@/types/employe/employe';
import {JSX} from "react";

interface Props {
  employe: Employe;
  onToggleActive: (employeId: number) => void;
}

/**
 * Composant EmployesTableRow - Ligne de table employé AdminJO
 *
 * @name EmployesTableRow
 *
 * Ce composant représente une ligne individuelle dans la table des employés, affichant
 * toutes les informations essentielles d'un employé avec actions d'activation/désactivation.
 * Il est conçu comme un composant atomique réutilisable pour optimiser les performances
 * et maintenir la cohérence visuelle dans les tableaux d'employés.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Affichage profil employé
 * - **Nom complet** : Prénom + Nom avec hiérarchie visuelle
 * - **Identifiant** : ID employé affiché en texte secondaire gris
 * - **Layout flex** : Alignement horizontal avatar + informations
 *
 * ### Données RH structurées
 * - **Matricule** : Identifiant unique employé
 * - **Email** : Adresse email de connexion
 * - **Téléphone** : Numéro de contact
 *
 * ### Propriétés affichées
 * - **employe.prenom** : Prénom pour nom complet et initiales
 * - **employe.nom** : Nom pour nom complet et initiales
 * - **employe.id** : Identifiant numérique affiché et pour callback
 * - **employe.matricule** : Identifiant unique RH
 * - **employe.user.email** : Email de connexion
 * - **employe.identifiant_telephone** : Numéro de contact
 * - **employe.user.is_active** : Statut d'activation boolean
 *
 * ### Relations données
 * - **User nested** : employe.user.* pour données utilisateur
 * - **Statut centralisé** : is_active dans user, pas dans employe
 *
 * @param {Props} props - Configuration de la ligne employé
 * @param {Employe} props.employe - Données complètes de l'employé à afficher
 * @param {Function} props.onToggleActive - Callback pour changer le statut d'activation
 *
 * @returns {JSX.Element} Ligne de tableau (<tr>) avec données employé et actions
 *
 * @see {@link EmployesTable} - Composant parent contenant cette ligne
 * @see {@link Employe} - Interface TypeScript des données employé
 * @see {@link EmployesManagement} - Gestion globale des actions employé
 *
 */
export default function EmployesTableRow({ employe, onToggleActive }: Props): JSX.Element {
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
