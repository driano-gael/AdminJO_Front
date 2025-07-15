
'use client';

/**
 * Page d'accueil de l'application AdminJO
 * 
 * Cette page sert de point d'entrée principal pour l'application d'administration
 * des Jeux Olympiques. Elle affiche le formulaire de connexion et redirige vers
 * le dashboard après authentification.
 * 
 * Route: / (racine de l'application)
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import LoginAdminForm from '@/components/connexion/loginAdminForm';

/**
 * Composant Home - Page d'accueil avec authentification
 * 
 * @returns JSX.Element - Le formulaire de connexion ou redirection vers dashboard
 */
export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si l'utilisateur est authentifié, rediriger vers le dashboard
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Afficher un loading pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginAdminForm />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-gray-600">Redirection vers le dashboard...</p>
      </div>
    </div>
  );
}