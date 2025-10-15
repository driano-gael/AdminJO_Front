'use client';

/**
 * Composant EpreuvesManagement - Gestionnaire principal des épreuves sportives olympiques AdminJO
 *
 * @name EpreuvesManagement
 *
 * Ce composant constitue le point central de gestion des épreuves sportives des Jeux Olympiques.
 * Il orchestre l'ensemble des fonctionnalités CRUD (Create, Read, Update, Delete) avec recherche
 * avancée ET filtrage par discipline, interface utilisateur complète incluant tableau de données,
 * modal de saisie avec sélection de disciplines, notifications de feedback et gestion d'état
 * centralisée. Il assure la coordination entre tous les sous-composants du module épreuves avec
 * navigation contextuelle et fonctionnalités de filtrage multicritères.
 *
 * ## Architecture et responsabilités avancées épreuves
 *
 * ### Composant orchestrateur central avec filtrage multicritères
 * - **Coordination générale** : Gère tous les sous-composants épreuves
 * - **État centralisé** : Point unique de vérité pour données épreuves + disciplines
 * - **Flux d'événements** : Centralise callbacks et actions utilisateur
 * - **Session management** : Surveillance expiration session utilisateur
 * - **Layout complet** : Structure complète page gestion épreuves
 * - **Recherche + filtres** : Système recherche textuelle + filtre discipline
 * - **Relations disciplines** : Gestion liens épreuves ↔ disciplines
 *
 * ### Gestion des données et hooks spécialisés épreuves
 * - **useEpreuvesManagement** : Hook métier pour opérations CRUD épreuves + filtres
 * - **useSessionExpiry** : Protection contre expiration session
 * - **État local** : Gestion modal, édition, notifications
 * - **Synchronisation** : Coordination état local/distant avec recherche + filtre
 * - **Error handling** : Gestion centralisée erreurs création/modification
 * - **Search + filter state** : Terme recherche ET discipline sélectionnée
 * - **Données relationnelles** : Épreuves + disciplines chargées simultanément
 *
 * ## Fonctionnalités CRUD complètes avec filtrage avancé
 *
 * ### Création d'épreuves (Create)
 * - **Déclenchement** : Bouton "Nouvelle Épreuve" dans EpreuvesHeader
 * - **Interface** : EpreuveModal en mode création (editingEpreuve = null)
 * - **Validation** : Nom requis + discipline obligatoire + paramètres optionnels
 * - **Sauvegarde** : Appel createEpreuve() du hook avec CreateEpreuveRequest
 * - **Feedback** : Notification succès "Épreuve créée avec succès !"
 * - **Rafraîchissement** : Liste mise à jour avec filtres préservés
 * - **Relation discipline** : Association épreuve ↔ discipline via modal
 *
 * ### Lecture et affichage avec filtrage multicritères
 * - **Source données** : Hook useEpreuvesManagement fournit épreuves + disciplines
 * - **Affichage** : EpreuvesTable avec colonnes spécialisées (nom, discipline, actions)
 * - **États système** : Loading, error, empty gérés dans table
 * - **Recherche textuelle** : SearchAndFilters avec terme persistant
 * - **Filtre discipline** : Dropdown discipline avec selectedDisciplineId
 * - **Refresh intelligent** : handleRefresh préserve recherche ET filtre discipline
 * - **Pagination** : Toutes épreuves affichées avec filtrage côté client/serveur
 *
 * ### Modification d'épreuves (Update)
 * - **Déclenchement** : Bouton "Modifier" dans EpreuvesTableRow
 * - **Interface** : EpreuveModal pré-remplie avec données existantes
 * - **Mode édition** : editingEpreuve contient épreuve à modifier
 * - **Sauvegarde** : Appel updateEpreuve() avec ID et nouvelles données
 * - **Feedback** : Notification succès "Épreuve modifiée avec succès !"
 * - **Préservation** : Recherche et filtres maintenus après modification
 * - **Relation discipline** : Modification association épreuve ↔ discipline possible
 *
 * ### Suppression d'épreuves (Delete)
 * - **Déclenchement** : Bouton "Supprimer" dans EpreuvesTableRow
 * - **Sécurité** : Confirmation implicite (gérée par composant table)
 * - **Suppression** : Appel deleteEpreuve() avec ID épreuve
 * - **Feedback** : Notification succès "Épreuve supprimée avec succès !"
 * - **Gestion erreur** : Notification erreur si échec suppression
 * - **État préservé** : Recherche et filtres maintenus après suppression
 *
 * ## Gestion avancée des états d'interface avec filtres
 *
 * ### États modaux avec gestion d'erreurs
 * - **showModal** : Contrôle visibilité EpreuveModal
 * - **editingEpreuve** : Épreuve en cours d'édition ou null pour création
 * - **Ouverture** : handleOpenModal() avec épreuve optionnelle
 * - **Fermeture** : Fermeture avec nettoyage état ET erreurs (setCreateError(null))
 * - **Error cleanup** : Nettoyage erreurs création lors fermeture
 * - **Disciplines** : Liste disciplines transmise à modal pour sélection
 *
 * ### Système de notifications contextuelles
 * - **notification state** : Objet {message, type} ou null
 * - **Types supportés** : 'success', 'error', 'info'
 * - **Messages contextuels** : Textes spécialisés par action épreuves
 * - **Auto-dismiss** : Fermeture manuelle par utilisateur
 * - **Position** : Overlay global au-dessus du contenu
 * - **Feedback riche** : Confirmation visuelle de toutes les opérations
 *
 * ### États de chargement spécialisés épreuves
 * - **loading** : État chargement liste épreuves
 * - **createLoading** : État chargement opérations CUD spécifiques
 * - **error** : Messages d'erreur de chargement données
 * - **createError** : Erreurs spécifiques création/modification
 * - **Granularité** : États séparés pour différentes opérations
 *
 * ## Recherche et filtrage multicritères avancé
 *
 * ### Système de recherche + filtres intégré
 * - **Composant** : SearchAndFilters dédié à recherche + filtre discipline
 * - **Recherche textuelle** : searchTerm via hook useEpreuvesManagement
 * - **Filtre discipline** : selectedDisciplineId pour filtrage par discipline
 * - **Données disciplines** : Liste disciplines chargée pour dropdown
 * - **Callbacks** : handleSearch() et handleDisciplineFilter() distincts
 * - **Persistance** : Recherche ET filtre préservés entre opérations CRUD
 * - **UX optimisée** : Filtrage sans perte de contexte
 *
 * ### Logique de rafraîchissement contextuel avancée
 * - **Paramètres multiples** : loadEpreuves(searchTerm, selectedDisciplineId)
 * - **Recherche conditionnelle** : searchTerm.trim() || undefined pour API
 * - **Filtre discipline** : selectedDisciplineId transmis à API
 * - **Déclencheurs** : Bouton refresh, après opérations CRUD
 * - **Cohérence** : État recherche ET filtre toujours synchronisés
 * - **Performance** : Une seule requête pour critères multiples
 *
 * ## Flux d'interactions utilisateur avancés épreuves
 *
 * ### Parcours création épreuve avec discipline
 * 1. **Clic "Nouvelle Épreuve"** → handleOpenModal() sans paramètre
 * 2. **Modal s'ouvre** → EpreuveModal mode création (editingEpreuve = null)
 * 3. **Saisie données** → Nom + sélection discipline + paramètres épreuve
 * 4. **Soumission** → handleSaveEpreuve() avec CreateEpreuveRequest
 * 5. **Création API** → createEpreuve() via hook spécialisé
 * 6. **Succès** → Modal ferme, notification succès, liste rafraîchie avec filtres
 * 7. **Erreur** → Erreur affichée dans modal, modal reste ouverte
 *
 * ### Parcours modification épreuve
 * 1. **Clic "Modifier"** → handleOpenModal(epreuve) avec objet complet
 * 2. **Modal s'ouvre** → EpreuveModal pré-remplie (editingEpreuve = epreuve)
 * 3. **Modification données** → Nom, discipline et paramètres modifiables
 * 4. **Soumission** → handleSaveEpreuve() avec données modifiées
 * 5. **Update API** → updateEpreuve() avec ID et nouvelles données
 * 6. **Succès** → Modal ferme, notification succès, liste mise à jour
 * 7. **Erreur** → Gestion via hook, modal peut rester ouverte
 *
 * ### Parcours suppression épreuve
 * 1. **Clic "Supprimer"** → handleDeleteEpreuve(id) avec identifiant
 * 2. **Suppression directe** → deleteEpreuve() via hook (confirmation dans table)
 * 3. **Succès** → Notification succès, liste automatiquement mise à jour
 * 4. **Erreur** → try/catch avec notification erreur générique
 * 5. **Filtres préservés** : Recherche et discipline maintenues après suppression
 *
 * ### Parcours recherche + filtres épreuve
 * 1. **Saisie recherche** → SearchAndFilters capture terme
 * 2. **Sélection discipline** → SearchAndFilters capture selectedDisciplineId
 * 3. **Callbacks distincts** → handleSearch() et handleDisciplineFilter()
 * 4. **Mise à jour liste** → Épreuves filtrées selon critères multiples
 * 5. **Opérations CRUD** → Filtres préservés pendant toutes opérations
 * 6. **Refresh** → handleRefresh() respecte tous critères actifs
 *
 * ## Gestion d'erreurs et feedback avancée
 *
 * ### Types d'erreurs gérées avec granularité
 * - **Erreurs réseau** : Échec appels API (création/modification/suppression)
 * - **Erreurs validation** : Gérées dans EpreuveModal (nom + discipline requis)
 * - **Erreurs création** : createError spécifique avec affichage modal
 * - **Erreurs système** : Gestion générique avec try/catch
 * - **Session expirée** : Détection et redirection automatique
 * - **Erreurs relations** : Problèmes liens épreuves ↔ disciplines
 *
 * ### Système de feedback utilisateur contextuel
 * - **Notifications succès** : Messages spécifiques par action réussie
 * - **Notifications erreur** : Messages génériques pour échecs
 * - **Messages contextuels** : "Épreuve créée/modifiée/supprimée avec succès !"
 * - **Fermeture manuelle** : Pas d'auto-dismiss, contrôle utilisateur
 * - **Position fixe** : Overlay non-intrusif
 * - **Feedback modal** : Erreurs création affichées dans modal
 *
 * ## Intégration hooks et services spécialisés épreuves
 *
 * ### Hook useEpreuvesManagement avancé
 * - **Données épreuves** : epreuves, searchTerm, selectedDisciplineId, loading, error
 * - **Données disciplines** : disciplines pour filtrage et modal
 * - **Actions CRUD** : createEpreuve, updateEpreuve, deleteEpreuve
 * - **Recherche + filtres** : handleSearch, handleDisciplineFilter, loadEpreuves
 * - **Chargement spécialisé** : createLoading, createError pour opérations
 * - **Gestion état** : setCreateError pour nettoyage erreurs
 * - **Synchronisation** : Mise à jour automatique après opérations
 * - **Relations** : Gestion liens épreuves ↔ disciplines
 *
 * ### Hook useSessionExpiry
 * - **Surveillance** : Détection expiration session utilisateur
 * - **Redirection** : Automatique vers login si session expirée
 * - **Sécurité** : Protection données sensibles épreuves
 * - **Transparence** : Fonctionnement invisible pour utilisateur
 *
 * ## Sécurité et validation avancée
 *
 * ### Aspects sécuritaires
 * - **Session monitoring** : useSessionExpiry pour protection
 * - **Validation côté client** : Contrôles dans EpreuveModal
 * - **Error handling** : Gestion sécurisée des exceptions
 * - **Input sanitization** : Validation nom épreuve + discipline
 * - **Relations sécurisées** : Validation liens épreuves ↔ disciplines
 *
 * ### Validation des données épreuves
 * - **Champs requis** : Nom épreuve ET discipline obligatoires
 * - **Relation discipline** : selectedDisciplineId validé
 * - **Format nom** : Validation longueur et caractères autorisés
 * - **Unicité** : Gestion conflits noms par discipline (côté serveur)
 * - **Cohérence** : Validation cohérence épreuve ↔ discipline
 *
 * @returns {JSX.Element} Interface complète de gestion des épreuves avec CRUD, recherche, filtres et notifications
 *
 * @see {@link EpreuvesHeader} - En-tête avec navigation et bouton création
 * @see {@link SearchAndFilters} - Composant de recherche + filtres disciplines
 * @see {@link EpreuvesTable} - Tableau d'affichage et actions des épreuves
 * @see {@link EpreuveModal} - Modal de création/édition des épreuves
 * @see {@link useEpreuvesManagement} - Hook métier pour opérations CRUD + filtres
 * @see {@link useSessionExpiry} - Hook de surveillance de session
 * @see {@link Notification} - Composant de feedback utilisateur
 *
 */
