'use client';

import { useAuth } from '@/contexts/authContext';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  onBack: () => void;
}

export default function AuthGuard({ children, onBack }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté en tant qu'administrateur pour accéder à cette page.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
