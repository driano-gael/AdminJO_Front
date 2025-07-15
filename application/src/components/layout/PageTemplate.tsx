'use client';

import { ReactNode } from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';
import Breadcrumb from '@/components/navigation/Breadcrumb';


interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
    title: string;
    backUrl?: string;
    backLabel?: string;
    breadcrumbs?: BreadcrumbItem[];
    intro?: {
        title: string;
        description: string;
    };
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
