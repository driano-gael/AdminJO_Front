'use client';

import EvenementsManagement from '@/components/componentsEvenement/evenements/EvenementsManagement';
import PageTemplate from '@/components/layout/PageTemplate';
import { useRouter } from 'next/navigation';

/**
 * Page Gestion des Événements - Route: /management/events
 * 
 * Interface dédiée à la gestion des événements olympiques
 */
export default function EventsPage() {
    const router = useRouter();

    return (
        <PageTemplate
            title="Gestion des Événements sportifs"
            backUrl="/pagesEvenements"
            backLabel="Retour à la Gestion"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Gestion', href: '/management' },
                { label: 'Événements' }
            ]}
        >
            <EvenementsManagement onBack={() => router.push('/dashboard')} />
        </PageTemplate>
    );
}
