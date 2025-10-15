'use client';

/**
 * Page d'accueil de l'application AdminJO
 * 
 * Cette page sert de point d'entrée principal pour l'application d'administration
 * des Jeux Olympiques. Elle affiche le formulaire de connexion et redirige vers
 * le dashboard après authentification.
 * 
 * Route: / (racine de l'application)
 *
 * @module HomePage
 */

import {JSX, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import LoginAdminForm from '@/components/connexion/loginAdminForm';

/**
 * Composant HomePage - Page d'accueil avec authentification
 *
 * Cette page gère le point d'entrée de l'application avec une logique d'authentification
 * intelligente. Elle redirige automatiquement les utilisateurs déjà connectés vers
 * le dashboard ou affiche le formulaire de connexion pour les utilisateurs non authentifiés.
 *
 * @name HomePage
 *
 * ## Fonctionnalités principales
 *
 * ### Gestion de l'authentification
 * - **Vérification automatique** : Contrôle du statut d'authentification au chargement
 * - **Redirection intelligente** : Navigation automatique vers `/dashboard` si connecté
 * - **États de chargement** : Affichage d'un spinner pendant la vérification
 *
 * ### Interface utilisateur
 * - **Formulaire de connexion** : Composant `LoginAdminForm` pour les utilisateurs non connectés
 * - **Écrans de transition** : Messages et spinners pendant les états intermédiaires
 * - **Design responsive** : Interface adaptée à tous les écrans
 *
 * ## Flux d'authentification
 *
 * 1. **Chargement initial** : Affichage du spinner "Vérification de l'authentification"
 * 2. **Utilisateur connecté** : Redirection automatique + spinner "Redirection vers le dashboard"
 * 3. **Utilisateur non connecté** : Affichage du formulaire de connexion
 *
 * ## Gestion des états
 *
 * - **isLoading = true** : Spinner de vérification d'authentification
 * - **isAuthenticated = true && !isLoading** : Redirection vers dashboard
 * - **isAuthenticated = false && !isLoading** : Affichage du formulaire de connexion
 *
 * ## Hooks utilisés
 *
 * - **useAuth** : Context d'authentification pour `isAuthenticated` et `isLoading`
 * - **useRouter** : Navigation programmée vers `/dashboard`
 * - **useEffect** : Effet de redirection automatique
 *
 * @returns {JSX.Element} Interface d'authentification ou états de transition
 *
 * @see {@link LoginAdminForm} - Composant de formulaire de connexion
 * @see {@link useAuth} - Hook de context d'authentification
 * @see /dashboard - Page de destination après connexion
 *
 */
export function HomePage(): JSX.Element {
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
          <p className="mt-4 text-gray-600">Vérification de l&apos;authentification...</p>
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

export default HomePage;
