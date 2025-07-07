'use client';

import Link from 'next/link';

/**
 * Props pour le composant Breadcrumb
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
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
