'use client';

import { useRouter } from 'next/navigation';

interface BackToDashboardButtonProps {
  className?: string;
  text?: string;
}

/**
 * Composant réutilisable pour le bouton de retour vers le dashboard/accueil
 * Remplace la logique dupliquée dans tous les headers et sections du dashboard
 */
export default function BackToDashboardButton({ 
  className = "text-blue-600 hover:text-blue-800 font-medium",
  text = "⬅️ Accueil"
}: BackToDashboardButtonProps) {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <button
      onClick={handleBackToDashboard}
      className={className}
    >
      {text}
    </button>
  );
}
