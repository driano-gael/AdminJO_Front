import BackToEventsButton from '../shared/BackToEventsButton';
import {JSX} from "react";

interface EpreuvesHeaderProps {
  onCreateClick: () => void;
}

/**
 * Composant EpreuvesHeader - En-tête de gestion des épreuves sportives olympiques AdminJO
 *
 * @name EpreuvesHeader
 *
 * Ce composant fournit l'interface d'en-tête pour la section de gestion des épreuves
 * sportives des Jeux Olympiques. Il affiche le titre de la page avec iconographie
 * spécialisée médailles olympiques, le bouton de navigation retour vers les événements,
 * et le bouton d'ajout d'une nouvelle épreuve. Il suit les standards de design du
 * système AdminJO avec une mise en page horizontale équilibrée et navigation contextuelle
 * adaptée à la hiérarchie événements > disciplines > épreuves.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Titre et identification thématique olympique
 * - **Titre principal** : "Gestion des Épreuves" avec typographie imposante
 * - **Iconographie médailles** : Emojis 🥇🥈🥉 pour contexte compétitif olympique
 * - **Cohérence** : Style aligné avec autres modules AdminJO (événements, disciplines)
 *
 * ### Navigation contextuelle - Retour événements
 * - **Composant** : BackToEventsButton importé depuis shared/BackToEventsButton
 * - **Position** : Côté gauche du header pour navigation logique ascendante
 * - **Contexte hiérarchique** : Événements > Disciplines > Épreuves
 * - **UX** : Permet retour rapide vers liste événements sans perdre contexte
 * - **Hiérarchie** : Navigation parent-enfant claire dans arborescence JO
 *
 * @param {EpreuvesHeaderProps} props - Configuration du header des épreuves
 * @param {Function} props.onCreateClick - Callback déclenché lors du clic sur "Nouvelle Épreuve"
 *
 * @returns {JSX.Element} Header avec navigation, titre médailles et bouton de création d'épreuve
 *
 * @see {@link EpreuvesManagement} - Composant parent utilisant ce header
 * @see {@link EpreuveModal} - Modal ouverte par le bouton de création
 * @see {@link BackToEventsButton} - Composant de navigation vers événements
 *
 */
export function EpreuvesHeader({ onCreateClick }: EpreuvesHeaderProps): JSX.Element {
  return (
    <header className="bg-white shadow-md">
        <div className="flex justify-between items-center py-6 px-6">
            <BackToEventsButton />
            <h1 className="text-3xl font-bold text-gray-900">
              🥇 🥈 🥉 Gestion des Épreuves
            </h1>
          
          <button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Nouvelle Épreuve
          </button>
        </div>
    </header>
  );
}
export default EpreuvesHeader;
