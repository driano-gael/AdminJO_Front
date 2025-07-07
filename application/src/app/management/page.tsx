'use client';

import Link from 'next/link';
import { useAuthenticatedPage } from '@/hooks/useAuthenticatedPage';
import PageTemplate from '@/components/layout/PageTemplate';

/**
 * Page Dashboard Management - Route: /management
 * 
 * Interface de gestion des entités olympiques avec navigation vers les sous-sections
 */
export default function ManagementPage() {
    const { forceLogout } = useAuthenticatedPage();

    /**
     * Fonction de test d'expiration de session (développement uniquement)
     */
    const handleTestSessionExpiry = () => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🧪 Test d\'expiration de session déclenché');
            forceLogout();
        }
    };

    // Définition des sections de gestion
    const managementSections = [
        {
            id: 'events',
            title: 'Gestion des Événements',
            description: 'Créer, modifier et supprimer les événements olympiques',
            icon: '🏃‍♂️',
            color: 'bg-blue-600 hover:bg-blue-700',
            href: '/management/events'
        },
        {
            id: 'lieux',
            title: 'Gestion des Lieux',
            description: 'Administrer les sites et venues olympiques',
            icon: '🏟️',
            color: 'bg-green-600 hover:bg-green-700',
            href: '/management/lieux'
        },
        {
            id: 'disciplines',
            title: 'Gestion des Disciplines',
            description: 'Organiser les disciplines sportives',
            icon: '🏆',
            color: 'bg-purple-600 hover:bg-purple-700',
            href: '/management/disciplines'
        },
        {
            id: 'epreuves',
            title: 'Gestion des Épreuves',
            description: 'Configurer les épreuves et compétitions',
            icon: '🥇',
            color: 'bg-orange-600 hover:bg-orange-700',
            href: '/management/epreuves'
        }
    ];

    return (
        <PageTemplate
            title="🔧 Gestion Administrative"
            backUrl="/dashboard"
            backLabel="Retour au Dashboard"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Gestion' }
            ]}
            intro={{
                title: "Interface de Gestion",
                description: "Gérez les différents aspects des Jeux Olympiques"
            }}
        >
            {/* Grille des sections de gestion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {managementSections.map((section) => (
                    <Link
                        key={section.id}
                        href={section.href}
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

            {/* Section outils d'administration */}
            <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Outils d&apos;Administration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">Management</div>
                        <div className="text-sm text-gray-600">Interface centralisée</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">Sécurisé</div>
                        <div className="text-sm text-gray-600">Accès protégé</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">Temps réel</div>
                        <div className="text-sm text-gray-600">Données synchronisées</div>
                    </div>
                </div>

                {/* Bouton de test d'expiration (développement uniquement) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            🧪 Outils de développement
                        </h4>
                        <button
                            onClick={handleTestSessionExpiry}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Tester expiration session
                        </button>
                    </div>
                )}
            </div>
        </PageTemplate>
    );
}
