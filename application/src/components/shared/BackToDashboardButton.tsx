'use client';

import { useRouter } from 'next/navigation';

interface BackToDashboardButtonProps {
  text?: string;
  className?: string;
}

/**
 * Composant BackToDashboardButton - Bouton retour dashboard spécialisé AdminJO
 *
 * Ce composant bouton de navigation spécialisé fournit un accès direct et optimisé
 * vers le tableau de bord principal de l'application AdminJO des Jeux Olympiques 2024.
 * Contrairement au BackButton générique, il est pré-configuré pour la destination
 * dashboard avec des optimisations spécifiques et une iconographie dédiée. Il centralise
 * la logique de retour au hub principal d'administration olympique, offre une
 * customisation du texte et du style, et assure une expérience utilisateur cohérente
 * pour l'accès rapide au centre de contrôle AdminJO depuis n'importe quelle section
 * de l'écosystème d'administration des Jeux Olympiques.
 *
 * ## Architecture navigation dashboard et optimisations spécialisées
 *
 * ### Navigation dashboard pré-configurée optimisée
 * - **URL fixe dashboard** : Route '/dashboard' intégrée et optimisée
 * - **Router integration** : useRouter() hook pour navigation client-side
 * - **Dashboard-specific** : Logique spécialisée centre administratif JO
 * - **Push navigation** : router.push('/dashboard') ajout historique
 * - **Client-side routing** : Navigation sans rechargement page dashboard
 * - **Performance optimisée** : Préchargement dashboard Next.js automatique
 * - **History management** : Gestion pile navigation dashboard native
 *
 * @param {BackToDashboardButtonProps} props - Propriétés configuration bouton dashboard
 * @param {string} [props.text="← Tableau de bord"] - Texte affiché bouton hub (optionnel)
 * @param {string} [props.className] - Classes CSS Tailwind dashboard custom (optionnel)
 *
 * @returns {JSX.Element} Bouton navigation dashboard interactif optimisé hub AdminJO
 *
 * @see Next.js useRouter - Hook Next.js navigation App Router dashboard
 * @see BackButton - Composant générique navigation flexible
 */
export function BackToDashboardButton({
  text = "← Tableau de bord",
  className = "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
}: BackToDashboardButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard');
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
export default BackToDashboardButton;