import { useState } from 'react';
import { useEpreuvesManagement } from '@/hooks/useEpreuvesManagement';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { CreateEpreuveRequest } from '@/lib/api/services/evenementSports/epreuveService';
import Notification from '@/components/notification';
import EpreuvesHeader from './EpreuvesHeader';
import SearchAndFilters from './SearchAndFilters';
import EpreuvesTable from './EpreuvesTable';
import EpreuveModal from './EpreuveModal';

export function EpreuvesManagement() {
  useSessionExpiry();

  const {
    epreuves,
    disciplines,
    searchTerm,
    selectedDisciplineId,
    loading,
    error,
    createLoading,
    createError,
    loadEpreuves,
    createEpreuve,
    updateEpreuve,
    deleteEpreuve,
    handleSearch,
    handleDisciplineFilter,
    setCreateError
  } = useEpreuvesManagement();

  const [showModal, setShowModal] = useState(false);
  const [editingEpreuve, setEditingEpreuve] = useState<Epreuve | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleOpenModal = (epreuve?: Epreuve) => {
    setEditingEpreuve(epreuve || null);
    setShowModal(true);
  };

  // Fonction pour actualiser les données en gardant les filtres actuels
  const handleRefresh = () => {
    loadEpreuves(
      searchTerm.trim() || undefined, 
      selectedDisciplineId
    );
  };

  const handleSaveEpreuve = async (epreuveData: CreateEpreuveRequest) => {
    try {
      if (editingEpreuve) {
        await updateEpreuve(editingEpreuve.id, epreuveData);
        setNotification({
          message: 'Épreuve modifiée avec succès !',
          type: 'success'
        });
      } else {
        // Mode création
        await createEpreuve(epreuveData);
        setNotification({
          message: 'Épreuve créée avec succès !',
          type: 'success'
        });
      }
      setShowModal(false);
      setEditingEpreuve(null);
    } catch {
      // L'erreur est déjà gérée dans le hook
    }
  };

  // Fonction pour supprimer une épreuve
  const handleDeleteEpreuve = async (id: number) => {
    try {
      await deleteEpreuve(id);
      setNotification({
        message: 'Épreuve supprimée avec succès !',
        type: 'success'
      });
    } catch {
      setNotification({
        message: 'Erreur lors de la suppression de l\'épreuve',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <EpreuvesHeader 
        onCreateClick={() => handleOpenModal()}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          selectedDisciplineId={selectedDisciplineId}
          disciplines={disciplines}
          onSearch={handleSearch}
          onDisciplineFilter={handleDisciplineFilter}
        />

        {/* Epreuves Table */}
        <EpreuvesTable
          epreuves={epreuves}
          loading={loading}
          searchTerm={searchTerm}
          onRefresh={handleRefresh}
          onDelete={handleDeleteEpreuve}
          onEdit={(epreuve) => handleOpenModal(epreuve)}
          error={error}
        />
      </main>
      
      <EpreuveModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEpreuve(null);
          setCreateError(null);
        }}
        onSave={handleSaveEpreuve}
        loading={createLoading}
        error={createError}
        epreuve={editingEpreuve || undefined}
        disciplines={disciplines}
      />
      
      {notification && (
        <Notification
          title="Gestion Épreuves"
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
export default EpreuvesManagement;
