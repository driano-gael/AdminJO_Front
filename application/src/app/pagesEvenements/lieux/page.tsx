'use client';

import LieuxManagement from '@/components/componentsEvenement/lieux/LieuxManagement';
import PageTemplate from '@/components/layout/PageTemplate';
import { useRouter } from 'next/navigation';

/**
 * Page Gestion des Lieux - Route: /pagesEvenements/lieux
 * 
 * Interface dédiée à la gestion des lieux olympiques
 */
export default function LieuxPage() {
    const router = useRouter();

    return (
        <PageTemplate
            title="Gestion des évènements sportifs"
            breadcrumbs={[
                { label: 'Accueil', href: '/dashboard' },
                { label: 'Tableau de gestion des évènements', href: '/pagesEvenements' },
                { label: 'Lieux' }
            ]}
        >
            <LieuxManagement onBack={() => router.push('/pagesEvenements')} />
        </PageTemplate>
    );
}
