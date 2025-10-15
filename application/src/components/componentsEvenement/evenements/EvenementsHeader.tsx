import BackToEventsButton from '../shared/BackToEventsButton';
import {JSX} from "react";

interface Props {
    onCreateEvent: () => void;
}

/**
 * Composant EventsHeader - En-tête de gestion des événements sportifs olympiques AdminJO
 *
 * @name EventsHeader
 *
 * Ce composant fournit l'interface d'en-tête pour la section de gestion des événements sportifs
 * des Jeux Olympiques 2024. Il affiche le titre de la page avec iconographie olympique spécialisée
 * (calendrier et trophée), le bouton de navigation retour vers les événements parent, et le bouton
 * d'ajout d'un nouvel événement. Il suit les standards de design du système AdminJO avec une mise
 * en page horizontale équilibrée, responsive design complet, et navigation contextuelle adaptée
 * à la hiérarchie complexe des événements sportifs olympiques.
 *
 * ## Fonctionnalités réellement implémentées événements
 *
 * ### Titre et identification thématique événements olympiques
 * - **Titre principal** : "Gestion des Événements Sportifs" avec typographie imposante
 * - **Iconographie olympique** : Emojis 📅 🏆 pour contexte événementiel et compétitif
 * - **Cohérence** : Style aligné avec autres modules AdminJO (disciplines, épreuves)
 *
 * ### Navigation contextuelle - Retour événements parent
 * - **Composant** : BackToEventsButton importé depuis shared/BackToEventsButton
 * - **Position** : Côté gauche du header pour navigation logique ascendante
 * - **Contexte hiérarchique** : Événements parent → Événements sportifs (sous-module)
 * - **UX** : Permet retour rapide vers liste événements parent sans perdre contexte
 * - **Réutilisabilité** : Composant partagé avec autres sous-modules événements
 *
 * ### Action de création événement sportif
 * - **Bouton primaire** : "+ Nouvel Événement"
 * - **Callback** : onCreateEvent pour déclenchement modal/formulaire
 *
 * ## Interactions et comportements événements
 *
 * ### Interaction navigation retour événements
 * - **Composant délégué** : BackToEventsButton gère sa propre logique
 * - **Navigation contextuelle** : Retour vers gestion événements parent
 * - **Préservation état** : Navigation sans perte de données locales
 * - **Hiérarchie** : Remontée logique dans arborescence fonctionnelle
 *
 * @param {Props} props - Configuration du header des événements sportifs
 * @param {Function} props.onCreateEvent - Callback déclenché lors du clic sur "Nouvel Événement"
 *
 * @returns {JSX.Element} Header avec navigation, titre événements et bouton de création
 *
 * @see {@link EvenementsManagement} - Composant parent utilisant ce header
 * @see {@link EvenementModal} - Modal ouverte par le bouton de création
 * @see {@link BackToEventsButton} - Composant de navigation vers événements parent
 *
 */
export function EventsHeader({ onCreateEvent }: Props): JSX.Element {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
            <BackToEventsButton />
            <h1 className="text-3xl font-bold text-gray-900">
              📅 Gestion des Événements Sportifs 🏆
            </h1>
          <button 
            onClick={onCreateEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Nouvel Événement
          </button>
        </div>
      </div>
    </header>
  );
}
export default EventsHeader;
