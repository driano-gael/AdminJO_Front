import { Discipline } from '@/types/sportEvenement/discipline';
import Image from "next/image";
import {JSX} from "react";

interface Props {
  discipline: Discipline;
  onDelete: (id: number) => void;
  onEdit: (discipline: Discipline) => void;
}

/**
 * Composant DisciplinesTableRow - Ligne de table pour affichage d'une discipline sportive olympique AdminJO
 *
 * @name DisciplinesTableRow
 *
 * Ce composant représente une ligne individuelle dans le tableau des disciplines sportives
 * des Jeux Olympiques. Il affiche les données essentielles d'une discipline (nom avec icône
 * sportive) et les actions de modification et suppression intégrées. Il assure un rendu
 * optimisé et responsive avec interaction hover, gestion intelligente des icônes optionnelles,
 * et boutons d'action contextuels. Il constitue l'élément de base pour la visualisation
 * des disciplines dans l'interface de gestion AdminJO.
 *
 * ## Fonctionnalités d'affichage des données spécialisées
 *
 * ### Affichage du nom discipline avec icône
 * - **Contenu principal** : discipline.nom - Nom officiel discipline olympique
 * - **Icône sportive** : discipline.icone - Image SVG représentative du sport
 * - **Gestion conditionnelle** : {discipline.icone && (...)} pour icônes optionnelles
 *
 * ### Gestion des icônes sportives avancée
 * - **Image Next.js** : Composant Image optimisé pour performance SVG
 * - **Dimensions fixes** : width={24} height={24} pour cohérence visuelle
 * - **Alt descriptif** : "Icône ${discipline.nom}" pour accessibilité
 * - **Source dynamique** : discipline.icone path depuis base données
 * - **Fallback graceful** : Pas d'icône si discipline.icone null/undefined
 * - **Optimisation** : Lazy loading et cache automatique Next.js
 *
 * ## Actions utilisateur intégrées
 *
 * ### Action de modification discipline
 * - **Déclencheur** : Bouton "Modifier" dans colonne actions
 * - **Callback** : onEdit(discipline) avec objet complet pour pré-remplissage modal
 * - **Style** : text-blue-600 hover:text-blue-900 pour feedback visuel cohérent
 * - **Fonctionnalité** : Ouvre DisciplineModal d'édition avec données actuelles
 * - **Données complètes** : Transmission objet discipline entier (nom + icône)
 *
 * ### Action de suppression discipline
 * - **Déclencheur** : Bouton "Supprimer" dans colonne actions
 * - **Callback** : onDelete(discipline.id) avec identifiant unique
 * - **Confirmation** : Gérée par composant parent (DisciplinesManagement)
 * - **Sécurité** : Suppression avec confirmation utilisateur obligatoire
 * - **Feedback** : Retour visuel via notifications parent après suppression
 *
 * ## Interactions et comportements
 *
 * ### Gestion des événements
 * - **onEdit callback** : Transmission objet discipline complet
 * - **onDelete callback** : Transmission ID discipline pour identification
 * - **Event isolation** : Pas d'interférence entre boutons et hover ligne
 * - **Bubble prevention** : Actions boutons isolées comportement ligne
 * - **State management** : Pas d'état local, tout géré via callbacks
 *
 * ## Props et interface TypeScript
 *
 * ### Structure des props spécialisée
 * - **discipline** : Objet Discipline complet (id, nom, icône)
 * - **onDelete** : Function(id: number) pour suppression
 * - **onEdit** : Function(discipline: Discipline) pour édition complète
 * - **Callbacks** : Fonctions stables depuis composant parent
 *
 * ### Intégration avec DisciplinesTable
 * - **Usage** : Rendu via disciplines.map() dans DisciplinesTable
 * - **Key prop** : discipline.id utilisé comme clé React
 * - **Props drilling** : Callbacks transmis depuis DisciplinesManagement
 *
 * @param {Props} props - Configuration de la ligne de discipline
 * @param {Discipline} props.discipline - Données complètes discipline à afficher
 * @param {Function} props.onDelete - Callback suppression avec ID discipline
 * @param {Function} props.onEdit - Callback édition avec objet discipline complet
 *
 * @returns {JSX.Element} Ligne de table avec nom, icône discipline et actions
 *
 * @see {@link DisciplinesTable} - Composant parent contenant cette ligne
 * @see {@link DisciplinesManagement} - Gestionnaire principal fournissant callbacks
 * @see {@link Discipline} - Interface TypeScript des données de discipline
 * @see {@link DisciplineModal} - Modal d'édition ouverte via onEdit
 */
export function DisciplinesTableRow({ discipline, onDelete, onEdit }: Props): JSX.Element {
  return (
    <tr className="hover:bg-gray-50">
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {discipline.icone && (
            <Image
              src={`${discipline.icone}`}
              alt={`Icône ${discipline.nom}`}
              width={24}
              height={24}
            />
          )}
          <div className="text-sm font-medium text-gray-900">{discipline.nom}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onClick={() => onEdit(discipline)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Modifier
        </button>
        <button 
          onClick={() => onDelete(discipline.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
export default DisciplinesTableRow;
