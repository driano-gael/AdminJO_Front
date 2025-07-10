'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';

/**
 * Hook personnalisé pour gérer l'expiration de session
 * 
 * Ce hook :
 * - Écoute les événements d'expiration de session
 * - Déclenche automatiquement la déconnexion forcée quand la session expire
 * - Doit être utilisé dans les composants qui nécessitent une authentification
 * 
 * Utilisation :
 * ```tsx
 * function MyComponent() {
 *   useSessionExpiry(); // Ajoutez simplement cette ligne
 *   // ... le reste de votre composant
 * }
 * ```
 */
export function useSessionExpiry() {
  const { isAuthenticated, forceLogout } = useAuth();

  useEffect(() => {
      const handleSessionExpired = () => {
        if (isAuthenticated) {
          forceLogout();
        }
      };
      window.addEventListener('sessionExpired', handleSessionExpired);
      return () => {
        window.removeEventListener('sessionExpired', handleSessionExpired);
      };
  }, [isAuthenticated, forceLogout]); // Recréer l'effet si l'état d'authentification change
}

/**
 * Fonction utilitaire pour émettre un événement d'expiration de session
 * 
 * Cette fonction peut être appelée depuis n'importe où dans l'application
 * pour déclencher l'expiration de session (par exemple, lors d'une erreur 401)
 * 
 * @example
 * ```tsx
 * // Dans un service API
 * if (response.status === 401) {
 *   emitSessionExpired();
 * }
 * ```
 */
export function emitSessionExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sessionExpired'));
  }
}
