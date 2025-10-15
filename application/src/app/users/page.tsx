/**
 * Page de gestion des utilisateurs (clients) AdminJO
 *
 * Cette page constitue l'interface de consultation et gestion des utilisateurs clients
 * pour l'application d'administration des Jeux Olympiques 2024. Elle permet la consultation,
 * recherche, filtrage et gestion des statuts des comptes clients.
 *
 */

'use client';

import PageTemplate from '@/components/layout/PageTemplate';
import ClientsManagement from '@/components/componentClient/ClientsManagement';
import {JSX} from "react";

/**
 * Composant de la page de gestion des utilisateurs
 *
 * Cette page offre une interface complète pour l'administration des utilisateurs clients
 * des JO 2024. Elle permet la consultation, la recherche, le filtrage et la gestion
 * des statuts des comptes utilisateurs avec interface responsive et fonctionnalités
 * de recherche avancées.
 *
 * @name UsersPage
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Gestion limitée des clients
 * - **Affichage de liste** : Consultation des clients existants dans un tableau
 * - **Activation/Désactivation** : Basculer le statut actif/inactif des comptes clients
 * - **Pas de création/modification** : Interface de consultation principalement
 * - **Pas de suppression** : Seulement gestion des statuts
 *
 * ### Recherche et filtrage
 * - **Recherche textuelle** : Recherche par nom, email ou autres critères clients
 * - **Filtre par statut** : Filtrage par statut actif/inactif des comptes
 *
 * ### Interface utilisateur
 * - **En-tête simple** : Header avec titre de la section
 * - **Barre de recherche et filtres** : Outils de recherche et filtre de statut
 * - **Tableau des clients** : Affichage des informations clients avec actions limitées
 * - **Notifications** : Messages de succès et d'erreur pour les actions
 *
 * ## Structure des composants intégrés
 *
 * ### ClientsHeader
 * - Titre de la section "Gestion des utilisateurs"
 * - Interface simple sans bouton de création
 *
 * ### ClientsSearchAndFilters
 * - Champ de recherche textuelle pour filtrer les clients
 * - Sélecteur de filtre par statut (actif/inactif)
 * - Interface épurée similaire aux employés
 *
 * ### ClientsTable
 * - Tableau des clients avec colonnes d'informations
 * - Boutons d'action limités (principalement activation/désactivation)
 * - Gestion des états de chargement et d'erreur
 * - Affichage des messages quand aucun client n'existe
 *
 * ## Workflow utilisateur
 *
 * 1. **Consultation** : Affichage automatique de la liste des clients existants
 * 2. **Recherche** : Utilisation de la barre de recherche pour filtrer
 * 3. **Filtrage** : Application du filtre par statut si nécessaire
 * 4. **Gestion des statuts** : Activation/désactivation des comptes via boutons
 * 5. **Feedback** : Notification de succès/erreur après chaque action
 *
 * ## Intégration technique
 *
 * - **Hook useClientsManagement** : Logique métier et appels API pour consultation et gestion des statuts
 * - **Hook useSessionExpiry** : Gestion automatique de l'expiration de session
 * - **Composant Notification** : Système unifié de notifications utilisateur
 * - **PageTemplate** : Structure de page avec titre, breadcrumbs et intro
 *
 * ## Gestion des états
 *
 * - **Loading** : Spinner pendant le chargement des données
 * - **Error** : Affichage des messages d'erreur réseau
 * - **Success** : Notifications de réussite pour les changements de statut
 * - **Filtrage** : États de recherche et filtre par statut
 *
 * ## Navigation et structure
 *
 * - **Breadcrumbs** : Dashboard > Utilisateurs (navigation contextuelle)
 * - **Titre** : "Gestion des Utilisateurs" avec description
 * - **Container responsive** : Adaptation automatique mobile/desktop
 * - **Intégration PageTemplate** : Structure standardisée avec intro
 *
 *
 * @returns {JSX.Element} Page de consultation et gestion limitée des utilisateurs clients
 *
 * @see {@link PageTemplate} - Template de page utilisé pour la structure
 * @see {@link ClientsManagement} - Composant principal de gestion des clients
 * @see {@link ClientsHeader} - En-tête simple de la section
 * @see {@link ClientsSearchAndFilters} - Outils de recherche et filtrage par statut
 * @see {@link ClientsTable} - Tableau d'affichage avec actions limitées
 * @see {@link useClientsManagement} - Hook de gestion des clients
 *
 */

export function UsersPage(): JSX.Element {
    return (
        <PageTemplate
            title="👥 Gestion des Utilisateurs"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Utilisateurs' }
            ]}
            intro={{
                title: "Administration des Utilisateurs",
                description: "Gérez les comptes et permissions des utilisateurs"
            }}
        >
            <ClientsManagement />
        </PageTemplate>
    );
}
export default UsersPage;
