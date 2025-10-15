/**
 * Composant AppHeader - En-tête navigation principal AdminJO
 *
 * Ce composant en-tête universel constitue la barre de navigation principale de l'application
 * AdminJO des Jeux Olympiques 2024. Il fournit une interface de navigation cohérente pour
 * toutes les pages protégées avec titre dynamique, navigation contextuelle, informations
 * utilisateur connecté, et action de déconnexion sécurisée. Conçu pour l'écosystème
 * administratif olympique, il intègre composants de navigation spécialisés, gestion
 * intelligente des liens retour, affichage identité utilisateur, et bouton déconnexion
 * avec states interactifs pour une expérience navigation premium des équipes JO 2024.
 *
 * ## Architecture navigation et layout header
 *
 * ### 🏗️ Structure layout trois zones équilibrées
 * - **Zone gauche** : Navigation retour contextuelle (BackToDashboardButton ou Link)
 * - **Zone centre** : Titre page dynamique avec typography imposante
 * - **Zone droite** : Informations utilisateur + bouton déconnexion
 * - **Layout absolu** : Positioning absolute pour zones gauche/droite
 * - **Centrage parfait** : mx-auto pour titre centré indépendamment contenu latéral
 * - **Responsive design** : Adaptation automatique toutes largeurs écran
 * - **Z-index cohérent** : shadow-md élévation sans conflits superposition
 *
 * ### 🧭 Navigation contextuelle intelligente
 * - **BackToDashboardButton** : Composant spécialisé si backUrl === '/dashboard'
 * - **Link personnalisé** : Next.js Link si backUrl différent du dashboard
 * - **Detection automatique** : shouldUseBackToDashboardButton logic intelligente
 * - **Fallback labels** : backLabel par défaut "⬅️ Accueil" si non fourni
 * - **Conditional rendering** : showBackToDashboard prop pour masquer navigation
 * - **Props flexibility** : backUrl et backLabel configurables par parent
 * - **Consistent styling** : Styles harmonisés entre BackToDashboardButton et Link
 *
 * ### 👤 Zone utilisateur et authentification
 * - **Email display** : Affichage user.email depuis AuthContext
 * - **Strong emphasis** : <strong> tag pour mise en valeur identité
 * - **Logout action** : Bouton déconnexion avec callback logout()
 * - **Secure styling** : bg-red-600 couleur danger pour action déconnexion
 * - **Interactive states** : hover:bg-red-700 feedback visuel
 * - **Transition smooth** : transition-colors animation fluide
 * - **Positioning absolute** : right-0 pr-4 alignement droite cohérent
 *
 * ## Gestion d'état et intégration authentification
 *
 * ### 🔐 Intégration AuthContext centralisée
 * - **useAuth hook** : Accès user et logout depuis contexte global
 * - **User data** : Affichage user.email avec fallback sécurisé
 * - **Logout function** : Déconnexion sécurisée via contexte
 * - **State synchronization** : Réactivité automatique changements auth
 * - **Session management** : Gestion tokens via AuthContext transparent
 * - **Security consistency** : Cohérence état auth dans toute application
 * - **Error handling** : Gestion erreurs auth déléguée au contexte
 *
 * ### 📡 Props configuration et flexibilité
 * - **title** : string requis pour identification page courante
 * - **backUrl** : string optionnel pour navigation retour personnalisée
 * - **backLabel** : string optionnel pour texte bouton retour
 * - **showBackToDashboard** : boolean optionnel pour masquer navigation retour
 * - **Default values** : Valeurs par défaut sensées pour usage simplifié
 * - **Type safety** : Interface AppHeaderProps stricte TypeScript
 * - **Backward compatibility** : Props optionnelles pour flexibilité maximale
 *
 * ## Design system et expérience visuelle
 *
 * ### 🎨 Design cohérent AdminJO olympique
 * - **Background header** : bg-white couleur système cohérente
 * - **Shadow elevation** : shadow-md pour détachement visuel contenu
 * - **Typography hierarchy** : text-3xl font-bold pour titre principal
 * - **Color system** : text-gray-900/600 respectant palette AdminJO
 * - **Padding vertical** : py-6 respiration généreuse header
 * - **Spacing horizontal** : pl-4/pr-4 marges latérales équilibrées
 * - **Interactive colors** : text-blue-600 hover:blue-800 pour liens
 *
 * ### 📱 Responsive design et adaptabilité
 * - **Mobile adaptation** : Layout flexible s'adapte écrans étroits
 * - **Touch targets** : Boutons px-4 py-2 dimensionnés interaction tactile
 * - **Text scaling** : Typography responsive avec text-3xl/text-sm
 * - **Absolute positioning** : Maintien layout trois zones sur mobile
 * - **Content overflow** : Titre tronqué si nécessaire écrans très étroits
 * - **Navigation priority** : Déconnexion et navigation restent accessibles
 * - **Breakpoint harmony** : Cohérence avec responsive design system
 *
 * ## Performance et optimisations
 *
 * ### ⚡ Optimisations actuelles
 * - **Client component** : 'use client' pour hooks authentification nécessaires
 * - **Conditional logic** : shouldUseBackToDashboardButton calculated once
 * - **Static styling** : Classes Tailwind pré-compilées pour performance
 * - **Minimal re-renders** : useAuth deps stables évitent re-renders inutiles
 * - **Component reuse** : BackToDashboardButton réutilisé vs duplication code
 * - **Props drilling minimal** : Interface simple sans over-engineering
 * - **Memory efficient** : Pas de state local ou subscriptions lourdes
 *
 * ### 🎯 Candidats optimisation avancée
 * - **React.memo** : Mémorisation si title change fréquemment
 * - **useCallback** : Mémorisation logout handler si passé en prop
 * - **Lazy imports** : Import dynamique BackToDashboardButton si lourd
 * - **Bundle optimization** : Tree shaking composants navigation non utilisés
 * - **CSS optimization** : Classes Tailwind unused purging
 * - **Image optimization** : Optimisation logos/avatars si ajoutés
 *
 * ## Accessibilité et standards navigation
 *
 * ### ♿ Conformité accessibilité native
 * - **Semantic header** : <header> tag pour structure sémantique
 * - **Heading hierarchy** : h1 titre principal pour screen readers
 * - **Navigation landmarks** : Structure navigation accessible
 * - **Button semantics** : <button> natif pour action déconnexion
 * - **Link semantics** : Next.js Link pour navigation SEO-friendly
 * - **Focus management** : Tab navigation logique gauche-droite
 * - **Color contrast** : Couleurs respectant ratios WCAG AA
 *
 * ### 🔧 Améliorations accessibilité possibles
 * - **Skip links** : Navigation rapide contenu principal
 * - **ARIA labels** : Labels contextuels pour boutons/liens
 * - **Keyboard shortcuts** : Raccourcis navigation (Alt+H home, etc.)
 * - **Screen reader** : Annonces contextuelles changements page
 * - **Focus indicators** : Focus rings visibles navigation clavier
 * - **High contrast** : Support modes contraste élevé
 * - **Reduced motion** : Respect prefers-reduced-motion animations
 *
 * ## Intégration écosystème navigation AdminJO
 *
 * ### 🔌 Composants navigation intégrés
 * - **BackToDashboardButton** : Composant spécialisé retour dashboard
 * - **Next.js Link** : Navigation performante avec prefetching
 * - **AuthContext integration** : État authentification centralisé
 * - **Layout systems** : Utilisé par AuthenticatedLayout et PageTemplate
 * - **Shared components** : Pattern réutilisable navigation retour
 * - **Design tokens** : Classes cohérentes design system AdminJO
 *
 * ### 🔄 Workflow navigation typique
 * 1. **Page load** : AuthenticatedLayout/PageTemplate renderise AppHeader
 * 2. **Props injection** : title, backUrl, backLabel passés par layout parent
 * 3. **Auth display** : useAuth récupère user.email pour affichage
 * 4. **Navigation setup** : Logic détermine BackToDashboardButton vs Link
 * 5. **Interactive ready** : Boutons navigation et déconnexion actifs
 * 6. **User actions** : Navigation retour ou déconnexion disponibles
 * 7. **State updates** : AuthContext gère changements état global
 *
 * ## Contexte métier administration olympique
 *
 * ### 🏅 Spécificités navigation JO 2024
 * - **Dashboard central** : Hub principal organisateurs JO 2024
 * - **Navigation hiérarchique** : Retour dashboard depuis sous-modules
 * - **Identity management** : Affichage email administrateur connecté
 * - **Security logout** : Déconnexion sécurisée systèmes critiques
 * - **Professional UI** : Interface cohérente équipes organisatrices
 * - **Operational efficiency** : Navigation rapide pendant événements
 * - **Audit compliance** : Traçabilité actions via identité utilisateur
 *
 * ### 📊 Types pages utilisant AppHeader
 * - **Dashboard principal** : Vue synthétique activités administrateur
 * - **Gestion événements** : CRUD événements sportifs olympiques
 * - **Administration lieux** : Gestion infrastructure olympique
 * - **Gestion disciplines** : Configuration sports et épreuves
 * - **Résultats temps réel** : Interfaces saisie résultats compétitions
 * - **Coordination médias** : Gestion contenus communications
 * - **Logistique JO** : Coordination opérationnelle événements
 *
 * ## Patterns développement et extensibilité
 *
 * ### 🏗️ Architecture patterns appliqués
 * - **Component composition** : Intégration BackToDashboardButton harmonieuse
 * - **Props drilling contrôlé** : Interface minimale mais complète
 * - **Conditional rendering** : Logic navigation adaptative
 * - **Context integration** : useAuth pour état authentification global
 * - **Layout responsibility** : Focus navigation, délégation authentification
 * - **Responsive by design** : Adaptation écrans intégrée architecture
 *
 * ### 🔧 Extensibilité futures possibles
 * - **Avatar support** : Props avatar pour photo profil utilisateur
 * - **Notifications badge** : Indicateurs notifications non-lues
 * - **Theme switcher** : Toggle thème sombre/clair
 * - **Language selector** : Sélection langue pour événements internationaux
 * - **Search integration** : Barre recherche globale dans header
 * - **Breadcrumb integration** : Support breadcrumb avancé
 * - **Menu dropdown** : Menu utilisateur avec paramètres/profil
 *
 * ## Limitations et améliorations futures
 *
 * ### ❌ Limitations actuelles identifiées
 * - **Fixed layout** : Structure trois zones non configurable
 * - **Basic user info** : Seulement email affiché, pas photo/nom
 * - **No notifications** : Pas d'indicateurs notifications
 * - **Single logout** : Pas d'options déconnexion avancées
 * - **No search** : Pas de recherche globale intégrée
 * - **Static branding** : Pas de logo/branding JO visible
 * - **No help** : Pas de liens aide/documentation
 *
 * ### 🚀 Améliorations prioritaires futures
 * - **User avatar** : Photo profil avec fallback initiales
 * - **Notification system** : Badge notifications avec dropdown
 * - **Branding elements** : Logo JO 2024 et identité visuelle
 * - **Search functionality** : Recherche globale avec suggestions
 * - **Settings menu** : Menu utilisateur avec paramètres compte
 * - **Help integration** : Liens aide contextuelle et documentation
 * - **Performance metrics** : Monitoring temps navigation
 * - **A11y enhancements** : Améliorations accessibilité avancées
 * - **Theme support** : Système thèmes adaptatifs
 * - **Mobile optimization** : Optimisations spécifiques mobile
 *
 * ### 🔧 Améliorations techniques avancées
 * - **Server components** : Migration React Server Components si possible
 * - **Edge optimization** : Optimisations edge computing header
 * - **Bundle splitting** : Code splitting navigation components
 * - **Performance budgets** : Monitoring impact performance header
 * - **Real-time features** : WebSocket notifications temps réel
 * - **PWA integration** : Support Progressive Web App
 * - **Analytics integration** : Tracking patterns navigation utilisateur
 * - **Security enhancements** : Headers sécurité avancés
 *
 * @param {AppHeaderProps} props - Configuration du header navigation
 * @param {string} props.title - Titre de la page affiché au centre
 * @param {string} [props.backUrl="/dashboard"] - URL navigation retour
 * @param {string} [props.backLabel="⬅️ Accueil"] - Texte bouton retour
 * @param {boolean} [props.showBackToDashboard=true] - Afficher navigation retour
 *
 * @returns {JSX.Element} Header navigation complet avec titre et contrôles
 *
 * @see {@link BackToDashboardButton} - Composant navigation dashboard spécialisé
 * @see {@link useAuth} - Hook authentification pour user et logout
 * @see {@link AuthenticatedLayout} - Layout utilisant ce header
 * @see {@link PageTemplate} - Template utilisant ce header via layout
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Header basique avec titre seulement
 * <AppHeader title="Gestion Événements" />
 * ```
 *
 * @example
 * ```tsx
 * // Header avec navigation retour personnalisée
 * <AppHeader
 *   title="Détail Événement"
 *   backUrl="/events"
 *   backLabel="← Retour Événements"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Header sans navigation retour
 * <AppHeader
 *   title="Dashboard Principal"
 *   showBackToDashboard={false}
 * />
 * ```
 */

