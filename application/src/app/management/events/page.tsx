'use client';

import EventsManagement from '@/components/management/EvenementsManagement';
import PageTemplate from '@/components/layout/PageTemplate';

/**
 * Page Gestion des Événements - Route: /management/events
 * 
 * Interface dédiée à la gestion des événements olympiques
 */
export default function EventsPage() {
    return (
        <PageTemplate
            title="🏃‍♂️ Gestion des Événements"
            backUrl="/management"
            backLabel="Retour à la Gestion"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Gestion', href: '/management' },
                { label: 'Événements' }
            ]}
        >
            {/* Composant de gestion des événements */}
            <EventsManagement onBack={() => {}} />
        </PageTemplate>
    );
}
