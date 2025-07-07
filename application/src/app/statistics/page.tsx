'use client';

import PageTemplate from '@/components/layout/PageTemplate';

/**
 * Page Statistiques - Route: /statistics
 * 
 * Interface dédiée aux statistiques des Jeux Olympiques
 */
export default function StatisticsPage() {
    return (
        <PageTemplate
            title="📊 Statistiques des JO"
            backUrl="/dashboard"
            backLabel="Retour au Dashboard"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Statistiques' }
            ]}
            intro={{
                title: "Analyse et Statistiques",
                description: "Consultez les données et métriques des Jeux Olympiques"
            }}
        >
            {/* Grille des statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">42</div>
                    <div className="text-sm text-gray-600">Événements totaux</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">1,234</div>
                    <div className="text-sm text-gray-600">Participants</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">25</div>
                    <div className="text-sm text-gray-600">Lieux actifs</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">87%</div>
                    <div className="text-sm text-gray-600">Taux d'occupation</div>
                </div>
            </div>

            {/* Placeholder pour les graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        Évolution des inscriptions
                    </h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">📈</div>
                            <p>Graphique en développement</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        Répartition par discipline
                    </h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">🥧</div>
                            <p>Graphique en développement</p>
                        </div>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
}
