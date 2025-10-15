/**
 * Page de gestion des disciplines AdminJO
 *
 * Cette page constitue l'interface de gestion des disciplines sportives pour
 * l'application d'administration des Jeux Olympiques 2024. Elle permet la gestion CRUD
 * complète des disciplines avec recherche textuelle.
 *
 * @module DisciplinesPage
 */

'use client';

import DisciplinesManagement from '@/components/componentsEvenement/discipline/DisciplinesManagement';
import PageTemplate from '@/components/layout/PageTemplate';
import {JSX} from "react";

/**
 * Composant de la page de gestion des disciplines
 *
 * Cette page offre une interface complète pour l'administration des disciplines sportives
 * des JO 2024. Elle permet la création, modification, consultation et suppression des
 * disciplines avec interface de recherche et système de notifications intégré.
 *
 * @name DisciplinesPage
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Gestion complète des disciplines (CRUD)
 * - **Affichage de liste** : Consultation des disciplines existantes dans un tableau
 * - **Création de disciplines** : Formulaire modal pour ajouter de nouvelles disciplines
 * - **Modification de disciplines** : Édition des disciplines existantes via modal
 * - **Suppression de disciplines** : Suppression avec confirmation utilisateur
 *
 * ### Recherche et interface
 * - **Recherche textuelle** : Recherche par nom de discipline ou autres critères
 * - **Actualisation** : Bouton refresh pour recharger les données avec recherche conservée
 * - **Notifications** : Messages de succès et d'erreur pour toutes les actions
 *
 * ## Structure des composants intégrés
 *
 * ### DisciplinesHeader
 * - Titre de la section "Gestion des disciplines"
 * - Bouton "Créer une discipline" qui ouvre la modal de création
 *
 * ### SearchAndFilters
 * - Champ de recherche textuelle pour filtrer les disciplines
 * - Interface simple et épurée
 *
 * ### DisciplinesTable
 * - Tableau des disciplines avec colonnes d'informations (nom, icône)
 * - Boutons d'action pour chaque discipline (modifier/supprimer)
 * - Bouton de rafraîchissement des données
 * - Gestion des états de chargement et d'erreur
 *
 * ### DisciplineModal
 * - Formulaire modal pour création et modification
 * - Validation des champs requis (nom, icône)
 * - Mode création (nouvelle discipline) ou édition (discipline existante)
 * - Boutons d'annulation et de sauvegarde
 *
 * ## Workflow utilisateur
 *
 * 1. **Consultation** : Affichage automatique de la liste des disciplines existantes
 * 2. **Recherche** : Utilisation de la barre de recherche pour filtrer par nom
 * 3. **Création** : Clic sur "Créer" → modal vierge → saisie → sauvegarde
 * 4. **Modification** : Clic sur "Modifier" → modal pré-remplie → édition → sauvegarde
 * 5. **Suppression** : Clic sur "Supprimer" → confirmation → suppression définitive
 * 6. **Actualisation** : Bouton refresh conservant le terme de recherche actuel
 *
 * ## Intégration technique
 *
 * - **Hook useDisciplinesManagement** : Logique métier et appels API pour toutes les opérations CRUD
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
 * - **Recherche** : Persistance du terme de recherche lors du refresh
 *
 * @returns {JSX.Element} Page complète de gestion des disciplines avec interface CRUD
 *
 * @see {@link PageTemplate} - Template de page utilisé pour la structure
 * @see {@link DisciplinesManagement} - Composant principal de gestion des disciplines
 * @see {@link DisciplinesHeader} - En-tête avec bouton de création
 * @see {@link SearchAndFilters} - Outil de recherche textuelle
 * @see {@link DisciplinesTable} - Tableau d'affichage et d'actions
 * @see {@link DisciplineModal} - Modal de création/modification
 * @see {@link useDisciplinesManagement} - Hook de gestion des disciplines
 *
 */
function DisciplinesPage(): JSX.Element {
    return (
        <PageTemplate
            title="Gestion des évènements sportifs"
            breadcrumbs={[
                { label: 'Accueil', href: '/dashboard' },
                { label: 'Tableau de gestion des évènements', href: '/pagesEvenements' },
                { label: 'Disciplines' }
            ]}
        >
            {/* Composant de gestion des disciplines */}
            <DisciplinesManagement />
        </PageTemplate>
    );
}
export default DisciplinesPage;