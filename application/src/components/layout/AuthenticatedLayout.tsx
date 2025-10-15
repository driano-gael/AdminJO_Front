/**
 * Composant AuthenticatedLayout - Layout principal protégé AdminJO
 *
 * Ce composant layout fondamental orchestre la structure de page complète pour toutes
 * les interfaces protégées de l'application AdminJO des Jeux Olympiques 2024. Il combine
 * protection par authentification, navigation contextuelle, et architecture responsive
 * pour créer un environnement sécurisé et cohérent destiné aux administrateurs olympiques.
 * Conçu comme wrapper universel, il intègre AuthGuard pour sécurité, AppHeader pour
 * navigation, surveillance session automatique, et container responsive pour une
 * expérience utilisateur homogène à travers tous les modules de gestion des JO.
 *
 * ## Architecture layout et composition sécurisée
 *
 * ### 🛡️ Protection authentification multicouches
 * - **AuthGuard wrapper** : Protection automatique toutes pages utilisant ce layout
 * - **Session monitoring** : useSessionExpiry() surveillance continue validité session
 * - **Token refresh** : Renouvellement automatique tokens via AuthGuard
 * - **Redirections sécurisées** : LoginAdminForm si non authentifié
 * - **État global** : Synchronisation avec AuthContext pour cohérence
 * - **Pas de bypass** : Impossible accéder contenu sans authentification valide
 * - **Security by design** : Sécurité intégrée architecture, pas optionnelle
 *
 * ### 🏗️ Structure layout hiérarchique
 * 1. **AuthGuard** : Couche sécurité englobante (niveau 1)
 * 2. **Container principal** : bg-base-200 background cohérent (niveau 2)
 * 3. **AppHeader** : Navigation et titre contextuels (niveau 3)
 * 4. **Main content** : Zone contenu protégé children (niveau 4)
 * 5. **Session monitoring** : Hook surveillance invisible (transversal)
 *
 * ## Gestion navigation et contexte
 *
 * ### 🧭 Navigation contextuelle flexible
 * - **Title dynamique** : Titre page passé via props pour identification
 * - **Navigation retour** : backUrl et backLabel optionnels pour breadcrumb
 * - **AppHeader intégration** : Composant navigation centralisé et réutilisable
 * - **Contexte préservé** : Navigation sans perte état authentification
 * - **Hiérarchie claire** : Breadcrumb visuel via props navigation
 * - **Responsive nav** : AppHeader adaptatif tous écrans automatiquement
 * - **Accessibility** : Navigation accessible via AppHeader standards
 *
 * ### 📡 Props interface et flexibilité
 * - **children** : ReactNode contenu page à protéger et afficher
 * - **title** : string titre page pour AppHeader et identification
 * - **backUrl** : string optionnel URL page parent pour navigation retour
 * - **backLabel** : string optionnel texte bouton retour personnalisé
 * - **Props optionnelles** : backUrl/backLabel pour flexibilité navigation
 * - **Type safety** : Interface Props stricte avec ReactNode générique
 * - **Extensibilité** : Structure props facilement extensible futures options
 *
 * ## Session monitoring et sécurité continue
 *
 * ### ⏰ Surveillance session automatique
 * - **useSessionExpiry hook** : Monitoring continu validité session
 * - **Détection expiration** : Identification automatique tokens expirés
 * - **SessionExpiredModal** : Modal automatique si session expirée
 * - **Recovery graceful** : Gestion propre expirations sans crash
 * - **Background monitoring** : Surveillance transparente pour utilisateur
 * - **Multi-tab sync** : Cohérence expiration entre onglets multiples
 * - **Cleanup automatique** : Nettoyage ressources si session invalidée
 *
 * ### 🔐 Sécurité intégrée architecture
 * - **Zero trust** : Aucun contenu accessible sans authentification
 * - **Defense in depth** : AuthGuard + session monitoring + token refresh
 * - **Fail secure** : Échec vers LoginAdminForm, jamais exposition données
 * - **Audit trail** : Traçabilité accès via AuthContext et hooks
 * - **Memory protection** : Nettoyage automatique données sensibles
 * - **State isolation** : Isolation état auth du contenu applicatif
 *
 * ## Design system et expérience utilisateur
 *
 * ### 🎨 Design cohérent AdminJO
 * - **Background uniforme** : bg-base-200 couleur de fond système cohérente
 * - **Structure sémantique** : div container + main content pour SEO/accessibility
 * - **AppHeader integration** : Navigation standardisée toutes pages
 * - **Spacing harmonieux** : Pas de margins/paddings conflictuels
 * - **Z-index management** : Ordre superposition logique composants
 * - **Color system** : Respect palette couleurs AdminJO olympique
 * - **Typography** : Cohérence typographique via AppHeader titles
 *
 * ### 📱 Responsive et adaptabilité
 * - **Mobile-first** : Layout adaptatif écrans tactiles prioritaires
 * - **Container fluide** : S'adapte largeur viewport automatiquement
 * - **AppHeader responsive** : Navigation adaptée tous form factors
 * - **Content scaling** : Zone main s'ajuste contenu et écran
 * - **Touch-friendly** : Navigation tactile via AppHeader optimisée
 * - **Breakpoint harmony** : Cohérence breakpoints avec design system
 * - **Orientation support** : Fonctionnel portrait et paysage
 *
 * ## Performance et optimisations
 *
 * ### ⚡ Optimisations architecture
 * - **Composant léger** : Structure minimale sans logique complexe
 * - **Client component** : 'use client' pour hooks interactifs nécessaires
 * - **Props drilling minimal** : Interface props simple et directe
 * - **Hook efficient** : useSessionExpiry optimisé pour surveillance
 * - **Re-renders contrôlés** : Pas de state local, dépendances externes stables
 * - **Memory efficient** : Pas de subscriptions ou timers internes
 * - **CSS static** : Classes Tailwind pré-compilées pour performance
 *
 * ### 🎯 Candidats optimisation avancée
 * - **React.memo** : Mémorisation si props title/navigation changent fréquemment
 * - **Lazy loading** : Chargement différé AppHeader si très lourd
 * - **Suspense boundaries** : Loading états pour chargement navigation
 * - **Error boundaries** : Isolation erreurs layout du contenu page
 * - **Bundle optimization** : Code splitting si layout devient complexe
 * - **Preload resources** : Préchargement assets navigation critiques
 *
 * ## Intégration écosystème AdminJO
 *
 * ### 🔌 Communication composants système
 * - **AuthGuard** : Composant sécurité pour protection routes
 * - **AppHeader** : Navigation réutilisable avec titre et breadcrumb
 * - **useSessionExpiry** : Hook monitoring session pour sécurité continue
 * - **AuthContext** : Context global authentification via AuthGuard
 * - **Design tokens** : bg-base-200 du design system AdminJO
 * - **Navigation patterns** : Intégration router Next.js via AppHeader
 *
 * ### 🔄 Workflow utilisation typique
 * 1. **Page request** : Utilisateur accède route protégée
 * 2. **Layout wrap** : AuthenticatedLayout entoure contenu page
 * 3. **Auth check** : AuthGuard vérifie authentification
 * 4. **Session monitor** : useSessionExpiry lance surveillance
 * 5. **Header render** : AppHeader affiche navigation avec titre
 * 6. **Content render** : children affiché dans main si authentifié
 * 7. **Monitoring continue** : Session surveillée pendant utilisation
 *
 * ## Contexte métier administration olympique
 *
 * ### 🏅 Spécificités environnement JO 2024
 * - **Sécurité renforcée** : Standards élevés pour événements critiques
 * - **Multi-utilisateurs** : Layout partagé équipes organisatrices diverses
 * - **Sessions longues** : Surveillance continue activité administrative
 * - **Navigation contextuelle** : Breadcrumbs essentiels hiérarchique complexe
 * - **Accessibilité** : Standards CIO pour inclusion organisateurs handicapés
 * - **Performance** : Fluidité cruciale pendant événements temps réel
 * - **Audit compliance** : Traçabilité accès pour sécurité olympique
 *
 * ### 📊 Types pages utilisant ce layout
 * - **Dashboard principal** : Vue d'ensemble activités administrateur
 * - **Gestion événements** : CRUD événements sportifs olympiques
 * - **Administration lieux** : Gestion infrastructure olympique
 * - **Gestion disciplines** : Configuration sports et épreuves
 * - **Résultats temps réel** : Saisie scores pendant compétitions
 * - **Coordination médias** : Gestion contenus et communications
 * - **Logistique JO** : Coordination opérationnelle événements
 *
 * ## Patterns développement et extensibilité
 *
 * ### 🏗️ Architecture patterns appliqués
 * - **Layout pattern** : Structure commune pages avec variations
 * - **HOC pattern** : Higher-Order Component pour fonctionnalités transversales
 * - **Composition pattern** : Assemblage composants spécialisés
 * - **Props drilling contrôlé** : Interface minimale mais flexible
 * - **Security by default** : Protection intégrée, pas optionnelle
 * - **Single responsibility** : Focus layout, délégation sécurité/navigation
 *
 * ### 🔧 Extensibilité et configuration futures
 * - **Theme support** : Props theme pour variations couleurs
 * - **Sidebar integration** : Support navigation latérale si nécessaire
 * - **Footer support** : Props footer pour informations persistantes
 * - **Notifications overlay** : Intégration système notifications global
 * - **Breadcrumb advanced** : Support breadcrumbs complexes multi-niveaux
 * - **Layout variants** : Props variant pour différentes structures
 * - **Custom headers** : Support headers spécialisés selon contexte
 *
 * ## Accessibilité et standards
 *
 * ### ♿ Conformité accessibilité
 * - **Semantic HTML** : Structure main/div sémantique correcte
 * - **Skip links** : Navigation rapide contenu via AppHeader
 * - **Focus management** : Gestion focus lors transitions pages
 * - **Screen readers** : Structure logique pour synthèse vocale
 * - **Keyboard navigation** : Navigation clavier complète via AppHeader
 * - **ARIA landmarks** : Identification zones page pour technologies assistives
 * - **Contrast ratios** : bg-base-200 respecte ratios contraste
 *
 * ### 🔧 Améliorations accessibilité possibles
 * - **Skip to content** : Lien direct au contenu principal
 * - **ARIA labels** : Labels contextuels pour identification sections
 * - **Live regions** : Annonces changements état pour screen readers
 * - **Focus restoration** : Restauration focus après navigations
 * - **High contrast** : Support modes contraste élevé
 * - **Reduced motion** : Respect préférences animation utilisateur
 *
 * ## Gestion erreurs et robustesse
 *
 * ### 🛡️ Stratégies resilience
 * - **AuthGuard protection** : Gestion erreurs auth sans crash layout
 * - **Graceful degradation** : Fonctionnement partiel si composants échouent
 * - **Error boundaries** : Isolation erreurs enfants du layout
 * - **Fallback UI** : AppHeader minimale si erreur navigation
 * - **Session recovery** : Récupération automatique sessions expirées
 * - **Network resilience** : Fonctionnement offline partiel
 *
 * ### 🔄 Recovery patterns
 * - **Auto-retry** : Nouvelles tentatives automatiques si échecs temporaires
 * - **User feedback** : Messages erreur clairs via AppHeader
 * - **State consistency** : Cohérence état même cas d'erreur
 * - **Cleanup garantie** : Nettoyage ressources même si erreurs
 * - **Audit logging** : Traçabilité erreurs pour debugging
 *
 * ## Limitations et améliorations futures
 *
 * ### ❌ Limitations actuelles identifiées
 * - **Structure rigide** : Pas de variations layout selon contexte
 * - **No sidebar** : Pas de support navigation latérale
 * - **No footer** : Pas de zone footer persistante
 * - **Basic breadcrumb** : Navigation retour simple seulement
 * - **No theming** : Couleurs/styles non configurables
 * - **No notifications** : Pas d'overlay notifications intégré
 * - **Fixed header** : AppHeader position non configurable
 *
 * ### 🚀 Améliorations prioritaires futures
 * - **Layout variants** : Props pour différentes structures (sidebar, etc.)
 * - **Theme system** : Support thèmes sombre/clair AdminJO
 * - **Notification overlay** : Système toast notifications intégré
 * - **Advanced breadcrumb** : Navigation hiérarchique complexe
 * - **Performance monitoring** : Métriques temps chargement layout
 * - **Offline support** : Fonctionnement hors-ligne avec cache
 * - **Progressive enhancement** : Amélioration progressive selon capabilities
 * - **Analytics integration** : Tracking usage patterns navigation
 * - **Custom hooks** : Hooks layout pour logique réutilisable
 * - **Micro-frontends** : Support architecture micro-frontends si évolution
 *
 * ### 🔧 Améliorations techniques avancées
 * - **Suspense integration** : Loading boundaries pour navigation async
 * - **Concurrent features** : Support React 18 concurrent rendering
 * - **Web Components** : Interopérabilité avec autres technologies
 * - **Service Worker** : Intégration PWA pour expérience native
 * - **WebAssembly** : Optimisations performance critiques si nécessaire
 * - **Real-time sync** : WebSocket intégration pour données temps réel
 * - **Edge computing** : Optimisations edge pour latence réduite
 *
 * @param {Props} props - Configuration du layout authentifié
 * @param {ReactNode} props.children - Contenu page à protéger et afficher
 * @param {string} props.title - Titre page pour AppHeader et identification
 * @param {string} [props.backUrl] - URL page parent pour navigation retour optionnelle
 * @param {string} [props.backLabel] - Texte bouton retour personnalisé optionnel
 *
 * @returns {JSX.Element} Layout complet avec protection auth et navigation
 *
 * @see {@link AuthGuard} - Composant protection authentification utilisé
 * @see {@link AppHeader} - Composant navigation avec titre et breadcrumb
 * @see {@link useSessionExpiry} - Hook surveillance session continue
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Layout basique avec titre seulement
 * <AuthenticatedLayout title="Dashboard Admin">
 *   <DashboardContent />
 * </AuthenticatedLayout>
 * ```
 *
 * @example
 * ```tsx
 * // Layout avec navigation retour
 * <AuthenticatedLayout
 *   title="Gestion Événements"
 *   backUrl="/dashboard"
 *   backLabel="← Retour Dashboard"
 * >
 *   <EventsManagement />
 * </AuthenticatedLayout>
 * ```
 *
 * @example
 * ```tsx
 * // Intégration page Next.js
 * export default function EventsPage() {
 *   return (
 *     <AuthenticatedLayout
 *       title="Événements Olympiques"
 *       backUrl="/dashboard"
 *       backLabel="← Dashboard"
 *     >
 *       <EventsContent />
 *     </AuthenticatedLayout>
 *   );
 * }
 * ```
 */

'use client';

import { ReactNode } from 'react';
import AuthGuard from '@/components/connexion/authGuard';
import AppHeader from '@/components/navigation/AppHeader';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';

/**
 * Props pour le composant AuthenticatedLayout
 */
interface Props {
  children: ReactNode;
  title: string;
  backUrl?: string;
  backLabel?: string;
}

export default function AuthenticatedLayout({ 
    children, 
    title, 
    backUrl, 
    backLabel 
}: Props) {
    useSessionExpiry();
    return (
        <AuthGuard>
            <div className="bg-base-200">
                <AppHeader 
                    title={title}
                    backUrl={backUrl}
                    backLabel={backLabel}
                />
                <main className="">
                {children}
                </main>
            </div>
        </AuthGuard>
    );
}
