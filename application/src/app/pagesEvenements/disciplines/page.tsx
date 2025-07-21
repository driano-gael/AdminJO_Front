'use client';

import DisciplinesManagement from '@/components/componentsEvenement/discipline/DisciplinesManagement';
import PageTemplate from '@/components/layout/PageTemplate';
import { useRouter } from 'next/navigation';

/**
 * Page Gestion des Disciplines - Route: /management/disciplines
 * 
 * Interface dédiée à la gestion des disciplines sportives
 */
export default function DisciplinesPage() {
    const router = useRouter();
    return (
        <PageTemplate
            title="Gestion des évènements sportifs"
            breadcrumbs={[
                { label: 'Accueil', href: '/dashboard' },
                { label: 'Tableau de gestion des évènements', href: '/pagesEvenements' },
                { label: 'Disciplines' }
            ]}
        >
            {/* Composant de gestion des disciplines */}
            <DisciplinesManagement onBack={() => router.push('/pagesEvenements')} />
        </PageTemplate>
    );
}
