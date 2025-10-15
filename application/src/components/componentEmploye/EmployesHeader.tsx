'use client';

import {JSX} from "react";

interface EmployesHeaderProps {
  onAddEmploye?: () => void;
}

/**
 * Composant EmployesHeader - En-tête de gestion des employés AdminJO
 *
 * @name EmployesHeader
 *
 * Ce composant fournit l'interface d'en-tête pour la section de gestion des employés.
 * Il affiche le titre de la page, une description et le bouton d'ajout d'un nouvel employé.
 * Il suit les standards de design du système AdminJO avec une mise en page responsive.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Titre et identification de page
 * - **Titre principal** : "Gestion des Employés" avec typographie hiérarchisée
 * - **Icône contextuelle** : Emoji homme d'affaires (👨‍💼) pour identification visuelle
 * - **Description** : Sous-titre explicatif du contenu de la page
 *
 * ### Action d'ajout d'employé
 * - **Bouton principal** : Action d'ajout avec style primaire bleu
 * - **Callback optionnel** : onAddEmploye peut être undefined
 *
 *
 * @param {EmployesHeaderProps} props - Configuration de l'en-tête des employés
 * @param {Function} [props.onAddEmploye] - Callback optionnel pour l'ajout d'employé
 *
 * @returns {JSX.Element} En-tête responsive avec titre, description et action d'ajout
 *
 * @see {@link EmployesManagement} - Composant parent gérant la liste complète
 * @see {@link CreateEmployeForm} - Formulaire déclenché par le bouton d'ajout
 * @see {@link Employe} - Type des données employé gérées
 *
 */
export function EmployesHeader({ onAddEmploye }: EmployesHeaderProps): JSX.Element {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl">👨‍💼</span>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                    Gestion des Employés
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Liste des employés enregistrés dans le système
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={onAddEmploye}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un employé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EmployesHeader;
