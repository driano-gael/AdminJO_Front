'use client';

import { useAuth } from '@/contexts/authContext';
import { useState } from 'react';
import ManagementDashboard from '@/components/dashboard/ManagementDashboard';
import PlaceholderManagement from '@/components/management/PlaceholderManagement';
import { 
    dashboardSections, 
    getDashboardSectionById, 
} from '@/types/dashBoardSections/dashboardSections';

/**
 * Composant Dashboard principal de l'application d'administration des JO
 * 
 * Fonctionnalités :
 * - Affichage du tableau de bord principal avec les différentes sections
 * - Navigation vers les modules de gestion (événements, lieux, disciplines, épreuves)
 * - Affichage des informations utilisateur et bouton de déconnexion
 * - Statistiques rapides (données factices pour l'exemple)
 * - Gestion de l'état de navigation entre les sections
 * 
 * @returns JSX.Element - Le tableau de bord d'administration
 */
export default function Dashboard() {
    // Récupération des données utilisateur et fonction de déconnexion depuis le contexte auth
    const { user, logout } = useAuth();
    
    // État pour gérer quelle section est actuellement sélectionnée
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    /**
     * Gestionnaire de clic sur une section du dashboard
     * @param sectionId - L'ID de la section sélectionnée
     */
    const handleSectionClick = (sectionId: string) => {
        setSelectedSection(sectionId);
    };

    // Rendu conditionnel : si la section "management" est sélectionnée, afficher le tableau de bord de gestion
    if (selectedSection === 'management') {
        return <ManagementDashboard onBack={() => setSelectedSection(null)} />;
    }
    
    // Rendu conditionnel : si une autre section est sélectionnée, afficher le composant placeholder
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

    // Rendu principal : affichage du tableau de bord avec toutes les sections
    return (
        <div className="min-h-screen bg-base-200">
          {/* Header avec informations utilisateur et bouton de déconnexion */}
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
                    {/* Bouton de déconnexion qui utilise la fonction logout du contexte auth */}
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

            {/* Contenu principal du tableau de bord */}
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Section d'introduction */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Tableau de bord d&apos;administration
                    </h2>
                    <p className="text-lg text-gray-600">
                      Sélectionnez une section pour commencer la gestion
                    </p>
                </div>

                {/* Grille des sections du tableau de bord */}
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

                {/* Section des statistiques rapides (données factices pour l'exemple) */}
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
