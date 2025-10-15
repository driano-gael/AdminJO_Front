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
 * ### Structure fil d'Ariane intelligent
 * - **Items array** : BreadcrumbItem[] avec label et href optionnel
 * - **Navigation cliquable** : Links actifs pour items avec href fourni
 *
 *
 * @param {BreadcrumbProps} props - Configuration du breadcrumb navigation
 * @param {BreadcrumbItem[]} props.items - Array des éléments de navigation hiérarchique
 *
 * @returns {JSX.Element} Navigation breadcrumb complète avec liens et séparateurs
 *
 * @see {@link BreadcrumbItem} - Interface structure éléments navigation
 * @see {@link PageTemplate} - Template utilisant ce breadcrumb via props
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
export function Breadcrumb({ items }: BreadcrumbProps) {
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
export default Breadcrumb;
