'use client';

import {JSX, useState} from 'react';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { useEmployesManagement } from '@/hooks/useEmployesManagement';
import { CreateEmployeRequest } from '@/types/employe/employe';
import Notification from '@/components/notification';
import EmployesHeader from './EmployesHeader';
import EmployesSearchAndFilters from './EmployesSearchAndFilters';
import EmployesTable from './EmployesTable';
import CreateEmployeForm from './CreateEmployeForm';

/**
 * Composant EmployesManagement - Orchestrateur de gestion des employés AdminJO
 *
 * @name EmployesManagement
 *
 * Ce composant principal coordonne l'ensemble de l'interface de gestion des employés,
 * intégrant la recherche, l'affichage tabulaire, la création et les actions d'activation.
 * Il gère l'état global de la section employés et orchestre les interactions entre
 * les sous-composants spécialisés pour fournir une expérience utilisateur cohérente.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Orchestration des composants enfants
 * - **Header** : EmployesHeader avec bouton d'ajout
 * - **Recherche** : EmployesSearchAndFilters avec état partagé
 * - **Table** : EmployesTable avec données filtrées et actions
 * - **Formulaire** : CreateEmployeForm en modal conditionnelle
 * - **Notifications** : Système de feedback utilisateur
 *
 * ### Gestion d'état centralisée
 * - **Hook principal** : useEmployesManagement pour logique métier
 * - **État UI local** : notification et showCreateForm
 * - **Synchronisation** : États partagés entre composants enfants
 * - **Session** : useSessionExpiry pour sécurité automatique
 * - **Réactivité** : Mise à jour automatique des vues
 *
 * ### Flux de données employés
 * - **Chargement** : loadEmployes() au montage et refresh
 * - **Recherche** : handleSearch avec état searchTerm partagé
 * - **Filtrage** : handleStatusFilter avec statusFilter
 * - **Actions** : toggleEmployeActive avec refresh automatique
 * - **Création** : createEmploye avec gestion success/error
 *
 * ### Système de notifications intégré
 * - **Success** : "Employé créé avec succès !" en vert
 * - **Error** : "Erreur lors de la création de l'employé" en rouge
 * - **Auto-dismiss** : Fermeture manuelle via onClose
 *
 * ## Architecture et composition
 *
 * ### Intégration des hooks
 * - **useEmployesManagement** : Hook principal avec toute la logique
 * - **useSessionExpiry** : Sécurité session en arrière-plan
 * - **useState local** : Seulement pour UI (notification, modal)
 * - **Pas de useEffect** : Logique déléguée aux hooks spécialisés
 *
 * ## Flux d'interaction utilisateur
 *
 * ### Création d'employé
 * 1. **Clic** "Ajouter un employé" → setShowCreateForm(true)
 * 2. **Affichage** CreateEmployeForm en modal overlay
 * 3. **Soumission** handleCreateEmploye avec validation
 * 4. **Success** → notification + fermeture modal + refresh liste
 * 5. **Error** → notification d'erreur + modal reste ouverte
 *
 * ### Recherche et filtrage
 * 1. **Saisie** dans EmployesSearchAndFilters
 * 2. **Callback** handleSearch/handleStatusFilter
 * 3. **État partagé** searchTerm/statusFilter mis à jour
 * 4. **Propagation** vers EmployesTable pour re-filtrage
 * 5. **Affichage** résultats filtrés en temps réel
 *
 * ### Actions sur employés
 * 1. **Clic** bouton toggle dans EmployesTable
 * 2. **Callback** toggleEmployeActive(employeId)
 * 3. **API call** gérée par useEmployesManagement
 * 4. **Refresh** automatique de la liste
 * 5. **Feedback** visuel immédiat dans le tableau
 *
 * ## États et conditions d'affichage
 *
 * ### Rendu conditionnel
 * - **CreateForm** : {showCreateForm && <CreateEmployeForm />}
 * - **Notification** : {notification && <Notification />}
 * - **Loading/Error** : Gérés dans EmployesTable
 * - **Empty state** : Géré dans EmployesTable
 *
 * ### Cycle de vie des états
 * - **Initial** : showCreateForm=false, notification=null
 * - **Création** : showCreateForm=true → isLoading → success/error → reset
 * - **Notification** : message → auto-remain → manual dismiss
 * - **Refresh** : loading=true → data → loading=false
 *
 * ## Gestion des erreurs
 *
 * ### Stratégies d'erreur
 * - **API errors** : Gérées dans useEmployesManagement
 * - **UI errors** : Try/catch dans handleCreateEmploye
 * - **Network errors** : Retry via refresh button
 * - **Validation errors** : Gérées dans CreateEmployeForm
 *
 * ### Communication d'erreur
 * - **Notifications** : Messages d'erreur via système notification
 * - **Table errors** : Affichage dédié dans EmployesTable
 * - **Form errors** : Gestion locale dans CreateEmployeForm
 *
 * @returns {JSX.Element} Interface complète de gestion des employés avec tous les sous-composants
 *
 * @see {@link useEmployesManagement} - Hook principal contenant la logique métier
 * @see {@link EmployesHeader} - En-tête avec titre et bouton d'ajout
 * @see {@link EmployesSearchAndFilters} - Interface de recherche et filtrage
 * @see {@link EmployesTable} - Table d'affichage avec actions
 * @see {@link CreateEmployeForm} - Formulaire de création en modal
 * @see {@link useSessionExpiry} - Gestion automatique de l'expiration session
 *
 */
export function EmployesManagement(): JSX.Element {
  useSessionExpiry();

  const {
    employes,
    loading,
    error,
    searchTerm,
    statusFilter,
    isCreating,
    loadEmployes,
    createEmploye,
    handleSearch,
    handleStatusFilter,
    toggleEmployeActive
  } = useEmployesManagement();

  // États pour l'UI
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateEmploye = async (employeData: CreateEmployeRequest) => {
    const success = await createEmploye(employeData);
    if (success) {
      setNotification({
        message: 'Employé créé avec succès !',
        type: 'success'
      });
      setShowCreateForm(false);
    } else {
      setNotification({
        message: 'Erreur lors de la création de l\'employé',
        type: 'error'
      });
    }
    return success;
  };

  return (
    <div className="min-h-screen bg-base-200">
      <EmployesHeader onAddEmploye={() => setShowCreateForm(true)} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <EmployesSearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilter}
        />

        <EmployesTable
          employes={employes}
          loading={loading}
          searchTerm={searchTerm}
          onRefresh={loadEmployes}
          error={error}
          handleToggleActive={toggleEmployeActive}
        />
      </main>

      {/* Formulaire de création */}
      {showCreateForm && (
        <CreateEmployeForm
          onSubmit={handleCreateEmploye}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isCreating}
        />
      )}

      {/* Notifications */}
      {notification && (
        <Notification
          title="Gestion Employés"
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
export default EmployesManagement;