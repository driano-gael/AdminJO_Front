'use client';

import PageTemplate from '@/components/layout/PageTemplate';

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
            {/* Placeholder pour la gestion des utilisateurs */}
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        Liste des Utilisateurs
                    </h3>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Ajouter un utilisateur
                    </button>
                </div>

                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <div className="text-6xl mb-4">👥</div>
                        <h4 className="text-xl font-semibold mb-2">
                            Interface en développement
                        </h4>
                        <p>
                            La gestion des utilisateurs sera disponible prochainement
                        </p>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
}
