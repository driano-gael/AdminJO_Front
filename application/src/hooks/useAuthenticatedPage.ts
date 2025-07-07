import { useAuth } from '@/contexts/authContext';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';

/**
 * Hook personnalisé pour les pages authentifiées
 * 
 * Combine useAuth et useSessionExpiry pour éviter la duplication
 * dans chaque page
 * 
 * @returns Toutes les fonctions et états d'authentification
 */
export function useAuthenticatedPage() {
  const auth = useAuth();
  
  // Activation automatique de la gestion d'expiration de session
  useSessionExpiry();
  
  return auth;
}
