'use client';

import PageTemplate from '@/components/layout/PageTemplate';
import EmployesManagement from '@/components/componentEmploye/EmployesManagement';

/**
 * Page Employés - Route: /employees
 *
 * Interface dédiée à la gestion des employés
 */
export default function EmployeesPage() {
    return (
        <PageTemplate
            title="👨‍💼 Gestion des Employés"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Employés' }
            ]}
            intro={{
                title: "Administration des Employés",
                description: "Gérez les comptes employés et leurs informations"
            }}
        >
            <EmployesManagement />
        </PageTemplate>
    );
}
