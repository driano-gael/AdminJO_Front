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
 * ### Structure layout trois zones équilibrées
 * - **Zone gauche** : Navigation retour contextuelle (BackToDashboardButton ou Link)
 * - **Zone centre** : Titre page dynamique avec typography imposante
 * - **Zone droite** : Informations utilisateur + bouton déconnexion
 *
 * ### Navigation contextuelle intelligente
 * - **BackToDashboardButton** : Composant spécialisé si backUrl === '/dashboard'
 * - **Link personnalisé** : Next.js Link si backUrl différent du dashboard
 * - **Detection automatique** : shouldUseBackToDashboardButton logic intelligente
 * - **Fallback labels** : backLabel par défaut "⬅️ Accueil" si non fourni
 * - **Conditional rendering** : showBackToDashboard prop pour masquer navigation
 * - **Props flexibility** : backUrl et backLabel configurables par parent
 * - **Consistent styling** : Styles harmonisés entre BackToDashboardButton et Link
 *
 * ### Zone utilisateur et authentification
 * - **Email display** : Affichage user.email depuis AuthContext
 * - **Logout action** : Bouton déconnexion avec callback logout()
 *
 * ## Gestion d'état et intégration authentification
 *
 * ### Intégration AuthContext centralisée
 * - **useAuth hook** : Accès user et logout depuis contexte global
 * - **User data** : Affichage user.email avec fallback sécurisé
 * - **Logout function** : Déconnexion sécurisée via contexte
 * - **State synchronization** : Réactivité automatique changements auth
 * - **Session management** : Gestion tokens via AuthContext transparent
 * - **Security consistency** : Cohérence état auth dans toute application
 * - **Error handling** : Gestion erreurs auth déléguée au contexte
 *
 * ### Props configuration et flexibilité
 * - **title** : string requis pour identification page courante
 * - **backUrl** : string optionnel pour navigation retour personnalisée
 * - **backLabel** : string optionnel pour texte bouton retour
 * - **showBackToDashboard** : boolean optionnel pour masquer navigation retour
 * - **Default values** : Valeurs par défaut sensées pour usage simplifié
 * - **Type safety** : Interface AppHeaderProps stricte TypeScript
 * - **Backward compatibility** : Props optionnelles pour flexibilité maximale
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
export function AppHeader({
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
export default AppHeader;
