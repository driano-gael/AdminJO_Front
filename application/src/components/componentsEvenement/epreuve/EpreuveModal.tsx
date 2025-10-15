import {useState, useEffect, JSX} from 'react';
import { CreateEpreuveRequest } from '@/lib/api/services/evenementSports/epreuveService';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Discipline } from '@/types/sportEvenement/discipline';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (epreuveData: CreateEpreuveRequest) => void;
    loading: boolean;
    error: string | null;
    epreuve?: Epreuve;
    disciplines: Discipline[];
}

/**
 * Composant EpreuveModal - Modal de création/édition des épreuves sportives olympiques AdminJO
 *
 * @name EpreuveModal
 *
 * Ce composant fournit une interface modale spécialisée pour la création et la modification
 * des épreuves sportives des Jeux Olympiques. Il gère deux modes distincts (création/édition)
 * avec validation temps réel, sélecteur de discipline obligatoire, gestion d'erreurs intégrée,
 * et UX optimisée pour la saisie de données relationnelles. Il constitue l'interface de saisie
 * pour les épreuves avec leur association obligatoire à une discipline parente, respectant
 * la hiérarchie événements → disciplines → épreuves.
 *
 * ## Fonctionnalités principales spécialisées épreuves
 *
 * ### Dual-mode : Création et Édition épreuves
 * - **Mode création** : epreuve === undefined, formulaire vide avec discipline par défaut
 * - **Mode édition** : epreuve fournie, formulaire pré-rempli avec données existantes
 * - **Titre dynamique** : "Créer une nouvelle épreuve" vs "Modifier l'épreuve"
 * - **Bouton contextuel** : "Créer" vs "Modifier" selon le mode
 * - **États de chargement** : "Création..." vs "Modification..." pendant traitement
 *
 * ### Formulaire spécialisé épreuves olympiques
 * - **Libellé épreuve** : Champ texte requis pour nom spécifique épreuve
 * - **Sélecteur discipline** : Dropdown obligatoire pour association parent
 * - **Validation temps réel** : Contrôles immédiats lors de la saisie
 * - **Gestion erreurs** : Affichage erreurs serveur intégré dans modal
 * - **Relations obligatoires** : Discipline obligatoire pour création épreuve
 *
 * ### Sélecteur de discipline obligatoire (fonctionnalité relationnelle)
 * - **Dropdown dynamique** : Select peuplé depuis liste disciplines fournie
 * - **Option par défaut** : "Sélectionner une discipline" avec validation
 * - **Association obligatoire** : disciplineId > 0 requis pour soumission
 * - **Auto-sélection** : Première discipline sélectionnée par défaut en création
 * - **Validation stricte** : Bouton submit disabled si pas de discipline
 * - **Données relationnelles** : Liste disciplines depuis useEpreuvesManagement
 *
 *
 * @param {Props} props - Configuration de la modal des épreuves
 * @param {boolean} props.isOpen - Contrôle la visibilité de la modal
 * @param {Function} props.onClose - Callback de fermeture de la modal
 * @param {Function} props.onSave - Callback de sauvegarde avec données épreuve
 * @param {boolean} props.loading - État de chargement pour désactiver contrôles
 * @param {string | null} props.error - Message d'erreur serveur à afficher
 * @param {Epreuve} [props.epreuve] - Épreuve à éditer (undefined = mode création)
 * @param {Discipline[]} props.disciplines - Liste disciplines pour sélecteur obligatoire
 *
 * @returns {JSX.Element | null} Modal de création/édition épreuve ou null si fermée
 *
 * @see {@link EpreuvesManagement} - Composant parent gérant cette modal
 * @see {@link Epreuve} - Interface TypeScript des données d'épreuve
 * @see {@link CreateEpreuveRequest} - Interface TypeScript pour création épreuve
 * @see {@link Discipline} - Interface TypeScript des disciplines parentes
 *
 */
export function EpreuveModal({
    isOpen, 
    onClose, 
    onSave, 
    loading, 
    error, 
    epreuve,
    disciplines
}: Props): JSX.Element | null {
    const [formData, setFormData] = useState<CreateEpreuveRequest>({
      libelle: '',
      disciplineId: 0
    });

    // Déterminer si c'est une création ou une modification
    const isEditing = Boolean(epreuve);
    const title = isEditing ? 'Modifier l\'épreuve' : 'Créer une nouvelle épreuve';
    const submitLabel = isEditing ? 'Modifier' : 'Créer';
    const loadingLabel = isEditing ? 'Modification...' : 'Création...';

    // Initialiser le formulaire avec les données de l'épreuve en mode édition
    useEffect(() => {
      if (epreuve) {
        setFormData({
          libelle: epreuve.libelle,
          disciplineId: epreuve.discipline.id
        });
      } else {
        setFormData({
          libelle: '',
          disciplineId: disciplines.length > 0 ? disciplines[0].id : 0
        });
      }
    }, [epreuve, disciplines]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.libelle.trim() && formData.disciplineId > 0) {
        onSave(formData);
      }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-center mb-4" style={{ minHeight: '3rem' }}>
                    <h3 className="text-lg text-black font-semibold">{title}</h3>
                </div>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}
              
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Libellé de l&apos;épreuve
                        </label>
                        <input
                            type="text"
                            value={formData.libelle}
                            onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: 100m sprint, Saut en hauteur..."
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discipline
                        </label>
                        <select
                            value={formData.disciplineId}
                            onChange={(e) => setFormData({ ...formData, disciplineId: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={0}>Sélectionner une discipline</option>
                            {disciplines.map((discipline) => (
                                <option key={discipline.id} value={discipline.id}>
                                    {discipline.nom}
                                </option>
                            ))}
                        </select>
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
                            disabled={loading || formData.disciplineId === 0}
                        >
                            {loading ? loadingLabel : submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default EpreuveModal;
