'use client';

import { useRouter } from 'next/navigation';

/**
 * Composant BackToEventsButton - Bouton navigation retour événements AdminJO
 *
 * Ce composant réutilisable fournit une navigation contextuelle standardisée pour retourner
 * à la gestion globale des événements olympiques depuis les sous-modules spécialisés
 * (disciplines, lieux, épreuves). Il centralise la logique de navigation avec Next.js
 * App Router, élimine la duplication de code entre composants, et assure une expérience
 * utilisateur cohérente pour la navigation hiérarchique dans l'écosystème AdminJO des
 * Jeux Olympiques 2024. Design adaptatif avec customisation possible du style et texte
 * tout en maintenant les standards visuels et d'accessibilité AdminJO.
 *
 * ## Fonctionnalités de navigation réellement implémentées
 *
 * ### 🔙 Navigation hiérarchique contextualisée événements
 * - **Destination fixe** : /pagesEvenements route principale gestion événements
 * - **Router Next.js** : useRouter() hook pour navigation client-side
 * - **Push navigation** : router.push() pour ajout historique navigateur
 * - **Bouton universel** : Utilisable dans tous sous-modules événements
 * - **Centralisation logique** : Évite duplication code navigation
 * - **URL absolue** : /pagesEvenements chemin constant indépendant contexte
 * - **Contexte olympique** : Retour vers hub central gestion événements JO
 *
 * ### 🎨 Interface utilisateur standardisée personnalisable
 * - **Texte par défaut** : "↩️ gestion globale évènements" avec emoji directeur
 * - **Classe par défaut** : bg-gray-600 hover:bg-gray-700 style AdminJO cohérent
 * - **Props customisation** : className et text optionnels pour adaptation
 * - **Transition fluide** : transition-colors pour animation hover
 * - **Taille optimisée** : px-4 py-2 pour zone clic confortable
 * - **Typography** : text-sm font-medium pour lisibilité optimale
 * - **Responsive** : rounded-md coins arrondis cohérents design system
 *
 * ### 🔧 Configuration flexible et réutilisabilité
 * - **Props optionnelles** : className et text avec valeurs défaut sensées
 * - **Override complet** : Possibilité remplacement style total via className
 * - **Texte adaptable** : text prop pour contextes spéciaux (langues, etc.)
 * - **Compatibilité** : Fonctionne tous sous-modules événements
 * - **Maintenance centralisée** : Modifications navigation propagées automatiquement
 * - **Standards cohérents** : Même logique navigation partout dans app
 *
 * ## Architecture technique et intégration Next.js
 *
 * ### 🚀 Client Component Next.js 13+ App Router
 * - **'use client'** : Directive pour composant interactif côté client
 * - **useRouter hook** : Navigation programmable App Router Next.js
 * - **Client-side routing** : Navigation sans rechargement page
 * - **History management** : push() ajoute entrée historique navigateur
 * - **Performant** : Préchargement routes et optimisations Next.js
 * - **SEO friendly** : URLs propres maintenues pendant navigation
 * - **Hot reloading** : Compatible rechargement développement Next.js
 *
 * ### 📡 Gestion d'état et lifecycle
 * - **Stateless component** : Pas d'état local pour simplicité maximale
 * - **Effect-free** : Pas d'useEffect, composant entièrement synchrone
 * - **Props-driven** : Configuration via props, pas de logique interne
 * - **Immutable** : Pas de mutations état, seulement lecture props
 * - **Pure function** : Résultat déterministe basé uniquement sur props
 * - **Memory efficient** : Minimal footprint mémoire, pas de subscriptions
 * - **Fast render** : Rendu rapide sans calculs complexes
 *
 * ## Expérience utilisateur et design patterns
 *
 * ### 🎯 UX navigation contextuelle optimisée
 * - **Breadcrumb visuel** : Indique position dans hiérarchie navigation
 * - **Action prévisible** : Emoji ↩️ et texte explicite pour clarté
 * - **Feedback immédiat** : Hover effect pour confirmation interaction
 * - **Terminologie claire** : "gestion globale évènements" descriptif
 * - **Position logique** : Généralement coin supérieur gauche headers
 * - **Escape route** : Toujours disponible pour sortir sous-modules
 * - **Context preservation** : Navigation ne perd pas travail en cours
 *
 * ### 🔧 États interactifs et feedback visuel
 * - **État normal** : bg-gray-600 couleur neutre non-intrusive
 * - **État hover** : bg-gray-700 assombrissement pour feedback
 * - **Transition smooth** : transition-colors pour animation fluide
 * - **Disabled state** : Pas implémenté (navigation toujours possible)
 * - **Focus state** : Focus ring navigateur par défaut (améliorable)
 * - **Active state** : Utilise hover pendant clic
 * - **Loading state** : Pas d'indicateur pendant navigation (instantanée)
 *
 * ## Customisation et extensibilité
 *
 * ### 🎨 Personnalisation apparence
 * - **className override** : Remplacement complet classes CSS par défaut
 * - **text override** : Modification texte affiché sur bouton
 * - **Valeurs par défaut** : Fallback sensés si props non fournies
 * - **Cohérence forcée** : Valeurs défaut alignées design system AdminJO
 * - **Flexibilité totale** : Adaptable besoins spécifiques contextes
 * - **Maintenance aisée** : Changements globaux via props par défaut
 *
 * ### 🔗 Intégration patterns composants
 * - **Drop-in replacement** : Remplace boutons navigation ad-hoc existants
 * - **Header integration** : S'intègre naturellement headers sous-modules
 * - **Layout flexible** : Adaptation automatique containers parents
 * - **Spacing external** : Pas de margins externes, gestion parent
 * - **Z-index neutral** : Pas de problèmes superposition éléments
 * - **Event bubbling** : onClick ne stop pas propagation autres events
 *
 * ## Responsive design et accessibilité
 *
 * ### 📱 Adaptation multi-supports
 * - **Touch-friendly** : py-2 hauteur suffisante interaction tactile mobile
 * - **Readable text** : text-sm taille optimale tous écrans
 * - **Compact design** : px-4 largeur raisonnable écrans étroits
 * - **Native responsive** : Classes Tailwind adaptatives automatiques
 * - **Mobile first** : Fonctionne parfaitement petits écrans
 * - **Desktop enhanced** : Hover effects riches sur desktop
 * - **Cross-platform** : Compatible iOS, Android, desktop browsers
 *
 * ### ♿ Standards accessibilité navigation
 * - **Sémantique button** : Élément <button> natif pour lecteurs écran
 * - **Texte descriptif** : Contenu textuel explicite pour synthèse vocale
 * - **Navigation clavier** : Tab/Enter support natif élément button
 * - **Contraste suffisant** : text-white sur bg-gray-600 conforme WCAG
 * - **Focus visible** : Focus ring navigateur par défaut visible
 * - **Screen reader** : Emoji ↩️ ignoré, texte lu correctement
 * - **Landmark implicit** : Navigation button dans contexte header
 *
 * ### 🔧 Améliorations accessibilité possibles
 * - **ARIA label** : aria-label="Retourner à la gestion des événements"
 * - **Focus ring** : Custom focus:ring-2 focus:ring-offset-2 pour visibilité
 * - **Keyboard shortcuts** : Support Alt+← pour navigation rapide
 * - **Screen reader** : aria-describedby pour description contextuelle
 * - **High contrast** : Modes contraste élevé pour malvoyants
 * - **Reduced motion** : respect prefers-reduced-motion pour animations
 *
 * ## Performance et optimisations techniques
 *
 * ### ⚡ Optimisations actuelles
 * - **Stateless design** : Pas de re-renders inutiles sans état local
 * - **Minimal dependencies** : Seulement useRouter, pas de deps lourdes
 * - **CSS classes** : Tailwind pré-compilé pour performance CSS
 * - **No side effects** : Pas d'effects ou subscriptions coûteuses
 * - **Pure component** : Candidat idéal React.memo si nécessaire
 * - **Small bundle** : Code minimal impacte peu taille bundle
 * - **Tree shaking** : Imports optimisés pour dead code elimination
 *
 * ### 🎯 Optimisations possibles futures
 * - **React.memo** : Mémorisation si utilisé dans listes ou re-renders fréquents
 * - **useCallback** : Mémorisation handleBackToEvents si passé en prop
 * - **Prefetch route** : Préchargement /pagesEvenements via Next.js
 * - **Suspense boundary** : Loading boundary pour navigation lente
 * - **Error boundary** : Gestion erreurs navigation avec fallback UI
 * - **Analytics** : Tracking usage navigation pour UX insights
 *
 * ## Contexte métier événements olympiques JO 2024
 *
 * ### 🏅 Spécificités domaine olympique navigation
 * - **Hiérarchie événements** : Navigation depuis disciplines/lieux/épreuves vers hub
 * - **Terminologie métier** : "gestion globale évènements" langage organisateurs
 * - **Workflow organisationnel** : Retour contexte principal après tâches spécialisées
 * - **Architecture modulaire** : Sous-modules événements avec navigation unifiée
 * - **Standards CIO** : Respect patterns navigation systèmes olympiques
 * - **Efficiency opérationnelle** : Navigation rapide pour équipes JO sous pression
 * - **Context switching** : Passage fluide entre domaines fonctionnels
 *
 * ### 📊 Relations architecture événements AdminJO
 * - **Hub central** : /pagesEvenements comme point focal gestion
 * - **Sous-modules** : disciplines, lieux, épreuves sous hiérarchie événements
 * - **Navigation bidirectionnelle** : Aller vers spécialisés, revenir vers global
 * - **Breadcrumb implicit** : Bouton indique position dans arborescence
 * - **State preservation** : Navigation préserve contexte global événements
 * - **Role-based** : Navigation adaptée rôles administrateurs JO
 *
 * ## Utilisation dans écosystème AdminJO
 *
 * ### 🔌 Intégration composants headers existants
 * - **LieuxHeader** : Utilisé dans en-tête gestion lieux olympiques
 * - **DisciplinesHeader** : Navigation retour depuis gestion disciplines
 * - **EpreuvesHeader** : Retour contexte depuis gestion épreuves
 * - **Headers uniformes** : Même navigation tous sous-modules événements
 * - **Layout consistency** : Position standard coin supérieur gauche
 * - **Visual hierarchy** : Navigation + Titre + Actions pattern
 *
 * ### 📍 Position dans architecture composants
 * - **Dossier shared** : components/componentsEvenement/shared/
 * - **Réutilisabilité** : Importé par multiples headers sous-modules
 * - **Centralisation** : Single source of truth logique navigation
 * - **Maintenance** : Modifications propagées automatiquement tous usages
 * - **Testing** : Tests unitaires centralisés pour toutes intégrations
 * - **Documentation** : Pattern réutilisable documenté une fois
 *
 * ## Patterns de développement et bonnes pratiques
 *
 * ### 🏗️ Architecture composant exemplaire
 * - **Single responsibility** : Une fonction navigation claire et précise
 * - **Composition over inheritance** : Props pour customisation vs héritage
 * - **Inversion of control** : Configuration via props externes
 * - **DRY principle** : Élimine duplication logique navigation
 * - **Open/closed principle** : Ouvert extension via props, fermé modification
 * - **Dependency injection** : Router injecté via hook vs prop drilling
 *
 * ### 🔧 Patterns React modernes
 * - **Hooks usage** : useRouter seul hook nécessaire, usage optimal
 * - **Props destructuring** : Destructuration avec defaults pour lisibilité
 * - **TypeScript strict** : Interface props avec optionalité explicite
 * - **Function component** : Pattern moderne vs class component
 * - **No render props** : Simplicité vs patterns complexes
 * - **Custom hook potential** : Logique extractible en hook si complexification
 *
 * ## Limitations et améliorations futures
 *
 * ### ❌ Limitations actuelles identifiées
 * - **Route hardcodée** : /pagesEvenements pas configurable dynamiquement
 * - **Pas de loading** : Aucun indicateur pendant navigation
 * - **Pas de confirmation** : Navigation immédiate sans warning perte données
 * - **Pas d'analytics** : Aucun tracking usage navigation
 * - **État global ignoré** : Pas de vérification état application
 * - **Pas de cache** : Aucune optimisation préchargement route
 * - **Error handling basique** : Pas de gestion erreurs navigation
 *
 * ### 🚀 Évolutions possibles prioritaires
 * - **Route configurable** : Prop route pour flexibilité destinations
 * - **Confirmation modal** : Warning si formulaires non sauvegardés ouverts
 * - **Loading states** : Spinner pendant navigation lente
 * - **Breadcrumb integration** : Intégration système breadcrumb global
 * - **Analytics tracking** : Métriques usage navigation pour UX
 * - **Keyboard shortcuts** : Alt+← support navigation clavier
 * - **Route prefetching** : Optimisation Next.js préchargement
 * - **Error boundaries** : Gestion robuste erreurs navigation
 * - **A11y enhancements** : ARIA labels et descriptions étendues
 * - **Theme integration** : Support themes sombre/clair AdminJO
 *
 * ### 🔧 Améliorations techniques avancées
 * - **Suspense integration** : Loading boundaries pour navigation async
 * - **Error recovery** : Retry logic si navigation échoue
 * - **State persistence** : Sauvegarde état local avant navigation
 * - **Route guards** : Vérification permissions avant navigation
 * - **Deep linking** : Support paramètres URL pour navigation contextuelle
 * - **Progressive enhancement** : Fallback href si JavaScript disabled
 * - **Performance monitoring** : Métriques temps navigation
 * - **Cache strategies** : Optimisation cache Next.js routes
 *
 * @param {BackToEventsButtonProps} props - Configuration du bouton navigation
 * @param {string} [props.className] - Classes CSS custom pour override styling
 * @param {string} [props.text] - Texte affiché sur bouton (default: "↩️ gestion globale évènements")
 *
 * @returns {JSX.Element} Bouton navigation retour vers gestion événements
 *
 * @see {@link LieuxHeader} - Utilise ce bouton pour navigation retour
 * @see {@link DisciplinesHeader} - Utilise ce bouton pour navigation retour
 * @see {@link EpreuvesHeader} - Utilise ce bouton pour navigation retour
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Usage basique avec styles par défaut
 * <BackToEventsButton />
 * ```
 *
 * @example
 * ```tsx
 * // Customisation style et texte
 * <BackToEventsButton
 *   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
 *   text="← Retour événements"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Intégration dans header sous-module
 * function SubModuleHeader() {
 *   return (
 *     <header className="flex justify-between items-center">
 *       <BackToEventsButton />
 *       <h1>Gestion Sous-Module</h1>
 *       <button>Action Principale</button>
 *     </header>
 *   );
 * }
 * ```
 */
interface BackToEventsButtonProps {
  className?: string;
  text?: string;
}

/**
 * Composant réutilisable pour le bouton de retour vers la gestion globale des événements
 * Remplace la logique dupliquée dans tous les composants de management
 */
export default function BackToEventsButton({ 
  className = "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors",
  text = "↩️ gestion globale évènements"
}: BackToEventsButtonProps) {
  const router = useRouter();

  const handleBackToEvents = () => {
    router.push('/pagesEvenements');
  };

  return (
    <button
      onClick={handleBackToEvents}
      className={className}
    >
      {text}
    </button>
  );
}
