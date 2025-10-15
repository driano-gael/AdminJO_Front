import { Epreuve } from '@/types/sportEvenement/epreuve';
import Image from "next/image";
import {JSX} from "react";

interface Props {
  epreuve: Epreuve;
  onDelete: (id: number) => void;
  onEdit: (epreuve: Epreuve) => void;
}

/**
 * Composant EpreuvesTableRow - Ligne de tableau pour épreuve sportive olympique AdminJO
 *
 * @name EpreuvesTableRow
 *
 * Ce composant représente une ligne individuelle dans le tableau des épreuves sportives
 * olympiques. Il affiche les informations essentielles d'une épreuve (nom et discipline
 * associée) avec iconographie spécialisée et fournit les actions CRUD directes via
 * boutons intégrés. Conçu pour l'interface d'administration des Jeux Olympiques 2024,
 * il suit les standards de design AdminJO avec states hover interactifs et gestion
 * optimisée des relations épreuves ↔ disciplines.
 *
 * ## Données affichées réellement implémentées
 *
 * ### Informations épreuve principale
 * - **Libellé épreuve** : `epreuve.libelle`
 * - **Nom complet** : Désignation officielle épreuve (ex: "100m nage libre hommes")
 *
 * ### Informations discipline associée avec iconographie
 * - **Nom discipline** : `epreuve.discipline.nom`
 * - **Icône discipline** : `epreuve.discipline.icone` via composant Next.js Image
 * - **Gestion conditionnelle** : Affichage icône seulement si disponible
 * - **Dimensions icône** : 20x20px optimisées pour lisibilité ligne tableau
 *
 * ## Actions utilisateur CRUD intégrées
 *
 * ### Action de modification épreuve
 * - **Bouton "Modifier"** : Déclenche édition épreuve complète
 * - **Callback** : `onEdit(epreuve)` avec objet épreuve complet
 *
 * ### 🗑Action de suppression épreuve
 * - **Bouton "Supprimer"** : Déclenche suppression épreuve
 * - **Callback** : `onDelete(epreuve.id)` avec ID numérique épreuve
 * - **Confirmation** : Gestion confirmations dans composants parents
 * - **Sécurité** : Transmission ID uniquement pour limitation exposition
 *
 * ## Spécificités épreuves olympiques
 *
 * ### Types de données épreuve gérées
 * - **Libellé** : string - Nom complet épreuve officiel
 * - **ID** : number - Identifiant unique épreuve
 * - **Discipline** : objet - Référence discipline parente
 * - **Relations** : discipline.nom, discipline.icone
 * - **Structure** : Type Epreuve importé depuis types/sportEvenement
 * - **Validation** : Types TypeScript strictes pour sécurité
 *
 * ## Sécurité et validation
 *
 * ### Aspects sécuritaires
 * - **Validation props** : Interface TypeScript stricte
 * - **Sanitisation** : Affichage sécurisé données textuelles
 * - **ID transmission** : Seul ID transmis pour suppression
 * - **XSS prevention** : React échappe automatiquement contenu
 * - **Image sources** : URLs icônes validées côté serveur
 * - **Type safety** : Interfaces Props et Epreuve strictes
 *
 * ### Validation des données affichées
 * - **Libellé épreuve** : Affichage string avec échappement auto
 * - **Nom discipline** : Propriété imbriquée sécurisée
 * - **Icône discipline** : Conditional rendering évite erreurs null
 * - **Actions callbacks** : Validation types paramètres
 * - **Cohérence** : Structure données garantie par types TS
 *
 * @param {Props} props - Propriétés du composant
 * @param {Epreuve} props.epreuve - Objet épreuve avec discipline associée à afficher
 * @param {function} props.onDelete - Callback suppression avec ID épreuve
 * @param {function} props.onEdit - Callback édition avec objet épreuve complet
 *
 * @returns {JSX.Element} Ligne de tableau interactive avec données épreuve et actions
 *
 * @see {@link EpreuvesTable} - Tableau parent contenant les lignes
 * @see {@link Epreuve} - Interface TypeScript de l'objet épreuve
 * @see {@link Image} - Composant Next.js pour optimisation images
 *
 */
export function EpreuvesTableRow({ epreuve, onDelete, onEdit }: Props): JSX.Element {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{epreuve.libelle}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">{epreuve.discipline.nom}</div>
          {epreuve.discipline.icone && <Image src={epreuve.discipline.icone} alt={"icone"} width={20} height={20}/>}
          </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onClick={() => onEdit(epreuve)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Modifier
        </button>
        <button 
          onClick={() => onDelete(epreuve.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
export default EpreuvesTableRow;
