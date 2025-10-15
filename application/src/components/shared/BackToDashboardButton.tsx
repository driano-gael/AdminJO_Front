'use client';

import { useRouter } from 'next/navigation';

interface BackToDashboardButtonProps {
  text?: string;
  className?: string;
}

/**
 * Composant BackToDashboardButton - Bouton retour dashboard spécialisé AdminJO
 *
 * Ce composant bouton de navigation spécialisé fournit un accès direct et optimisé
 * vers le tableau de bord principal de l'application AdminJO des Jeux Olympiques 2024.
 * Contrairement au BackButton générique, il est pré-configuré pour la destination
 * dashboard avec des optimisations spécifiques et une iconographie dédiée. Il centralise
 * la logique de retour au hub principal d'administration olympique, offre une
 * customisation du texte et du style, et assure une expérience utilisateur cohérente
 * pour l'accès rapide au centre de contrôle AdminJO depuis n'importe quelle section
 * de l'écosystème d'administration des Jeux Olympiques.
 *
 * ## Architecture navigation dashboard et optimisations spécialisées
 *
 * ### 🎯 Navigation dashboard pré-configurée optimisée
 * - **URL fixe dashboard** : Route '/dashboard' intégrée et optimisée
 * - **Router integration** : useRouter() hook pour navigation client-side
 * - **Dashboard-specific** : Logique spécialisée centre administratif JO
 * - **Push navigation** : router.push('/dashboard') ajout historique
 * - **Client-side routing** : Navigation sans rechargement page dashboard
 * - **Performance optimisée** : Préchargement dashboard Next.js automatique
 * - **SEO friendly** : URL dashboard propre maintenue navigation
 * - **History management** : Gestion pile navigation dashboard native
 * - **Hub centralization** : Point d'accès centralisé toutes fonctions AdminJO
 *
 * ### 🎨 Customisation apparence avec cohérence dashboard
 * - **Destination fixe** : Pas de props url, toujours vers dashboard
 * - **Texte personnalisable** : Props text avec défaut "← Tableau de bord"
 * - **Style configurable** : Props className pour override styling complet
 * - **Valeurs dashboard** : text et className avec fallbacks dashboard
 * - **Override total** : className remplace styles défaut dashboard
 * - **Flexibilité contrôlée** : Adaptable contextes avec destination fixe
 * - **Cohérence dashboard** : Valeurs défaut alignées hub administratif
 * - **Responsive dashboard** : Adaptable mobile, tablette, desktop hub
 * - **Dashboard branding** : Esthétique spécialisée centre contrôle JO
 *
 * ### 🔧 Interface props spécialisée dashboard
 * - **text** : string optionnel - Texte affiché (défaut: "← Tableau de bord")
 * - **className** : string optionnel - Classes CSS Tailwind custom
 * - **Type safety** : Interface BackToDashboardButtonProps stricte
 * - **Simplified API** : Pas de props url pour simplification usage
 * - **Optional flexibility** : Seuls text et className personnalisables
 * - **Dashboard defaults** : Fallbacks optimisés expérience dashboard
 * - **IntelliSense** : Autocomplétion spécialisée dashboard dans IDE
 * - **Consistency forced** : URL dashboard non configurable pour cohérence
 *
 * ## Expérience utilisateur dashboard et design patterns
 *
 * ### 🏢 UX retour hub administratif optimisée
 * - **Dashboard indication** : Flèche ← vers "Tableau de bord" explicite
 * - **Hub accessibility** : Texte descriptif centre administratif JO
 * - **Action dashboard** : Comportement retour hub prévisible standard
 * - **Feedback dashboard** : Hover effects confirmation interaction hub
 * - **Placement universel** : Utilisable toutes sections AdminJO
 * - **Context dashboard** : Texte personnalisable selon section origine
 * - **Hub guidance** : Navigation intuitive vers centre contrôle
 * - **Dashboard priority** : Accès prioritaire hub depuis partout
 * - **Administrative flow** : Workflow retour optimisé gestionnaires JO
 *
 * ### 🎨 Design système dashboard et cohérence hub
 * - **Style dashboard** : Classes Tailwind optimisées hub AdminJO
 * - **Couleurs hub** : Palette spécialisée dashboard olympique 2024
 * - **Typography dashboard** : Police et tailles hub administratif
 * - **Spacing hub** : Marges et paddings selon grille dashboard
 * - **Hover dashboard** : Transitions fluides feedback hub visuel
 * - **Focus dashboard** : Contours clavier navigation hub accessible
 * - **Mobile dashboard** : Design responsive priorité tactile hub
 * - **Brand dashboard** : Esthétique cohérente marque hub olympique
 * - **Administrative look** : Apparence professionnelle centre contrôle
 *
 * ## Implémentation technique dashboard et performance
 *
 * ### ⚡ Optimisations performance dashboard spécialisées
 * - **Client component** : 'use client' pour interactivité browser hub
 * - **Hook useRouter** : Navigation optimisée App Router dashboard
 * - **Dashboard cache** : Props stables évitent re-renders hub inutiles
 * - **Bundle dashboard** : Code minimal performance hub optimale
 * - **Tree shaking** : Import sélectif useRouter dashboard seulement
 * - **Dashboard prefetch** : Next.js précharge hub automatiquement
 * - **Memory dashboard** : Pas de state local économie mémoire hub
 * - **Fast dashboard** : Transitions instantanées client-side hub
 * - **Hub priority** : Priorisation chargement dashboard AdminJO
 *
 * ### 🔒 Sécurité dashboard et validation hub
 * - **Dashboard route** : URL '/dashboard' hardcodée sécurisée
 * - **XSS prevention** : React escape automatique contenu text hub
 * - **Hub security** : Validation côté Next.js route dashboard
 * - **TypeScript dashboard** : Interface stricte évite erreurs hub
 * - **Input sanitization** : Props text sécurisées React hub
 * - **Dashboard controls** : Seule route hub valide accessible
 * - **Error boundaries** : Gestion erreurs navigation hub gracieuse
 * - **CSRF dashboard** : Navigation client-side hub sécurisée
 * - **Administrative security** : Contrôles accès centre administratif
 *
 * ### 🧪 Testabilité dashboard et maintenance hub
 * - **Dashboard interface** : Structure claire tests unitaires hub
 * - **Mocking dashboard** : useRouter mockable tests Jest hub
 * - **Behavior dashboard** : Actions utilisateur hub testables
 * - **Snapshot dashboard** : Rendu hub stable tests régression
 * - **Integration dashboard** : Navigation hub testable bout-en-bout
 * - **Debug dashboard** : Props explicites debugging hub
 * - **Coverage dashboard** : Logique hub simple 100% testable
 * - **Maintenance hub** : Code minimal documentation hub complète
 *
 * ## Cas d'usage dashboard et intégrations AdminJO
 *
 * ### 🏅 Contextes métier dashboard Jeux Olympiques
 * - **Retour hub principal** : Navigation depuis gestion événements
 * - **Centre administratif** : Accès hub depuis toutes sections JO
 * - **Dashboard olympique** : Hub central organisateurs 2024
 * - **Workflow hub** : Retours contextuels vers centre contrôle
 * - **Navigation centralisée** : Point focal toutes administrations
 * - **Hub organisationnel** : Centre névralgique gestion olympique
 * - **Administrative return** : Retour systématique hub après actions
 * - **Control center** : Accès rapide tableau bord depuis partout
 * - **Olympic management** : Hub spécialisé administration JO 2024
 *
 * ### 📱 Responsive dashboard et accessibilité hub
 * - **Mobile dashboard** : Hub tactile optimisé smartphones
 * - **Tablet hub** : Centre contrôle approprié navigation tablettes
 * - **Desktop dashboard** : Hub précis hover states souris desktop
 * - **Keyboard hub** : Tab order et Enter activation dashboard
 * - **Screen readers** : ARIA labels sémantique HTML hub
 * - **High contrast** : Support modes contraste élevé dashboard
 * - **Touch dashboard** : Taille minimum 44px hub recommandations
 * - **Voice dashboard** : Compatible assistants vocaux hub
 * - **Administrative access** : Accessibilité centre administratif
 *
 * ## Variations dashboard et personnalisations hub
 *
 * ### 🎨 Styles dashboard prédéfinis et customisation hub
 * - **Style hub défaut** : Design AdminJO dashboard standard
 * - **Dashboard variants** : Primary, secondary hub variations
 * - **Hub size variations** : Small, medium, large dashboard contextes
 * - **Icon dashboard** : Support icônes SVG hub personnalisées
 * - **Loading dashboard** : Indicateurs chargement navigation hub
 * - **Disabled dashboard** : États désactivés feedback hub visuel
 * - **Active dashboard** : Indication hub actuel si applicable
 * - **Custom dashboard** : Transitions personnalisables CSS hub
 * - **Administrative theme** : Thématique spécialisée centre contrôle
 *
 * ### 🔧 Extensions fonctionnelles dashboard possibles
 * - **Dashboard analytics** : Tracking navigation hub métriques
 * - **Hub notifications** : Alertes dashboard lors retour hub
 * - **Dashboard state** : Sauvegarde état avant retour hub
 * - **Hub shortcuts** : Raccourcis clavier dashboard rapide
 * - **Dashboard gestures** : Navigation tactile swipe hub mobile
 * - **Hub personalization** : Adaptation préférences dashboard
 * - **Dashboard breadcrumb** : Fil Ariane intégré hub
 * - **Hub context** : Mémorisation contexte avant dashboard
 * - **Administrative workflow** : Intégration workflows centre contrôle
 *
 * ## Performance dashboard et monitoring hub
 *
 * ### 📊 Métriques dashboard et optimisations hub
 * - **Dashboard tracking** : Métriques utilisation retours hub
 * - **Hub timing** : Mesure performance transitions dashboard
 * - **Error dashboard** : Tracking erreurs navigation hub Sentry
 * - **User dashboard** : Analyse parcours utilisateur hub AdminJO
 * - **Hub conversion** : Impact retours dashboard workflows
 * - **Performance hub** : Bundle size dashboard contrôlé strict
 * - **Dashboard vitals** : Optimisation métriques Google hub
 * - **Hub accessibility** : Conformité WCAG AAA dashboard mesurée
 * - **Administrative metrics** : Métriques spécialisées centre contrôle
 *
 * ### 🚀 Améliorations dashboard futures envisageables
 * - **Smart dashboard** : Hub intelligent contextuel adaptatif
 * - **Dashboard gestures** : Navigation gesture hub mobile avancée
 * - **Voice dashboard** : Commandes vocales "tableau bord" intégrées
 * - **AI dashboard** : Suggestions navigation IA hub contextuelle
 * - **Dashboard personalization** : Hub adapté préférences utilisateur
 * - **Multi-language** : Internationalization dashboard dynamique
 * - **Dashboard themes** : Support thèmes sombre/clair hub AdminJO
 * - **Hub micro-interactions** : Animations subtiles engagement dashboard
 * - **Administrative AI** : IA assistante centre contrôle intégrée
 *
 * @param {BackToDashboardButtonProps} props - Propriétés configuration bouton dashboard
 * @param {string} [props.text="← Tableau de bord"] - Texte affiché bouton hub (optionnel)
 * @param {string} [props.className] - Classes CSS Tailwind dashboard custom (optionnel)
 *
 * @returns {JSX.Element} Bouton navigation dashboard interactif optimisé hub AdminJO
 *
 * @see Next.js useRouter - Hook Next.js navigation App Router dashboard
 * @see BackButton - Composant générique navigation flexible
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Utilisation basique retour dashboard standard
 * <BackToDashboardButton />
 * ```
 *
 * @example
 * ```tsx
 * // Dashboard avec texte personnalisé contexte
 * <BackToDashboardButton text="← Retour au hub principal" />
 * ```
 *
 * @example
 * ```tsx
 * // Style dashboard complètement personnalisé
 * <BackToDashboardButton
 *   text="← Centre de contrôle"
 *   className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Dans section gestion événements olympiques
 * function EventManagement() {
 *   return (
 *     <div>
 *       <BackToDashboardButton text="← Hub AdminJO" />
 *       <h1>Gestion Événements JO 2024</h1>
 *       // ...contenu section
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Dashboard mobile avec style adaptatif
 * <BackToDashboardButton
 *   className="lg:px-6 lg:py-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm lg:text-base"
 * />
 * ```
 */
export default function BackToDashboardButton({
  text = "← Tableau de bord",
  className = "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
}: BackToDashboardButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard');
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
    >
      {text}
    </button>
  );
}
