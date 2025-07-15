/**
 * Composant LoginAdminForm - Formulaire de connexion administrateur
 * 
 * Ce composant :
 * - Affiche un formulaire de connexion avec email/mot de passe
 * - Gère la validation et les erreurs de connexion
 * - Affiche un spinner pendant la connexion
 * - Utilise le contexte d'authentification pour la connexion
 * - Interface spécialement conçue pour les administrateurs JO 2024
 */

'use client';

import { useState } from 'react';
import { useAuth  } from '@/contexts/authContext'
import Spinner from '@/components/spinner';
import Notification from '@/components/notification';
import Image from 'next/image';

/**
 * Composant principal du formulaire de connexion administrateur
 * 
 * @returns JSX.Element - Le formulaire de connexion complet
 */
export default function LoginAdminForm() {
  // Récupérer la fonction de connexion depuis le contexte
  const { login } = useAuth();
  
  // États locaux pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Gère la soumission du formulaire de connexion
   * 
   * @param e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    setError(null);     // Réinitialiser les erreurs précédentes
    setIsLoading(true); // Afficher le spinner

    try {
      // Tenter la connexion via le contexte d'authentification
      await login(email, password);
      // Si succès, le contexte gère automatiquement la redirection
    } catch (err: unknown) {
      // Gérer les erreurs de connexion
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
    } finally {
      setIsLoading(false); // Masquer le spinner
    }
  };

  return (
    // Conteneur principal avec centrage vertical et horizontal
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      {/* Carte du formulaire */}
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        
        {/* En-tête avec titre et description */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ticket JO 2024 <br/>Administration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous pour accéder à l&apos;interface d&apos;administration
          </p>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@jo2024.fr"
            />
          </div>

          {/* Champ Mot de passe avec bouton de visibilité */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
                style={{ color: '#111' }}
                autoComplete="current-password"
              />
              
              {/* Bouton pour afficher/masquer le mot de passe */}
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                onClick={() => setShowPassword((state) => !state)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  // Icône œil barré (masquer)
                    <Image
                    src="/images/hidde.png"
                    alt="Masquer le mot de passe"
                    className="h-5 w-5"
                    width={20}
                    height={20}
                    />
                ) : (
                  // Icône œil (afficher)
                    <Image
                        src="/images/show.png"
                        alt="Afficher le mot de passe"
                        className="h-5 w-5"
                        width={20}
                        height={20}/>                )}
              </button>
            </div>
          </div>

          {/* Bouton de soumission avec gestion du loading */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                {/* Spinner avec texte pendant la connexion */}
                <Spinner size="small" color="white" />
                <span className="ml-2">Connexion...</span>
              </>
            ) : (
              // Texte normal du bouton
              'Se connecter'
            )}
          </button>
        </form>
      </div>

      {/* Notification d'erreur affichée en cas d'échec de connexion */}
      {error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}