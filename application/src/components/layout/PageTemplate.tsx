/**
 * Composant PageTemplate - Template page avancé avec breadcrumbs AdminJO
 *
 * @name PageTemplate
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
 * ### Structure hiérarchique enrichie
 * 1. **AuthenticatedLayout** : Base sécurisée avec AppHeader (niveau 1)
 * 2. **Breadcrumb navigation** : Navigation hiérarchique contextuelle (niveau 2)
 * 3. **Section introduction** : Titre et description page optionnels (niveau 3)
 * 4. **Main content** : Zone contenu principal children (niveau 4)
 * 5. **Protection auth** : AuthGuard + session monitoring hérités (transversal)
 *
 * ### Navigation breadcrumb sophistiquée
 * - **BreadcrumbItem array** : items avec label et href optionnel pour navigation
 * - **Conditional rendering** : Breadcrumb affiché seulement si items fournis
 * - **Hierarchical navigation** : Chemin complet depuis racine vers page courante
 * - **Click navigation** : Liens actifs pour remontée hiérarchie rapide
 * - **Visual separation** : Séparateurs visuels entre niveaux navigation
 * - **Responsive breadcrumb** : Adaptation mobile avec truncation si nécessaire
 * - **Accessibility** : Navigation accessible via Breadcrumb component
 *
 * ## Props interface et configuration flexible
 *
 * ### Props héritées AuthenticatedLayout
 * - **title** : string titre principal page pour AppHeader
 * - **backUrl** : string optionnel URL navigation retour
 * - **backLabel** : string optionnel texte bouton retour personnalisé
 * - **children** : ReactNode contenu principal page template
 * - **Transmission directe** : Props passées sans modification à AuthenticatedLayout
 * - **Compatibilité** : Interface identique pour migration facile
 *
 * ### Props spécialisées PageTemplate
 * - **breadcrumbs** : BreadcrumbItem[] optionnel pour navigation hiérarchique
 * - **intro** : {title, description} optionnel pour section introduction
 * - **Extensibilité** : Structure props facilement extensible futures fonctionnalités
 * - **Type safety** : Interfaces BreadcrumbItem et Props strictes
 * - **Optional by design** : Toutes nouvelles props optionnelles pour flexibilité
 * - **Composition friendly** : Props permettent composition différentes layouts
 *
 * ### Workflow utilisation typique
 * 1. **Navigation utilisateur** : Clic lien vers page template
 * 2. **Auth verification** : AuthenticatedLayout vérifie authentification
 * 3. **Header render** : AppHeader avec titre et navigation retour
 * 4. **Breadcrumb display** : Navigation hiérarchique si breadcrumbs fournis
 * 5. **Intro section** : Titre/description si intro configurée
 * 6. **Content render** : Affichage children dans zone principale
 * 7. **Interactive navigation** : Breadcrumb et header permettent navigation
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

export function PageTemplate({
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
export default PageTemplate;
