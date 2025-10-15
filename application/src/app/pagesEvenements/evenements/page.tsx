/**
 * Page de gestion des événements sportifs AdminJO
 *
 * Cette page constitue l'interface principale de gestion des événements sportifs pour
 * l'application d'administration des Jeux Olympiques 2024. Elle permet la gestion CRUD
 * complète des événements avec filtrage avancé et recherche.
 *
 * @module EvenementsPage
 */

'use client';

import PageTemplate from '@/components/layout/PageTemplate';
import EvenementsManagement from '@/components/componentsEvenement/evenements/EvenementsManagement';
import {JSX} from "react";

/**
 * Composant de la page de gestion des événements sportifs
 *
 * @name EventsPage
 *
 * Cette page offre une interface complète pour l'administration des événements sportifs
 * des JO 2024. Elle permet la gestion CRUD complète avec système de filtrage avancé,
 * recherche textuelle et interface modale pour la création/modification.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Gestion complète des événements (CRUD)
 * - **Affichage de liste** : Consultation des événements existants dans un tableau
 * - **Création d'événements** : Formulaire modal pour ajouter de nouveaux événements
 * - **Modification d'événements** : Édition des événements existants via modal
 * - **Suppression d'événements** : Suppression avec confirmation utilisateur
 *
 * ### Système de filtrage avancé
 * - **Recherche textuelle** : Recherche par description, lieu, sports
 * - **Filtre par lieu** : Sélection d'un lieu de compétition spécifique
 * - **Filtre par discipline** : Filtrage par discipline sportive (extraite des épreuves)
 * - **Filtre par épreuve** : Sélection d'une épreuve spécifique
 * - **Filtre par statut** : Filtrage par statut d'événement (à venir, en cours, terminé)
 * - **Filtre temporel** : Sélection de plage de dates (date début - date fin)
 *
 * ### Interface utilisateur avancée
 * - **En-tête avec bouton d'ajout** : Header avec action de création d'événement
 * - **Barre de recherche et filtres** : Outils de recherche et 6 filtres différents
 * - **Tableau des événements** : Affichage avec colonnes d'informations et actions
 * - **Modal de saisie** : Formulaire modal pour création et modification
 * - **Notifications** : Messages de succès et d'erreur pour toutes les actions
 *
 * ## Structure des composants intégrés
 *
 * ### EvenementsHeader
 * - Titre de la section "Gestion des événements sportifs"
 * - Bouton "Créer un événement" qui ouvre la modal de création
 *
 * ### EvenementsSearchAndFilters (SearchAndFilters)
 * - Champ de recherche textuelle
 * - 6 filtres : lieu, discipline, épreuve, statut, date début, date fin
 * - Bouton de réinitialisation des filtres
 *
 * ### EvenementsTable
 * - Tableau des événements avec colonnes : description, date, lieu, statut, épreuves
 * - Boutons d'action pour chaque événement (modifier/supprimer)
 * - Bouton de rafraîchissement des données
 * - Gestion des états de chargement et d'erreur
 *
 * ### EvenementModal
 * - Formulaire modal pour création et modification
 * - Validation des champs requis
 * - Mode création (nouvel événement) ou édition (événement existant)
 * - Sélection de lieu et épreuve via dropdowns
 *
 * ## Workflow utilisateur complet
 *
 * 1. **Consultation** : Affichage automatique de la liste des événements
 * 2. **Recherche/Filtrage** : Utilisation des outils de recherche et 6 filtres
 * 3. **Création** : Clic sur "Créer" → modal vierge → saisie → sauvegarde
 * 4. **Modification** : Clic sur "Modifier" → modal pré-remplie → édition → sauvegarde
 * 5. **Suppression** : Clic sur "Supprimer" → confirmation → suppression définitive
 * 6. **Actualisation** : Bouton refresh pour recharger les données
 *
 * ## Intégration avec les données
 *
 * - **Hook useEventsManagement** : Logique métier complète avec toutes les opérations CRUD
 * - **Chargement automatique** : Événements, lieux et épreuves depuis l'API
 * - **Calcul de disciplines** : Extraction automatique des disciplines uniques des épreuves
 * - **Filtrage côté client** : Application des filtres en temps réel sur les données
 *
 * ## Gestion des états avancée
 *
 * - **États de chargement** : Spinners pendant les opérations API
 * - **Gestion d'erreurs** : Affichage des erreurs réseau avec messages explicites
 * - **Confirmations** : Dialogs de confirmation pour les suppressions
 * - **Notifications** : Feedback pour création, modification, suppression réussies/échouées
 * - **États de filtrage** : Persistance des filtres appliqués pendant la session
 *
 * ## Navigation et structure
 *
 * - **Breadcrumbs** : Dashboard > Événements (navigation contextuelle)
 * - **Titre** : "Gestion des événements sportifs"
 * - **Container responsive** : Adaptation automatique mobile/desktop
 * - **Intégration PageTemplate** : Structure standardisée avec intro
 *
 * @returns {JSX.Element} Page complète de gestion des événements avec interface CRUD et filtrage
 *
 * @see {@link PageTemplate} - Template de page utilisé pour la structure
 * @see {@link EvenementsManagement} - Composant principal de gestion des événements
 * @see {@link EvenementsHeader} - En-tête avec bouton de création
 * @see {@link EvenementsSearchAndFilters} - Outils de recherche et filtrage avancés
 * @see {@link EvenementsTable} - Tableau d'affichage et d'actions
 * @see {@link EvenementModal} - Modal de création/modification
 * @see {@link useEventsManagement} - Hook de gestion des événements
 *
 */

export function EventsPage(): JSX.Element {
    // const router = useRouter(); // Non utilisé pour le moment

    return (
        <PageTemplate
            title="Gestion des évènements sportifs"
            breadcrumbs={[
                { label: 'Accueil', href: '/dashboard' },
                { label: 'Tableau de gestion des évènements', href: '/pagesEvenements' },
                { label: 'Événements' }
            ]}
        >
            <EvenementsManagement />
        </PageTemplate>
    );
}
export default EventsPage;
