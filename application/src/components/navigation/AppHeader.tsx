'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/authContext';
import BackToDashboardButton from '../shared/BackToDashboardButton';

/**
 * Props pour le composant AppHeader
 */
interface AppHeaderProps {
  title: string;
  backUrl?: string;
  backLabel?: string;
  showBackToDashboard?: boolean;
}

/**
 * Composant AppHeader - Header réutilisable pour toutes les pages
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - Le header de l'application
 */
export default function AppHeader({ 
  title, 
  backUrl = '/dashboard', 
  backLabel = '⬅️ Accueil',
  showBackToDashboard = true 
}: AppHeaderProps) {
  const { user, logout } = useAuth();

  // Détermine si on utilise le composant BackToDashboardButton ou un Link personnalisé
  const shouldUseBackToDashboardButton = showBackToDashboard && (backUrl === '/dashboard' || !backUrl);

  return (
        <header className="bg-white shadow-md">
            <div className="">
                <div className="flex items-center py-6 relative">
                    {showBackToDashboard && (
                        <div className="absolute left-0 pl-4">
                            {shouldUseBackToDashboardButton ? (
                                <BackToDashboardButton 
                                  text={backLabel}
                                />
                            ) : (
                                <Link 
                                    href={backUrl}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {backLabel || 'Retour'}
                                </Link>
                            )}
                        </div>
                    )}

                    <h1 className="mx-auto text-3xl font-bold text-gray-900">
                        {title}
                    </h1>
                    
                    <div className="absolute right-0 pr-4 flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            <strong>{user?.email}</strong>
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
  );
}
