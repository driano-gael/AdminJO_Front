import { Epreuve } from '@/types/sportEvenement/epreuve';
import {JSX} from "react";

interface Props {
  epreuves: Epreuve[];
}

/**
 * Composant EvenementEpreuves - Affichage spécialisé des épreuves multiples d'un événement olympique AdminJO
 *
 * @name EvenementEpreuves
 * Ce composant sous-composant spécialisé gère l'affichage optimisé de plusieurs épreuves
 * associées à un événement sportif olympique. Il présente chaque épreuve sous forme de badge
 * coloré avec informations complètes (libellé, genre, tour, discipline) et gestion intelligente
 * des états vides. Intégré dans EvenementsTableRow, il permet une visualisation claire des
 * relations 1-N entre événements et épreuves avec layout vertical compact et responsive.
 *
 * ## Fonctionnalités d'affichage épreuves multiples
 *
 * ### Discipline associée conditionnelle
 * - **Affichage conditionnel** : `{epreuve.discipline && (...)}` pour sécurité
 * - **Nom discipline** : `epreuve.discipline.nom` en sous-texte italique
 * - **Gestion null** : Protection contre disciplines non chargées/undefined
 * - **Relations** : Affichage relation épreuve ↔ discipline dans chaque badge
 * - **Contextualisation** : Discipline aide identification type épreuve
 *
 * @param {Props} props - Configuration du composant épreuves multiples
 * @param {Epreuve[]} props.epreuves - Array des épreuves à afficher en badges
 *
 * @returns {JSX.Element} Liste verticale de badges épreuves ou message vide
 *
 * @see {@link EvenementsTableRow} - Composant parent intégrant ce sous-composant
 * @see {@link Epreuve} - Interface TypeScript des objets épreuves affichés
 * @see {@link EvenementsTable} - Tableau grand-parent contenant les événements
 *
 */
export function EvenementEpreuves({ epreuves }: Props): JSX.Element {
  return (
    <div className="text-sm text-gray-900">
        {epreuves && epreuves.length > 0 ? (
            <div className="flex flex-col space-y-1">
                {epreuves.map((epreuve) => (
                    <div
                        key={epreuve.id}
                        className="inline-block bg-green-100 text-black px-2 py-1 rounded-full text-xs w-fit"
                    >
                        <div className="font-semibold">
                          {epreuve.libelle} {epreuve.genre} {epreuve.tour}
                        </div>
                        {epreuve.discipline && (
                            <div className="text-black text-xs italic">
                                {epreuve.discipline.nom}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <span className="text-gray-400">Aucune épreuve</span>
        )}
    </div>
  );
}
export default EvenementEpreuves;
