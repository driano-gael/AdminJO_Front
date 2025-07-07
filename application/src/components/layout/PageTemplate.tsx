'use client';

import { ReactNode } from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';
import Breadcrumb from '@/components/navigation/Breadcrumb';

/**
 * Interface pour les éléments de breadcrumb
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Props pour le composant PageTemplate
 */
interface PageTemplateProps {
    title: string;
    backUrl?: string;
    backLabel?: string;
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
    intro?: {
        title: string;
        description: string;
    };
}

/**
 * Template réutilisable pour toutes les pages de l'application
 * 
 * Inclut automatiquement :
 * - Layout authentifié
 * - Breadcrumbs de navigation
 * - Section d'introduction optionnelle
 */
export default function PageTemplate({
    title,
    backUrl,
    backLabel,
    breadcrumbs,
    children,
    intro
}: PageTemplateProps) {
    return (
        <AuthenticatedLayout
            title={title}
            backUrl={backUrl}
            backLabel={backLabel}
        >
            {/* Navigation breadcrumb */}
            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

            {/* Section d'introduction optionnelle */}
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
