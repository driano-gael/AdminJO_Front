/**
 * Page de gestion des employés AdminJO
 *
 * Cette page constitue l'interface complète de gestion des employés pour l'application
 * d'administration des Jeux Olympiques 2024. Elle permet la supervision, la création,
 * la modification et la suppression des comptes employés avec gestion des rôles et permissions.
 *
 * @module EmployeesPage
 */

'use client';

import PageTemplate from '@/components/layout/PageTemplate';
import EmployesManagement from '@/components/componentEmploye/EmployesManagement';
import {JSX} from "react";

/**
 * Composant de la page de gestion des employés
 *
 * Cette page offre une interface simple pour l'administration des employés des JO 2024.
 * Elle permet la consultation, la recherche, le filtrage et la création d'employés,
 * ainsi que l'activation/désactivation de leurs comptes.
 *
 * @name EmployeesPage
 *
 * ## Fonctionnalités réelles implémentées
 *
 * ### Gestion des employés
 * - **Affichage de liste** : Consultation des employés existants dans un tableau
 * - **Création d'employés** : Formulaire modal pour ajouter de nouveaux employés
 * - **Activation/Désactivation** : Basculer le statut actif/inactif des employés
 * - **Actualisation** : Rechargement manuel de la liste des employés
 *
 * ### Recherche et filtrage
 * - **Recherche textuelle** : Recherche par nom, prénom ou autres critères
 * - **Filtre par statut** : Filtrage par statut actif/inactif des employés
 *
 *
 * ## Structure des composants
 *
 * ### EmployesHeader
 * - Titre de la section
 * - Bouton "Ajouter un employé" qui ouvre le formulaire de création
 *
 * ### EmployesSearchAndFilters
 * - Champ de recherche textuelle
 * - Sélecteur de filtre par statut (actif/inactif)
 *
 * ### EmployesTable
 * - Tableau des employés avec colonnes d'informations
 * - Boutons d'action pour activer/désactiver les employés
 * - Bouton de rafraîchissement des données
 * - Gestion des états de chargement et d'erreur
 *
 * ### CreateEmployeForm
 * - Formulaire modal de création d'employé
 * - Validation des champs requis
 * - Soumission avec gestion du loading
 *
 * ## Workflow utilisateur
 *
 * 1. **Consultation** : Affichage de la liste des employés existants
 * 2. **Recherche** : Utilisation de la barre de recherche pour filtrer
 * 3. **Filtrage** : Application du filtre par statut si nécessaire
 * 4. **Création** : Clic sur "Ajouter" → ouverture du formulaire modal
 * 5. **Gestion des statuts** : Activation/désactivation via les boutons d'action
 * 6. **Actualisation** : Rechargement des données via le bouton refresh
 *
 * ## Gestion des états
 *
 * - **Loading** : Spinner pendant le chargement des données
 * - **Error** : Affichage des messages d'erreur
 * - **Success** : Notifications de réussite des opérations
 * - **Empty** : État quand aucun employé n'est trouvé
 *
 * ## Intégration technique
 *
 * - **Hook useEmployesManagement** : Logique métier et appels API
 * - **Hook useSessionExpiry** : Gestion de l'expiration de session
 * - **Composant Notification** : Système de notifications utilisateur
 * - **Responsive design** : Interface adaptée mobile/desktop

 *
 * @returns {JSX.Element} Interface complète de gestion des employés
 *
 * @see {@link EmployesHeader} - En-tête avec bouton d'ajout
 * @see {@link EmployesSearchAndFilters} - Outils de recherche et filtrage
 * @see {@link EmployesTable} - Tableau d'affichage des employés
 * @see {@link CreateEmployeForm} - Formulaire de création d'employé
 * @see {@link useEmployesManagement} - Hook de gestion des employés
 *
 */
export function EmployeesPage(): JSX.Element {
    return (
        <PageTemplate
            title="👨‍💼 Gestion des Employés"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Employés' }
            ]}
            intro={{
                title: "Administration des Employés",
                description: "Gérez les comptes employés et leurs informations"
            }}
        >
            {/*
             * Composant principal de gestion des employés
             *
             * Ce composant encapsule toute la logique métier de gestion des employés :
             * - Interface de liste avec recherche et filtrage
             * - Formulaires de création et modification
             * - Gestion des rôles et permissions
             * - Actions d'administration (activation/désactivation)
             * - Validation des données et gestion d'erreurs
             *
             * Il s'intègre parfaitement avec l'API backend pour toutes les opérations
             * CRUD et respecte les permissions utilisateur définies.
             */}
            <EmployesManagement />
        </PageTemplate>
    );
}
export default EmployeesPage;
