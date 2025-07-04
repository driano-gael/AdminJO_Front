/**
 * Composant AuthGuard - Protection des routes par authentification
 * 
 * Ce composant sert de garde d'authentification pour protéger les routes
 * sensibles de l'application. Il vérifie l'état d'authentification de l'utilisateur
 * et affiche soit le contenu protégé, soit un formulaire de connexion.
 * 
 * Fonctionnalités :
 * - Vérification automatique de l'état d'authentification
 * - Affichage d'un spinner pendant le chargement
 * - Redirection vers le formulaire de connexion si non authentifié
 * - Affichage du contenu protégé si authentifié
 * 
 * Utilisation :
 * <AuthGuard>
 *   <ComponentProtege />
 * </AuthGuard>
 */

'use client';

import { useAuth } from '@/contexts/authContext';
import Spinner from '@/components/spinner';
import LoginAdminForm from '@/components/connexion/loginAdminForm';

/**
 * Props pour le composant AuthGuard
 */
interface AuthGuardProps {
  children: React.ReactNode; // Contenu à protéger par authentification
}

/**
 * Composant AuthGuard - Protection par authentification
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Spinner, formulaire de connexion ou contenu protégé
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  // Récupération de l'état d'authentification depuis le contexte
  const { isAuthenticated, isLoading } = useAuth();

  // Affichage du spinner pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }
  
  // Affichage du formulaire de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return <LoginAdminForm />;
  }
  
  // Affichage du contenu protégé si l'utilisateur est authentifié
  return <>{children}</>;
}