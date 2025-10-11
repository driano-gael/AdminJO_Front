'use client';

import PageTemplate from '@/components/layout/PageTemplate';
import ClientsManagement from '@/components/componentClient/ClientsManagement';

/**
 * Page Utilisateurs - Route: /users
 * 
 * Interface dédiée à la gestion des utilisateurs
 */
export default function UsersPage() {
    return (
        <PageTemplate
            title="👥 Gestion des Utilisateurs"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Utilisateurs' }
            ]}
            intro={{
                title: "Administration des Utilisateurs",
                description: "Gérez les comptes et permissions des utilisateurs"
            }}
        >
            <ClientsManagement />
        </PageTemplate>
    );
}
