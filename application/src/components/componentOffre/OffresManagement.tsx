'use client';

/**
 * Composant OffresManagement - Gestionnaire principal des offres olympiques AdminJO
 *
 * @name OffresManagement
 *
 * Ce composant constitue le point central de gestion des offres sportives des Jeux Olympiques.
 * Il orchestre l'ensemble des fonctionnalités CRUD (Create, Read, Update, Delete) avec une
 * interface utilisateur complète incluant tableau de données, modal de saisie, notifications
 * de feedback et gestion d'état centralisée. Il assure la coordination entre tous les
 * sous-composants du module offres.
 *
 * ## Architecture et responsabilités
 *
 * ### Composant orchestrateur central
 * - **Coordination générale** : Gère tous les sous-composants offres
 * - **État centralisé** : Point unique de vérité pour données offres
 * - **Flux d'événements** : Centralise callbacks et actions utilisateur
 * - **Session management** : Surveillance expiration session utilisateur
 * - **Layout complet** : Structure complète page gestion offres
 *
 * ### Gestion des données et hooks
 * - **useOffresManagement** : Hook métier pour opérations CRUD offres
 * - **useSessionExpiry** : Protection contre expiration session
 * - **État local** : Gestion modal, édition, notifications
 * - **Synchronisation** : Coordination état local/distant
 * - **Error handling** : Gestion centralisée des erreurs
 *
 * ## Fonctionnalités CRUD complètes
 *
 * ### Création d'offres
 * - **Déclenchement** : Bouton "Nouvelle Offre" dans OffresHeader
 * - **Interface** : OffresModal en mode création (editingOffre = null)
 * - **Validation** : Champs requis et formats contrôlés dans modal
 * - **Sauvegarde** : Appel createOffre() du hook avec données formulaire
 * - **Feedback** : Notification succès "Offre créée avec succès"
 * - **Rafraîchissement** : Liste automatiquement mise à jour
 *
 * ### Lecture et affichage (Read)
 * - **Source données** : Hook useOffresManagement fournit liste offres
 * - **Affichage** : OffresTable avec colonnes spécialisées
 * - **États système** : Loading, error, empty gérés dans table
 *
 * ### Modification d'offres (Update)
 * - **Déclenchement** : Bouton "Modifier" dans OffresTableRow
 * - **Interface** : OffresModal pré-remplie avec données existantes
 * - **Mode édition** : editingOffre contient offre à modifier
 * - **Sauvegarde** : Appel updateOffre() avec ID et nouvelles données
 * - **Feedback** : Notification succès "Offre modifiée avec succès"
 *
 * ### Suppression d'offres (Delete)
 * - **Déclenchement** : Bouton "Supprimer" dans OffresTableRow
 * - **Confirmation** : Dialog native avec nom de l'offre
 * - **Protection** : Confirmation obligatoire avant suppression
 * - **Suppression** : Appel deleteOffre() avec ID offre
 * - **Feedback** : Notification succès "Offre supprimée avec succès"
 *
 * ## Gestion des états d'interface
 *
 * ### États modaux
 * - **showModal** : Contrôle visibilité OffresModal
 * - **editingOffre** : Offre en cours d'édition ou null pour création
 * - **Ouverture** : handleOpenModal() avec offre optionnelle
 * - **Fermeture** : handleCloseModal() avec nettoyage état
 * - **Mode dynamique** : Modal s'adapte selon editingOffre
 *
 * ### Système de notifications
 * - **notification state** : Objet {message, type} ou null
 * - **Types supportés** : 'success', 'error', 'info'
 * - **Durée** : 1000ms d'affichage automatique
 * - **Auto-dismiss** : Fermeture automatique après durée
 * - **Position** : Overlay global au-dessus du contenu
 *
 * ### États de chargement
 * - **loading** : État chargement liste offres (useOffresManagement)
 * - **formLoading** : État chargement opérations CRUD modal
 * - **error** : Messages d'erreur de chargement données
 * - **Spinner** : Affichage conditionnel selon états
 *
 * ## Flux d'interactions utilisateur
 *
 * ### Parcours création offre
 * 1. **Clic "Nouvelle Offre"** → handleOpenModal() sans paramètre
 * 2. **Modal s'ouvre** → OffresModal mode création (editingOffre = null)
 * 3. **Saisie données** → Validation temps réel dans modal
 * 4. **Soumission** → handleSaveOffre() avec données formulaire
 * 5. **Création API** → createOffre() via hook
 * 6. **Succès** → Modal ferme, notification affichée, liste rafraîchie
 * 7. **Erreur** → Modal ferme, notification erreur affichée
 *
 * ### Parcours modification offre
 * 1. **Clic "Modifier"** → handleOpenModal(offre) avec objet complet
 * 2. **Modal s'ouvre** → OffresModal pré-remplie (editingOffre = offre)
 * 3. **Modification données** → Champs modifiables avec valeurs actuelles
 * 4. **Soumission** → handleSaveOffre() avec données modifiées
 * 5. **Update API** → updateOffre() avec ID et nouvelles données
 * 6. **Succès** → Modal ferme, notification succès, liste mise à jour
 * 7. **Erreur** → Modal ferme, notification erreur affichée
 *
 * ### Parcours suppression offre
 * 1. **Clic "Supprimer"** → handleDeleteOffre(id) avec identifiant
 * 2. **Recherche offre** → Récupération nom pour confirmation
 * 3. **Dialog confirmation** → window.confirm() avec nom offre
 * 4. **Confirmation** → deleteOffre() via hook
 * 5. **Succès** → Notification succès, liste automatiquement mise à jour
 * 6. **Erreur** → Notification erreur, offre reste présente
 * 7. **Annulation** → Aucune action, retour état précédent
 *
 * ## Gestion d'erreurs et feedback
 *
 * ### Types d'erreurs gérées
 * - **Erreurs réseau** : Échec appels API (création/modification/suppression)
 * - **Erreurs validation** : Gérées dans OffresModal (champs requis)
 * - **Erreurs système** : Gestion générique avec try/catch
 * - **Session expirée** : Détection et redirection automatique
 *
 * ### Système de feedback utilisateur
 * - **Notifications succès** : Confirmation actions réussies (vert)
 * - **Notifications erreur** : Signalement problèmes (rouge)
 * - **Messages contextuels** : Textes adaptés à chaque action
 * - **Durée optimisée** : 1000ms pour lecture sans obstruction
 * - **Position fixe** : Overlay non-intrusif
 *
 * ## Intégration hooks et services
 *
 * ### Hook useOffresManagement
 * - **Données** : offres, loading, error pour état global
 * - **Actions** : createOffre, updateOffre, deleteOffre pour CRUD
 * - **Chargement** : formLoading pour états modaux
 * - **Notifications** : setFormNotification pour feedback formulaires
 * - **Synchronisation** : Mise à jour automatique après opérations
 *
 * ### Hook useSessionExpiry
 * - **Surveillance** : Détection expiration session utilisateur
 * - **Redirection** : Automatique vers login si session expirée
 * - **Sécurité** : Protection données sensibles
 * - **Transparence** : Fonctionnement invisible pour utilisateur
 *
 * ## Performance et optimisations
 *
 * ### Optimisations actuelles
 * - **Client component** : 'use client' pour interactivité
 * - **État minimal** : Variables d'état ciblées et nécessaires
 * - **Callbacks optimisés** : Fonctions stables entre re-renders
 * - **Conditional rendering** : Affichage conditionnel modal/notifications
 * - **Hook spécialisé** : Logique métier externalisée
 *
 * ### Gestion re-renders
 * - **État local isolé** : showModal, editingOffre, notification séparés
 * - **Callbacks stables** : Fonctions handler réutilisables
 * - **Props drilling minimal** : Transmission ciblée vers enfants
 * - **Effect cleanup** : Nettoyage état lors fermeture modal
 *
 * ## Sécurité et validation
 *
 * ### Aspects sécuritaires
 * - **Session monitoring** : useSessionExpiry pour protection
 * - **Confirmation suppression** : Dialog avant action destructive
 * - **Validation côté client** : Contrôles dans OffresModal
 * - **Error handling** : Gestion sécurisée des exceptions
 *
 * ### Validation des données
 * - **Champs requis** : Libellé obligatoire pour création/modification
 * - **Types numériques** : Contrôle nb_personne et montant
 * - **Valeurs minimales** : nb_personne >= 1, montant >= 0
 * - **Formats** : Validation montant avec 2 décimales maximum
 *
 * @returns {JSX.Element} Interface complète de gestion des offres avec CRUD et notifications
 *
 * @see {@link OffresHeader} - En-tête avec titre et bouton création
 * @see {@link OffresTable} - Tableau d'affichage et actions des offres
 * @see {@link OffresModal} - Modal de création/édition des offres
 * @see {@link useOffresManagement} - Hook métier pour opérations CRUD
 * @see {@link useSessionExpiry} - Hook de surveillance de session
 * @see {@link Notification} - Composant de feedback utilisateur
 */
