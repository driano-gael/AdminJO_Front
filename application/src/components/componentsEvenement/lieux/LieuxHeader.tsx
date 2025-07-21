interface LieuxHeaderProps {
  onBack: () => void;
  onCreateClick: () => void;
}

export default function LieuxHeader({ onBack, onCreateClick }: LieuxHeaderProps) {
  return (
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
              🏢 Gestion des Lieux
            </h1>
          </div>
          <button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Nouveau Lieu
          </button>
        </div>
      </div>
    </header>
  );
}
