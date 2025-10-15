/**
 * Composant PageTemplate - Template page avancé avec breadcrumbs AdminJO
 *
 * Ce composant template sophistiqué étend AuthenticatedLayout pour fournir une structure
 * de page enrichie dédiée aux interfaces complexes de l'application AdminJO des Jeux
 * Olympiques 2024. Il intègre navigation hiérarchique via breadcrumbs, sections
 * d'introduction contextuelles, et architecture modulaire pour créer des pages
 * professionnelles cohérentes. Conçu pour les workflows administratifs avancés JO,
 * il combine sécurité héritée, navigation multi-niveaux, présentation structurée
 * du contenu, et extensibilité maximale pour une expérience utilisateur premium
 * destinée aux équipes organisatrices des événements olympiques.
 *
 * ## Architecture template et composition avancée
 *
 * ### 🏗️ Structure hiérarchique enrichie
 * 1. **AuthenticatedLayout** : Base sécurisée avec AppHeader (niveau 1)
 * 2. **Breadcrumb navigation** : Navigation hiérarchique contextuelle (niveau 2)
 * 3. **Section introduction** : Titre et description page optionnels (niveau 3)
 * 4. **Main content** : Zone contenu principal children (niveau 4)
 * 5. **Protection auth** : AuthGuard + session monitoring hérités (transversal)
 *
 * ### 🧭 Navigation breadcrumb sophistiquée
 * - **BreadcrumbItem array** : items avec label et href optionnel pour navigation
 * - **Conditional rendering** : Breadcrumb affiché seulement si items fournis
 * - **Hierarchical navigation** : Chemin complet depuis racine vers page courante
 * - **Click navigation** : Liens actifs pour remontée hiérarchie rapide
 * - **Visual separation** : Séparateurs visuels entre niveaux navigation
 * - **Responsive breadcrumb** : Adaptation mobile avec truncation si nécessaire
 * - **Accessibility** : Navigation accessible via Breadcrumb component
 *
 * ### 📄 Section introduction contextuelle
 * - **Titre page** : intro.title avec text-2xl font-bold mise en valeur
 * - **Description détaillée** : intro.description text-lg explicative
 * - **Centrage élégant** : text-center mb-12 pour présentation professionnelle
 * - **Conditional intro** : Section affichée seulement si intro fournie
 * - **Typography hiérarchique** : h2 + p pour structure sémantique correcte
 * - **Spacing généreux** : mb-4 entre titre/description, mb-12 avec contenu
 * - **Color system** : text-gray-900/600 respectant design AdminJO
 *
 * ## Props interface et configuration flexible
 *
 * ### 🔧 Props héritées AuthenticatedLayout
 * - **title** : string titre principal page pour AppHeader
 * - **backUrl** : string optionnel URL navigation retour
 * - **backLabel** : string optionnel texte bouton retour personnalisé
 * - **children** : ReactNode contenu principal page template
 * - **Transmission directe** : Props passées sans modification à AuthenticatedLayout
 * - **Compatibilité** : Interface identique pour migration facile
 *
 * ### 📚 Props spécialisées PageTemplate
 * - **breadcrumbs** : BreadcrumbItem[] optionnel pour navigation hiérarchique
 * - **intro** : {title, description} optionnel pour section introduction
 * - **Extensibilité** : Structure props facilement extensible futures fonctionnalités
 * - **Type safety** : Interfaces BreadcrumbItem et Props strictes
 * - **Optional by design** : Toutes nouvelles props optionnelles pour flexibilité
 * - **Composition friendly** : Props permettent composition différentes layouts
 *
 * ## Patterns usage et cas d'utilisation
 *
 * ### 📊 Types pages optimales pour ce template
 * - **Pages management** : Gestion entités avec navigation multi-niveaux
 * - **Workflows complexes** : Processus métier nécessitant contexte clair
 * - **Pages détail** : Affichage détaillé entités avec breadcrumb remontée
 * - **Dashboards spécialisés** : Vues synthétiques avec introduction explicative
 * - **Formulaires avancés** : Création/édition avec contexte navigation
 * - **Pages configuration** : Paramétrage système avec guidance utilisateur
 * - **Rapports détaillés** : Présentations données avec contexte métier
 *
 * ### 🔄 Workflow utilisation typique
 * 1. **Navigation utilisateur** : Clic lien vers page template
 * 2. **Auth verification** : AuthenticatedLayout vérifie authentification
 * 3. **Header render** : AppHeader avec titre et navigation retour
 * 4. **Breadcrumb display** : Navigation hiérarchique si breadcrumbs fournis
 * 5. **Intro section** : Titre/description si intro configurée
 * 6. **Content render** : Affichage children dans zone principale
 * 7. **Interactive navigation** : Breadcrumb et header permettent navigation
 *
 * ## Intégration composants et dépendances
 *
 * ### 🔌 Composants intégrés spécialisés
 * - **AuthenticatedLayout** : Layout base avec sécurité et AppHeader
 * - **Breadcrumb** : Composant navigation hiérarchique réutilisable
 * - **Navigation system** : Intégration router Next.js via composants
 * - **Type interfaces** : BreadcrumbItem pour structure données navigation
 * - **Design system** : Classes Tailwind cohérentes AdminJO
 * - **Accessibility** : Standards via composants navigation spécialisés
 *
 * ### 📡 Communication parent-enfant
 * - **Props drilling** : Transmission props AuthenticatedLayout transparente
 * - **Component composition** : Assemblage composants spécialisés
 * - **Optional rendering** : Sections conditionnelles selon props
 * - **State external** : Pas état local, configuration via props
 * - **Event delegation** : Navigation events gérés par composants enfants
 * - **Interface consistency** : Cohérence interfaces entre composants
 *
 * ## Performance et optimisations
 *
 * ### ⚡ Optimisations architecture
 * - **Conditional rendering** : Breadcrumb et intro rendus seulement si nécessaire
 * - **Lightweight template** : Structure minimale sans logique complexe
 * - **Component reuse** : Réutilisation AuthenticatedLayout pour éviter duplication
 * - **Props passthrough** : Transmission directe sans transformations coûteuses
 * - **CSS static** : Classes Tailwind pré-compilées pour performance
 * - **No state management** : Composant stateless pour simplicité maximale
 * - **Memory efficient** : Pas de subscriptions ou side effects
 *
 * ### 🎯 Candidats optimisation avancée
 * - **React.memo** : Mémorisation si props intro/breadcrumbs changent fréquemment
 * - **Lazy breadcrumb** : Chargement différé Breadcrumb si très lourd
 * - **Component splitting** : Code splitting sections si template complexifié
 * - **Props memoization** : useMemo pour props objects si recalculs fréquents
 * - **Bundle optimization** : Tree shaking pour composants non utilisés
 * - **Suspense integration** : Loading boundaries pour sections async
 *
 * ## Responsive design et accessibilité
 *
 * ### 📱 Adaptation multi-supports
 * - **Mobile breadcrumb** : Breadcrumb component gère adaptation mobile
 * - **Responsive intro** : text-2xl et text-lg s'adaptent écrans
 * - **Touch navigation** : Navigation tactile via Breadcrumb optimisée
 * - **Content scaling** : Sections s'ajustent largeur viewport
 * - **Typography responsive** : Tailles texte adaptatives automatiques
 * - **Spacing adaptive** : mb-12, mb-4 appropriés tous écrans
 * - **Layout inheritance** : Responsive via AuthenticatedLayout hérité
 *
 * ### ♿ Standards accessibilité avancés
 * - **Navigation hierarchy** : Structure logique breadcrumb pour screen readers
 * - **Semantic HTML** : h2, p, sections sémantiquement correctes
 * - **Focus management** : Navigation clavier via composants spécialisés
 * - **ARIA support** : Labels contextuels via Breadcrumb component
 * - **Skip links** : Navigation rapide sections via structure hiérarchique
 * - **Screen reader** : Intro title/description lisibles synthèse vocale
 * - **Keyboard shortcuts** : Support navigation clavier via composants
 *
 * ## Contexte métier administration olympique
 *
 * ### 🏅 Spécificités workflows JO 2024
 * - **Hiérarchies complexes** : Navigation multi-niveaux gestion olympique
 * - **Context preservation** : Breadcrumbs essentiels pour orientation utilisateurs
 * - **Professional presentation** : Section intro pour contexte métier clair
 * - **Operational efficiency** : Navigation rapide entre niveaux hiérarchie
 * - **Team coordination** : Interfaces claires pour équipes multiples
 * - **Process guidance** : Introductions pour expliquer workflows complexes
 * - **Audit trails** : Navigation traçable pour compliance olympique
 *
 * ### 📊 Exemples d'usage contextuels JO
 * - **Event management** : Dashboard → Événements → Détail événement
 * - **Venue administration** : Lieux → Détail lieu → Configuration capacités
 * - **Results workflow** : Résultats → Discipline → Épreuve → Saisie scores
 * - **Media coordination** : Médias → Catégorie → Assets → Upload contenu
 * - **Logistics ops** : Logistique → Zone → Ressource → Planification
 * - **Technical setup** : Technique → Système → Configuration → Paramètres
 *
 * ## Extensibilité et patterns avancés
 *
 * ### 🚀 Architecture extensible future
 * - **Section modulaire** : Ajout facile nouvelles sections template
 * - **Props composition** : Interface extensible sans breaking changes
 * - **Component slots** : Emplacements définissables pour contenu custom
 * - **Theme integration** : Support futur système thèmes AdminJO
 * - **Layout variants** : Variations template selon contexte métier
 * - **Dynamic sections** : Sections configurables via props avancées
 * - **Plugin system** : Architecture permettant extensions tierces
 *
 * ### 🔧 Patterns développement appliqués
 * - **Template pattern** : Structure réutilisable avec variations contenu
 * - **Composition pattern** : Assemblage composants spécialisés flexibles
 * - **Props drilling optimisé** : Transmission sélective props pertinentes
 * - **Conditional rendering** : Sections optionnelles selon configuration
 * - **Interface segregation** : Props groupées par responsabilité
 * - **Single responsibility** : Focus template presentation, délégation logique
 *
 * ## Limitations et améliorations futures
 *
 * ### ❌ Limitations actuelles identifiées
 * - **Intro rigide** : Section intro structure fixe title/description
 * - **Breadcrumb simple** : Pas de breadcrumb dynamique ou contextuel
 * - **No sidebar** : Pas de support navigation latérale avancée
 * - **Fixed spacing** : Espacements non configurables entre sections
 * - **No actions** : Pas de zone actions contextuelles page
 * - **Basic theming** : Couleurs/styles non personnalisables
 * - **No analytics** : Pas de tracking usage sections template
 *
 * ### 🚀 Améliorations prioritaires futures
 * - **Flexible intro** : Section intro configurable avec slots custom
 * - **Dynamic breadcrumb** : Breadcrumb auto-généré depuis route/context
 * - **Action zones** : Emplacements actions contextuelles (boutons, menus)
 * - **Advanced spacing** : Props spacing configurables entre sections
 * - **Template variants** : Différentes structures template selon usage
 * - **Performance metrics** : Monitoring temps chargement sections
 * - **Content management** : CMS integration pour contenu intro
 * - **A/B testing** : Support test variations template
 * - **Progressive enhancement** : Amélioration progressive selon capabilities
 * - **Micro-interactions** : Animations subtiles transitions sections
 *
 * ### 🔧 Améliorations techniques avancées
 * - **Server components** : Migration React Server Components si applicable
 * - **Streaming SSR** : Rendu streaming sections pour performance
 * - **Edge optimization** : Optimisations edge computing templates
 * - **Component library** : Extraction template vers library réutilisable
 * - **Design tokens** : System tokens pour spacing/colors configurables
 * - **Accessibility++** : ARIA live regions pour sections dynamiques
 * - **Performance budgets** : Limites performance par section template
 * - **Bundle analysis** : Analyse impact bundle par fonctionnalité template
 *
 * @param {Props} props - Configuration du template page avancé
 * @param {string} props.title - Titre principal page pour AppHeader
 * @param {string} [props.backUrl] - URL navigation retour optionnelle
 * @param {string} [props.backLabel] - Texte bouton retour personnalisé
 * @param {BreadcrumbItem[]} [props.breadcrumbs] - Navigation hiérarchique optionnelle
 * @param {Object} [props.intro] - Section introduction optionnelle avec titre/description
 * @param {string} props.intro.title - Titre section introduction
 * @param {string} props.intro.description - Description détaillée introduction
 * @param {ReactNode} props.children - Contenu principal page template
 *
 * @returns {JSX.Element} Template page complet avec navigation et sections avancées
 *
 * @see {@link AuthenticatedLayout} - Layout base sécurisé utilisé comme fondation
 * @see {@link Breadcrumb} - Composant navigation hiérarchique intégré
 * @see {@link BreadcrumbItem} - Interface items navigation breadcrumb
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Template basique avec titre seulement
 * <PageTemplate title="Gestion Événements">
 *   <EventsContent />
 * </PageTemplate>
 * ```
 *
 * @example
 * ```tsx
 * // Template avec breadcrumb et introduction
 * <PageTemplate
 *   title="Détail Événement"
 *   breadcrumbs={[
 *     { label: "Dashboard", href: "/dashboard" },
 *     { label: "Événements", href: "/events" },
 *     { label: "Football Masculin" }
 *   ]}
 *   intro={{
 *     title: "Configuration Événement Football",
 *     description: "Gérez tous les aspects de cet événement olympique"
 *   }}
 * >
 *   <EventDetailContent />
 * </PageTemplate>
 * ```
 *
 * @example
 * ```tsx
 * // Template complet avec navigation retour
 * <PageTemplate
 *   title="Résultats Natation"
 *   backUrl="/events"
 *   backLabel="← Retour Événements"
 *   breadcrumbs={[
 *     { label: "Dashboard", href: "/dashboard" },
 *     { label: "Événements", href: "/events" },
 *     { label: "Natation", href: "/events/natation" },
 *     { label: "Résultats" }
 *   ]}
 *   intro={{
 *     title: "Saisie Résultats Épreuves",
 *     description: "Interface de saisie temps réel des résultats olympiques"
 *   }}
 * >
 *   <ResultsManagement />
 * </PageTemplate>
 * ```
 */

