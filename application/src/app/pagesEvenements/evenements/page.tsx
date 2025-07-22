'use client';

import EvenementsManagement from '@/components/componentsEvenement/evenements/EvenementsManagement';
import PageTemplate from '@/components/layout/PageTemplate';

/**
 * Page Gestion des Événements - Route: /management/events
 * 
 * Interface dédiée à la gestion des événements olympiques
 */
export default function EventsPage() {
    // const router = useRouter(); // Non utilisé pour le moment

    return (
        <PageTemplate
            title="Gestion des évènements sportifs"
            breadcrumbs={[
                { label: 'Accueil', href: '/dashboard' },
                { label: 'Tableau de gestion des évènements', href: '/pagesEvenements' },
                { label: 'Événements' }
            ]}
        >
            <EvenementsManagement />
        </PageTemplate>
    );
}
