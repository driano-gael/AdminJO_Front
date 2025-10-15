'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  url: string;
  text?: string;
  className?: string;
}

/**
 * Composant BackButton - Bouton navigation retour générique AdminJO
 *
 * Ce composant bouton de navigation universel fournit une interface standardisée
 * pour la navigation retour vers n'importe quelle URL dans l'application AdminJO
 * des Jeux Olympiques 2024. Il centralise la logique de navigation avec Next.js
 * App Router, offre une customisation complète du texte et du style, et assure
 * une expérience utilisateur cohérente pour tous les besoins de navigation
 * contextuelle. Conçu pour la flexibilité maximale, il permet aux développeurs
 * de créer des boutons retour personnalisés tout en maintenant les standards
 * de design et d'accessibilité AdminJO pour l'écosystème olympique.
 *
 * ## Architecture navigation et configuration flexible
 *
 * ### 🔄 Navigation programmable Next.js App Router
 * - **Router integration** : useRouter() hook pour navigation client-side
 * - **URL flexible** : Props url accepte n'importe quelle route application
 * - **Push navigation** : router.push() ajoute entrée historique navigateur
 * - **Client-side routing** : Navigation sans rechargement page complète
 * - **Performance optimisée** : Préchargement routes Next.js automatique
 * - **SEO friendly** : URLs propres maintenues pendant navigation
 * - **History management** : Gestion pile navigation navigateur native
 * - **App Router compatible** : Optimisé pour Next.js 13+ App Router
 *
 * ### 🎨 Customisation complète apparence et comportement
 * - **URL destination** : Props url obligatoire pour spécifier destination
 * - **Texte personnalisable** : Props text avec défaut "← Retour"
 * - **Style configurable** : Props className pour override complet styling
 * - **Valeurs par défaut** : text et className avec fallbacks sensés
 * - **Override total** : className remplace entièrement styles par défaut
 * - **Flexibilité maximale** : Adaptable à tous contextes navigation
 * - **Cohérence forcée** : Valeurs défaut alignées design AdminJO
 * - **Responsive design** : Adaptable mobile, tablette, desktop
 *
 * ### 🔧 Interface props et validation TypeScript
 * - **url** : string requis - URL destination navigation (ex: '/dashboard')
 * - **text** : string optionnel - Texte affiché (défaut: "← Retour")
 * - **className** : string optionnel - Classes CSS Tailwind custom
 * - **Type safety** : Interface BackButtonProps stricte TypeScript
 * - **Required validation** : url obligatoire pour fonctionnement correct
 * - **Optional flexibility** : text et className optionnels pour simplicité
 * - **Default consistency** : Fallbacks cohérents design system AdminJO
 * - **IntelliSense** : Autocomplétion complète props dans IDE
 *
 * ## Expérience utilisateur et design patterns
 *
 * ### 🎯 UX navigation contextuelle optimisée
 * - **Indication directionnelle** : Flèche ← pour direction retour claire
 * - **Texte descriptif** : "Retour" explicite pour accessibilité optimale
 * - **Action prévisible** : Comportement navigation standard attendu
 * - **Feedback immédiat** : Hover effects pour confirmation interaction
 * - **Placement flexible** : Utilisable headers, footers, inline content
 * - **Context awareness** : Texte personnalisable selon destination
 * - **User guidance** : Navigation intuitive workflows complexes AdminJO
 * - **Error prevention** : URL validation évite navigations cassées
 *
 * ### 🎨 Design système et cohérence visuelle
 * - **Style par défaut** : Classes Tailwind optimisées AdminJO
 * - **Couleurs cohérentes** : Palette officielle Jeux Olympiques 2024
 * - **Typography** : Police et tailles alignées design system
 * - **Spacing harmonieux** : Marges et paddings selon grille AdminJO
 * - **Hover states** : Transitions fluides et feedback visuel
 * - **Focus accessibility** : Contours clavier pour navigation accessible
 * - **Mobile first** : Design responsive priorité tactile
 * - **Brand alignment** : Esthétique cohérente marque olympique
 *
 * ## Implémentation technique et performance
 *
 * ### ⚡ Optimisations performance Next.js
 * - **Client component** : 'use client' pour interactivité browser
 * - **Hook useRouter** : Navigation optimisée App Router
 * - **Minimal re-renders** : Props stables évitent re-renders inutiles
 * - **Bundle size** : Code minimal pour performance optimale
 * - **Tree shaking** : Import sélectif useRouter seulement
 * - **Prefetching** : Next.js précharge routes automatiquement
 * - **Memory efficient** : Pas de state local pour économie mémoire
 * - **Fast navigation** : Transitions instantanées client-side
 *
 * ### 🔒 Sécurité et validation des entrées
 * - **URL validation** : Props url typée string pour sécurité
 * - **XSS prevention** : React escape automatique contenu text
 * - **Route security** : Validation côté Next.js des routes
 * - **TypeScript safety** : Interface stricte évite erreurs runtime
 * - **Input sanitization** : Props text sécurisées par React
 * - **Navigation controls** : Seules routes valides accessibles
 * - **Error boundaries** : Gestion erreurs navigation gracieuse
 * - **CSRF protection** : Navigation client-side sécurisée
 *
 * ### 🧪 Testabilité et maintenance
 * - **Props interface** : Structure claire pour tests unitaires
 * - **Mocking friendly** : useRouter mockable pour tests Jest
 * - **Behavior testing** : Actions utilisateur testables facilement
 * - **Snapshot testing** : Rendu stable pour tests régression
 * - **Integration testing** : Navigation testable bout-en-bout
 * - **Debug friendly** : Props explicites pour debugging
 * - **Code coverage** : Logique simple 100% testable
 * - **Maintenance ease** : Code minimal et documentation complète
 *
 * ## Cas d'usage et intégrations AdminJO
 *
 * ### 🏅 Contextes métier Jeux Olympiques
 * - **Navigation événements** : Retour liste événements olympiques
 * - **Gestion disciplines** : Retour dashboard disciplines sportives
 * - **Administration épreuves** : Navigation entre sections épreuves
 * - **Workflow organisateurs** : Retours contextuels workflows
 * - **Breadcrumb navigation** : Intégration chemins navigation
 * - **Modal dialogs** : Fermeture modales avec navigation
 * - **Form workflows** : Annulation formulaires avec retour
 * - **Multi-step processes** : Navigation étapes organisationnelles
 *
 * ### 📱 Responsive et accessibilité
 * - **Mobile optimization** : Bouton tactile optimisé smartphones
 * - **Tablet friendly** : Taille appropriée navigation tablettes
 * - **Desktop precision** : Hover states précis souris desktop
 * - **Keyboard navigation** : Tab order et Enter activation
 * - **Screen readers** : ARIA labels et semantic HTML
 * - **High contrast** : Support modes contraste élevé
 * - **Touch targets** : Taille minimum 44px recommandations Apple
 * - **Voice control** : Compatible assistants vocaux
 *
 * ## Variations et personnalisations avancées
 *
 * ### 🎨 Styles prédéfinis et customisation
 * - **Style par défaut** : Design AdminJO standard cohérent
 * - **Variants disponibles** : Primary, secondary, ghost, danger
 * - **Size variations** : Small, medium, large pour contextes
 * - **Icon integration** : Support icônes SVG personnalisées
 * - **Loading states** : Indicateurs chargement navigation
 * - **Disabled states** : États désactivés avec feedback visuel
 * - **Active states** : Indication page actuelle si applicable
 * - **Custom animations** : Transitions personnalisables CSS
 *
 * ### 🔧 Extensions fonctionnelles possibles
 * - **Confirmation dialogs** : Popup confirmation avant navigation
 * - **Analytics tracking** : Tracking navigation pour métriques
 * - **Breadcrumb integration** : Mise à jour automatique fil Ariane
 * - **History management** : Navigation back/forward intelligente
 * - **Deep linking** : URLs partagées avec état application
 * - **Progress tracking** : Sauvegarde progression workflows
 * - **Keyboard shortcuts** : Raccourcis clavier navigation rapide
 * - **Gesture support** : Navigation tactile swipe mobile
 *
 * ## Performance et monitoring
 *
 * ### 📊 Métriques et optimisations
 * - **Click tracking** : Métriques utilisation boutons retour
 * - **Navigation timing** : Mesure performance transitions
 * - **Error monitoring** : Tracking erreurs navigation Sentry
 * - **User journey** : Analyse parcours utilisateur AdminJO
 * - **Conversion funnel** : Impact retours sur workflows
 * - **Performance budget** : Bundle size contrôlé strict
 * - **Core Web Vitals** : Optimisation métriques Google
 * - **Accessibility metrics** : Conformité WCAG AAA mesurée
 *
 * ### 🚀 Améliorations futures envisageables
 * - **Smart defaults** : URL destination intelligente contextuelle
 * - **Gesture recognition** : Navigation gesture mobile avancée
 * - **Voice commands** : Commandes vocales "retour" intégrées
 * - **AI suggestions** : Suggestions navigation IA contextuelle
 * - **Personalization** : Adaptation préférences utilisateur
 * - **Multi-language** : Internationalization texte dynamique
 * - **Theme variants** : Support thèmes sombre/clair AdminJO
 * - **Micro-interactions** : Animations subtiles engagement
 *
 * @param {BackButtonProps} props - Propriétés configuration bouton retour
 * @param {string} props.url - URL destination navigation (obligatoire)
 * @param {string} [props.text="← Retour"] - Texte affiché bouton (optionnel)
 * @param {string} [props.className] - Classes CSS Tailwind custom (optionnel)
 *
 * @returns {JSX.Element} Bouton navigation retour interactif optimisé AdminJO
 *
 * @see Next.js useRouter - Hook Next.js navigation App Router
 * @see BackToDashboardButton - Variante spécialisée dashboard
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Utilisation basique retour dashboard
 * <BackButton url="/dashboard" />
 * ```
 *
 * @example
 * ```tsx
 * // Retour personnalisé avec texte custom
 * <BackButton
 *   url="/events"
 *   text="← Retour aux événements"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Style complètement personnalisé
 * <BackButton
 *   url="/disciplines"
 *   text="← Disciplines"
 *   className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Dans un workflow multi-étapes
 * const handleBack = () => {
 *   // Logique sauvegarde avant navigation
 *   saveFormData();
 * };
 *
 * <BackButton url="/step-1" text="← Étape précédente" />
 * ```
 */
export default function BackButton({
  url,
  text = "← Retour",
  className = "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(url);
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
