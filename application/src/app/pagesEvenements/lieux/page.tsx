/**
 * Page de gestion des lieux AdminJO
 *
 * Cette page constitue l'interface de gestion des lieux de compétition pour
 * l'application d'administration des Jeux Olympiques 2024. Elle permet la gestion CRUD
 * complète des lieux avec recherche textuelle.
 *
 * @module LieuxPage
 */

'use client';

import PageTemplate from '@/components/layout/PageTemplate';
import LieuxManagement from '@/components/componentsEvenement/lieux/LieuxManagement';
import {JSX} from "react";

/**
 * Composant de la page de gestion des lieux
 *
 * @name LieuxPage
 *
 * Cette page offre une interface complète pour l'administration des lieux de compétition
 * des JO 2024. Elle permet la gestion CRUD complète avec recherche textuelle et
 * interface modale pour la création/modification.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Gestion complète des lieux (CRUD)
 * - **Affichage de liste** : Consultation des lieux existants dans un tableau
 * - **Création de lieux** : Formulaire modal pour ajouter de nouveaux lieux
 * - **Modification de lieux** : Édition des lieux existants via modal
 * - **Suppression de lieux** : Suppression avec confirmation utilisateur
 *
 * ### Recherche et interface
 * - **Recherche textuelle** : Recherche par nom de lieu ou autres critères
 * - **Notifications** : Messages de succès et d'erreur pour toutes les actions
 *
 * ## Structure des composants intégrés
 *
 * ### LieuxHeader
 * - Titre de la section "Gestion des lieux"
 * - Bouton "Créer un lieu" qui ouvre la modal de création
 *
 * ### SearchAndFilters
 * - Champ de recherche textuelle pour filtrer les lieux
 * - Interface simple et épurée
 *
 * ### LieuxTable
 * - Tableau des lieux avec colonnes d'informations
 * - Boutons d'action pour chaque lieu (modifier/supprimer)
 * - Gestion des états de chargement et d'erreur
 * - Affichage des messages quand aucun lieu n'existe
 *
 * ### LieuModal
 * - Formulaire modal pour création et modification
 * - Validation des champs requis (nom, adresse, capacité, etc.)
 * - Mode création (nouveau lieu) ou édition (lieu existant)
 * - Boutons d'annulation et de sauvegarde
 *
 * ## Workflow utilisateur
 *
 * 1. **Consultation** : Affichage automatique de la liste des lieux existants
 * 2. **Recherche** : Utilisation de la barre de recherche pour filtrer
 * 3. **Création** : Clic sur "Créer" → modal vierge → saisie → sauvegarde
 * 4. **Modification** : Clic sur "Modifier" → modal pré-remplie → édition → sauvegarde
 * 5. **Suppression** : Clic sur "Supprimer" → confirmation → suppression définitive
 * 6. **Feedback** : Notification de succès/erreur après chaque action
 *
 * ## Intégration technique
 *
 * - **Hook useLieuxManagement** : Logique métier et appels API pour toutes les opérations CRUD
 * - **Hook useSessionExpiry** : Gestion automatique de l'expiration de session
 * - **Composant Notification** : Système unifié de notifications utilisateur
 * - **PageTemplate** : Structure de page avec titre, breadcrumbs et intro
 *
 * ## Gestion des états
 *
 * - **Loading** : Spinner pendant le chargement des données
 * - **Error** : Affichage des messages d'erreur réseau
 * - **Success** : Notifications de réussite des opérations
 * - **CreateLoading** : États de chargement spécifiques pour la création
 * - **CreateError** : Gestion d'erreurs spécifiques pour la création
 *
 * @returns {JSX.Element} Page complète de gestion des lieux avec interface CRUD
 *
 * @see {@link PageTemplate} - Template de page utilisé pour la structure
 * @see {@link LieuxManagement} - Composant principal de gestion des lieux
 * @see {@link LieuxHeader} - En-tête avec bouton de création
 * @see {@link SearchAndFilters} - Outil de recherche textuelle
 * @see {@link LieuxTable} - Tableau d'affichage et d'actions
 * @see {@link LieuModal} - Modal de création/modification
 * @see {@link useLieuxManagement} - Hook de gestion des lieux
 *
 */

export function LieuxPage(): JSX.Element {
    return (
        <PageTemplate
            title="Gestion des évènements sportifs"
            breadcrumbs={[
                { label: 'Accueil', href: '/dashboard' },
                { label: 'Tableau de gestion des évènements', href: '/pagesEvenements' },
                { label: 'Lieux' }
            ]}
        >
            <LieuxManagement />
        </PageTemplate>
    );
}
export default LieuxPage;
