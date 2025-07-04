'use client';

import { useState } from 'react';
import EventsManagement from './EventsManagement';
import LieuxManagement from './LieuxManagement';
import DisciplinesManagement from './DisciplinesManagement';
import EpreuvesManagement from './EpreuvesManagement';
import AuthGuard from './AuthGuard';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { useAuth } from '@/contexts/authContext';

// Type pour gérer les différentes sections du dashboard de gestion
type ManagementSection = 'dashboard' | 'events' | 'lieux' | 'disciplines' | 'epreuves';

/**
 * Props pour le composant ManagementDashboard
 */
interface ManagementDashboardProps {
  onBack: () => void; // Fonction pour revenir au dashboard principal
}

/**
 * Composant ManagementDashboard - Interface de gestion des entités olympiques
 * 
 * Fonctionnalités :
 * - Navigation entre les différentes sections de gestion (événements, lieux, disciplines, épreuves)
 * - Protection par authentification via AuthGuard
 * - Gestion automatique de l'expiration de session
 * - Interface unifiée pour la gestion des données olympiques
 * - Bouton de test d'expiration de session (uniquement en développement)
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Le dashboard de gestion
 */
export default function ManagementDashboard({ onBack }: ManagementDashboardProps) {
  // État pour gérer la section active du dashboard
  const [activeSection, setActiveSection] = useState<ManagementSection>('dashboard');
  
  // Récupération de la fonction de déconnexion forcée depuis le contexte auth
  const { forceLogout } = useAuth();
  
  // Activation de la gestion automatique de l'expiration de session
  useSessionExpiry();

  /**
   * Fonction pour revenir au dashboard principal de gestion
   */
  const handleBackToDashboard = () => {
    setActiveSection('dashboard');
  };

  /**
   * Fonction de test pour simuler l'expiration de session
   * Uniquement disponible en environnement de développement
   */
  const testSessionExpiry = () => {
    if (process.env.NODE_ENV === 'development') {
      forceLogout();
    }
  };

  // Rendu avec protection par authentification
  return (
    <AuthGuard onBack={onBack}>
      {/* Rendu conditionnel basé sur la section active */}
      {activeSection === 'events' && <EventsManagement onBack={handleBackToDashboard} />}
      {activeSection === 'lieux' && <LieuxManagement onBack={handleBackToDashboard} />}
      {activeSection === 'disciplines' && <DisciplinesManagement onBack={handleBackToDashboard} />}
      {activeSection === 'epreuves' && <EpreuvesManagement onBack={handleBackToDashboard} />}
      
      {/* Affichage du dashboard principal quand aucune section spécifique n'est sélectionnée */}
      {activeSection === 'dashboard' && (
        <DashboardContent
          onBack={onBack}
          setActiveSection={setActiveSection}
          testSessionExpiry={testSessionExpiry}
        />
      )}
    </AuthGuard>
  );
}

/**
 * Props pour le composant DashboardContent
 */
interface DashboardContentProps {
  onBack: () => void; // Fonction pour revenir au dashboard principal
  setActiveSection: (section: ManagementSection) => void; // Fonction pour changer de section
  testSessionExpiry: () => void; // Fonction de test d'expiration de session
}

/**
 * Composant DashboardContent - Contenu principal du dashboard de gestion
 * 
 * Fonctionnalités :
 * - Affichage des cartes de navigation vers les différentes sections
 * - Aperçu rapide des statistiques (données factices)
 * - Actions rapides pour créer de nouveaux éléments
 * - Bouton de test d'expiration de session (développement uniquement)
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Le contenu du dashboard
 */
function DashboardContent({ onBack, setActiveSection, testSessionExpiry }: DashboardContentProps) {
  return (
    <div className="min-h-screen bg-base-200">
      {/* En-tête avec bouton de retour */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ← Retour au Dashboard Principal
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                🏛️ Dashboard de Gestion
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Administration des Jeux Olympiques
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Section d'accueil */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Bienvenue dans le tableau de bord de gestion
          </h2>
          <p className="text-gray-600 mb-4">
            Gérez tous les aspects de votre organisation olympique depuis cette interface centralisée. 
            Sélectionnez une section pour commencer.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>🔒 Accès administrateur</span>
            <span>•</span>
            <span>✨ Interface modernisée</span>
            <span>•</span>
            <span>📊 Données en temps réel</span>
            {/* Bouton de test d'expiration de session uniquement en développement */}
            {process.env.NODE_ENV === 'development' && (
              <>
                <span>•</span>
                <button
                  onClick={testSessionExpiry}
                  className="text-red-500 hover:text-red-700 text-xs px-2 py-1 border border-red-300 rounded"
                >
                  Test Expiration Session
                </button>
              </>
            )}
          </div>
        </div>

        {/* Cartes de navigation vers les différentes sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Gestion des Événements */}
          <div
            onClick={() => setActiveSection('events')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🏟️</div>
              <div className="text-sm text-gray-500">Gestion</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Événements</h3>
            <p className="text-gray-600 text-sm mb-4">
              Gérez les événements sportifs, leurs horaires et leurs lieux.
            </p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <span>Gérer les événements</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Gestion des Lieux */}
          <div
            onClick={() => setActiveSection('lieux')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🏢</div>
              <div className="text-sm text-gray-500">Gestion</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lieux</h3>
            <p className="text-gray-600 text-sm mb-4">
              Administrez les sites et installations olympiques.
            </p>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <span>Gérer les lieux</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Gestion des Disciplines */}
          <div
            onClick={() => setActiveSection('disciplines')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🏆</div>
              <div className="text-sm text-gray-500">Gestion</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Disciplines</h3>
            <p className="text-gray-600 text-sm mb-4">
              Organisez les différentes disciplines sportives.
            </p>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              <span>Gérer les disciplines</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Gestion des Épreuves */}
          <div
            onClick={() => setActiveSection('epreuves')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-orange-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🥇</div>
              <div className="text-sm text-gray-500">Gestion</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Épreuves</h3>
            <p className="text-gray-600 text-sm mb-4">
              Configurez les épreuves et compétitions spécifiques.
            </p>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              <span>Gérer les épreuves</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Section des statistiques (données factices) */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">-</div>
              <div className="text-sm text-gray-600">Événements</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">-</div>
              <div className="text-sm text-gray-600">Lieux</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">-</div>
              <div className="text-sm text-gray-600">Disciplines</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">-</div>
              <div className="text-sm text-gray-600">Épreuves</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Les statistiques seront mises à jour automatiquement
          </div>
        </div>

        {/* Section des actions rapides */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveSection('events')}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">🏟️</span>
              Nouvel Événement
            </button>
            <button
              onClick={() => setActiveSection('lieux')}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <span className="mr-2">🏢</span>
              Nouveau Lieu
            </button>
            <button
              onClick={() => setActiveSection('disciplines')}
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <span className="mr-2">🏆</span>
              Nouvelle Discipline
            </button>
            <button
              onClick={() => setActiveSection('epreuves')}
              className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              <span className="mr-2">🥇</span>
              Nouvelle Épreuve
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
