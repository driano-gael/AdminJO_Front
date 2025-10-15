'use client';

import { Client } from '@/types/client/client';
import ClientsTableRow from './ClientsTableRow';
import Spinner from '@/components/spinner';
import {JSX} from "react";

interface Props {
  clients: Client[];
  loading: boolean;
  searchTerm: string;
  onRefresh: () => void;
  error?: string | null;
  handleToggleActive: (clientId: number) => Promise<void>;
}

/**
 * Composant ClientsTable - Tableau d'affichage et gestion des clients AdminJO
 *
 * Ce composant affiche la liste des clients dans un tableau responsive avec
 * gestion des états de chargement, erreurs, et actions limitées (activation/désactivation).
 * Il utilise le composant ClientsTableRow pour afficher chaque ligne.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Affichage du tableau
 * - **En-tête avec compteur** : "Clients (X)" avec nombre total affiché
 * - **Bouton d'actualisation** : 🔄 Actualiser avec état disabled pendant loading
 * - **Indicateur de chargement** : Spinner + texte "Chargement..." pendant les opérations
 *
 * ### Gestion des états
 * - **État de chargement** : Affichage du spinner et désactivation du bouton refresh
 * - **Gestion d'erreurs** : Zone d'affichage des erreurs avec fond rouge si présentes
 * - **État vide** : Message affiché quand aucun client n'est trouvé
 * - **Résultats de recherche** : Indication du terme recherché quand applicable
 *
 * ### ⚡ Actions disponibles
 * - **Actualisation** : Bouton pour recharger les données (callback onRefresh)
 * - **Toggle activation** : Transmission de handleToggleActive aux lignes
 *
 * ## Structure du composant
 *
 * ### Props reçues
 * - `clients` : Array des clients à afficher
 * - `loading` : État de chargement pour l'interface
 * - `searchTerm` : Terme de recherche pour messages contextuels
 * - `onRefresh` : Callback pour actualiser les données
 * - `error` : Message d'erreur optionnel à afficher
 * - `handleToggleActive` : Fonction pour activer/désactiver un client
 *
 * ### Rendu conditionnel
 * - **Loading** : Spinner visible pendant le chargement
 * - **Erreur** : Zone rouge d'affichage des erreurs
 * - **Données** : Tableau avec en-têtes et lignes ClientsTableRow
 * - **Vide** : Messages différents selon présence de searchTerm
 *
 * ## Intégration avec ClientsTableRow
 *
 * Le composant utilise ClientsTableRow pour chaque client :
 * - Transmission des données client
 * - Callback handleToggleActive pour les actions
 * - Gestion uniforme du design et interactions
 *
 * @param {Props} props - Configuration du tableau des clients
 * @param {Client[]} props.clients - Liste des clients à afficher
 * @param {boolean} props.loading - État de chargement
 * @param {string} props.searchTerm - Terme de recherche actuel
 * @param {Function} props.onRefresh - Callback d'actualisation des données
 * @param {string | null} props.error - Message d'erreur optionnel
 * @param {Function} props.handleToggleActive - Callback pour toggle activation client
 *
 * @returns {JSX.Element} Tableau responsive des clients avec actions limitées
 *
 * @see {@link ClientsTableRow} - Composant de ligne utilisé pour chaque client
 * @see {@link ClientsManagement} - Composant parent utilisant ce tableau
 * @see {@link Spinner} - Composant de chargement utilisé
 * @see {@link useClientsManagement} - Hook fournissant les données et actions
 *
 */
export function ClientsTable({
    clients,
    loading,
    searchTerm,
    onRefresh,
    error,
    handleToggleActive
}: Props): JSX.Element {
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
                email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DATE CREATION
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTIONS
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
                  onToggleActive={handleToggleActive}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ClientsTable;
