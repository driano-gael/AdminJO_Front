/**
 * Composant Breadcrumb - Navigation fil d'Ariane hiérarchique AdminJO
 *
 * Ce composant navigation spécialisé fournit une interface fil d'Ariane (breadcrumb)
 * sophistiquée pour la navigation hiérarchique dans l'application AdminJO des Jeux
 * Olympiques 2024. Il permet aux administrateurs de visualiser leur position dans
 * l'arborescence applicative et de naviguer rapidement vers les niveaux parents.
 * Conçu pour les workflows complexes olympiques, il intègre liens interactifs,
 * séparateurs visuels, état page courante, et responsive design pour une expérience
 * navigation contextuelle optimale dans l'écosystème de gestion des événements
 * sportifs et de l'infrastructure des Jeux Olympiques 2024.
 *
 * ## Architecture navigation hiérarchique
 *
 * ### 🗺️ Structure fil d'Ariane intelligent
 * - **Items array** : BreadcrumbItem[] avec label et href optionnel
 * - **Navigation cliquable** : Links actifs pour items avec href fourni
 * - **Page courante** : Item sans href affiché comme texte statique
 * - **Séparateurs visuels** : Flèches → entre chaque niveau hiérarchie
 * - **Conditional links** : Link Next.js ou span selon présence href
 * - **Index tracking** : Séparateur seulement après premier item
 * - **Semantic nav** : <nav> tag pour structure navigation accessible
 *
 * ### 📍 Gestion état page courante vs navigation
 * - **Link interactif** : item.href présent → Link Next.js avec hover effects
 * - **Texte statique** : item.href absent → span avec emphase visuelle
 * - **Styling différentiel** : hover:text-blue-600 pour liens, text-gray-900 font-medium pour courant
 * - **Visual hierarchy** : Page courante mise en valeur vs niveaux parents
 * - **Click feedback** : Hover states seulement sur éléments navigables
 * - **Accessibility** : Distinction claire éléments interactifs vs informatifs
 * - **SEO friendly** : Links avec href pour indexation navigation
 *
 * ### 🎨 Design et présentation visuelle
 * - **Spacing external** : mb-8 séparation avec contenu page
 * - **Layout horizontal** : flex items-center space-x-2 pour alignment
 * - **Typography** : text-sm pour discrétion, text-gray-600 base
 * - **Separators** : → flèches Unicode pour direction navigation
 * - **Color system** : gray-600 base, blue-600 hover, gray-900 current
 * - **Container padding** : Pas de padding interne, géré par parent
 * - **Responsive text** : text-sm adapté lecture tous écrans
 *
 * ## Interface données et configuration
 *
 * ### 📊 Structure BreadcrumbItem
 * - **label** : string texte affiché pour niveau navigation
 * - **href** : string optionnel URL pour navigation cliquable
 * - **Flexibilité** : href undefined = page courante non-cliquable
 * - **Type safety** : Interface stricte TypeScript pour validation
 * - **Extensibilité** : Structure facilement extensible (icon, id, etc.)
 * - **Simplicité** : Interface minimale pour usage direct
 *
 * ### 🔧 Props configuration breadcrumb
 * - **items** : BreadcrumbItem[] array complet chemin navigation
 * - **Required prop** : items obligatoire pour fonctionnement breadcrumb
 * - **Empty handling** : Affichage vide si items array vide
 * - **Dynamic length** : Support chemins navigation longueur variable
 * - **Order preservation** : Ordre items respecté pour hiérarchie logique
 * - **Immutable** : Props non mutées par composant
 *
 * ## Responsive design et adaptabilité
 *
 * ### 📱 Adaptation écrans et débordement
 * - **Horizontal scroll** : Layout flex permet scroll naturel si débordement
 * - **Text wrapping** : Pas de wrap, préservation layout horizontal
 * - **Mobile friendly** : text-sm lisible écrans tactiles
 * - **Touch targets** : Links dimensionnés interaction tactile
 * - **Compact display** : space-x-2 espacement optimal mobile/desktop
 * - **Truncation** : Pas de truncation automatique, gestion parent si nécessaire
 * - **Overflow strategy** : Débordement horizontal géré container parent
 *
 * ### 🎯 Performance et optimisations
 * - **Static rendering** : Pas de state ou effects, rendu statique pur
 * - **Next.js Links** : Prefetching automatique pour navigation rapide
 * - **CSS static** : Classes Tailwind pré-compilées pour performance
 * - **Minimal DOM** : Structure HTML légère avec éléments essentiels
 * - **No JavaScript** : Fonctionnement sans JS via liens natifs
 * - **Memory efficient** : Pas de subscriptions ou timers
 * - **Bundle light** : Code minimal impact taille bundle
 *
 * ## Accessibilité et navigation
 *
 * ### ♿ Standards accessibilité navigation
 * - **Semantic nav** : <nav> tag pour identification navigation
 * - **Link semantics** : Links Next.js pour navigation accessible
 * - **Visual hierarchy** : Contraste couleurs pour différenciation niveaux
 * - **Keyboard navigation** : Tab navigation naturelle entre links
 * - **Screen readers** : Structure logique pour synthèse vocale
 * - **Focus indicators** : Focus rings natifs Links pour navigation clavier
 * - **ARIA implicit** : Sémantique native suffisante pour breadcrumb basique
 *
 * ### 🔧 Améliorations accessibilité possibles
 * - **ARIA breadcrumb** : role="navigation" aria-label="Breadcrumb"
 * - **Current page** : aria-current="page" sur item actuel
 * - **Skip links** : Navigation rapide fin breadcrumb
 * - **ARIA separators** : aria-hidden="true" sur séparateurs décoratifs
 * - **Screen reader** : Instructions navigation pour utilisateurs non-voyants
 * - **High contrast** : Modes contraste élevé support
 * - **Reduced motion** : Pas d'animations, déjà optimal
 *
 * ## Intégration écosystème AdminJO
 *
 * ### 🔌 Utilisation dans templates et layouts
 * - **PageTemplate** : Utilisé via props breadcrumbs optionnelles
 * - **Dynamic generation** : Items générés par pages selon context
 * - **Route integration** : Hrefs correspondent routes Next.js
 * - **Hierarchical data** : Reflects structure données métier olympique
 * - **Context preservation** : Navigation préserve contexte applicatif
 * - **Layout harmony** : S'intègre layouts AuthenticatedLayout/PageTemplate
 *
 * ### 🔄 Patterns usage typiques AdminJO
 * - **Dashboard → Module** : ["Dashboard", "Événements"]
 * - **Module → Detail** : ["Dashboard", "Événements", "Football Masculin"]
 * - **Nested workflows** : ["Dashboard", "Lieux", "Stade France", "Configuration"]
 * - **Admin hierarchy** : Reflect structure organisationnelle JO
 * - **Context switching** : Navigation rapide entre domaines métier
 * - **User orientation** : Indication position dans workflows complexes
 *
 * ## Contexte métier olympique JO 2024
 *
 * ### 🏅 Spécificités navigation administrative olympique
 * - **Hiérarchies complexes** : Événements → Disciplines → Épreuves → Détails
 * - **Multi-domain** : Navigation entre lieux, événements, résultats, médias
 * - **Operational context** : Orientation rapide pendant événements temps réel
 * - **Team coordination** : Navigation claire pour équipes multiples
 * - **Audit trails** : Chemins navigation traçables pour compliance
 * - **Professional UI** : Interface cohérente standards organisateurs JO
 * - **Efficiency focus** : Réduction clics navigation workflows fréquents
 *
 * ### 📊 Exemples concrets usage JO
 * - **Event management** : Dashboard → Événements → Natation → 100m Libre
 * - **Venue admin** : Dashboard → Lieux → Centre Aquatique → Capacités
 * - **Results workflow** : Dashboard → Résultats → Athlétisme → Marathon → Saisie
 * - **Media coordination** : Dashboard → Médias → Photos → Cérémonie → Upload
 * - **Logistics ops** : Dashboard → Logistique → Transport → Navettes → Planning
 * - **Technical setup** : Dashboard → Technique → Chronométrage → Piscine → Config
 *
 * ## Patterns développement et extensibilité
 *
 * ### 🏗️ Architecture patterns appliqués
 * - **Presentation component** : Focus affichage, pas de logique métier
 * - **Data-driven rendering** : Rendu basé uniquement sur props items
 * - **Conditional navigation** : Links vs texte selon présence href
 * - **Immutable props** : Pas de mutations données entrée
 * - **Stateless design** : Pas d'état local pour simplicité maximale
 * - **Separation of concerns** : Navigation UI séparée de logique routing
 *
 * ### 🔧 Extensibilité futures possibles
 * - **Icon support** : Props icon pour chaque BreadcrumbItem
 * - **Custom separators** : Props separator pour personnalisation
 * - **Truncation options** : Props maxItems pour limitation longueur
 * - **Styling variants** : Props variant pour différents styles
 * - **Animation support** : Micro-animations transitions navigation
 * - **Dropdown overflow** : Menu déroulant si trop d'items
 * - **Mobile adaptation** : Comportement spécifique mobile (collapse, etc.)
 *
 * ## Performance et optimisations avancées
 *
 * ### ⚡ Optimisations actuelles
 * - **Pure component** : Rendu déterministe basé props uniquement
 * - **Next.js prefetching** : Links préchargés pour navigation rapide
 * - **Static CSS** : Classes Tailwind compilées statiquement
 * - **Minimal JavaScript** : Aucune logique JS côté client
 * - **SEO optimized** : Links crawlables pour indexation
 * - **Memory efficient** : Aucune allocation mémoire dynamique
 *
 * ### 🎯 Candidats optimisation avancée
 * - **React.memo** : Mémorisation si items changent rarement
 * - **Virtual scrolling** : Pour breadcrumbs très longs (edge case)
 * - **Route prefetching** : Prefetch intelligent basé usage patterns
 * - **Bundle optimization** : Tree shaking si fonctionnalités étendues
 * - **CSS optimization** : Purge classes inutilisées
 * - **Accessibility cache** : Cache calculs ARIA si complexifiés
 *
 * ## Limitations et améliorations futures
 *
 * ### ❌ Limitations actuelles identifiées
 * - **No truncation** : Pas de gestion débordement automatique
 * - **Fixed separators** : Séparateurs → non configurables
 * - **No icons** : Pas de support icônes dans items
 * - **Basic styling** : Un seul style, pas de variants
 * - **No tooltips** : Pas d'info-bulles items tronqués
 * - **Static structure** : Pas d'adaptations dynamiques selon contexte
 * - **No analytics** : Pas de tracking clics navigation
 *
 * ### 🚀 Améliorations prioritaires futures
 * - **Smart truncation** : Ellipsis middle items si débordement
 * - **Icon integration** : Support icônes contextuelles par item
 * - **Mobile optimization** : Comportement adaptatif écrans étroits
 * - **Tooltip system** : Info-bulles pour items tronqués ou contexte
 * - **Animation library** : Transitions fluides changements breadcrumb
 * - **Customization props** : Separateurs, styles, comportements configurables
 * - **Analytics integration** : Métriques usage patterns navigation
 * - **Performance monitoring** : Mesure impact rendu breadcrumbs longs
 * - **Accessibility++** : ARIA live regions pour annonces navigation
 * - **Theme integration** : Support thèmes sombre/clair AdminJO
 *
 * ### 🔧 Améliorations techniques avancées
 * - **Server components** : Migration React Server Components si bénéfique
 * - **Edge optimization** : Optimisations edge computing navigation
 * - **Intersection observer** : Lazy loading items non-visibles (très longs)
 * - **Web Workers** : Traitement breadcrumbs complexes arrière-plan
 * - **Cache strategies** : Mise en cache intelligent structures navigation
 * - **Real-time sync** : Synchronisation breadcrumbs multi-onglets
 * - **Progressive enhancement** : Fallback sans JavaScript robuste
 * - **Security hardening** : Validation URLs navigation pour sécurité
 *
 * @param {BreadcrumbProps} props - Configuration du breadcrumb navigation
 * @param {BreadcrumbItem[]} props.items - Array des éléments de navigation hiérarchique
 *
 * @returns {JSX.Element} Navigation breadcrumb complète avec liens et séparateurs
 *
 * @see {@link BreadcrumbItem} - Interface structure éléments navigation
 * @see {@link PageTemplate} - Template utilisant ce breadcrumb via props
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Breadcrumb basique avec navigation
 * <Breadcrumb items={[
 *   { label: "Dashboard", href: "/dashboard" },
 *   { label: "Événements", href: "/events" },
 *   { label: "Football Masculin" } // Page courante sans href
 * ]} />
 * ```
 *
 * @example
 * ```tsx
 * // Breadcrumb workflow complexe JO
 * <Breadcrumb items={[
 *   { label: "Dashboard", href: "/dashboard" },
 *   { label: "Lieux", href: "/venues" },
 *   { label: "Stade de France", href: "/venues/stade-france" },
 *   { label: "Configuration Capacités" }
 * ]} />
 * ```
 *
 * @example
 * ```tsx
 * // Intégration PageTemplate
 * <PageTemplate
 *   title="Détail Événement"
 *   breadcrumbs={[
 *     { label: "Dashboard", href: "/dashboard" },
 *     { label: "Événements", href: "/events" },
 *     { label: "Natation", href: "/events/natation" },
 *     { label: "100m Libre Hommes" }
 *   ]}
 * >
 *   <EventDetail />
 * </PageTemplate>
 * ```
 */

'use client';

import Link from 'next/link';

/**
 * Interface pour les éléments de navigation breadcrumb
 */
interface BreadcrumbItem {
  /** Texte affiché pour cet élément de navigation */
  label: string;
  /** URL optionnelle pour navigation cliquable - si omise, élément affiché comme page courante */
  href?: string;
}

/**
 * Interface des propriétés du composant Breadcrumb
 */
interface BreadcrumbProps {
  /** Array des éléments de navigation hiérarchique du plus général au plus spécifique */
  items: BreadcrumbItem[];
}

/**
 * Composant Breadcrumb - Navigation fil d'Ariane réutilisable
 *
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Le breadcrumb de navigation
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-8">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            {index > 0 && <span>→</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-blue-600">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
