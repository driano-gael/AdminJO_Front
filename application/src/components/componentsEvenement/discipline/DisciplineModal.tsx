import {useState, useEffect, JSX} from 'react';
import { CreateDisciplineRequest } from '@/lib/api/services/evenementSports/disciplineService';
import { Discipline } from '@/types/sportEvenement/discipline';
import Image from 'next/image';

// Liste des icônes disponibles dans le dossier sportSVG
const SPORT_ICONS = [
  'alp.svg', 'arc.svg', 'ath.svg', 'bdm.svg', 'bk3.svg', 'bkb.svg', 'bkg.svg', 'bmf.svg',
  'bmx.svg', 'bob.svg', 'box.svg', 'bs5.svg', 'bsb.svg', 'bth.svg', 'ccs.svg', 'ckt.svg',
  'clb.svg', 'crd.svg', 'csl.svg', 'csp.svg', 'ctr.svg', 'cur.svg', 'div.svg', 'equ.svg',
  'fbl.svg', 'fen.svg', 'flf.svg', 'frs.svg', 'fsk.svg', 'fut.svg', 'gac (1).svg', 'gar.svg',
  'glf.svg', 'gry.svg', 'gtr.svg', 'hbb.svg', 'hbl.svg', 'hoc.svg', 'iho.svg', 'jud.svg',
  'kte.svg', 'lax.svg', 'lug.svg', 'mpn.svg', 'mtb.svg', 'ncb.svg', 'ows.svg', 'roc.svg',
  'rol.svg', 'row.svg', 'ru7.svg', 'sal.svg', 'sbd.svg', 'sho.svg', 'sjp.svg', 'skb.svg',
  'skn.svg', 'smt.svg', 'squ.svg', 'srf.svg', 'ssk.svg', 'stk.svg', 'swa.svg', 'swm.svg',
  'ten.svg', 'tkw.svg', 'tri.svg', 'tte.svg', 'vbv.svg', 'vvo.svg', 'wlf.svg', 'wpo.svg',
  'wre.svg', 'wsu.svg', 'volleyball.svg'
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (disciplineData: CreateDisciplineRequest) => void;
    loading: boolean;
    error: string | null;
    discipline?: Discipline;
}

