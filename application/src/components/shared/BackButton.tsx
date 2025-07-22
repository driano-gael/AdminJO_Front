'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  url: string;
  text?: string;
  className?: string;
}

/**
 * Composant générique pour les boutons de retour vers une URL personnalisée
 * Utilise le router Next.js pour la navigation
 */
export default function BackButton({ 
  url,
  text = "← Retour",
  className = "text-blue-600 hover:text-blue-800 font-medium"
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(url);
  };

  return (
    <button
      onClick={handleBack}
      className={className}
    >
      {text}
    </button>
  );
}
