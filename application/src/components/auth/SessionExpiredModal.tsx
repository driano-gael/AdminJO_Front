'use client';

import { useState, useEffect } from 'react';

/**
 * Props pour le composant SessionExpiredModal
 */
interface SessionExpiredModalProps {
  isOpen: boolean;      // Contrôle l'affichage du modal
  onClose: () => void;  // Fonction appelée quand l'utilisateur ferme le modal
  onReconnect: () => void; // Fonction appelée pour rediriger vers la page de connexion
}

/**
 * Composant Modal qui s'affiche quand la session utilisateur expire
 * 
 * Fonctionnalités :
 * - Affiche un compte à rebours de 10 secondes
 * - Redirige automatiquement vers la page de connexion à la fin du compte à rebours
 * - Permet à l'utilisateur de se reconnecter immédiatement ou de fermer le modal
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Le modal de session expirée
 */
export default function SessionExpiredModal({ isOpen, onClose, onReconnect }: SessionExpiredModalProps) {
    
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
