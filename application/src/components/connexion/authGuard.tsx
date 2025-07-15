/**
 * Composant AuthGuard - Protection des routes par authentification
 * 
 * Ce composant sert de garde d'authentification pour protéger les routes
 * sensibles de l'application. Il vérifie l'état d'authentification de l'utilisateur
 * et affiche soit le contenu protégé, soit un formulaire de connexion.
 * 
 * Fonctionnalités :
 * - Vérification automatique de l'état d'authentification
 * - Vérification de la validité du token d'accès
 * - Refresh automatique du token si nécessaire
 * - Affichage d'un spinner pendant le chargement et le refresh
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
import { useEffect, useState } from 'react';
import { isTokenValid } from '@/lib/api/core/tokenHelpers';
import { refreshToken } from '@/lib/api/auth/authService';

/**
 * Props pour le composant AuthGuard
 */
interface AuthGuardProps {
  children: React.ReactNode; // Contenu à protéger par authentification
}

/**
 * Composant AuthGuard - Protection par authentification avec refresh automatique
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Spinner, formulaire de connexion ou contenu protégé
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  // Récupération de l'état d'authentification depuis le contexte
  const { isAuthenticated, isLoading, forceLogout } = useAuth();
  
  // État local pour gérer le processus de refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  // Vérification et refresh du token si nécessaire
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      // Si l'utilisateur n'est pas authentifié, pas besoin de vérifier le token
      if (!isAuthenticated) {
        setHasValidToken(false);
        return;
      }

      // Vérifier si le token actuel est valide
      const tokenValid = isTokenValid();
      
      if (tokenValid) {
        // Token valide, tout va bien
        setHasValidToken(true);
        if (process.env.NODE_ENV === 'development') {
          console.log('🔑 AuthGuard: Token valide');
        }
      } else {
        // Token expiré, tenter un refresh
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 AuthGuard: Token expiré, tentative de refresh...');
        }
        
        setIsRefreshing(true);
        
        try {
          await refreshToken();
          setHasValidToken(true);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ AuthGuard: Token refreshé avec succès');
          }
        } catch (error) {
          // Échec du refresh, déconnexion forcée
          if (process.env.NODE_ENV === 'development') {
            console.log('❌ AuthGuard: Échec du refresh, déconnexion forcée');
          }
          
          forceLogout();
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    checkAndRefreshToken();
  }, [isAuthenticated, forceLogout]);

  // Affichage du spinner pendant la vérification de l'authentification initiale
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  // Affichage du spinner pendant le refresh du token
  if (isRefreshing) {
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

  // Affichage du formulaire de connexion si le token n'est pas valide
  if (!hasValidToken) {
    return <LoginAdminForm />;
  }
  
  // Affichage du contenu protégé si l'utilisateur est authentifié avec un token valide
  return <>{children}</>;
}