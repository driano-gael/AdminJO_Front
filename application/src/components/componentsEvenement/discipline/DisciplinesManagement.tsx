'use client';

/**
 * Composant DisciplinesManagement - Gestionnaire principal des disciplines sportives olympiques AdminJO
 *
 * @name DisciplinesManagement
 *
 * Ce composant constitue le point central de gestion des disciplines sportives des Jeux Olympiques.
 * Il orchestre l'ensemble des fonctionnalités CRUD (Create, Read, Update, Delete) avec recherche
 * avancée, interface utilisateur complète incluant tableau de données, modal de saisie avec
 * sélection d'icônes, notifications de feedback et gestion d'état centralisée. Il assure la
 * coordination entre tous les sous-composants du module disciplines avec navigation contextuelle.
 *
 * ## Architecture et responsabilités avancées
 *
 * ### Composant orchestrateur central avec recherche
 * - **Coordination générale** : Gère tous les sous-composants disciplines
 * - **État centralisé** : Point unique de vérité pour données disciplines
 * - **Flux d'événements** : Centralise callbacks et actions utilisateur
 * - **Session management** : Surveillance expiration session utilisateur
 * - **Layout complet** : Structure complète page gestion disciplines
 * - **Recherche intégrée** : Système de recherche avec terme persistant
 *
 * ### Gestion des données et hooks spécialisés
 * - **useDisciplinesManagement** : Hook métier pour opérations CRUD disciplines
 * - **useSessionExpiry** : Protection contre expiration session
 * - **État local** : Gestion modal, édition, notifications
 * - **Synchronisation** : Coordination état local/distant avec recherche
 * - **Error handling** : Gestion centralisée des erreurs création/modification
 * - **Search state** : Terme de recherche géré par hook dédié
 *
 * ## Fonctionnalités CRUD complètes avec recherche
 *
 * ### Création de disciplines (Create)
 * - **Déclenchement** : Bouton "Nouvelle Discipline" dans DisciplinesHeader
 * - **Interface** : DisciplineModal en mode création (editingDiscipline = null)
 * - **Validation** : Nom requis et sélection icône optionnelle
 * - **Sauvegarde** : Appel createDiscipline() du hook avec CreateDisciplineRequest
 * - **Feedback** : Notification succès "Discipline créée avec succès !"
 * - **Rafraîchissement** : Liste automatiquement mise à jour avec recherche préservée
 *
 * ### Lecture et affichage avec recherche (Read)
 * - **Source données** : Hook useDisciplinesManagement fournit liste disciplines
 * - **Affichage** : DisciplinesTable avec colonnes spécialisées (nom, icône, actions)
 * - **États système** : Loading, error, empty gérés dans table
 * - **Recherche** : SearchAndFilters avec terme persistant entre opérations
 * - **Refresh intelligent** : handleRefresh préserve terme recherche actuel
 *
 * ### Modification de disciplines (Update)
 * - **Déclenchement** : Bouton "Modifier" dans DisciplinesTableRow
 * - **Interface** : DisciplineModal pré-remplie avec données existantes
 * - **Mode édition** : editingDiscipline contient discipline à modifier
 * - **Sauvegarde** : Appel updateDiscipline() avec ID et nouvelles données
 * - **Feedback** : Notification succès "Discipline modifiée avec succès !"
 * - **Préservation** : Recherche et position dans liste maintenues
 *
 * ### Suppression de disciplines (Delete)
 * - **Déclenchement** : Bouton "Supprimer" dans DisciplinesTableRow
 * - **Sécurité** : Confirmation implicite (gérée par composant table)
 * - **Suppression** : Appel deleteDiscipline() avec ID discipline
 * - **Feedback** : Notification succès "Discipline supprimée avec succès !"
 * - **Gestion erreur** : Notification erreur si échec suppression
 * - **État préservé** : Recherche maintenue après suppression
 *
 * ## Gestion avancée des états d'interface
 *
 * ### États modaux avec gestion d'erreurs
 * - **showModal** : Contrôle visibilité DisciplineModal
 * - **editingDiscipline** : Discipline en cours d'édition ou null pour création
 * - **Ouverture** : handleOpenModal() avec discipline optionnelle
 * - **Fermeture** : Fermeture avec nettoyage état ET erreurs (setCreateError(null))
 * - **Mode dynamique** : Modal s'adapte selon editingDiscipline
 * - **Error cleanup** : Nettoyage erreurs création lors fermeture
 *
 * ### Système de notifications contextuelles
 * - **notification state** : Objet {message, type} ou null
 * - **Types supportés** : 'success', 'error', 'info'
 * - **Messages contextuels** : Textes spécialisés par action
 * - **Auto-dismiss** : Fermeture manuelle par utilisateur
 * - **Position** : Overlay global au-dessus du contenu
 * - **Feedback riche** : Confirmation visuelle de toutes les opérations
 *
 * ### États de chargement spécialisés
 * - **loading** : État chargement liste disciplines (lecture)
 * - **createLoading** : État chargement opérations CUD spécifiques
 * - **error** : Messages d'erreur de chargement données
 * - **createError** : Erreurs spécifiques création/modification
 *
 * ## Recherche et filtrage avancé
 *
 * ### Système de recherche intégré
 * - **Composant** : SearchAndFilters dédié à la recherche
 * - **État géré** : searchTerm via hook useDisciplinesManagement
 * - **Callback** : handleSearch() pour mise à jour terme
 * - **Persistance** : Terme préservé entre opérations CRUD
 * - **Refresh intelligent** : handleRefresh() respecte recherche active
 * - **UX optimisée** : Recherche sans perte de contexte
 *
 * ### Logique de rafraîchissement contextuel
 * - **Condition** : if (searchTerm.trim()) pour détecter recherche active
 * - **Avec recherche** : loadDisciplines(searchTerm) pour maintenir filtre
 * - **Sans recherche** : loadDisciplines() pour chargement complet
 * - **Déclencheurs** : Bouton refresh, après opérations CRUD
 * - **Cohérence** : État recherche toujours synchronisé
 *
 * ## Flux d'interactions utilisateur avancés
 *
 * ### Parcours création discipline
 * 1. **Clic "Nouvelle Discipline"** → handleOpenModal() sans paramètre
 * 2. **Modal s'ouvre** → DisciplineModal mode création (editingDiscipline = null)
 * 3. **Saisie données** → Nom + sélection icône sportive optionnelle
 * 4. **Soumission** → handleSaveDiscipline() avec CreateDisciplineRequest
 * 5. **Création API** → createDiscipline() via hook spécialisé
 * 6. **Succès** → Modal ferme, notification succès, liste rafraîchie avec recherche
 * 7. **Erreur** → Erreur affichée dans modal, modal reste ouverte
 *
 * ### Parcours modification discipline
 * 1. **Clic "Modifier"** → handleOpenModal(discipline) avec objet complet
 * 2. **Modal s'ouvre** → DisciplineModal pré-remplie (editingDiscipline = discipline)
 * 3. **Modification données** → Nom et icône modifiables avec valeurs actuelles
 * 4. **Soumission** → handleSaveDiscipline() avec données modifiées
 * 5. **Update API** → updateDiscipline() avec ID et nouvelles données
 * 6. **Succès** → Modal ferme, notification succès, liste mise à jour
 * 7. **Erreur** → Gestion via hook, modal peut rester ouverte
 *
 * ### Parcours suppression discipline
 * 1. **Clic "Supprimer"** → handleDeleteDiscipline(id) avec identifiant
 * 2. **Suppression directe** → deleteDiscipline() via hook (confirmation dans table)
 * 3. **Succès** → Notification succès, liste automatiquement mise à jour
 * 4. **Erreur** → try/catch avec notification erreur générique
 *
 * ### Parcours recherche discipline
 * 1. **Saisie recherche** → SearchAndFilters capture terme
 * 2. **Callback search** → handleSearch() met à jour état via hook
 * 3. **Mise à jour liste** → Disciplines filtrées selon terme
 * 4. **Opérations CRUD** → Recherche préservée pendant toutes opérations
 * 5. **Refresh** → handleRefresh() respecte terme actuel
 *
 * ## Gestion d'erreurs et feedback avancée
 *
 * ### Types d'erreurs gérées avec granularité
 * - **Erreurs réseau** : Échec appels API (création/modification/suppression)
 * - **Erreurs validation** : Gérées dans DisciplineModal (nom requis)
 * - **Erreurs création** : createError spécifique avec affichage modal
 * - **Erreurs système** : Gestion générique avec try/catch
 * - **Session expirée** : Détection et redirection automatique
 * - **Erreurs recherche** : Gérées par hook dédié
 *
 * ### Système de feedback utilisateur contextuel
 * - **Notifications succès** : Messages spécifiques par action réussie
 * - **Notifications erreur** : Messages génériques pour échecs
 * - **Messages contextuels** : "Discipline créée/modifiée/supprimée avec succès !"
 * - **Fermeture manuelle** : Pas d'auto-dismiss, contrôle utilisateur
 * - **Feedback modal** : Erreurs création affichées dans modal
 *
 * ## Intégration hooks et services spécialisés
 *
 * ### Hook useDisciplinesManagement avancé
 * - **Données** : disciplines, searchTerm, loading, error pour état global
 * - **Actions CRUD** : createDiscipline, updateDiscipline, deleteDiscipline
 * - **Recherche** : handleSearch, loadDisciplines avec terme optionnel
 * - **Chargement spécialisé** : createLoading, createError pour opérations
 * - **Gestion état** : setCreateError pour nettoyage erreurs
 * - **Synchronisation** : Mise à jour automatique après opérations
 *
 * ### Hook useSessionExpiry
 * - **Surveillance** : Détection expiration session utilisateur
 * - **Redirection** : Automatique vers login si session expirée
 * - **Sécurité** : Protection données sensibles disciplines
 * - **Transparence** : Fonctionnement invisible pour utilisateur
 *
 * ## Performance et optimisations avancées
 *
 * ### Optimisations actuelles
 * - **Client component** : 'use client' pour interactivité complète
 * - **État minimal** : Variables d'état ciblées et nécessaires
 * - **Callbacks optimisés** : Fonctions stables entre re-renders
 * - **Conditional rendering** : Affichage conditionnel modal/notifications
 * - **Hook spécialisé** : Logique métier externalisée avec recherche
 * - **Refresh intelligent** : Préservation contexte recherche
 *
 * ### Gestion re-renders optimisée
 * - **État local isolé** : showModal, editingDiscipline, notification séparés
 * - **Callbacks stables** : Fonctions handler réutilisables
 * - **Effect cleanup** : Nettoyage état lors fermeture modal avec erreurs
 * - **Search persistence** : Terme recherche stable entre opérations
 *
 * ## Sécurité et validation avancée
 *
 * ### Aspects sécuritaires
 * - **Session monitoring** : useSessionExpiry pour protection
 * - **Validation côté client** : Contrôles dans DisciplineModal
 * - **Error handling** : Gestion sécurisée des exceptions
 * - **Type safety** : Interfaces TypeScript strictes
 * - **Input sanitization** : Validation nom discipline
 *
 * ### Validation des données
 * - **Champ requis** : Nom discipline obligatoire pour création/modification
 * - **Icône optionnelle** : Sélection icône sportive non obligatoire
 * - **Format nom** : Validation longueur et caractères autorisés
 * - **Unicité** : Gestion conflits noms (côté serveur attendue)
 *
 * @returns {JSX.Element} Interface complète de gestion des disciplines avec CRUD, recherche et notifications
 *
 * @see {@link DisciplinesHeader} - En-tête avec navigation et bouton création
 * @see {@link SearchAndFilters} - Composant de recherche disciplines
 * @see {@link DisciplinesTable} - Tableau d'affichage et actions des disciplines
 * @see {@link DisciplineModal} - Modal de création/édition des disciplines
 * @see {@link useDisciplinesManagement} - Hook métier pour opérations CRUD
 * @see {@link useSessionExpiry} - Hook de surveillance de session
 * @see {@link Notification} - Composant de feedback utilisateur
 *
 */
