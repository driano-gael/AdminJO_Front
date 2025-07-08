'use client';

import Link from 'next/link';
import { dashboardSections } from '@/types/dashBoardSections/dashboardSections';
import PageTemplate from '@/components/layout/PageTemplate';

/**
 * Page Dashboard principal - Route: /dashboard
 * 
 * Affiche le tableau de bord principal avec navigation vers les différentes sections
 * via des liens Next.js vers les routes dédiées
 */
export default function DashboardPage() {
    // Déterminer l'URL de destination selon la section
    const getDestinationUrl = (sectionId: string) => {
        switch (sectionId) {
            case 'management/':
                return '/management';
            case 'statistics/':
                return '/statistics';
            case 'users/':
                return '/users';
            case 'settings/':
                return '/settings';
            default:
                return `/dashboard/${sectionId}`;
        }
    };

    return (
        <PageTemplate
            title="Administration JO 2024"
            intro={{
                title: "Tableau de bord d'administration",
                description: "Sélectionnez une section pour commencer la gestion"
            }}
        >
            {/* Grille des sections du tableau de bord */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {dashboardSections.map((section) => (
                    <Link
                        key={section.url}
                        href={section.url}
                        className={`${section.color} text-white rounded-lg p-8 cursor-pointer transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl block`}
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">
                                {section.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {section.title}
                            </h3>
                            <p className="text-white/90 text-sm">
                                {section.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Section des statistiques rapides */}
            <div className="mt-16 bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Statistiques rapides</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">42</div>
                        <div className="text-sm text-gray-600">Événements sportifs</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">1,234</div>
                        <div className="text-sm text-gray-600">Utilisateurs actifs</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">18</div>
                        <div className="text-sm text-gray-600">Offres disponibles</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">156</div>
                        <div className="text-sm text-gray-600">Employés</div>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
}
