'use client';

import {JSX} from "react";

/**
 * Composant ClientsHeader - En-tête de la page de gestion des clients AdminJO
 *
 * Ce composant affiche l'en-tête de la section de gestion des clients avec titre,
 * icône et description. Il s'agit d'un composant d'affichage pur sans interactions,
 * contrairement aux autres headers qui incluent des boutons d'action.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Affichage d'en-tête simple
 * - **Titre principal** : "Gestion des Clients" avec icône 👥
 * - **Description** : "Liste des clients enregistrés dans le système"
 *
 * ## Structure du composant
 *
 * - **Container principal**
 * - **Section titre**
 *
 * @returns {JSX.Element} En-tête de la section clients avec titre et description
 *
 * @see {@link ClientsManagement} - Composant parent utilisant ce header
 * @see {@link ClientsSearchAndFilters} - Composant de recherche suivant
 * @see {@link ClientsTable} - Tableau des clients
 *
 */
export function ClientsHeader(): JSX.Element {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl">👥</span>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                    Gestion des Clients
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Liste des clients enregistrés dans le système
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ClientsHeader;
