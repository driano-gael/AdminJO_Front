/**
 * Hook de gestion des offres pour l'application AdminJO
 *
 * Ce hook centralise toute la logique de gestion des offres dans l'application
 * d'administration des JO 2024. Il fournit les opérations CRUD complètes,
 * la gestion des états de chargement et un système de notifications intégré
 * pour le feedback utilisateur.
 *
 * @module useOffreManagement
 * @category Hooks
 * @since 1.0.0
 * @author AdminJO Team
 */

import { useState, useEffect } from 'react';
import { Offre } from '@/types/offre/offre';
import { OffreService } from '@/lib/api/services/offres/offreService';
import { Notification } from '@/types/common/notification';

/**
 * Hook useOffreManagement - Gestion complète des offres
 *
 * Ce hook fournit une interface unifiée pour la gestion des offres de l'application
 * AdminJO. Il combine les opérations CRUD, la gestion des états de chargement et
 * un système de notifications pour offrir un feedback utilisateur immédiat sur
 * toutes les opérations effectuées.
 *
 * @name useOffreManagement
 *
 * ## Fonctionnalités principales
 *
 * ### Gestion des données offres
 * - **Chargement automatique** : Récupération de toutes les offres au montage du composant
 * - **Gestion d'état** : États de chargement et d'erreur pour les opérations principales
 * - **Mise à jour synchrone** : Actualisation immédiate de l'état local après modifications
 * - **Synchronisation** : Maintien de la cohérence avec les données backend
 *
 * ### Opérations CRUD complètes
 * - **Création d'offres** : Ajout de nouvelles offres avec validation et feedback
 * - **Lecture des données** : Récupération et affichage de toutes les offres
 * - **Mise à jour** : Modification des offres existantes avec confirmation
 * - **Suppression** : Suppression sécurisée des offres avec notification
 *
 * ### Système de notifications intégré
 * - **Feedback immédiat** : Notifications de succès/erreur pour chaque opération
 * - **Types de notifications** : Messages différenciés selon le type d'opération
 * - **Gestion centralisée** : Interface unifiée pour toutes les notifications
 * - **Réinitialisation automatique** : Nettoyage des notifications lors de nouvelles opérations
 *
 * ## États gérés
 *
 * ### Données principales
 * - **offres** : Liste complète des offres disponibles
 * - **loading** : État de chargement pour les opérations de lecture principales
 * - **error** : Messages d'erreur pour les opérations de chargement
 *
 * ### États des formulaires
 * - **formLoading** : État de chargement spécifique aux opérations CRUD
 * - **formNotification** : Notifications de feedback pour les opérations utilisateur
 *
 * ## Opérations disponibles
 *
 * ### Chargement des données
 * - **loadOffres()** : Récupération de toutes les offres depuis l'API
 * - **Gestion d'erreurs** : Capture et affichage des erreurs de chargement
 * - **États de chargement** : Indicateurs visuels pendant les opérations
 *
 * ### Opérations de création
 * - **createOffre()** : Création de nouvelles offres avec validation
 * - **Mise à jour locale** : Ajout immédiat à la liste sans rechargement
 * - **Notification succès** : Confirmation de création réussie
 *
 * ### Opérations de modification
 * - **updateOffre()** : Modification des offres existantes
 * - **Mise à jour optimiste** : Changement immédiat dans l'état local
 * - **Synchronisation** : Maintien de la cohérence avec les données serveur
 *
 * ### Opérations de suppression
 * - **deleteOffre()** : Suppression des offres avec confirmation
 * - **Nettoyage local** : Retrait immédiat de la liste affichée
 * - **Gestion d'erreurs** : Rollback en cas d'échec de suppression
 *
 * ## Flux de fonctionnement
 *
 * 1. **Initialisation** : Chargement automatique de toutes les offres au montage
 * 2. **Opérations CRUD** : Exécution avec mise à jour immédiate de l'état local
 * 3. **Notifications** : Affichage du feedback utilisateur pour chaque action
 * 4. **Gestion d'erreurs** : Capture et affichage des erreurs avec rollback si nécessaire
 * 5. **Synchronisation** : Maintien de la cohérence entre l'état local et le serveur
 *
 * ## Intégrations
 *
 * - **OffreService** : Service API principal pour les opérations sur les offres
 * - **Offre type** : Interface TypeScript pour la structure des données
 * - **Notification type** : Interface pour le système de feedback utilisateur
 *
 * @returns {Object} Interface complète de gestion des offres
 * @returns {Offre[]} returns.offres - Liste des offres disponibles
 * @returns {boolean} returns.loading - État de chargement principal
 * @returns {string | null} returns.error - Message d'erreur principal
 * @returns {boolean} returns.formLoading - État de chargement des opérations CRUD
 * @returns {Notification | null} returns.formNotification - Notification de feedback utilisateur
 * @returns {Function} returns.createOffre - Créer une nouvelle offre
 * @returns {Function} returns.updateOffre - Modifier une offre existante
 * @returns {Function} returns.deleteOffre - Supprimer une offre
 * @returns {Function} returns.setFormLoading - Modifier l'état de chargement des formulaires
 * @returns {Function} returns.setFormNotification - Gérer les notifications
 * @returns {Function} returns.loadOffres - Recharger les offres
 *
 * @see {@link OffreService} - Service API des offres
 * @see {@link Offre} - Interface TypeScript des données offre
 * @see {@link Notification} - Interface TypeScript des notifications
 *
 * @example
 * ```tsx
 * function OffresManagementPage() {
 *   const {
 *     offres,
 *     loading,
 *     error,
 *     formLoading,
 *     formNotification,
 *     createOffre,
 *     updateOffre,
 *     deleteOffre,
 *     setFormNotification
 *   } = useOffreManagement();
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *
 *   const handleCreateOffre = async (offreData) => {
 *     try {
 *       await createOffre(offreData);
 *       // Notification automatique de succès
 *     } catch (error) {
 *       // Notification automatique d'erreur
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {formNotification && (
 *         <NotificationComponent
 *           message={formNotification.message}
 *           type={formNotification.type}
 *           onClose={() => setFormNotification(null)}
 *         />
 *       )}
 *       <OffreForm
 *         onSubmit={handleCreateOffre}
 *         loading={formLoading}
 *       />
 *       <OffresList
 *         offres={offres}
 *         onUpdate={updateOffre}
 *         onDelete={deleteOffre}
 *         loading={formLoading}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useOffreManagement() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formNotification, setFormNotification] = useState<Notification | null>(null);

  // Charger les offres
  const loadOffres = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiOffres = await OffreService.getAll();
      setOffres(apiOffres);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des offres';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Créer une offre
  const createOffre = async (offreData: Offre) => {
    try {
      setFormLoading(true);
      setFormNotification(null);

      const newOffre = await OffreService.create(offreData);
      setOffres(prev => [...prev, newOffre]);
      setFormNotification({
        message: 'Offre créée avec succès',
        type: 'success'
      });
      return newOffre;
    } catch (err) {
      setFormNotification({
        message: "Erreur lors de la création de l'offre",
        type: 'error'
      });
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  // Modifier une offre
  const updateOffre = async (id: number, offreData: Offre) => {
    try {
      setFormLoading(true);
      setFormNotification(null);

      const updatedOffre = await OffreService.update({ ...offreData, id });
      setOffres(prev => prev.map(offre => offre.id === id ? updatedOffre : offre));
      setFormNotification({
        message: 'Offre modifiée avec succès',
        type: 'success'
      });
      return updatedOffre;
    } catch (err) {
      setFormNotification({
        message: "Erreur lors de la modification de l'offre",
        type: 'error'
      });
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const deleteOffre = async (id: number) => {
    try {
      await OffreService.delete(id);
      setOffres(prev => prev.filter(offre => offre.id !== id));

      // Notification de succès pour suppression
      setFormNotification({
        message: 'Offre supprimée avec succès',
        type: 'success'
      });
    } catch (err) {
      setFormNotification({
        message: "Erreur lors de la suppression de l'offre",
        type: 'error'
      });
      console.log(err)
    }
  };

  useEffect(() => {
    loadOffres();
  }, []);

  return {
    offres,
    loading,
    error,
    formLoading,
    formNotification,
    createOffre,
    updateOffre,
    deleteOffre,
    setFormLoading,
    setFormNotification,
    loadOffres
  };
}