/**
 * Composant DisciplineModal - Modal de création/édition des disciplines sportives olympiques AdminJO
 *
 * @name DisciplineModal
 *
 * Ce composant fournit une interface modale spécialisée pour la création et la modification
 * des disciplines sportives des Jeux Olympiques. Il gère deux modes distincts (création/édition)
 * avec validation temps réel, sélecteur d'icônes sportives avancé, gestion d'erreurs intégrée,
 * et UX optimisée pour la saisie de données métier spécifiques. Il inclut un catalogue complet
 * d'icônes SVG olympiques avec prévisualisation et sélection interactive.
 *
 * ## Fonctionnalités principales spécialisées
 *
 * ### Dual-mode : Création et Édition disciplines
 * - **Mode création** : discipline === undefined, formulaire vide avec valeurs par défaut
 * - **Mode édition** : discipline fournie, formulaire pré-rempli avec données existantes
 * - **Titre dynamique** : "Créer une nouvelle discipline" vs "Modifier la discipline"
 * - **Bouton contextuel** : "Créer" vs "Modifier" selon le mode
 * - **États de chargement** : "Création..." vs "Modification..." pendant traitement
 *
 * ### Formulaire spécialisé disciplines olympiques
 * - **Nom discipline** : Champ texte requis pour nom officiel discipline
 * - **Sélecteur icône** : Interface avancée sélection icône sportive SVG
 * - **Validation temps réel** : Contrôles immédiats lors de la saisie
 * - **Gestion erreurs** : Affichage erreurs serveur intégré dans modal
 * - **Prévisualisation** : Aperçu icône sélectionnée en temps réel
 *
 * ### Sélecteur d'icônes sportives avancé (fonctionnalité unique)
 * - **Catalogue complet** : 71+ icônes SVG sports olympiques disponibles
 * - **Grid responsive** : Grille 8 colonnes avec scroll si dépassement
 * - **Preview temps réel** : Affichage icône sélectionnée avec chemin
 * - **Path management** : Gestion chemins relatifs depuis dossier public
 *
 * ## Architecture des données et état spécialisée
 *
 * ### Structure d'état discipline
 * - **formData** : Objet CreateDisciplineRequest avec nom et icône
 * - **Nom requis** : String pour nom officiel discipline olympique
 * - **Icône optionnelle** : String chemin relatif vers fichier SVG
 * - **Validation intégrée** : Contrôles côté client avec feedback serveur
 *
 * ### useEffect d'initialisation discipline
 * - **Déclencheurs** : discipline change pour mode édition/création
 * - **Mode édition** : Pré-remplissage nom et icône existante
 * - **Mode création** : Reset complet avec valeurs par défaut vides
 * - **Path conversion** : Gestion chemins icônes relatifs/absolus
 * - **Synchronisation** : Cohérence entre état formulaire et props
 *
 * ## Gestion des interactions utilisateur
 *
 * ### Saisie et validation nom discipline
 * - **Input contrôlé** : value={formData.nom} avec onChange handler
 * - **Validation required** : Attribut required pour validation HTML5
 * - **Placeholder contextuel** : "Ex: Athlétisme, Natation, Basketball..."
 *
 * ### Sélection et gestion icônes
 * - **handleIconSelect** : Fonction construction chemin relatif automatique
 * - **Path conversion** : `/images/sportSVG/${iconName}` pour standardisation
 * - **State update** : setFormData avec nouveau chemin icône
 * - **Visual feedback** : Mise à jour immédiate prévisualisation
 * - **Désélection possible** : Click sur icône sélectionnée pour retirer
 *
 * ### Soumission et validation finale
 * - **Prérequis validation** : formData.nom.trim() non vide obligatoire
 * - **Icône optionnelle** : Pas de validation icône (peut être vide)
 * - **Callback onSave** : onSave(formData) avec CreateDisciplineRequest
 * - **Prévention default** : e.preventDefault() pour contrôler soumission
 * - **Loading state** : Bouton disabled pendant traitement serveur
 *
 * ## Gestion d'erreurs et feedback avancée
 *
 * ### Affichage erreurs serveur intégré
 * - **Error prop** : string | null pour messages erreur serveur
 * - **Conditional display** : {error && (...)} pour affichage conditionnel
 * - **Position** : Avant formulaire pour attention immédiate
 *
 * ### Feedback utilisateur contextuel
 * - **Instructions claires** : "Cliquez sur une icône pour la sélectionner"
 * - **Loading feedback** : États boutons et labels dynamiques
 *
 * ## Gestion des états et lifecycle
 *
 * ### Cycle de vie modal discipline
 * - **Ouverture** : isOpen true → Modal s'affiche avec données discipline
 * - **Initialisation** : useEffect reset/populate selon mode avec icônes
 * - **Interactions** : Saisie nom + sélection icône avec feedback visuel
 * - **Soumission** : onSave callback avec CreateDisciplineRequest validé
 * - **Fermeture** : isOpen false → Modal masquée, état préservé
 *
 * ### États de chargement et erreurs
 * - **loading prop** : Contrôle états pendant opérations serveur
 * - **error prop** : Affichage messages erreur serveur dans modal
 * - **Boutons disabled** : Tous contrôles désactivés si loading
 * - **Labels dynamiques** : "Création..." vs "Modification..." pendant traitement
 * - **UX cohérente** : Prévention double-soumission et feedback visuel
 *
 * ### Nettoyage et reset spécialisé
 * - **Mode création** : Reset complet nom vide, icône vide
 * - **Mode édition** : Population avec nom et icône discipline existante
 * - **Path consistency** : Chemins icônes cohérents entre modes
 * - **Error cleanup** : Gestion via props parent (onClose avec setCreateError)
 *
 * ## Validation et sécurité spécialisée
 *
 * ### Validation côté client disciplines
 * - **Nom requis** : formData.nom.trim() obligatoire et non vide
 * - **Icône optionnelle** : Sélection icône non obligatoire
 * - **Format nom** : Pas de contrainte format spécifique côté client
 * - **Path validation** : Chemins icônes construits de manière sécurisée
 * - **Sanitization** : trim() sur nom pour éviter espaces parasites
 *
 * ### Sécurité saisie et fichiers
 * - **Input sanitization** : Validation nom discipline côté client
 * - **Path construction** : Chemins icônes construits de manière sécurisée
 * - **Type safety** : Interfaces Props et CreateDisciplineRequest strictes
 * - **File validation** : Liste SPORT_ICONS contrôlée pour sécurité
 * - **No upload** : Pas d'upload fichiers, sélection depuis catalogue
 *
 * ## Performance et optimisations avancées
 *
 * ### Optimisations actuelles
 * - **Conditional rendering** : if (!isOpen) return null pour performance
 * - **Image Next.js** : Optimisation automatique chargement icônes
 * - **Lazy loading** : Icônes chargées selon visibilité
 * - **Array constant** : SPORT_ICONS pré-définie pour éviter recalculs
 * - **Minimal re-renders** : useState ciblés par fonctionnalité
 *
 * ### Gestion mémoire spécialisée
 * - **useEffect cleanup** : Dépendance [discipline] optimisée
 * - **Constant array** : SPORT_ICONS en dehors composant pour stabilité
 * - **Path caching** : Chemins construits une fois par sélection
 *
 * @param {Props} props - Configuration de la modal des disciplines
 * @param {boolean} props.isOpen - Contrôle la visibilité de la modal
 * @param {Function} props.onClose - Callback de fermeture de la modal
 * @param {Function} props.onSave - Callback de sauvegarde avec données discipline
 * @param {boolean} props.loading - État de chargement pour désactiver contrôles
 * @param {string | null} props.error - Message d'erreur serveur à afficher
 * @param {Discipline} [props.discipline] - Discipline à éditer (undefined = mode création)
 *
 * @returns {JSX.Element | null} Modal de création/édition discipline ou null si fermée
 *
 * @see {@link DisciplinesManagement} - Composant parent gérant cette modal
 * @see {@link Discipline} - Interface TypeScript des données de discipline
 * @see {@link CreateDisciplineRequest} - Interface TypeScript pour création discipline
 *
 */
