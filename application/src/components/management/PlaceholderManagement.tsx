'use client';

interface PlaceholderManagementProps {
  onBack: () => void;
  title: string;
  icon: string;
  description: string;
}

export default function PlaceholderManagement({ 
  onBack, 
  title, 
  icon, 
  description 
}: PlaceholderManagementProps) {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ← Retour au Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {icon} {title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-8xl mb-6">{icon}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 mb-8">{description}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <p className="text-yellow-800">
              <strong>🚧 Section en développement</strong><br />
              Cette fonctionnalité sera bientôt disponible. Elle permettra la gestion complète de cette section.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Fonctionnalités prévues :</h3>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
              <li>• Création et modification d&apos;éléments</li>
              <li>• Recherche et filtrage avancés</li>
              <li>• Gestion des permissions</li>
              <li>• Export et import de données</li>
              <li>• Statistiques et rapports</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
