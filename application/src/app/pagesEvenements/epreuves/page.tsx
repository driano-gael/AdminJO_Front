/**
 * Page de gestion des épreuves AdminJO
 *
 * Cette page constitue l'interface de gestion des épreuves sportives pour
 * l'application d'administration des Jeux Olympiques 2024. Elle permet la gestion CRUD
 * complète des épreuves avec recherche textuelle et filtrage par discipline.
 *
 * @module EpreuvesPage
 */

'use client';

import EpreuvesManagement from '@/components/componentsEvenement/epreuve/EpreuvesManagement';
import PageTemplate from '@/components/layout/PageTemplate';
import {JSX} from "react";

/**
 * Composant de la page de gestion des épreuves
 *
 * @name EpreuvesPage
 *
 * Cette page offre une interface complète pour l'administration des épreuves sportives
 * des JO 2024. Elle permet la gestion CRUD complète avec recherche textuelle,
 * filtrage par discipline et interface modale pour la création/modification.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Gestion complète des épreuves (CRUD)
 * - **Affichage de liste** : Consultation des épreuves existantes dans un tableau
 * - **Création d'épreuves** : Formulaire modal pour ajouter de nouvelles épreuves
 * - **Modification d'épreuves** : Édition des épreuves existantes via modal
 * - **Suppression d'épreuves** : Suppression avec confirmation utilisateur
 *
 * ### Recherche et filtrage
 * - **Recherche textuelle** : Recherche par libellé d'épreuve ou autres critères
 * - **Filtre par discipline** : Sélection d'une discipline sportive spécifique
 * - **Actualisation** : Bouton refresh pour recharger les données avec filtres conservés
 *
 * ### Interface utilisateur
 * - **En-tête avec bouton d'ajout** : Header avec action de création d'épreuve
 * - **Barre de recherche et filtres** : Outils de recherche et filtrage par discipline
 * - **Tableau des épreuves** : Affichage avec colonnes d'informations et actions
 * - **Modal de saisie** : Formulaire modal pour création et modification
 * - **Notifications** : Messages de succès et d'erreur pour toutes les actions
 *
 * ## Structure des composants intégrés
 *
 * ### EpreuvesHeader
 * - Titre de la section "Gestion des épreuves"
 * - Bouton "Créer une épreuve" qui ouvre la modal de création
 *
 * ### SearchAndFilters
 * - Champ de recherche textuelle pour filtrer les épreuves
 * - Sélecteur de filtre par discipline (dropdown avec toutes les disciplines)
 * - Interface épurée avec réinitialisation possible
 *
 * ### EpreuvesTable
 * - Tableau des épreuves avec colonnes : libellé, discipline, genre, tour
 * - Boutons d'action pour chaque épreuve (modifier/supprimer)
 * - Bouton de rafraîchissement des données
 * - Gestion des états de chargement et d'erreur
 *
 * ### EpreuveModal
 * - Formulaire modal pour création et modification
 * - Validation des champs requis (libellé, discipline, genre, tour)
 * - Mode création (nouvelle épreuve) ou édition (épreuve existante)
 * - Sélection de discipline via dropdown
 *
 * ## Workflow utilisateur
 *
 * 1. **Consultation** : Affichage automatique de la liste des épreuves existantes
 * 2. **Recherche** : Utilisation de la barre de recherche pour filtrer par libellé
 * 3. **Filtrage** : Sélection d'une discipline pour afficher ses épreuves uniquement
 * 4. **Création** : Clic sur "Créer" → modal vierge → saisie → sauvegarde
 * 5. **Modification** : Clic sur "Modifier" → modal pré-remplie → édition → sauvegarde
 * 6. **Suppression** : Clic sur "Supprimer" → confirmation → suppression définitive
 * 7. **Actualisation** : Bouton refresh conservant les filtres actifs
 *
 * ## Intégration technique
 *
 * - **Hook useEpreuvesManagement** : Logique métier et appels API pour toutes les opérations CRUD
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
 * - **Filtrage** : Persistance des filtres (recherche + discipline) lors du refresh
 *
 * @returns {JSX.Element} Page complète de gestion des épreuves avec interface CRUD et filtrage
 *
 * @see {@link PageTemplate} - Template de page utilisé pour la structure
 * @see {@link EpreuvesManagement} - Composant principal de gestion des épreuves
 * @see {@link EpreuvesHeader} - En-tête avec bouton de création
 * @see {@link SearchAndFilters} - Outils de recherche et filtrage par discipline
 * @see {@link EpreuvesTable} - Tableau d'affichage et d'actions
 * @see {@link EpreuveModal} - Modal de création/modification
 * @see {@link useEpreuvesManagement} - Hook de gestion des épreuves
 *
 */

export function EpreuvesPage(): JSX.Element {
    return (
        <PageTemplate
            title="Gestion des évènements sportifs"
            breadcrumbs={[
                { label: 'Accueil', href: '/dashboard' },
                { label: 'Tableau de gestion des évènements', href: '/pagesEvenements' },
                { label: 'Épreuves' }
            ]}
        >
            {/* Composant de gestion des épreuves */}
            <EpreuvesManagement />
        </PageTemplate>
    );
}
export default EpreuvesPage;