import { useState } from 'react';
import { useDisciplinesManagement } from '@/hooks/useDisciplinesManagement';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Discipline } from '@/types/sportEvenement/discipline';
import { CreateDisciplineRequest } from '@/lib/api/services/evenementSports/disciplineService';
import Notification from '@/components/notification';
import DisciplinesHeader from './DisciplinesHeader';
import SearchAndFilters from './SearchAndFilters';
import DisciplinesTable from './DisciplinesTable';
import DisciplineModal from './DisciplineModal';

export function DisciplinesManagement() {
  useSessionExpiry();

  const {
    disciplines,
    searchTerm,
    loading,
    error,
    createLoading,
    createError,
    loadDisciplines,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
    handleSearch,
    setCreateError
  } = useDisciplinesManagement();

  const [showModal, setShowModal] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleOpenModal = (discipline?: Discipline) => {
    setEditingDiscipline(discipline || null);
    setShowModal(true);
  };

  // Fonction pour actualiser les données en gardant le terme de recherche actuel
  const handleRefresh = () => {
    if (searchTerm.trim()) {
      loadDisciplines(searchTerm);
    } else {
      loadDisciplines();
    }
  };

  const handleSaveDiscipline = async (disciplineData: CreateDisciplineRequest) => {
    try {
      if (editingDiscipline) {
        await updateDiscipline(editingDiscipline.id, disciplineData);
        setNotification({
          message: 'Discipline modifiée avec succès !',
          type: 'success'
        });
      } else {
        // Mode création
        await createDiscipline(disciplineData);
        setNotification({
          message: 'Discipline créée avec succès !',
          type: 'success'
        });
      }
      setShowModal(false);
      setEditingDiscipline(null);
    } catch {
      // L'erreur est déjà gérée dans le hook
    }
  };

  // Fonction pour supprimer une discipline
  const handleDeleteDiscipline = async (id: number) => {
    try {
      await deleteDiscipline(id);
      setNotification({
        message: 'Discipline supprimée avec succès !',
        type: 'success'
      });
    } catch {
      setNotification({
        message: 'Erreur lors de la suppression de la discipline',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <DisciplinesHeader 
        onCreateClick={() => handleOpenModal()}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />

        {/* Disciplines Table */}
        <DisciplinesTable
          disciplines={disciplines}
          loading={loading}
          searchTerm={searchTerm}
          onRefresh={handleRefresh}
          onDelete={handleDeleteDiscipline}
          onEdit={(discipline) => handleOpenModal(discipline)}
          error={error}
        />
      </main>
      
      <DisciplineModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingDiscipline(null);
          setCreateError(null);
        }}
        onSave={handleSaveDiscipline}
        loading={createLoading}
        error={createError}
        discipline={editingDiscipline || undefined}
      />
      
      {notification && (
        <Notification
          title="Gestion Disciplines"
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
export default DisciplinesManagement;
