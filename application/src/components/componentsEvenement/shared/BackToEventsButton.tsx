'use client';

import { useRouter } from 'next/navigation';

/**
 * Composant BackToEventsButton - Bouton navigation retour événements AdminJO
 *
 * @name BackToEventsButton
 * Ce composant réutilisable fournit une navigation contextuelle standardisée pour retourner
 * à la gestion globale des événements olympiques depuis les sous-modules spécialisés
 * (disciplines, lieux, épreuves). Il centralise la logique de navigation avec Next.js
 * App Router, élimine la duplication de code entre composants, et assure une expérience
 * utilisateur cohérente pour la navigation hiérarchique dans l'écosystème AdminJO des
 * Jeux Olympiques 2024. Design adaptatif avec customisation possible du style et texte
 * tout en maintenant les standards visuels et d'accessibilité AdminJO.
 *
 * ## Fonctionnalités de navigation réellement implémentées
 *
 * ### Navigation hiérarchique contextualisée événements
 * - **Destination fixe** : /pagesEvenements route principale gestion événements
 * - **Router Next.js** : useRouter() hook pour navigation client-side
 * - **Push navigation** : router.push() pour ajout historique navigateur
 * - **Bouton universel** : Utilisable dans tous sous-modules événements
 * - **Centralisation logique** : Évite duplication code navigation
 * - **URL absolue** : /pagesEvenements chemin constant indépendant contexte
 * - **Contexte olympique** : Retour vers hub central gestion événements JO
 *
 * @param {BackToEventsButtonProps} props - Configuration du bouton navigation
 * @param {string} [props.className] - Classes CSS custom pour override styling
 * @param {string} [props.text] - Texte affiché sur bouton (default: "↩️ gestion globale évènements")
 *
 * @returns {JSX.Element} Bouton navigation retour vers gestion événements
 *
 * @see {@link LieuxHeader} - Utilise ce bouton pour navigation retour
 * @see {@link DisciplinesHeader} - Utilise ce bouton pour navigation retour
 * @see {@link EpreuvesHeader} - Utilise ce bouton pour navigation retour
 *
 */
interface BackToEventsButtonProps {
  className?: string;
  text?: string;
}

/**
 * Composant réutilisable pour le bouton de retour vers la gestion globale des événements
 * Remplace la logique dupliquée dans tous les composants de management
 */
export function BackToEventsButton({
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
export default BackToEventsButton;
