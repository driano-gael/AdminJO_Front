import {Offre} from "@/types/offre/offre";

/**
 * Composant OffresTableRow - Ligne de table pour affichage d'une offre olympique AdminJO
 *
 * @name OffresTableRow
 *
 * Ce composant représente une ligne individuelle dans le tableau des offres sportives
 * des Jeux Olympiques. Il affiche les données essentielles d'une offre (nom, capacité,
 * prix) avec les actions de modification et suppression intégrées. Il assure un rendu
 * optimisé et responsive avec interaction hover et boutons d'action contextuels.
 *
 * ## Fonctionnalités d'affichage des données
 *
 * ### Affichage du libellé de l'offre
 * - **Contenu** : offre.libelle - Nom descriptif de l'offre olympique
 * - **Importance** : Identifiant principal de l'offre pour l'utilisateur
 * - **Responsabilité** : Affichage du nom commercial de l'offre sportive
 *
 * ### Affichage du nombre de personnes
 * - **Contenu** : offre.nb_personne - Capacité/limite participants
 * - **Type** : Valeur numérique représentant la capacité maximale
 * - **Format** : Affichage direct du nombre sans formatage spécial
 * - **Usage métier** : Information critique pour planification événements
 *
 * ### Affichage du montant
 * - **Contenu** : offre.montant - Prix de l'offre en devise
 * - **Format** : Valeur numérique brute sans formatage monétaire
 * - **Contexte** : Information tarifaire essentielle pour gestion
 *
 * ## Actions utilisateur intégrées
 *
 * ### Action de modification
 * - **Déclencheur** : Bouton "Modifier" dans colonne actions
 * - **Callback** : onEdit(offre) avec objet complet pour pré-remplissage
 * - **Fonctionnalité** : Ouvre modal d'édition avec données actuelles
 *
 * ### Action de suppression
 * - **Déclencheur** : Bouton "Supprimer" dans colonne actions
 * - **Callback** : onDelete(offre.id) avec identifiant unique
 * - **Confirmation** : Gérée par composant parent (OffresManagement)
 * - **Sécurité** : Suppression réversible via confirmation utilisateur
 *
 * ## Props et interface
 *
 * ### Structure des props
 * - **offre** : Objet Offre complet avec toutes propriétés
 * - **onDelete** : Function(id: number) pour suppression
 * - **onEdit** : Function(offre: Offre) pour édition
 * - **Callbacks** : Fonctions stables depuis composant parent
 *
 * ### Intégration avec OffresTable
 * - **Usage** : Rendu via map() dans OffresTable
 * - **Key prop** : offre.id utilisé comme clé React
 * - **Props drilling** : Callbacks transmis depuis OffresManagement
 * - **Isolation** : Composant autonome pour ligne individuelle
 * - **Réutilisabilité** : Peut être utilisé dans autres contextes table
 *
 * @param {Props} props - Configuration de la ligne d'offre
 * @param {Offre} props.offre - Données complètes de l'offre à afficher
 * @param {Function} props.onDelete - Callback de suppression avec ID offre
 * @param {Function} props.onEdit - Callback d'édition avec objet offre complet
 *
 * @returns {JSX.Element} Ligne de table avec données offre et actions
 *
 * @see {@link OffresTable} - Composant parent contenant cette ligne
 * @see {@link OffresManagement} - Gestionnaire principal fournissant callbacks
 * @see {@link Offre} - Interface TypeScript des données d'offre
 *
 */
interface Props {
  offre: Offre;
  onDelete: (id: number) => void;
  onEdit: (offre: Offre) => void;
}

export function OffresTableRow({ offre, onDelete, onEdit }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{offre.libelle}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{offre.nb_personne}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{offre.montant}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onEdit(offre)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(offre.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
export default OffresTableRow;
