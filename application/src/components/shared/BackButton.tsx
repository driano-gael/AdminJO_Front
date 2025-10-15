'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  url: string;
  text?: string;
  className?: string;
}

/**
 * Composant BackButton - Bouton navigation retour générique AdminJO
 *
 * @name BackButton
 * Ce composant bouton de navigation universel fournit une interface standardisée
 * pour la navigation retour vers n'importe quelle URL dans l'application AdminJO
 * des Jeux Olympiques 2024. Il centralise la logique de navigation avec Next.js
 * App Router, offre une customisation complète du texte et du style, et assure
 * une expérience utilisateur cohérente pour tous les besoins de navigation
 * contextuelle. Conçu pour la flexibilité maximale, il permet aux développeurs
 * de créer des boutons retour personnalisés tout en maintenant les standards
 * de design et d'accessibilité AdminJO pour l'écosystème olympique.
 *
 * ## Architecture navigation et configuration flexible
 *
 * ### Navigation programmable Next.js App Router
 * - **Router integration** : useRouter() hook pour navigation client-side
 * - **URL flexible** : Props url accepte n'importe quelle route application
 * - **Push navigation** : router.push() ajoute entrée historique navigateur
 *
 * @param {BackButtonProps} props - Propriétés configuration bouton retour
 * @param {string} props.url - URL destination navigation (obligatoire)
 * @param {string} [props.text="← Retour"] - Texte affiché bouton (optionnel)
 * @param {string} [props.className] - Classes CSS Tailwind custom (optionnel)
 *
 * @returns {JSX.Element} Bouton navigation retour interactif optimisé AdminJO
 *
 * @see Next.js useRouter - Hook Next.js navigation App Router
 * @see BackToDashboardButton - Variante spécialisée dashboard
 */
export function BackButton({
  url,
  text = "← Retour",
  className = "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(url);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
    >
      {text}
    </button>
  );
}
export default BackButton;
