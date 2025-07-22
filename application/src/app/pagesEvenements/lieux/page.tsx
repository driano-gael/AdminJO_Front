'use client';

import LieuxManagement from '@/components/componentsEvenement/lieux/LieuxManagement';
import PageTemplate from '@/components/layout/PageTemplate';

/**
 * Page Gestion des Lieux - Route: /pagesEvenements/lieux
 * 
 * Interface dédiée à la gestion des lieux olympiques
 */
export default function LieuxPage() {
    // const router = useRouter(); // Non utilisé pour le moment

    return (
        <PageTemplate
            title="Gestion des évènements sportifs"
            breadcrumbs={[
                { label: 'Accueil', href: '/dashboard' },
                { label: 'Tableau de gestion des évènements', href: '/pagesEvenements' },
                { label: 'Lieux' }
            ]}
        >
            <LieuxManagement />
        </PageTemplate>
    );
}
