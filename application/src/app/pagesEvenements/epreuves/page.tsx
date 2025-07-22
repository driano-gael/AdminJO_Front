'use client';

import EpreuvesManagement from '@/components/componentsEvenement/epreuve/EpreuvesManagement';
import PageTemplate from '@/components/layout/PageTemplate';
import { useRouter } from 'next/navigation';

/**
 * Page Gestion des Épreuves - Route: /management/epreuves
 * 
 * Interface dédiée à la gestion des épreuves olympiques
 */
export default function EpreuvesPage() {
    const router = useRouter();
    return (
        <PageTemplate
            title="Gestion des évènements sportifs"
            breadcrumbs={[
                { label: 'Accueil', href: '/dashboard' },
                { label: 'Tableau de gestion des évènements', href: '/pagesEvenements' },
                { label: 'Épreuves' }
            ]}
        >
            {/* Composant de gestion des épreuves */}
            <EpreuvesManagement />
        </PageTemplate>
    );
}
