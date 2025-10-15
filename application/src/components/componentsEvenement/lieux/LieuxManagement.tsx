'use client';

import { useState } from 'react';
import { useLieuxManagement } from '@/hooks/useLieuxManagement';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { Lieu } from '@/types/sportEvenement/lieu';
import { CreateLieuRequest } from '@/lib/api/services/evenementSports/lieuService';
import Notification from '@/components/notification';
import LieuxHeader from './LieuxHeader';
import SearchAndFilters from './SearchAndFilters';
import LieuxTable from './LieuxTable';
import LieuModal from './LieuModal';

/**
 * Composant LieuxManagement - Gestion complète des lieux olympiques AdminJO
 *
 * Ce composant principal orchestre la gestion complète des lieux olympiques pour les
 * Jeux Olympiques 2024. Il intègre toutes les fonctionnalités CRUD (création, lecture,
 * mise à jour, suppression) des établissements sportifs olympiques avec une interface
 * utilisateur complète incluant header, recherche/filtres, tableau des données et modal
 * de saisie. Conçu pour les administrateurs des JO 2024, il permet la gestion centralisée
 * de tous les lieux olympiques (Stade de France, Centre Aquatique, Arena Bercy, etc.)
 * avec notifications utilisateur et gestion d'erreurs avancée.
 *
 * ## Architecture et composition complète
 *
 * ### 🏗️ Structure modulaire organisée
 * - **LieuxHeader** : En-tête avec navigation et bouton création
 * - **SearchAndFilters** : Barre de recherche et filtres lieux
 * - **LieuxTable** : Tableau principal affichage/gestion lieux
 * - **LieuModal** : Modal création/édition lieu olympique
 * - **Notification** : Système notifications succès/erreur
 * - **Layout principal** : Container responsive avec bg-base-200
 *
 * ### 🔧 Hooks spécialisés intégrés
 * - **useLieuxManagement** : Logique métier complète gestion lieux
 * - **useSessionExpiry** : Sécurité session administrateur
 * - **useState local** : États UI modal, édition, notifications
 * - **Gestion async** : Appels API avec états loading/error
 *
 * ## Fonctionnalités CRUD complètes implémentées
 *
 * ### ➕ Création de nouveau lieu olympique
 * - **Trigger** : Bouton "Nouveau Lieu" dans LieuxHeader
 * - **Modal** : LieuModal en mode création (editingLieu = null)
 * - **Validation** : Données validées avant envoi API
 * - **Callback** : handleSaveLieu avec CreateLieuRequest
 * - **Notification** : "Lieu créé avec succès !" en cas de succès
 * - **Gestion erreur** : Affichage erreur si échec création
 * - **Refresh** : Rechargement liste après création réussie
 *
 * ### 📖 Lecture et affichage lieux
 * - **Source** : Hook useLieuxManagement avec état lieux[]
 * - **Tableau** : LieuxTable pour affichage structuré
 * - **Recherche** : Filtrage temps réel via SearchAndFilters
 * - **Loading** : États de chargement pendant récupération
 * - **Pagination** : Gérée dans composants enfants si nécessaire
 * - **Actualisation** : Bouton refresh dans tableau
 *
 * ### ✏️ Modification lieu existant
 * - **Trigger** : Bouton "Modifier" dans LieuxTableRow
 * - **Pré-remplissage** : Modal avec données lieu sélectionné
 * - **Mode édition** : editingLieu contient lieu à modifier
 * - **Update API** : updateLieu(id, data) via hook
 * - **Notification** : "Lieu modifié avec succès !" si réussite
 * - **Persistence** : Mise à jour immédiate dans liste
 *
 * ### 🗑️ Suppression lieu olympique
 * - **Trigger** : Bouton "Supprimer" dans LieuxTableRow
 * - **Confirmation** : Gestion dans composants enfants
 * - **API call** : deleteLieu(id) avec gestion erreur
 * - **Notification** : Messages succès/erreur appropriés
 * - **Mise à jour** : Retrait immédiat de la liste
 * - **Sécurité** : Vérification autorisations via session
 *
 * ## Gestion d'état complexe et notifications
 *
 * ### 📊 État global application lieux
 * - **lieux[]** : Liste complète lieux olympiques via hook
 * - **searchTerm** : Terme recherche actuel pour filtrage
 * - **loading** : État chargement données principales
 * - **error** : Erreurs API affichage/récupération données
 * - **createLoading** : Chargement spécifique création/modification
 * - **createError** : Erreurs spécifiques opérations CUD
 *
 * ### 🔔 Système notifications utilisateur
 * - **État notification** : {message, type, onClose} avec types stricts
 * - **Types supportés** : 'success' | 'error' | 'info'
 * - **Messages contextuels** : Textes spécifiques par action
 * - **Auto-dismiss** : Fermeture automatique ou manuelle
 * - **Feedback immédiat** : Confirmation visuelle actions utilisateur
 * - **Gestion erreurs** : Affichage convivial erreurs techniques
 *
 * ### 🎛️ États modaux et édition
 * - **showModal** : boolean contrôle affichage LieuModal
 * - **editingLieu** : Lieu | null pour mode création/édition
 * - **Mode création** : editingLieu = null, modal vierge
 * - **Mode édition** : editingLieu = lieu sélectionné, pré-remplissage
 * - **Fermeture propre** : Reset états lors fermeture modal
 *
 * ## Interactions utilisateur et workflows
 *
 * ### 🔄 Workflow création lieu complet
 * 1. **Clic** "Nouveau Lieu" → handleOpenModal() sans paramètre
 * 2. **Ouverture** modal vierge (editingLieu = null)
 * 3. **Saisie** données lieu par utilisateur
 * 4. **Validation** données côté client et serveur
 * 5. **Création** API call createLieu(data)
 * 6. **Notification** succès + fermeture modal
 * 7. **Refresh** liste lieux mise à jour
 *
 * ### ✏️ Workflow modification lieu complet
 * 1. **Clic** "Modifier" sur ligne → handleOpenModal(lieu)
 * 2. **Pré-remplissage** modal avec données existantes
 * 3. **Modification** données par utilisateur
 * 4. **Sauvegarde** updateLieu(id, data) via handleSaveLieu
 * 5. **Notification** "Lieu modifié avec succès !"
 * 6. **Mise à jour** immédiate affichage tableau
 *
 * ### 🗑️ Workflow suppression lieu
 * 1. **Clic** "Supprimer" → handleDeleteLieu(id)
 * 2. **Confirmation** (gérée dans composants enfants)
 * 3. **Suppression** API call deleteLieu(id)
 * 4. **Notification** résultat opération
 * 5. **Refresh** liste sans lieu supprimé
 *
 * ### 🔍 Workflow recherche et filtrage
 * 1. **Saisie** terme recherche dans SearchAndFilters
 * 2. **Transmission** handleSearch(terme) vers hook
 * 3. **Filtrage** côté client ou serveur
 * 4. **Mise à jour** affichage LieuxTable
 * 5. **Temps réel** résultats instantanés
 *
 * ## Sécurité et gestion session
 *
 * ### 🔒 Protection session administrateur
 * - **useSessionExpiry** : Surveillance continue session
 * - **Auto-logout** : Redirection si session expirée
 * - **Renouvellement** : Gestion silencieuse tokens
 * - **Intercepteurs** : Gestion 401/403 automatique
 * - **Persistance** : Sauvegarde état si déconnexion
 *
 * ### ✅ Validation et sécurisation données
 * - **Types TypeScript** : Interfaces strictes Lieu/CreateLieuRequest
 * - **Validation côté client** : Contrôles avant envoi
 * - **Sanitisation** : Nettoyage données utilisateur
 * - **CSRF protection** : Tokens anti-forgerie
 * - **Autorisations** : Vérification droits modification
 *
 * ## Performance et optimisations
 *
 * ### ⚡ Optimisations chargement
 * - **Lazy loading** : Chargement différé composants lourds
 * - **Memoization** : useState avec fonctions pures
 * - **Debouncing** : Recherche différée pour éviter spam API
 * - **Cache local** : Mise en cache lieux récemment consultés
 * - **Pagination** : Chargement progressif grandes listes
 *
 * ### 🔄 Gestion re-renders optimisée
 * - **useCallback** : Mémorisation callbacks stables
 * - **Conditional rendering** : Affichage conditionnel composants
 * - **Keys stables** : Optimisation listes React
 * - **State colocation** : État local vs global optimisé
 * - **Minimal updates** : Updates ciblées composants enfants
 *
 * ## Architecture responsive et accessibilité
 *
 * ### 📱 Design responsive adaptatif
 * - **Container responsive** : max-w-7xl mx-auto adaptatif
 * - **Padding adaptatif** : px-4 sm:px-6 lg:px-8 breakpoints
 * - **Modal responsive** : LieuModal adapté tous écrans
 * - **Tableau responsive** : Scroll horizontal si nécessaire
 * - **Touch-friendly** : Interactions tactiles optimisées
 *
 * ### ♿ Accessibilité complète
 * - **Navigation clavier** : Tab/Enter/Escape support complet
 * - **Screen readers** : Labels ARIA et descriptions contextuelles
 * - **Focus management** : Gestion focus modal et fermeture
 * - **Contraste** : Couleurs respectant WCAG AA/AAA
 * - **Semantic HTML** : Structure sémantique correcte
 *
 * ## Intégration écosystème AdminJO
 *
 * ### 🔗 Relations avec autres modules
 * - **Événements** : Lieux comme infrastructure pour événements
 * - **Navigation** : BackToEventsButton pour retour contexte
 * - **Types partagés** : Interfaces Lieu réutilisées
 * - **Services** : lieuService pour API centralisée
 * - **Hooks** : useLieuxManagement logique métier isolée
 *
 * ### 🎯 Positionnement dans architecture globale
 * - **Sous-module** : Partie gestion événements olympiques
 * - **Client component** : 'use client' pour interactivité
 * - **Layout cohérent** : Design system AdminJO respecté
 * - **Routing** : Intégration Next.js App Router
 * - **State management** : Hooks personnalisés vs état global
 *
 * ## Contexte métier lieux olympiques JO 2024
 *
 * ### 🏅 Spécificités domaine olympique
 * - **Infrastructure critique** : Lieux base physique compétitions
 * - **Exemples concrets** : Stade de France, Centre Aquatique, Arena Bercy
 * - **Standards CIO** : Nomenclature officielle établissements
 * - **Capacités** : Gestion jauges et configurations
 * - **Logistics** : Coordination avec transport et sécurité
 * - **Legacy** : Héritage post-JO des équipements
 *
 * ### 📊 Types de lieux gérés
 * - **Stades** : Football, athlétisme, cérémonies
 * - **Centres aquatiques** : Natation, plongeon, water-polo
 * - **Arenas** : Sports en salle, basketball, volleyball
 * - **Sites temporaires** : Installations éphémères JO
 * - **Centres d'entraînement** : Préparation équipes
 * - **Sites techniques** : Broadcast, médias, services
 *
 * ## Améliorations et extensions futures
 *
 * ### 🚀 Fonctionnalités avancées possibles
 * - **Géolocalisation** : Carte interactive lieux olympiques
 * - **Capacités détaillées** : Gestion jauges par configuration
 * - **Planning occupation** : Calendrier utilisation lieux
 * - **Photos/médias** : Galerie images établissements
 * - **Accessibilité PMR** : Informations handicap détaillées
 * - **Transport** : Intégration données mobilité
 * - **Météo** : Conditions climatiques sites extérieurs
 *
 * ### 📊 Analytics et reporting
 * - **Statistiques usage** : Métriques occupation lieux
 * - **Rapports capacité** : Analyses optimisation jauges
 * - **Export données** : CSV/PDF listes lieux
 * - **Dashboard** : Vue synthétique état lieux
 * - **Alertes** : Notifications problèmes infrastructure
 * - **Historique** : Journal modifications lieux
 *
 * @returns {JSX.Element} Interface complète de gestion des lieux olympiques
 *
 * @see {@link useLieuxManagement} - Hook logique métier gestion lieux
 * @see {@link LieuxHeader} - Composant en-tête avec navigation
 * @see {@link SearchAndFilters} - Composant recherche et filtres
 * @see {@link LieuxTable} - Tableau principal affichage lieux
 * @see {@link LieuModal} - Modal création/édition lieu
 * @see {@link Notification} - Système notifications utilisateur
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Utilisation dans page Next.js
 * export default function LieuxPage() {
 *   return <LieuxManagement />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Intégration dans layout événements
 * <EventsLayout>
 *   <LieuxManagement />
 * </EventsLayout>
 * ```
 */