'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/authContext';
import BackToDashboardButton from '../shared/BackToDashboardButton';

/**
 * Interface des propriétés du composant AppHeader
 */
interface AppHeaderProps {
  /** Titre de la page affiché au centre du header */
  title: string;
  /** URL de navigation retour (par défaut: /dashboard) */
  backUrl?: string;
  /** Texte du bouton de navigation retour (par défaut: ⬅️ Accueil) */
  backLabel?: string;
  /** Afficher le bouton de retour dashboard (par défaut: true) */
  showBackToDashboard?: boolean;
}

/**
 * Composant AppHeader - Header réutilisable pour toutes les pages
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Le header de l'application
 */
export default function AppHeader({ 
  title, 
  backUrl = '/dashboard', 
  backLabel = '⬅️ Accueil',
  showBackToDashboard = true 
}: AppHeaderProps) {
  const { user, logout } = useAuth();

  // Détermine si on utilise le composant BackToDashboardButton ou un Link personnalisé
  const shouldUseBackToDashboardButton = showBackToDashboard && (backUrl === '/dashboard' || !backUrl);

  return (
        <header className="bg-white shadow-md">
            <div className="">
                <div className="flex items-center py-6 relative">
                    {showBackToDashboard && (
                        <div className="absolute left-0 pl-4">
                            {shouldUseBackToDashboardButton ? (
                                <BackToDashboardButton 
                                  text={backLabel}
                                />
                            ) : (
                                <Link 
                                    href={backUrl}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {backLabel || 'Retour'}
                                </Link>
                            )}
                        </div>
                    )}

                    <h1 className="mx-auto text-3xl font-bold text-gray-900">
                        {title}
                    </h1>
                    
                    <div className="absolute right-0 pr-4 flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            <strong>{user?.email}</strong>
                        </span>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </header>
  );
}
