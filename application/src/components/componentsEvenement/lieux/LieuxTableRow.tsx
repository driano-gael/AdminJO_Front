import { Lieu } from '@/types/sportEvenement/lieu';

interface Props {
  lieu: Lieu;
  onDelete: (id: number) => void;
  onEdit: (lieu: Lieu) => void;
}

/**
 * Composant LieuxTableRow - Ligne de tableau pour lieu olympique AdminJO
 *
 * @name LieuxTableRow
 * Ce composant représente une ligne individuelle dans le tableau des lieux olympiques
 * des Jeux Olympiques 2024. Il affiche les informations essentielles d'un lieu (nom
 * de l'établissement olympique) avec les actions CRUD directes via boutons intégrés.
 * Conçu pour l'interface d'administration des Jeux Olympiques 2024, il suit les
 * standards de design AdminJO avec states hover interactifs et gestion optimisée
 * des établissements sportifs olympiques (Stade de France, Centre Aquatique, etc.).
 *
 * ## Données affichées réellement implémentées
 *
 * ### Nom du lieu olympique principal
 * - **Nom établissement** : `lieu.nom`
 *
 * ## Actions utilisateur CRUD intégrées
 *
 * ### Action de modification lieu
 * - **Bouton "Modifier"** : Déclenche édition lieu olympique complet
 * - **Callback** : `onEdit(lieu)` avec objet lieu complet
 * - **Données complètes** : Transmission objet avec toutes propriétés lieu
 *
 * ### Action de suppression lieu
 * - **Bouton "Supprimer"** : Déclenche suppression lieu olympique
 * - **Callback** : `onDelete(lieu.id)` avec ID numérique lieu
 * - **Confirmation** : Gestion confirmations dans composants parents
 * - **Sécurité** : Transmission ID uniquement pour limitation exposition
 * - **Impact métier** : Suppression lieu affecte événements associés
 *
 * @param {Props} props - Propriétés du composant
 * @param {Lieu} props.lieu - Objet lieu olympique à afficher
 * @param {function} props.onDelete - Callback suppression avec ID lieu
 * @param {function} props.onEdit - Callback édition avec objet lieu complet
 *
 * @returns {JSX.Element} Ligne de tableau interactive avec données lieu et actions
 *
 * @see {@link LieuxTable} - Tableau parent contenant les lignes
 * @see {@link Lieu} - Interface TypeScript de l'objet lieu
 * @see {@link LieuxManagement} - Gestionnaire principal fournissant callbacks
 *
 */

export function LieuxTableRow({ lieu, onDelete, onEdit }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{lieu.nom}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onClick={() => onEdit(lieu)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Modifier
        </button>
        <button 
          onClick={() => onDelete(lieu.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
export default LieuxTableRow;
