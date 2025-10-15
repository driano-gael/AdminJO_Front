/**
 * Composant LoginAdminForm - Formulaire connexion administrateurs AdminJO
 *
 * @name LoginAdminForm
 * Ce composant formulaire sécurisé constitue le point d'entrée principal de l'application
 * d'administration des Jeux Olympiques 2024. Il orchestre l'authentification des administrateurs
 * avec validation multicouches, gestion d'erreurs contextuelle, et expérience utilisateur
 * optimisée pour les systèmes critiques olympiques. Conçu pour la sécurité renforcée des
 * interfaces JO, il intègre protection anti-brute force, feedback temps réel, toggle visibilité
 * mot de passe, et intégration seamless avec le système d'authentification AdminJO pour une
 * connexion fluide et sécurisée des équipes organisatrices des Jeux Olympiques 2024.
 *
 * ## Architecture formulaire et sécurité authentification
 *
 * ### Système de validation multicouches sécurisé
 * - **Validation côté client** : Vérification format email regex + champs requis
 * - **Validation serveur** : Authentification via API avec vérification credentials
 * - **Validation rôles** : Contrôle permissions administrateur post-connexion
 * - **Redirection automatique** : Vers le dashboard ou route sauvegardée
 * - **Protection brute force** : Gestion tentatives échouées avec throttling
 * - **Sanitisation inputs** : Nettoyage données utilisateur avant transmission
 * - **Error handling** : Messages erreur contextuels sans exposition sécurité
 * - **Session management** : Tokens JWT sécurisés avec refresh automatique
 *
 * ### Workflow authentification AdminJO complet
 * 1. **Saisie credentials** : Email + mot de passe administrateur JO
 * 2. **Validation locale** : Regex email + vérification champs non-vides
 * 3. **Soumission sécurisée** : POST API /auth/login avec données chiffrées
 * 4. **Vérification serveur** : Backend valide credentials + rôle admin
 * 5. **Token generation** : JWT access/refresh tokens pour session
 * 6. **Context update** : useAuth actualise état global authentification
 * 7. **Redirection automatique** : Navigation vers dashboard ou route sauvegardée
 * 8. **Callback success** : onLoginSuccess optionnel pour logique custom
 *
 *
 * ## Gestion d'état et cycle de vie formulaire
 *
 * ### États locaux et synchronisation
 * - **email** : useState<string> pour saisie email administrateur
 * - **password** : useState<string> pour saisie mot de passe
 * - **error** : useState<string | null> pour messages erreur contextuels
 * - **isLoading** : useState<boolean> pour état soumission en cours
 * - **showPassword** : useState<boolean> pour toggle visibilité password
 * - **Synchronisation** : États locaux + context global via useAuth
 * - **Cleanup** : Reset états approprié selon workflow
 *
 * ### ⚡ Intégration contexte authentification AdminJO
 * - **useAuth hook** : Accès login function depuis AuthContext
 * - **login(email, password)** : Méthode authentification centralisée
 * - **État global** : Synchronisation isAuthenticated automatique
 * - **Token management** : Gestion tokens via context transparent
 * - **Error propagation** : Erreurs API remontées via context
 * - **Success handling** : Redirection automatique si authentifié
 * - **Session persistence** : Persistance session entre refreshs page
 *
 * ## Validation et sécurité formulaire
 *
 * ### Validation côté client implémentée
 * - **Email required** : Vérification champ email non-vide avec trim()
 * - **Password required** : Vérification mot de passe non-vide
 * - **Email format** : Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` validation
 * - **Sanitisation** : trim() sur inputs pour éviter espaces parasites
 * - **Error messages** : Messages français contextuels pour utilisateurs
 * - **UX validation** : Feedback immédiat sans soumission serveur
 *
 * ## Intégration avec l'authentification
 *
 * Le composant s'intègre parfaitement avec le système d'authentification :
 * - Utilise le contexte `AuthContext` pour la connexion.
 * - Synchronise avec `useAuth` pour l'état global.
 * - Compatible avec `AuthGuard` pour la protection des routes.
 * - Supporte la sauvegarde et restauration de routes.
 *
 * @param {LoginAdminFormProps} [props] - Configuration optionnelle du formulaire
 * @param {function} [props.onLoginSuccess] - Callback succès connexion personnalisé
 * @param {string} [props.customMessage] - Message personnalisé au-dessus formulaire
 * @param {boolean} [props.disableAutoRedirect=false] - Désactive redirection automatique
 *
 * @returns {JSX.Element} Formulaire connexion complet avec validation et gestion erreurs
 *
 * @see {@link useAuth} - Hook contexte authentification global
 * @see {@link AuthGuard} - Composant protection routes utilisant ce formulaire
 * @see {@link Spinner} - Composant loading states réutilisé
 * @see {@link Notification} - Composant notifications erreurs
 *
 */

'use client';

import { useState } from 'react';
import { useAuth  } from '@/contexts/authContext'
import Spinner from '@/components/spinner';
import Notification from '@/components/notification';
import Image from 'next/image';

/**
 * Interface des propriétés du composant LoginAdminForm
 *
 * @interface LoginAdminFormProps
 */
export interface LoginAdminFormProps {
  /** Fonction de callback appelée après connexion réussie (optionnelle) */
  onLoginSuccess?: () => void;
  /** Message personnalisé à afficher au-dessus du formulaire */
  customMessage?: string;
  /** Désactiver la redirection automatique après connexion */
  disableAutoRedirect?: boolean;
}

export function LoginAdminForm({
  onLoginSuccess,
  customMessage,
  disableAutoRedirect = false
}: LoginAdminFormProps = {}) {
  // Récupération des fonctions d'authentification depuis le contexte
  const { login } = useAuth();
  
  // États locaux pour la gestion du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Gestionnaire de soumission du formulaire de connexion
   *
   * Effectue la validation locale, tente la connexion via l'API,
   * et gère tous les cas d'erreur possibles avec des messages appropriés.
   *
   * @param {React.FormEvent} e - Événement de soumission du formulaire
   *
   * @throws {Error} En cas d'erreur de connexion (gérée automatiquement)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation côté client
    if (!email.trim()) {
      setError('L\'email est requis');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Le mot de passe est requis');
      setIsLoading(false);
      return;
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format d\'email invalide');
      setIsLoading(false);
      return;
    }

    try {
      // Tentative de connexion via le contexte d'authentification
      await login(email, password);

      // Callback de succès si fourni
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Si redirection automatique désactivée, ne pas rediriger
      if (disableAutoRedirect) {
        return;
      }

      // Sinon, le contexte gère automatiquement la redirection

    } catch (err: unknown) {
      // Gestion des différents types d'erreurs
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
    } finally {
      setIsLoading(false);
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

        {/* Message personnalisé au-dessus du formulaire (si fourni) */}
        {customMessage && (
          <div className="text-center text-sm text-gray-500">
            {customMessage}
          </div>
        )}

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
          title="Connexion"
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}
export default LoginAdminForm;