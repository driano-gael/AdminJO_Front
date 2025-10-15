import {JSX} from "react";

interface Props {
  onCreateClick: () => void;
}

/**
 * Composant OffresHeader - En-tête de gestion des offres AdminJO
 *
 * @name OffresHeader
 *
 * Ce composant fournit l'interface d'en-tête pour la section de gestion des offres sportives
 * des Jeux Olympiques. Il affiche le titre de la page avec icône thématique et le bouton
 * d'ajout d'une nouvelle offre. Il suit les standards de design du système AdminJO avec
 * une mise en page horizontale optimisée.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * - **Bouton primaire**
 * - **Pas de dépendances** : Props stables entre renders
 * - **Callback externe** : onCreateClick géré par parent
 *
 * ## Utilisation dans l'architecture
 * - **Parent** : OffresManagement l'utilise comme header
 * - **Position** : Premier élément de la page offres
 * - **Callback** : Déclenche ouverture OffresModal
 * - **Isolation** : Composant autonome sans dépendances
 *
 * ### Rôle dans l'UX
 * - **Point d'entrée** : Première interaction utilisateur
 * - **Navigation** : Identification de la section courante
 * - **Action primaire** : Création de nouvelles offres
 *
 *
 * @param {Props} props - Configuration du header des offres
 * @param {Function} props.onCreateClick - Callback déclenché lors du clic sur "Nouvelle Offre"
 *
 * @returns {JSX.Element} Header avec titre et bouton de création d'offre
 *
 * @see {@link OffresManagement} - Composant parent utilisant ce header
 * @see {@link OffresModal} - Modal ouverte par le bouton de création
 *
 */
export function OffresHeader({ onCreateClick }: Props): JSX.Element {
  return (
    <header className="bg-white shadow-md">
      <div className="py-6 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            🏃 Gestion des Offres
          </h1>
          {/*<BackToEventsButton />*/}
          <button
            onClick={onCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Nouvelle Offre
          </button>
        </div>
      </div>
    </header>
  );
}
export default OffresHeader;