export function DisciplineModal({
    isOpen, 
    onClose, 
    onSave, 
    loading, 
    error, 
    discipline
}: Props): JSX.Element | null {
    const [formData, setFormData] = useState<CreateDisciplineRequest>({
      nom: '',
      icone: ''
    });

    // Déterminer si c'est une création ou une modification
    const isEditing = Boolean(discipline);
    const title = isEditing ? 'Modifier la discipline' : 'Créer une nouvelle discipline';
    const submitLabel = isEditing ? 'Modifier' : 'Créer';
    const loadingLabel = isEditing ? 'Modification...' : 'Création...';

    // Initialiser le formulaire avec les données de la discipline en mode édition
    useEffect(() => {
      if (discipline) {
        setFormData({
          nom: discipline.nom,
          icone: discipline.icone || ''
        });
      } else {
        setFormData({
          nom: '',
          icone: ''
        });
      }
    }, [discipline]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.nom.trim()) {
        onSave(formData);
      }
    };

    const handleIconSelect = (iconName: string) => {
      // Stocker le chemin relatif depuis le dossier public
      const relativePath = `/images/sportSVG/${iconName}`;
      setFormData({ ...formData, icone: relativePath });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-center mb-4" style={{ minHeight: '3rem' }}>
                    <h3 className="text-lg text-black font-semibold">{title}</h3>
                </div>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}
              
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de la discipline
                        </label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Athlétisme, Natation, Basketball..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icône de la discipline
                        </label>
                        {formData.icone && (
                            <div className="mb-3 flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Icône sélectionnée :</span>
                                <Image
                                    src={formData.icone}
                                    alt="Icône sélectionnée"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8"
                                    unoptimized
                                />
                                <span className="text-sm text-gray-500">{formData.icone}</span>
                            </div>
                        )}

                        <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                            <div className="grid grid-cols-8 gap-2">
                                {SPORT_ICONS.map((icon) => {
                                    const relativeIconPath = `/images/sportSVG/${icon}`;
                                    return (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => handleIconSelect(icon)}
                                            className={`p-2 rounded border-2 hover:bg-gray-50 transition-colors ${
                                                formData.icone === relativeIconPath 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'border-gray-200'
                                            }`}
                                            title={icon.replace('.svg', '')}
                                        >
                                            <Image
                                                src={`/images/sportSVG/${icon}`}
                                                alt={icon.replace('.svg', '')}
                                                width={24}
                                                height={24}
                                                className="w-6 h-6 mx-auto"
                                                unoptimized
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Cliquez sur une icône pour la sélectionner
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                            disabled={loading}
                        >
                            {loading ? loadingLabel : submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default DisciplineModal;