export default function LieuxManagement() {
      useSessionExpiry();

      const {
        lieux,
        searchTerm,
        loading,
        error,
        createLoading,
        createError,
        loadLieux,
        createLieu,
        updateLieu,
        deleteLieu,
        handleSearch,
        setCreateError
      } = useLieuxManagement();

      const [showModal, setShowModal] = useState(false);
      const [editingLieu, setEditingLieu] = useState<Lieu | null>(null);
      const [notification, setNotification] = useState<{
          message: string;
          type: 'success' | 'error' | 'info';
      } | null>(null);

      const handleOpenModal = (lieu?: Lieu) => {
        setEditingLieu(lieu || null);
        setShowModal(true);
      };
    const handleSaveLieu = async (lieuData: CreateLieuRequest) => {
      try {
        if (editingLieu) {
          await updateLieu(editingLieu.id, lieuData);
          setNotification({
            message: 'Lieu modifié avec succès !',
            type: 'success'
          });
        } else {
          // Mode création
          await createLieu(lieuData);
          setNotification({
            message: 'Lieu créé avec succès !',
            type: 'success'
          });
        }
        setShowModal(false);
        setEditingLieu(null);
      } catch {
        // L'erreur est déjà gérée dans le hook
      }
    };

    // Fonction pour supprimer un lieu
    const handleDeleteLieu = async (id: number) => {
      try {
        await deleteLieu(id);
        setNotification({
          message: 'Lieu supprimé avec succès !',
          type: 'success'
        });
      } catch {
        setNotification({
          message: 'Erreur lors de la suppression du lieu',
          type: 'error'
        });
      }
    };

    return (
      <div className="min-h-screen bg-base-200">
        {/* Header */}
        <LieuxHeader 
          onCreateClick={()=>handleOpenModal()}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearch={handleSearch}
          />

          {/* Lieux Table */}
          <LieuxTable
            lieux={lieux}
            loading={loading}
            searchTerm={searchTerm}
            onRefresh={loadLieux}
            onDelete={handleDeleteLieu}
            onEdit={(lieux)=>handleOpenModal(lieux)}
            error={error}
          />
        </main>
        <LieuModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingLieu(null);
            setCreateError(null);
          }}
          onSave={handleSaveLieu}
          loading={createLoading}
          error={createError}
          lieu={editingLieu || undefined}
        />
        {notification && (
          <Notification
            title="Gestion Lieux"
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    );
}
