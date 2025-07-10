'use client';

import EpreuvesManagement from '@/components/management/EpreuvesManagement';
import PageTemplate from '@/components/layout/PageTemplate';

/**
 * Page Gestion des Épreuves - Route: /management/epreuves
 * 
 * Interface dédiée à la gestion des épreuves olympiques
 */
export default function EpreuvesPage() {
    return (
        <PageTemplate
            title="🥇 Gestion des Épreuves"
            backUrl="/pagesEvenements"
            backLabel="Retour à la Gestion"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Gestion', href: '/management' },
                { label: 'Épreuves' }
            ]}
        >
            {/* Composant de gestion des épreuves */}
            <EpreuvesManagement onBack={() => {}} />
        </PageTemplate>
    );
}
