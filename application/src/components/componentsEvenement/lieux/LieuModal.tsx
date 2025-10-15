import { useState, useEffect } from 'react';
import { CreateLieuRequest } from '@/lib/api/services/evenementSports/lieuService';
import { Lieu } from '@/types/sportEvenement/lieu';

/**
 * Composant LieuModal - Modal de création/édition des lieux olympiques AdminJO
 *
 * @name LieuModal
 * Ce composant modal spécialisé orchestre la création et modification des lieux olympiques
 * pour les Jeux Olympiques 2024. Il fournit une interface formulaire dédiée avec validation,
 * gestion d'erreurs intégrée, et adaptation automatique mode création/édition selon le contexte.
 * Conçu pour l'administration des établissements sportifs JO (Stade de France, Centre Aquatique,
 * Arena Bercy, etc.), il suit les standards AdminJO avec feedback utilisateur temps réel,
 * états de chargement visuels, et intégration harmonieuse dans le workflow de gestion des
 * infrastructures olympiques. Interface modal overlay responsive avec focus management optimisé.
 *
 * ## Architecture modale et modes d'utilisation
 *
 * ### Modes adaptatifs création vs édition lieu
 * - **Détection automatique** : `isEditing = Boolean(lieu)` pour mode switch
 * - **Mode création** : lieu=undefined, formulaire vierge, titre "Créer un nouveau lieu"
 * - **Mode édition** : lieu=objet, pré-remplissage données, titre "Modifier le lieu"
 * - **Labels dynamiques** : submitLabel "Créer"/"Modifier" selon contexte
 * - **Loading adaptatif** : loadingLabel "Création..."/"Modification..." contextualisé
 * - **Reset intelligent** : Formulaire réinitialisé selon mode via useEffect
 * - **Validation unifiée** : Même logique validation pour création/édition
 *
 * ## Gestion d'état et cycle de vie modal
 *
 * ### État local formulaire et synchronisation
 * - **formData state** : useState<CreateLieuRequest> pour données formulaire
 * - **Structure initiale** : {nom: ''} minimal requis création lieu
 * - **Synchronisation props** : useEffect(lieu) pour pré-remplissage édition
 * - **Reset création** : formData vide si lieu=undefined
 * - **Reset édition** : formData.nom = lieu.nom si lieu présent
 * - **Dépendance effect** : [lieu] pour re-sync changement lieu prop
 * - **Immutabilité** : Spread operator {...formData, nom} pour updates
 *
 * ### 🎛Contrôle visibilité et états modal
 * - **Conditional rendering** : `if (!isOpen) return null` pour performance
 * - **Prop isOpen** : boolean externe contrôle affichage modal
 * - **onClose callback** : Fermeture déléguée composant parent
 * - **États loading** : disabled sur boutons + labels adaptatifs
 * - **Gestion erreurs** : Bandeau error conditionnel si error prop
 * - **Persistance données** : Formulaire maintenu ouvert si erreur
 * - **Focus management** : Pas de focus trap implémenté (amélioration possible)
 *
 * ## Workflow création et édition lieux olympiques
 *
 * ### Processus création nouveau lieu olympique
 * 1. **Ouverture modal** : isOpen=true, lieu=undefined → mode création
 * 2. **Initialisation** : formData={nom: ''} formulaire vierge
 * 3. **Saisie utilisateur** : Input nom lieu avec placeholder guide
 * 4. **Validation** : trim() vérification nom non-vide
 * 5. **Soumission** : onSave(formData) avec CreateLieuRequest
 * 6. **États loading** : disabled boutons, label "Création..."
 * 7. **Gestion retour** : Success=fermeture, Error=maintien+affichage
 *
 * ### Processus modification lieu existant
 * 1. **Ouverture modal** : isOpen=true, lieu=objetLieu → mode édition
 * 2. **Pré-remplissage** : useEffect set formData.nom = lieu.nom
 * 3. **Modification** : Utilisateur édite nom pré-rempli
 * 4. **Validation identique** : Même logique que création
 * 5. **Soumission** : onSave(formData) pour update lieu
 * 6. **Loading adapté** : Label "Modification..." contextualisé
 * 7. **Persistance** : Données maintenues si erreur modification
 *
 * ### Processus annulation et fermeture
 * - **Bouton Annuler** : onClick={onClose} fermeture sans sauvegarde
 * - **Disabled loading** : Annulation bloquée pendant soumission
 * - **Perte données** : Warning implicite perte saisie (amélioration UX)
 * - **Reset formulaire** : Parent responsibility réinitialiser état
 *
 * @param {Props} props - Propriétés du composant modal lieu
 * @param {boolean} props.isOpen - État d'ouverture de la modal
 * @param {function} props.onClose - Callback fermeture modal
 * @param {function} props.onSave - Callback sauvegarde données lieu
 * @param {boolean} props.loading - État de chargement pendant soumission
 * @param {string|null} props.error - Message d'erreur à afficher
 * @param {Lieu} [props.lieu] - Lieu à éditer (optionnel, création si absent)
 *
 * @returns {JSX.Element|null} Modal formulaire lieu ou null si fermée
 *
 * @see {@link LieuxManagement} - Composant parent orchestrateur
 * @see {@link CreateLieuRequest} - Interface données création lieu
 * @see {@link Lieu} - Type entité lieu pour édition
 *
 */
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lieuData: CreateLieuRequest) => void;
    loading: boolean;
    error: string | null;
    lieu?: Lieu;
}

export function LieuModal({
    isOpen, 
    onClose, 
    onSave, 
    loading, 
    error, 
    lieu
}: Props) {
    const [formData, setFormData] = useState<CreateLieuRequest>({
      nom: ''
    });

    // Déterminer si c'est une création ou une modification
    const isEditing = Boolean(lieu);
    const title = isEditing ? 'Modifier le lieu' : 'Créer un nouveau lieu';
    const submitLabel = isEditing ? 'Modifier' : 'Créer';
    const loadingLabel = isEditing ? 'Modification...' : 'Création...';

    // Initialiser le formulaire avec les données du lieu en mode édition
    useEffect(() => {
      if (lieu) {
        setFormData({
          nom: lieu.nom
        });
      } else {
        setFormData({
          nom: ''
        });
      }
    }, [lieu]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.nom.trim()) {
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
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Stade de France"
                            required
                        />
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
export default LieuModal;
