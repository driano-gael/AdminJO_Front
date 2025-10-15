'use client';

import {Employe} from "@/types/employe/employe";

/**
 * Composant EmployesTable - Table de gestion des employés AdminJO
 *
 * @name EmployesTable
 *
 * Ce composant affiche la liste complète des employés sous forme de tableau responsive
 * avec fonctionnalités de filtrage, gestion des états de chargement/erreur, et actions
 * d'activation/désactivation. Il intègre la logique de recherche côté client et
 * fournit une interface optimisée pour la gestion RH des employés.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Affichage tabulaire des employés
 * - **Colonnes structurées** : Employé, Matricule, Email, Téléphone, Statut, Actions
 * - **Informations hiérarchisées** : Nom/prénom principal, ID secondaire
 * - **Compteur dynamique** : Affichage du nombre d'employés filtrés
 *
 * ### Filtrage côté client intégré
 * - **Recherche multi-critères** : Nom, prénom, email, matricule, téléphone
 * - **Filtrage réactif** : Mise à jour immédiate selon searchTerm
 * - **Performance optimisée** : Filter() sur tableau local sans requête
 * - **Sensibilité casse** : Recherche insensible à la casse (toLowerCase)
 * - **Recherche partielle** : Utilisation d'includes() pour correspondance
 *
 * ### Gestion des états système
 * - **État loading** : Spinner avec message "Chargement des employés..."
 * - **État error** : Interface d'erreur avec bouton "Réessayer"
 * - **État vide** : Message contextuel selon présence de searchTerm
 *
 * ### Actions employé intégrées
 * - **Toggle activation** : Bouton contextuel Activer/Désactiver
 * - **Couleurs contextuelles** : Rouge pour désactiver, vert pour activer
 * - **Gestion async** : handleToggleActive avec gestion d'erreur
 * - **Feedback utilisateur** : Changement visuel immédiat
 *
 * ## Interactions utilisateur
 *
 * ### Actions disponibles
 * - **Refresh** : Bouton actualiser déclenche onRefresh()
 * - **Toggle statut** : Bouton activer/désactiver par ligne
 * - **Hover** : Mise en évidence des lignes sur survol
 * - **Scroll** : Navigation horizontale sur petit écran
 *
 * @param {EmployesTableProps} props - Configuration de la table des employés
 * @param {Employe[]} props.employes - Liste des employés à afficher
 * @param {boolean} props.loading - État de chargement des données
 * @param {string} props.searchTerm - Terme de recherche pour filtrage client
 * @param {Function} props.onRefresh - Callback pour actualiser les données
 * @param {string | null} props.error - Message d'erreur à afficher si présent
 * @param {Function} props.handleToggleActive - Callback async pour changer statut employé
 *
 * @returns {JSX.Element} Table responsive avec liste filtrée des employés
 *
 * @see {@link EmployesManagement} - Composant parent fournissant les données
 * @see {@link EmployesSearchAndFilters} - Composant fournissant searchTerm
 * @see {@link Employe} - Interface TypeScript des données employé
 * @see {@link EmployesTableRow} - Composant dédié pour lignes individuelles
 *
 */

interface EmployesTableProps {
  employes: Employe[];
  loading: boolean;
  searchTerm: string;
  onRefresh: () => void;
  error: string | null;
  handleToggleActive: (employeId: number) => Promise<void>;
}

export default function EmployesTable({
  employes,
  loading,
  searchTerm,
  onRefresh,
  error,
  handleToggleActive,
}: EmployesTableProps) {
  // Filtrage des employés basé sur le terme de recherche
  const filteredEmployes = employes.filter((employe) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      employe.nom.toLowerCase().includes(searchLower) ||
      employe.prenom.toLowerCase().includes(searchLower) ||
      employe.user.email.toLowerCase().includes(searchLower) ||
      employe.matricule.toLowerCase().includes(searchLower) ||
      employe.identifiant_telephone.toLowerCase().includes(searchLower)
    );
  });

  const handleToggleClick = async (employeId: number) => {
    try {
      await handleToggleActive(employeId);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Chargement des employés...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* En-tête */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Liste des employés ({filteredEmployes.length})
          </h3>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredEmployes.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun employé trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Aucun employé ne correspond à votre recherche.' : 'Aucun employé enregistré.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployes.map((employe) => (
                <tr key={employe.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {employe.prenom?.charAt(0) || '?'}{employe.nom?.charAt(0) || '?'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employe.prenom || 'N/A'} {employe.nom || 'N/A'}
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
                      onClick={() => handleToggleClick(employe.id)}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