import { useState } from 'react';
import { useOffreManagement } from '@/hooks/useOffreManagement';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Offre } from '@/types/offre/offre';
import Notification from '@/components/notification';
import OffresHeader from "@/components/componentOffre/OffresHeader";
import OffreModal from "@/components/componentOffre/OffresModal";
import OffresTable from "@/components/componentOffre/OffresTable";

export function OffresManagement() {
  useSessionExpiry();

  const {
    offres,
    loading,
    error,
    formLoading,
    createOffre,
    updateOffre,
    deleteOffre,
    setFormNotification,
  } = useOffreManagement();

  const [showModal, setShowModal] = useState(false);
  const [editingOffre, setEditingOffre] = useState<Offre | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleOpenModal = (offre?: Offre) => {
    setEditingOffre(offre || null);
    setShowModal(true);
  };

  const handleSaveOffre = async (offreData: Offre) => {
    try {
      let successMessage = '';

      if (editingOffre) {
        await updateOffre(editingOffre.id, offreData);
        successMessage = 'Offre modifiée avec succès';
      } else {
        await createOffre(offreData);
        successMessage = 'Offre créée avec succès';
      }

      // Fermer la modal
      setShowModal(false);
      setEditingOffre(null);

      // Afficher directement la notification de succès
      setNotification({
        message: successMessage,
        type: 'success'
      });
    } catch (err) {
      console.error(err);
      // En cas d'erreur, fermer la modal et afficher l'erreur
      setShowModal(false);
      setEditingOffre(null);
      setNotification({
        message: 'Erreur lors de la sauvegarde',
        type: 'error'
      });
    }
  };

  const handleDeleteOffre = async (id: number) => {
    // Trouver l'offre à supprimer pour afficher son nom dans la confirmation
    const offreToDelete = offres.find((offre: Offre) => offre.id === id);
    const offreName = offreToDelete ? offreToDelete.libelle : 'cette offre';

    // Demander confirmation avant suppression
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'offre "${offreName}" ?`)) {
      try {
        await deleteOffre(id);
        // Afficher directement la notification de succès
        setNotification({
          message: 'Offre supprimée avec succès',
          type: 'success'
        });
      } catch (err) {
        console.error(err);
        // Afficher la notification d'erreur
        setNotification({
          message: 'Erreur lors de la suppression',
          type: 'error'
        });
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOffre(null);
    // Nettoyer formNotification sans l'afficher (cas d'annulation)
    setFormNotification(null);
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <OffresHeader
        onCreateClick={() => handleOpenModal()}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Offres Table */}
        <OffresTable
          offres={offres}
          loading={loading}
          onDelete={handleDeleteOffre}
          onEdit={(offre: Offre) => handleOpenModal(offre)}
          error={error}
        />
      </main>

      <OffreModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveOffre}
        loading={formLoading}
        offre={editingOffre || undefined}
      />

      {notification && (
        <Notification
          title="Gestion Offres"
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
export default OffresManagement;
