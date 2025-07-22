'use client';

import { useRouter } from 'next/navigation';

interface BackToEventsButtonProps {
  className?: string;
  text?: string;
}

/**
 * Composant réutilisable pour le bouton de retour vers la gestion globale des événements
 * Remplace la logique dupliquée dans tous les composants de management
 */
export default function BackToEventsButton({ 
  className = "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors",
  text = "↩️ gestion globale évènements"
}: BackToEventsButtonProps) {
  const router = useRouter();

  const handleBackToEvents = () => {
    router.push('/pagesEvenements');
  };

  return (
    <button
      onClick={handleBackToEvents}
      className={className}
    >
      {text}
    </button>
  );
}
