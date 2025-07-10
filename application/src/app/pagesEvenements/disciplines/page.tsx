'use client';

import DisciplinesManagement from '@/components/management/DisciplinesManagement';
import PageTemplate from '@/components/layout/PageTemplate';

/**
 * Page Gestion des Disciplines - Route: /management/disciplines
 * 
 * Interface dédiée à la gestion des disciplines sportives
 */
export default function DisciplinesPage() {
    return (
        <PageTemplate
            title="🏆 Gestion des Disciplines"
            backUrl="/pagesEvenements"
            backLabel="Retour à la Gestion"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Gestion', href: '/management' },
                { label: 'Disciplines' }
            ]}
        >
            {/* Composant de gestion des disciplines */}
            <DisciplinesManagement onBack={() => {}} />
        </PageTemplate>
    );
}
