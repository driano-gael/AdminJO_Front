'use client';

interface EmployesHeaderProps {
  onAddEmploye?: () => void;
}

/**
 * En-tête de la page de gestion des employés
 */
export default function EmployesHeader({ onAddEmploye }: EmployesHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl">👨‍💼</span>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                    Gestion des Employés
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Liste des employés enregistrés dans le système
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={onAddEmploye}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un employé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
