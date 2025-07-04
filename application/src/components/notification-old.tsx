/**
 * Composant Notification - Affichage de messages temporaires
 * 
 * Ce composant affiche des notifications temporaires en overlay avec différents types
 * (erreur, succès, info) et une fermeture automatique après une durée configurable.
 * 
 * Fonctionnalités :
 * - Types de notification (error, success, info) avec couleurs appropriées
 * - Fermeture automatique avec timer configurable
 * - Bouton de fermeture manuel
 * - Barre de progression pour indiquer le temps restant
 * - Animations d'apparition et de disparition
 * - Gestion des fuites mémoire avec cleanup
 * - Accessible avec attributs ARIA
 * 
 * Utilisation :
 * <Notification 
 *   message="Opération réussie !" 
 *   type="success" 
 *   onClose={() => setNotification(null)} 
 *   duration={3000} 
 * />
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';

/**
 * Props pour le composant Notification
 */
type Props = {
  /** Message à afficher dans la notification */
  message: string;
  /** Type de notification qui détermine la couleur et l'icône */
  type?: 'error' | 'success' | 'info';
  /** Fonction appelée lors de la fermeture de la notification */
  onClose: () => void;
  /** Durée d'affichage en millisecondes (3000ms par défaut) */
  duration?: number;
}

/**
 * Composant Notification - Affichage de messages temporaires
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - La notification avec styles et animations
 */
export default function Notification({ message, type = 'error', onClose, duration = 3000 }: Props) {
  // Référence pour le timer de fermeture automatique
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Référence pour vérifier si le composant est encore monté
  const mountedRef = useRef(true);

  // Ajuster la durée selon le type (les succès restent plus longtemps visibles)
  const adjustedDuration = type === 'success' ? Math.max(duration, 2500) : duration;

  /**
   * Fonction de fermeture sécurisée qui vérifie si le composant est encore monté
   */
  const handleClose = useCallback(() => {
    if (mountedRef.current) {
      onClose();
    }
  }, [onClose]);

  // Effet pour gérer le timer de fermeture automatique
  useEffect(() => {
    // Nettoyer le timer existant si présent
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Créer un nouveau timer pour la fermeture automatique
    timerRef.current = setTimeout(handleClose, adjustedDuration);

    // Cleanup : nettoyer le timer quand le composant se démonte ou change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleClose, adjustedDuration]);
      }
    };
  }, [handleClose, adjustedDuration]);

  // Effet pour marquer le composant comme démonté lors du cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Détermine les styles CSS en fonction du type de notification
   * @returns string - Classes CSS pour les couleurs et bordures
   */
  const getTypeStyles = useCallback(() => {
    switch (type) {
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-red-500 border-red-600';
    }
  }, [type]);

  return (
    <div className={`fixed top-4 right-4 z-[60] ${getTypeStyles()} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[300px] max-w-[400px] animate-slide-in`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        {/* Bouton de fermeture manuel */}
        <button
          onClick={handleClose}
          className="ml-3 text-white hover:text-gray-200 font-bold text-lg"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
      {/* Barre de progression pour indiquer le temps restant */}
      <div className={`absolute bottom-0 left-0 h-1 ${type === 'error' ? 'bg-red-300' : type === 'success' ? 'bg-green-300' : 'bg-blue-300'} animate-progress${type === 'success' ? ' success' : ''}`}></div>
    </div>
  );
}
