/**
 * Composant SessionExpiredModal - Modal expiration session AdminJO
 *
 * @name SessionExpiredModal
 * Ce composant modal critique gère l'expiration des sessions administrateur dans l'application
 * AdminJO des Jeux Olympiques 2024. Il fournit une interface utilisateur claire pour informer
 * les administrateurs de l'expiration de leur session avec compte à rebours automatique,
 * redirection programmée, et options de reconnexion immédiate. Conçu pour maintenir la
 * sécurité des systèmes olympiques tout en préservant l'expérience utilisateur, il intègre
 * feedback visuel temps réel, gestion automatique des timeouts, et actions utilisateur
 * flexibles pour une gestion optimale des sessions expirées dans l'écosystème AdminJO.
 *
 * ## Architecture modal et gestion session expirée
 *
 * ### Système de compte à rebours automatique
 * - **Durée initiale** : 10 secondes countdown par défaut
 * - **Timer automatique** : setInterval décrément chaque seconde
 * - **Redirection automatique** : onReconnect() déclenché à countdown = 0
 * - **Reset intelligent** : Réinitialisation countdown si modal fermé/rouvert
 * - **Cleanup robuste** : clearInterval dans useEffect cleanup
 * - **État synchronisé** : countdown useState avec timer côté effect
 * - **Performance** : Timer actif uniquement si modal ouvert
 *
 * ### Workflow expiration session sécurisée
 * 1. **Détection expiration** : AuthContext/useAuth détecte token expiré
 * 2. **Ouverture modal** : isOpen=true déclenche affichage modal
 * 3. **Compte à rebours** : 10 secondes timer avec affichage temps restant
 * 4. **Options utilisateur** : Fermer modal OU reconnexion immédiate
 * 5. **Redirection automatique** : onReconnect() si countdown atteint 0
 * 6. **Cleanup session** : Nettoyage tokens et redirection LoginAdminForm
 * 7. **Reset état** : Fermeture modal remet countdown à 10 secondes
 *
 *
 * ### Actions disponibles pour utilisateur
 * - **Fermer modal** : onClose() sans redirection, maintient session expirée
 * - **Reconnexion immédiate** : onReconnect() bypass countdown, redirection login
 * - **Attendre countdown** : Aucune action, redirection automatique à 0
 *
 * ### 📡 Intégration callbacks externes
 * - **onClose prop** : Callback fermeture modal sans action supplémentaire
 * - **onReconnect prop** : Callback redirection vers authentification
 * - **isOpen prop** : Contrôle externe affichage modal
 * - **Delegation pattern** : Logique métier gérée par composants parents
 * - **State external** : Modal stateless pour logique session
 *
 *
 * @param {SessionExpiredModalProps} props - Configuration du modal expiration session
 * @param {boolean} props.isOpen - Contrôle affichage modal (true = visible)
 * @param {function} props.onClose - Callback fermeture modal sans redirection
 * @param {function} props.onReconnect - Callback redirection authentification
 *
 * @returns {JSX.Element|null} Modal expiration avec countdown ou null si fermé
 *
 * @see {@link useAuth} - Hook authentification déclenchant ce modal
 * @see {@link AuthGuard} - Composant protection utilisant expiration
 * @see {@link LoginAdminForm} - Destination après onReconnect
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Interface des propriétés du composant SessionExpiredModal
 */
interface SessionExpiredModalProps {
  /** Contrôle l'affichage du modal - true pour visible, false pour caché */
  isOpen: boolean;
  /** Fonction appelée quand l'utilisateur ferme le modal sans redirection */
  onClose: () => void;
  /** Fonction appelée pour rediriger vers la page de connexion */
  onReconnect: () => void;
}

export function SessionExpiredModal({ isOpen, onClose, onReconnect }: SessionExpiredModalProps) {
    
    // État pour le compte à rebours (10 secondes par défaut)
    const [countdown, setCountdown] = useState(10);
    
    // Effet pour gérer le compte à rebours automatique
    useEffect(() => {
        // Si le modal n'est pas ouvert, réinitialiser le compte à rebours
        if (!isOpen) {
            setCountdown(10);
            return;
        }
        // Créer un timer qui décrémente le compte à rebours chaque seconde
        const timer = setInterval(() => {
            setCountdown(prev => {
                // Si le compte à rebours atteint 1, déclencher la reconnexion
                if (prev <= 1) {
                    onReconnect();
                    return 0;
                }
                // Sinon, décrémenter le compte à rebours
                return prev - 1;
            });
        }, 1000);
        // Nettoyer le timer quand le composant se démonte ou que les dépendances changent
        return () => clearInterval(timer);
    }, [isOpen, onReconnect]); // Dépendances : recréer l'effet si isOpen ou onReconnect change
    // Si le modal n'est pas ouvert, ne rien afficher
    if (!isOpen) return null;

    return (
        // Overlay sombre qui couvre toute la page
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Conteneur du modal */}
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
                {/* Icône d'horloge */}
                <div className="text-6xl mb-4">⏰</div>
                
                {/* Titre du modal */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Session expirée
                </h2>
                
                {/* Message explicatif avec compte à rebours dynamique */}
                <p className="text-gray-600 mb-6">
                    Votre session a expiré. Vous allez être redirigé vers la page de connexion dans {countdown} secondes.
                </p>
                
                {/* Boutons d'action */}
                <div className="flex justify-center space-x-3">
                    {/* Bouton pour fermer le modal sans redirection */}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Fermer
                    </button>
                    
                    {/* Bouton pour se reconnecter immédiatement */}
                    <button
                        onClick={onReconnect}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Se reconnecter maintenant
                    </button>
                </div>
            </div>
        </div>
    );
}
export default SessionExpiredModal;