'use client';

import { ReactNode } from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';
import Breadcrumb from '@/components/navigation/Breadcrumb';

/**
 * Interface pour les éléments de navigation breadcrumb
 */
interface BreadcrumbItem {
  /** Texte affiché pour cet élément de navigation */
  label: string;
  /** URL optionnelle pour navigation cliquable - si omise, élément non cliquable (page courante) */
  href?: string;
}

/**
 * Interface des propriétés du composant PageTemplate
 */
interface Props {
    /** Titre principal de la page affiché dans AppHeader */
    title: string;
    /** URL de navigation retour optionnelle */
    backUrl?: string;
    /** Texte personnalisé du bouton retour optionnel */
    backLabel?: string;
    /** Array d'éléments pour navigation breadcrumb hiérarchique optionnelle */
    breadcrumbs?: BreadcrumbItem[];
    /** Section introduction optionnelle avec titre et description */
    intro?: {
        /** Titre de la section introduction */
        title: string;
        /** Description détaillée de la page/section */
        description: string;
    };
    /** Contenu principal de la page template */
    children: ReactNode;
}

export default function PageTemplate({
    title,
    backUrl,
    backLabel,
    breadcrumbs,
    children,
    intro
}: Props) {
    return (
        <AuthenticatedLayout
            title={title}
            backUrl={backUrl}
            backLabel={backLabel}
        >
            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
            {intro && (
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {intro.title}
                    </h2>
                    <p className="text-lg text-gray-600">
                        {intro.description}
                    </p>
                </div>
            )}

            {/* Contenu principal */}
            {children}
        </AuthenticatedLayout>
    );
}
