/**
 * Page de gestion des offres AdminJO
 *
 * Cette page constitue l'interface de gestion des offres de billeterie pour l'application
 * d'administration des Jeux Olympiques 2024. Elle permet la création, modification,
 * suppression et consultation des offres de tickets pour les événements.
 *
 * @module OffrePage
 */

'use client';

import PageTemplate from '@/components/layout/PageTemplate';
import OffresManagement from "@/components/componentOffre/OffresManagement";
import {JSX} from "react";

/**
 * Composant de la page de gestion des offres
 *
 * Cette page offre une interface complète pour l'administration des offres de billeterie
 * des JO 2024. Elle permet la création, modification, consultation et suppression des
 * offres avec interface responsive et système de notifications intégré.
 *
 * @name OffrePage
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Gestion complète des offres (CRUD)
 * - **Affichage de liste** : Consultation des offres existantes dans un tableau
 * - **Création d'offres** : Formulaire modal pour ajouter de nouvelles offres
 * - **Modification d'offres** : Édition des offres existantes via modal
 * - **Suppression d'offres** : Suppression avec confirmation utilisateur
 *
 * ### Interface utilisateur
 * - **En-tête avec bouton d'ajout** : Header avec action de création d'offre
 * - **Tableau des offres** : Affichage des offres avec boutons d'action (modifier/supprimer)
 * - **Modal de saisie** : Formulaire modal pour création et modification
 * - **Notifications** : Messages de succès et d'erreur pour toutes les actions
 *
 * ### Gestion des états
 * - **États de chargement** : Spinners pendant les opérations API
 * - **Gestion d'erreurs** : Affichage des erreurs réseau et validation
 * - **Confirmations** : Dialog de confirmation avant suppression
 * - **Feedback utilisateur** : Notifications pour chaque action réussie/échouée
 *
 * ## Structure des composants intégrés
 *
 * ### OffresHeader
 * - Titre de la section "Gestion des offres"
 * - Bouton "Ajouter une offre" qui ouvre la modal de création
 *
 * ### OffresTable
 * - Tableau des offres avec colonnes d'informations
 * - Boutons d'action pour chaque offre (modifier/supprimer)
 * - Gestion des états de chargement et d'erreur
 * - Affichage des messages quand aucune offre n'existe
 *
 * ### OffreModal
 * - Formulaire modal pour création et modification
 * - Validation des champs requis
 * - Mode création (nouvelle offre) ou édition (offre existante)
 * - Boutons d'annulation et de sauvegarde
 *
 * ## Workflow utilisateur type
 *
 * 1. **Consultation** : Affichage automatique de la liste des offres existantes
 * 2. **Création** : Clic sur "Ajouter" → ouverture modal → saisie → sauvegarde
 * 3. **Modification** : Clic sur "Modifier" → ouverture modal pré-remplie → édition → sauvegarde
 * 4. **Suppression** : Clic sur "Supprimer" → confirmation → suppression définitive
 * 5. **Feedback** : Notification de succès/erreur après chaque action
 *
 * ## Gestion des actions
 *
 * ### Création d'offre
 * - Ouverture de modal vierge
 * - Validation des données saisies
 * - Appel API de création
 * - Fermeture modal et notification de succès
 *
 * ### Modification d'offre
 * - Ouverture de modal pré-remplie avec données existantes
 * - Édition des champs modifiables
 * - Appel API de mise à jour
 * - Actualisation de la liste et notification
 *
 * ### Suppression d'offre
 * - Dialog de confirmation avec nom de l'offre
 * - Suppression définitive si confirmée
 * - Actualisation automatique de la liste
 * - Notification de succès de la suppression
 *
 * ## Intégration technique
 *
 * - **Hook useOffresManagement** : Logique métier et appels API pour toutes les opérations CRUD
 * - **Hook useSessionExpiry** : Gestion automatique de l'expiration de session
 * - **Composant Notification** : Système unifié de notifications utilisateur
 * - **PageTemplate** : Structure de page avec titre, breadcrumbs et intro
 *
 * ## Navigation et structure
 *
 * - **Breadcrumbs** : Dashboard > Offres (navigation contextuelle)
 * - **Titre** : "Gestion des offres" avec description
 * - **États persistants** : Maintien des données pendant la session
 *
 *
 * @returns {JSX.Element} Page complète de gestion des offres avec interface CRUD
 *
 * @see {@link PageTemplate} - Template de page utilisé pour la structure
 * @see {@link OffresManagement} - Composant principal de gestion des offres
 * @see {@link OffresHeader} - En-tête avec bouton d'ajout
 * @see {@link OffresTable} - Tableau d'affichage et d'actions
 * @see {@link OffreModal} - Modal de création/modification
 * @see {@link useOffresManagement} - Hook de gestion des offres
 *
 */

export function OffrePage(): JSX.Element {
  return (
    <PageTemplate
      title="Gestion des offres"
      breadcrumbs={[
        {label: 'Accueil', href: '/dashboard'},
        {label: 'offre'}
      ]}
    >
      {/* Composant de gestion des offres*/}
      <OffresManagement/>
    </PageTemplate>
  );
}
export default OffrePage;