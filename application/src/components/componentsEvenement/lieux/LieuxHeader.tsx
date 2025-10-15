import BackToEventsButton from '../shared/BackToEventsButton';

/**
 * Composant LieuxHeader - En-tête de gestion des lieux olympiques AdminJO
 *
 * @name LieuxHeader
 * Ce composant fournit l'interface d'en-tête pour la section de gestion des lieux
 * olympiques des Jeux Olympiques 2024. Il affiche le titre de la page avec icône thématique,
 * le bouton de navigation retour vers les événements, et le bouton d'ajout d'un nouveau
 * lieu. Il suit les standards de design du système AdminJO avec une mise en page
 * horizontale équilibrée et navigation contextuelle pour la gestion des établissements
 * sportifs olympiques (Stade de France, Centre Aquatique, Arena Bercy, etc.).
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Titre et identification thématique lieux
 * - **Titre principal** : "Gestion des Lieux" avec typographie imposante
 * - **Cohérence** : Style aligné avec autres modules AdminJO (événements, disciplines)
 *
 * ### Navigation contextuelle - Retour événements
 * - **Composant** : BackToEventsButton importé depuis shared/BackToEventsButton
 * - **Position** : Côté gauche du header pour navigation logique
 * - **Contexte** : Les lieux font partie de la gestion des événements
 * - **UX** : Permet retour rapide vers liste événements sans perdre contexte
 * - **Hiérarchie** : Navigation parent-enfant claire (événements > lieux)
 * - **Intégration** : Lieux comme infrastructure pour événements olympiques
 *
 * ### Action de création lieu olympique
 * - **Bouton primaire** : "+ Nouveau Lieu"
 * - **Callback** : onCreateClick pour déclenchement modal/formulaire
 *
 * ### Interaction navigation retour
 * - **Composant délégué** : BackToEventsButton gère sa propre logique
 * - **Navigation contextuelle** : Retour vers gestion événements
 * - **Préservation état** : Navigation sans perte de données
 * - **UX cohérente** : Pattern de navigation standard AdminJO
 * - **Intégration** : Maintien du contexte événementiel global
 *
 *
 * @param {LieuxHeaderProps} props - Configuration du header des lieux
 * @param {Function} props.onCreateClick - Callback déclenché lors du clic sur "Nouveau Lieu"
 *
 * @returns {JSX.Element} Header avec navigation, titre et bouton de création de lieu
 *
 * @see {@link LieuxManagement} - Composant parent utilisant ce header
 * @see {@link LieuModal} - Modal ouverte par le bouton de création
 * @see {@link BackToEventsButton} - Composant de navigation vers événements
 *
 */
interface LieuxHeaderProps {
  onCreateClick: () => void;
}

export function LieuxHeader({ onCreateClick }: LieuxHeaderProps) {
  return (
    <header className="bg-white shadow-md">
        <div className="flex justify-between items-center py-6 px-6">
            <BackToEventsButton />
            <h1 className="text-3xl font-bold text-gray-900">
              🏢 Gestion des Lieux
            </h1>
          
          <button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Nouveau Lieu
          </button>
        </div>
    </header>
  );
}
export default LieuxHeader;
