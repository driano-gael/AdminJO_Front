import { Evenement} from '@/types/sportEvenement/evenement';
import EventStatus from './EvenementsStatus';
import EvenementEpreuve from './EvenementEpreuves';
import {JSX} from "react";

interface Props {
  event: Evenement;
  onDelete: (id: number) => void;
  onEdit: (event: Evenement) => void;
}

/**
 * Composant EvenementsTableRow - Ligne de tableau pour événement sportif olympique AdminJO
 *
 * Ce composant représente une ligne individuelle dans le tableau des événements sportifs
 * olympiques. Il affiche les informations complètes d'un événement (description, épreuves,
 * date/heure, lieu, statut) avec sous-composants spécialisés intégrés et fournit les actions
 * CRUD directes via boutons. Conçu pour l'interface d'administration des Jeux Olympiques 2024,
 * il orchestre l'affichage de données complexes avec relations multiples (épreuves, lieux)
 * et calcul de statut temps réel selon planning.
 *
 * ## Données affichées et sous-composants intégrés
 *
 * ### Description événement principale
 * - **Description complète** : `event.description` avec typographie medium accentuée
 * - **Contenu riche** : Titre descriptif événement sportif (ex: "Finale natation 100m")
 *
 * ### Épreuves associées via EvenementEpreuve (sous-composant intégré)
 * - **Composant spécialisé** : EvenementEpreuve pour affichage épreuves complexes
 * - **Données relationnelles** : `event.epreuves` array transmis intégralement
 * - **Gestion multiple** : Support affichage plusieurs épreuves par événement
 * - **Délégation affichage** : Logique rendu déléguée au sous-composant
 * - **Relations normalisées** : Chaque événement peut avoir plusieurs épreuves
 *
 * ### Date et horaire avec formatage français
 * - **Date formatée** : `new Date(event.date).toLocaleDateString('fr-FR')`
 * - **Format français** : Affichage DD/MM/YYYY selon standards locaux
 * - **Horaire complémentaire** : `event.horraire` affiché en sous-texte
 * - **Hiérarchie visuelle** : Date principale + horaire secondaire
 *
 * ### Lieu événement avec nom établissement
 * - **Nom lieu** : `event.lieu.nom` pour identification établissement
 * - **Relation lieu** : Objet lieu imbriqué avec propriétés complètes
 *
 * ### Statut temps réel via EventStatus (sous-composant calculé)
 * - **Composant dynamique** : EventStatus calcule statut selon date/heure actuelle
 * - **Props transmises** : date={event.date} time={event.horraire}
 * - **Calcul temps réel** : Statut mis à jour selon horloge système
 * - **États possibles** : À venir, En cours, Terminé avec couleurs distinctes
 *
 * ## Actions utilisateur CRUD intégrées
 *
 * ### ✏Action de modification événement
 * - **Bouton "Modifier"** : Déclenche édition événement complet
 * - **Callback** : `onEdit(event)` avec objet événement complet
 * - **Données complètes** : Transmission objet avec relations (épreuves, lieu)
 *
 * ### 🗑Action de suppression événement
 * - **Bouton "Supprimer"** : Déclenche suppression événement
 * - **Callback** : `onDelete(event.id)` avec ID numérique événement
 *
 *
 * @param {Props} props - Propriétés du composant
 * @param {Evenement} props.event - Objet événement avec relations (épreuves, lieu) à afficher
 * @param {function} props.onDelete - Callback suppression avec ID événement
 * @param {function} props.onEdit - Callback édition avec objet événement complet
 *
 * @returns {JSX.Element} Ligne de tableau interactive avec données événement et sous-composants
 *
 * @see {@link EvenementsTable} - Tableau parent contenant les lignes
 * @see {@link EvenementEpreuve} - Sous-composant affichage épreuves multiples
 * @see {@link EventStatus} - Sous-composant calcul statut temps réel
 * @see {@link Evenement} - Interface TypeScript de l'objet événement
 *
 */
export function EvenementsTableRow({ event, onDelete, onEdit }: Props): JSX.Element {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{event.description}</div>
      </td>
      <td className="px-6 py-4">
        <EvenementEpreuve epreuves={event.epreuves} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(event.date).toLocaleDateString('fr-FR')}
        </div>
        <div className="text-xs text-gray-500">{event.horraire}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{event.lieu.nom}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <EventStatus date={event.date} time={event.horraire} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onClick={() => onEdit(event)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Modifier
        </button>
        <button 
          onClick={() => onDelete(event.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
export default EvenementsTableRow;
