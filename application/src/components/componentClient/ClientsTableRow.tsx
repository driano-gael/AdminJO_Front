'use client';

import { Client } from '@/types/client/client';
import {JSX} from "react";

interface Props {
  client: Client;
  onToggleActive: (clientId: number) => void;
}

/**
 * Composant ClientsTableRow - Ligne de tableau pour un client AdminJO
 *
 * Ce composant affiche une ligne individuelle dans le tableau des clients avec
 * toutes les informations client et un bouton d'action pour activer/désactiver
 * le compte. Il s'agit d'un composant réutilisable utilisé par ClientsTable.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Affichage des données client
 * - **ID client** : Numéro formaté avec préfixe # (ex: #123)
 * - **Nom et prénom** : Informations personnelles du client
 * - **Téléphone** : Numéro de contact
 * - **Email** : Récupéré depuis client.user.email
 * - **Date de création** : Formatée en français depuis client.user.date_joined
 *
 * ### 🏷Indicateur de statut
 * - **Badge coloré** : Affichage visuel du statut actif/inactif
 *
 * ### ⚡ Action disponible
 * - **Bouton toggle** : Permet d'activer/désactiver le compte client
 * - **Couleur contextuelle** : Rouge pour désactiver, vert pour activer
 * - **Callback** : Appel de onToggleActive avec l'ID du client
 *
 * ## Structure des données
 *
 * ### Props reçues
 * - `client` : Objet Client complet avec propriétés imbriquées
 * - `onToggleActive` : Callback pour l'action d'activation/désactivation
 *
 * ### Structure Client utilisée
 * - `client.id` : Identifiant unique
 * - `client.nom` : Nom de famille
 * - `client.prenom` : Prénom
 * - `client.telephone` : Numéro de téléphone
 * - `client.user.email` : Email du compte utilisateur associé
 * - `client.user.is_active` : Statut d'activation du compte
 * - `client.user.date_joined` : Date de création du compte
 *
 * @param {Props} props - Configuration de la ligne client
 * @param {Client} props.client - Données complètes du client à afficher
 * @param {Function} props.onToggleActive - Callback pour activer/désactiver le client
 *
 * @returns {JSX.Element} Ligne de tableau avec données client et action toggle
 *
 * @see {@link ClientsTable} - Composant parent utilisant cette ligne
 * @see {@link Client} - Type des données client affichées
 * @see {@link ClientsManagement} - Composant racine gérant les actions
 *
 */
export function ClientsTableRow({ client, onToggleActive }: Props): JSX.Element {
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
export default ClientsTableRow;
