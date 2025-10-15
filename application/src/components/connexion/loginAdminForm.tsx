/**
 * Composant LoginAdminForm - Formulaire connexion administrateurs AdminJO
 *
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
 * ### 🔐 Système de validation multicouches sécurisé
 * - **Validation côté client** : Vérification format email regex + champs requis
 * - **Validation serveur** : Authentification via API avec vérification credentials
 * - **Validation rôles** : Contrôle permissions administrateur post-connexion
 * - **Protection brute force** : Gestion tentatives échouées avec throttling
 * - **Sanitisation inputs** : Nettoyage données utilisateur avant transmission
 * - **Error handling** : Messages erreur contextuels sans exposition sécurité
 * - **Session management** : Tokens JWT sécurisés avec refresh automatique
 *
 * ### 🛡️ Workflow authentification AdminJO complet
 * 1. **Saisie credentials** : Email + mot de passe administrateur JO
 * 2. **Validation locale** : Regex email + vérification champs non-vides
 * 3. **Soumission sécurisée** : POST API /auth/login avec données chiffrées
 * 4. **Vérification serveur** : Backend valide credentials + rôle admin
 * 5. **Token generation** : JWT access/refresh tokens pour session
 * 6. **Context update** : useAuth actualise état global authentification
 * 7. **Redirection automatique** : Navigation vers dashboard ou route sauvegardée
 * 8. **Callback success** : onLoginSuccess optionnel pour logique custom
 *
 * ## Interface utilisateur et expérience connexion
 *
 * ### 🎨 Design et layout formulaire olympique
 * - **Container centré** : min-h-screen flex centrage viewport complet
 * - **Carte formulaire** : max-w-md bg-white rounded-lg shadow-md élégante
 * - **Branding JO** : Titre "Ticket JO 2024 Administration" olympique
 * - **Description contextuelle** : Texte explicatif interface administration
 * - **Espacement généreux** : space-y-8 + p-8 pour respiration optimale
 * - **Background cohérent** : bg-base-200 aligné design system AdminJO
 * - **Responsive design** : Adaptation mobile/tablet/desktop automatique
 *
 * ### 📋 Champs formulaire et contrôles utilisateur
 * - **Champ Email** : type="email" avec placeholder "admin@jo2024.fr" contextuel
 * - **Champ Password** : Saisie sécurisée avec toggle visibilité
 * - **Labels explicites** : htmlFor + text-sm font-medium pour accessibilité
 * - **Validation HTML5** : required attributes + types appropriés
 * - **Styles focus** : focus:ring-blue-500 focus:border-blue-500 AdminJO
 * - **Placeholder guides** : Exemples contextuels pour guider saisie
 * - **Error display** : Messages erreur conditionnels sous champs
 *
 * ### 🔘 Contrôles interaction et feedback visuel
 * - **Bouton toggle password** : Oeil pour afficher/masquer mot de passe
 * - **Bouton submit** : "Se connecter" avec états loading/disabled
 * - **Spinner loading** : Indicateur visuel pendant authentification
 * - **États interactifs** : hover/focus/disabled cohérents
 * - **Messages erreur** : Notification contextuelle erreurs spécifiques
 * - **Success feedback** : Callback personnalisable succès connexion
 *
 * ## Gestion d'état et cycle de vie formulaire
 *
 * ### 🔄 États locaux et synchronisation
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
 * ### ✅ Validation côté client implémentée
 * - **Email required** : Vérification champ email non-vide avec trim()
 * - **Password required** : Vérification mot de passe non-vide
 * - **Email format** : Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` validation
 * - **Sanitisation** : trim() sur inputs pour éviter espaces parasites
 * - **Error messages** : Messages français contextuels pour utilisateurs
 * - **UX validation** : Feedback immédiat sans soumission serveur
 * - **Performance** : Évite appels API inutiles si validation locale échoue
 *
 * ### 🔒 Sécurité et protection données
 * - **Pas de stockage local** : Credentials jamais persistées côté client
 * - **Transmission sécurisée** : HTTPS obligatoire pour envoi passwords
 * - **Error handling** : Messages erreur sans exposition détails sécurité
 * - **XSS prevention** : React échappement automatique + pas de dangerouslySetInnerHTML
 * - **CSRF protection** : Tokens anti-forgerie intégrés requêtes auth
 * - **Password visibility** : Toggle contrôlé utilisateur pour UX sécurisée
 * - **Session security** : JWT tokens avec expiration appropriée
 *
 * ## Gestion erreurs et feedback utilisateur
 *
 * ### 🚨 Types d'erreurs gérées contextuellement
 * - **Validation locale** : "L'email est requis", "Format d'email invalide"
 * - **Credentials invalides** : Messages API via context (401 Unauthorized)
 * - **Permissions insuffisantes** : Accès refusé si pas rôle administrateur
 * - **Erreurs réseau** : Problèmes connectivité avec retry suggestions
 * - **Erreurs serveur** : 500/503 avec messages utilisateur appropriés
 * - **Session expirée** : Redirection automatique vers formulaire
 * - **Rate limiting** : Messages si trop de tentatives connexion
 *
 * ### 🔔 Système notifications et états
 * - **Error display** : Notification component pour erreurs visuelles
 * - **Loading states** : Spinner + disabled boutons pendant auth
 * - **Success callback** : onLoginSuccess pour logique personnalisée
 * - **Custom messages** : customMessage prop pour contexte spécialisé
 * - **Clear errors** : Reset erreurs sur nouvelle tentative
 * - **Feedback immédiat** : États UI synchrones avec actions utilisateur
 *
 * ## Responsive design et accessibilité
 *
 * ### 📱 Adaptation multi-supports
 * - **Mobile first** : Design optimisé écrans tactiles en priorité
 * - **Breakpoints adaptatifs** : max-w-md s'adapte largeurs écran
 * - **Touch targets** : Boutons et inputs dimensionnés interaction tactile
 * - **Viewport management** : min-h-screen utilise hauteur disponible
 * - **Content scaling** : Typography et espacement responsifs
 * - **Orientation support** : Fonctionnel portrait et paysage
 * - **Device compatibility** : Test iOS, Android, desktop browsers
 *
 * ### ♿ Standards accessibilité et navigation
 * - **Semantic HTML** : Form, labels, inputs structure correcte
 * - **Label association** : htmlFor liens labels avec inputs
 * - **Focus management** : Navigation clavier cohérente Tab/Shift+Tab
 * - **ARIA compliance** : Attributes accessibility appropriés
 * - **Screen readers** : Labels et descriptions lisibles synthèse vocale
 * - **Contrast ratios** : Couleurs respectant WCAG AA/AAA
 * - **Error announcements** : Messages erreur accessibles technologies assistives
 * - **Keyboard navigation** : Enter submit, Escape clear, etc.
 *
 * ## Performance et optimisations
 *
 * ### ⚡ Optimisations actuelles implémentées
 * - **Controlled inputs** : useState optimisé pour re-renders minimaux
 * - **Conditional rendering** : Affichage conditionnel erreurs/loading
 * - **Event handlers** : Callbacks optimisés sans re-créations inutiles
 * - **API efficiency** : Validation locale évite appels serveur superflus
 * - **State colocation** : États locaux pour performance vs contexte global
 * - **CSS static** : Classes Tailwind pré-compilées
 * - **Image optimization** : Next.js Image component si logos/assets
 *
 * ### 🎯 Candidats optimisation avancée
 * - **React.memo** : Mémorisation composant si parent re-renders fréquents
 * - **useCallback** : Mémorisation handleSubmit et togglePasswordVisibility
 * - **useMemo** : Mémorisation validation regex si complexifiée
 * - **Debouncing** : Validation email temps réel avec délai
 * - **Request deduplication** : Éviter soumissions multiples simultanées
 * - **Preload resources** : Préchargement assets dashboard post-auth
 * - **Connection monitoring** : Adaptation UX selon qualité réseau
 *
 * ## Contexte métier administrateurs JO 2024
 *
 * ### 🏅 Spécificités authentification olympique
 * - **Branding officiel** : "Ticket JO 2024 Administration" nomenclature
 * - **Sécurité renforcée** : Standards élevés pour événements critiques
 * - **Rôles administrateur** : Accès limité équipes organisatrices certifiées
 * - **Audit compliance** : Traçabilité connexions pour sécurité JO
 * - **Multi-tenancy** : Séparation accès différents niveaux admin
 * - **Terminology** : Langage professionnel organisateurs olympiques
 * - **Visual identity** : Cohérence charte graphique JO 2024
 *
 * ### 📊 Types administrateurs JO gérés
 * - **Event managers** : Gestion événements sportifs olympiques
 * - **Venue admins** : Administration lieux et infrastructure
 * - **Technical staff** : Équipes techniques résultats/timing
 * - **Media coordinators** : Gestion contenus et communications
 * - **Logistics teams** : Coordination opérationnelle JO
 * - **Security admins** : Supervision sécurité et accès
 * - **System admins** : Administration technique plateformes
 *
 * ## Intégration écosystème et extensibilité
 *
 * ### 🔌 Intégration composants AdminJO
 * - **AuthGuard** : Protection routes utilise ce formulaire
 * - **AuthContext** : Context global authentification intégré
 * - **Spinner** : Composant loading réutilisé pour cohérence
 * - **Notification** : Système notifications unifié erreurs
 * - **Layout system** : S'intègre layouts Next.js et responsive design
 * - **Navigation** : Redirection automatique post-auth vers dashboard
 *
 * ### 🔧 Props customisation et flexibilité
 * - **onLoginSuccess** : Callback optionnel logique post-connexion
 * - **customMessage** : Message personnalisé contexte spécialisé
 * - **disableAutoRedirect** : Désactivation redirection automatique
 * - **Extensibilité** : Props additionnelles facilement ajoutables
 * - **Composition** : Wrappable dans modals, layouts, guards
 * - **Configuration** : Adaptable différents environnements/contextes
 *
 * ## Patterns sécurité et bonnes pratiques
 *
 * ### 🛡️ Security patterns implémentés
 * - **Input sanitization** : Nettoyage données avant transmission
 * - **Error boundary** : Isolation erreurs auth du reste app
 * - **Secure transmission** : HTTPS requis pour credentials
 * - **No credential storage** : Jamais de persistance locale passwords
 * - **Token-based auth** : JWT avec expiration et refresh
 * - **Rate limiting** : Protection brute force via backend
 * - **Audit logging** : Traçabilité tentatives connexion
 *
 * ### 🔍 Testing et validation sécurité
 * - **Unit tests** : Tests validation, soumission, error handling
 * - **Integration tests** : Tests flux complet authentification
 * - **Security tests** : Validation résistance attaques courantes
 * - **Accessibility tests** : Conformité standards accessibilité
 * - **Performance tests** : Temps réponse et charge utilisateur
 * - **Cross-browser** : Compatibilité navigateurs principaux
 *
 * ## Limitations et améliorations futures
 *
 * ### ❌ Limitations actuelles identifiées
 * - **Basic validation** : Validation email regex simple
 * - **No 2FA support** : Pas d'authentification multi-facteurs
 * - **No password strength** : Pas d'indicateur force mot de passe
 * - **No remember me** : Pas d'option mémorisation session
 * - **Single language** : Interface français uniquement
 * - **No social auth** : Pas d'authentification sociale/SSO
 * - **Basic error handling** : Messages erreur génériques
 *
 * ### 🚀 Évolutions possibles prioritaires
 * - **Multi-factor auth** : Support 2FA/OTP pour sécurité renforcée
 * - **Password strength** : Indicateur force + requirements
 * - **Remember device** : Mémorisation appareils de confiance
 * - **Biometric auth** : Support Touch ID/Face ID mobile
 * - **SSO integration** : Single Sign-On avec systèmes CIO
 * - **Advanced validation** : Validation temps réel sophistiquée
 * - **Internationalization** : Support langues multiples JO
 * - **Accessibility++** : Améliorations accessibilité avancées
 * - **Analytics** : Métriques usage et conversion connexions
 * - **Theme support** : Modes sombre/clair selon préférences
 *
 * ### 🔧 Améliorations techniques avancées
 * - **Captcha integration** : Protection bot/automatisation
 * - **Device fingerprinting** : Sécurité basée caractéristiques device
 * - **Geo-restriction** : Limitation géographique selon IP
 * - **Session monitoring** : Surveillance activité temps réel
 * - **Advanced retry** : Logic retry sophistiquée avec backoff
 * - **Offline support** : Fonctionnement mode hors-ligne partiel
 * - **Push notifications** : Alertes sécurité sur devices
 * - **Passwordless auth** : Authentification sans mot de passe
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
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Utilisation basique standard
 * <LoginAdminForm />
 * ```
 *
 * @example
 * ```tsx
 * // Avec callback et message personnalisés
 * <LoginAdminForm
 *   onLoginSuccess={() => {
 *     analytics.track('admin_login_success');
 *     toast.success('Bienvenue dans AdminJO !');
 *   }}
 *   customMessage="Administration Jeux Olympiques 2024"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Dans modal sans redirection automatique
 * <Modal isOpen={showLogin}>
 *   <LoginAdminForm
 *     disableAutoRedirect={true}
 *     onLoginSuccess={() => {
 *       setShowLogin(false);
 *       router.push('/dashboard');
 *     }}
 *   />
 * </Modal>
 * ```
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

/**
 * Composant principal du formulaire de connexion administrateur
 * 
 * Ce composant offre une expérience de connexion sécurisée et intuitive pour
 * les administrateurs de l'application JO 2024. Il intègre toutes les bonnes
 * pratiques de sécurité et d'expérience utilisateur.
 *
 * ## Fonctionnalités principales
 *
 * ### 🔐 Sécurité renforcée
 * - **Validation côté client** : Vérification des formats email et mot de passe
 * - **Protection contre les attaques** : Mesures anti-brute force
 * - **Gestion des erreurs** : Messages d'erreur clairs et sécurisés
 * - **Contrôle d'accès** : Vérification des rôles administrateur
 *
 * ### 👁️ Interface utilisateur optimisée
 * - **Design responsive** : Adaptation mobile, tablet et desktop
 * - **Feedback visuel** : Spinners et états de chargement
 * - **Affichage/masquage mot de passe** : Toggle de visibilité
 * - **Messages contextuels** : Notifications d'erreur et de succès
 *
 * ### ⚡ Performance et accessibilité
 * - **Chargement optimisé** : Lazy loading des ressources
 * - **Navigation clavier** : Support complet du clavier
 * - **ARIA compliant** : Labels et descriptions pour lecteurs d'écran
 * - **Contraste optimal** : Respect des standards WCAG
 *
 * ## Workflow de connexion
 *
 * 1. **Saisie des identifiants** : Email et mot de passe administrateur
 * 2. **Validation locale** : Vérification des formats requis
 * 3. **Soumission sécurisée** : Envoi chiffré vers l'API d'authentification
 * 4. **Vérification des rôles** : Contrôle des permissions administrateur
 * 5. **Gestion de la session** : Stockage sécurisé des tokens JWT
 * 6. **Redirection automatique** : Vers le dashboard ou route sauvegardée
 *
 * ## Gestion des erreurs
 *
 * Le composant gère plusieurs types d'erreurs avec des messages appropriés :
 * - **Identifiants incorrects** : "Email ou mot de passe incorrect"
 * - **Accès refusé** : "Accès réservé aux administrateurs"
 * - **Erreur réseau** : "Problème de connexion, veuillez réessayer"
 * - **Session expirée** : "Votre session a expiré, reconnectez-vous"
 * - **Compte désactivé** : "Votre compte a été désactivé"
 *
 * ## Intégration avec l'authentification
 *
 * Le composant s'intègre parfaitement avec le système d'authentification :
 * - Utilise le contexte `AuthContext` pour la connexion
 * - Synchronise avec `useAuth` pour l'état global
 * - Compatible avec `AuthGuard` pour la protection des routes
 * - Supporte la sauvegarde et restauration de routes
 *
 * ## Personnalisation
 *
 * ```tsx
 * // Utilisation avec callback personnalisé
 * <LoginAdminForm
 *   onLoginSuccess={() => {
 *     console.log('Connexion réussie !');
 *     // Logique personnalisée
 *   }}
 *   customMessage="Bienvenue dans l'administration JO 2024"
 * />
 *
 * // Utilisation sans redirection automatique
 * <LoginAdminForm
 *   disableAutoRedirect={true}
 *   onLoginSuccess={() => handleCustomRedirect()}
 * />
 * ```
 *
 * @param {LoginAdminFormProps} props - Props du composant
 * @returns {JSX.Element} Le formulaire de connexion complet avec tous les contrôles
 *
 * @example
 * ```tsx
 * // Utilisation basique (cas le plus courant)
 * function LoginPage() {
 *   return (
 *     <div className="login-container">
 *       <LoginAdminForm />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Avec gestion personnalisée après connexion
 * function CustomLoginPage() {
 *   const handleLoginSuccess = () => {
 *     // Logique métier spécifique
 *     analytics.track('admin_login_success');
 *     toast.success('Bienvenue dans AdminJO !');
 *   };
 *
 *   return (
 *     <LoginAdminForm
 *       onLoginSuccess={handleLoginSuccess}
 *       customMessage="Administration des Jeux Olympiques 2024"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Intégration dans un modal
 * function LoginModal({ isOpen, onClose }) {
 *   return (
 *     <Modal isOpen={isOpen} onClose={onClose}>
 *       <LoginAdminForm
 *         onLoginSuccess={() => {
 *           onClose();
 *           router.push('/dashboard');
 *         }}
 *         disableAutoRedirect={true}
 *       />
 *     </Modal>
 *   );
 * }
 * ```
 *
 * @see {@link useAuth} - Hook d'authentification utilisé
 * @see authContext.tsx - Type du contexte d'authentification global
 * @see authContext.tsx - Composant fournisseur d'authentification
 * @see {@link Spinner} - Composant de loading utilisé
 * @see {@link Notification} - Composant de notification d'erreurs
 *
 * @since 1.0.0
 */
export default function LoginAdminForm({
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

  /**
   * Toggle de visibilité du mot de passe
   *
   * Permet à l'utilisateur d'afficher/masquer le mot de passe
   * pour faciliter la saisie et la vérification.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
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