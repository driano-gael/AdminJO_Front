'use client';

import { useAuth } from '@/contexts/authContext';
import { useState } from 'react';
import EventsManagement from '@/components/management/EventsManagement';
import PlaceholderManagement from '@/components/management/PlaceholderManagement';
import { 
    dashboardSections, 
    getDashboardSectionById, 
} from '@/types/dashBoardSections/dashboardSections';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    const handleSectionClick = (sectionId: string) => {
        setSelectedSection(sectionId);
    };

    if (selectedSection === 'events') {
        return <EventsManagement onBack={() => setSelectedSection(null)} />;
    }
    if (selectedSection) {
        const section = getDashboardSectionById(selectedSection);
        if (section) {
            return (
                <PlaceholderManagement
                    onBack={() => setSelectedSection(null)}
                    title={section.title}
                    icon={section.icon}
                    description={section.description}
                />
            );
        }
    }

    return (
        <div className="min-h-screen bg-base-200">
          {/* Header */}
            <header className="bg-white shadow-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                      🏅 Administration JO 2024
                    </h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Connecté en tant que: <strong>{user?.email}</strong>
                    </span>
                    <button
                      onClick={logout}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Tableau de bord d&apos;administration
                    </h2>
                    <p className="text-lg text-gray-600">
                      Sélectionnez une section pour commencer la gestion
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {dashboardSections.map((section) => (
                        <div
                            key={section.id}
                            onClick={() => handleSectionClick(section.id)}
                            className={`${section.color} text-white rounded-lg p-8 cursor-pointer transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl`}
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
                        </div>
                    ))}
                </div>

                {/* Quick Stats */}
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
            </main>
        </div>
    );
}
