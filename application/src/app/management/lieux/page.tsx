'use client';

import LieuxManagement from '@/components/management/LieuxManagement';
import PageTemplate from '@/components/layout/PageTemplate';

/**
 * Page Gestion des Lieux - Route: /management/lieux
 * 
 * Interface dédiée à la gestion des lieux olympiques
 */
export default function LieuxPage() {
    return (
        <PageTemplate
            title="🏟️ Gestion des Lieux"
            backUrl="/management"
            backLabel="Retour à la Gestion"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Gestion', href: '/management' },
                { label: 'Lieux' }
            ]}
        >
            {/* Composant de gestion des lieux */}
            <LieuxManagement onBack={() => {}} />
        </PageTemplate>
    );
}
