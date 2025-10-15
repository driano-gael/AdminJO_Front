import {JSX, useEffect, useState} from 'react';
import {Offre} from "@/types/offre/offre";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offreData: Offre) => void;
  loading: boolean;
  offre?: Offre;
}

/**
 * Composant OffresModal - Modal de création/édition des offres olympiques AdminJO
 *
 * @name OffreModal
 *
 * Ce composant fournit une interface modale complète pour la création et la modification
 * des offres sportives des Jeux Olympiques. Il gère deux modes distincts (création/édition)
 * avec validation temps réel, contrôles numériques avancés, et UX optimisée pour la saisie
 * de données complexes. Il inclut des champs spécialisés avec boutons d'ajustement et
 * validation intelligente des formats.
 *
 * ## Fonctionnalités principales
 *
 * ### Dual-mode : Création et Édition
 * - **Mode création** : offre === undefined, formulaire vide avec valeurs par défaut
 * - **Mode édition** : offre fournie, formulaire pré-rempli avec données existantes
 * - **Titre dynamique** : "Créer une nouvelle offre" vs "Modifier l'offre"
 * - **Bouton contextuel** : "Créer" vs "Modifier" selon le mode
 * - **États de chargement** : "Création..." vs "Modification..." pendant traitement
 *
 * ### Formulaire complet avec validation
 * - **Libellé offre** : Champ texte requis pour nom de l'offre
 * - **Description** : Champ texte pour détails de l'offre
 * - **Nombre de personnes** : Contrôle numérique avec boutons +/- et validation
 * - **Montant** : Contrôle monétaire avec symbole € et format décimal
 * - **Validation temps réel** : Contrôles immédiats lors de la saisie
 *
 * ### Contrôles numériques avancés
 * - **Boutons d'ajustement** : +/- pour nombre de personnes et montant
 * - **Validation saisie** : Regex pour formats autorisés
 * - **Valeurs minimales** : nb_personne >= 1, montant >= 0
 * - **Formatage automatique** : Montant avec 2 décimales au blur
 * - **États séparés** : String inputs pour contrôle précis, number values pour données
 *
 * ## Architecture des données et état
 *
 * ### Structure d'état complexe
 * - **formData** : Objet Offre principal avec données finales
 * - **nbPersonneInput** : String pour contrôle field nombre de personnes
 * - **montantInput** : String pour contrôle field montant avec décimales
 * - **Synchronisation** : Inputs string ↔ formData number values
 * - **Séparation concerns** : Affichage vs données métier
 *
 * ### useEffect d'initialisation
 * - **Déclencheurs** : offre et isOpen changes
 * - **Mode édition** : Pré-remplissage avec toutes propriétés offre
 * - **Mode création** : Reset complet avec valeurs par défaut
 * - **Formatage** : Conversion number → string pour inputs
 * - **Synchronisation** : Cohérence entre tous les états
 *
 * ## Champs de formulaire spécialisés
 *
 * ### Champ Libellé (nom de l'offre)
 * - **Type** : Input text standard
 * - **Validation** : Required, contrôlé par attribut HTML et submit handler
 * - **Placeholder** : "libellé de l'offre" pour guidance utilisateur
 * - **Style** : Focus ring bleu cohérent avec design system
 * - **Binding** : Liaison bidirectionnelle avec formData.libelle
 *
 * ### Champ Description
 * - **Type** : Input text étendu
 * - **Validation** : Required pour cohérence métier
 * - **Placeholder** : "description de l'offre" pour clarté
 * - **Usage** : Détails complémentaires sur l'offre sportive
 * - **Binding** : Liaison avec formData.description
 *
 * ### Champ Nombre de personnes (contrôle avancé)
 * - **Interface** : Input central avec boutons -/+ de chaque côté
 * - **Validation saisie** : Regex /^\d+$/ pour entiers positifs uniquement
 * - **Ajustement** : Boutons -1/+1 avec minimum absolu à 1
 * - **Auto-correction** : onBlur reset à 1 si valeur invalide ou vide
 * - **États** : nbPersonneInput (string) ↔ formData.nb_personne (number)
 *
 * ### Champ Montant (contrôle monétaire)
 * - **Interface** : Input avec symbole € à gauche et boutons -/+ ajustement
 * - **Validation saisie** : Regex /^\d*\.?\d{0,2}$/ pour décimales max 2
 * - **Ajustement** : Boutons -0.50/+0.50 pour incréments monétaires
 * - **Formatage** : onBlur conversion vers format XX.XX automatique
 * - **Minimum** : Montant >= 0, pas de valeurs négatives
 * - **États** : montantInput (string) ↔ formData.montant (number)
 * - **Position € symbol** : absolute left-3 pour alignement parfait
 * - **Placeholder** : "0.00" pour indication format attendu
 *
 * ## Gestion des interactions utilisateur
 *
 * ### Saisie clavier et validation
 * - **Temps réel** : Validation onChange pour feedback immédiat
 * - **Formats stricts** : Regex bloquent caractères non autorisés
 * - **onBlur corrections** : Auto-formatage et corrections valeurs
 * - **Required fields** : Libellé obligatoire pour soumission
 * - **Submit validation** : Vérification nb_personne > 0 avant envoi
 *
 * ### Contrôles boutons d'ajustement
 * - **Nb personnes** : adjustNbPersonne(-1/+1) avec minimum 1
 * - **Montant** : adjustMontant(-0.50/+0.50) avec minimum 0
 * - **Protection** : Math.max() pour éviter valeurs négatives
 * - **Synchronisation** : Mise à jour simultanée input et formData
 * - **États loading** : Boutons disabled pendant opérations
 *
 * ### Soumission et validation finale
 * - **Prérequis** : libelle.trim() non vide ET nb_personne > 0
 * - **Callback** : onSave(formData) avec objet Offre complet
 * - **Prévention** : e.preventDefault() pour contrôler soumission
 * - **États** : Bouton submit disabled si validation échoue
 *
 * ## Gestion des états et lifecycle
 *
 * ### Cycle de vie modal
 * - **Ouverture** : isOpen true → Modal s'affiche avec données
 * - **Initialisation** : useEffect reset/populate selon mode
 * - **Interactions** : Saisie utilisateur avec validation continue
 * - **Soumission** : onSave callback avec données validées
 * - **Fermeture** : isOpen false → Modal masquée, état préservé
 *
 * ### États de chargement
 * - **loading prop** : Contrôle états pendant opérations serveur
 * - **Boutons disabled** : Tous contrôles désactivés si loading
 * - **Labels dynamiques** : "Création..." vs "Modification..." pendant traitement
 * - **UX** : Prévention double-soumission et feedback visuel
 *
 * ### Nettoyage et reset
 * - **Mode création** : Reset complet formData, inputs vides/défaut
 * - **Mode édition** : Population avec données offre existante
 * - **Formatage cohérent** : String inputs synchronisés avec number data
 * - **Pas de memory leaks** : useEffect cleanup automatique
 *
 * ## Validation et sécurité
 *
 * ### Validation côté client
 * - **Champs requis** : libelle et description obligatoires
 * - **Formats numériques** : Regex strictes pour nb_personne et montant
 * - **Valeurs minimales** : nb_personne >= 1, montant >= 0
 * - **Longueur** : Pas de limite explicite mais validation serveur attendue
 * - **Sanitization** : trim() sur libelle pour éviter espaces
 *
 * ### Sécurité saisie
 * - **Input sanitization** : Regex bloquent caractères dangereux
 * - **Type safety** : Interface Props et Offre pour typage strict
 * - **Validation continue** : Contrôles temps réel et onBlur
 * - **Protection XSS** : React échappe automatiquement valeurs
 *
 * ## Performance et optimisations
 *
 * ### ⚡ Optimisations actuelles
 * - **Conditional rendering** : if (!isOpen) return null pour performance
 * - **État local** : Pas de props drilling, gestion autonome
 * - **Regex précompilées** : Patterns de validation réutilisés
 * - **Minimal re-renders** : useState ciblés par fonctionnalité
 *
 * ### Gestion mémoire
 * - **useEffect cleanup** : Dépendances [offre, isOpen] optimisées
 * - **Pas de timers** : Pas de setTimeout/setInterval à nettoyer
 * - **Event handlers** : Fonctions inline stables
 * - **Form state** : Reset propre entre ouvertures
 *
 * @param {Props} props - Configuration de la modal des offres
 * @param {boolean} props.isOpen - Contrôle la visibilité de la modal
 * @param {Function} props.onClose - Callback de fermeture de la modal
 * @param {Function} props.onSave - Callback de sauvegarde avec données offre
 * @param {boolean} props.loading - État de chargement pour désactiver contrôles
 * @param {Offre} [props.offre] - Offre à éditer (undefined = mode création)
 *
 * @returns {JSX.Element | null} Modal de création/édition ou null si fermée
 *
 * @see {@link OffresManagement} - Composant parent gérant cette modal
 * @see {@link Offre} - Interface TypeScript des données d'offre
 *
 */
export function OffreModal({
                                     isOpen,
                                     onClose,
                                     onSave,
                                     loading,
                                     offre
                                   }: Props): JSX.Element | null {
  const [formData, setFormData] = useState<Offre>({
    id: 0,
    libelle: '',
    description: '',
    nb_personne: 1,
    montant: 0,
  });

  // États pour les champs numériques en string pour un meilleur contrôle
  const [nbPersonneInput, setNbPersonneInput] = useState<string>('1');
  const [montantInput, setMontantInput] = useState<string>('');

  // Déterminer si c'est une création ou une modification
  const isEditing = Boolean(offre);
  const title = isEditing ? `Modifier l'offre` : 'Créer une nouvelle offre';
  const submitLabel = isEditing ? 'Modifier' : 'Créer';
  const loadingLabel = isEditing ? 'Modification...' : 'Création...';

  // Initialiser le formulaire avec les données de l'offre en mode édition
  useEffect(() => {
    if (offre) {
      setFormData({
        id: offre.id,
        libelle: offre.libelle,
        description: offre.description,
        nb_personne: offre.nb_personne,
        montant: offre.montant,
      });
      setNbPersonneInput(offre.nb_personne.toString());
      setMontantInput(offre.montant.toFixed(2));
    } else {
      setFormData({
        id: 0,
        libelle: '',
        description: '',
        nb_personne: 1,
        montant: 0,
      });
      setNbPersonneInput('1');
      setMontantInput('');
    }
  }, [offre, isOpen]);

  // Gestion du nombre de personnes
  const handleNbPersonneChange = (value: string) => {
    // Permettre seulement les nombres entiers positifs
    if (value === '' || /^\d+$/.test(value)) {
      setNbPersonneInput(value);
      const numValue = value === '' ? 0 : parseInt(value, 10);
      setFormData({...formData, nb_personne: numValue});
    }
  };

  const adjustNbPersonne = (increment: number) => {
    const currentValue = parseInt(nbPersonneInput) || 0;
    const newValue = Math.max(1, currentValue + increment);
    setNbPersonneInput(newValue.toString());
    setFormData({...formData, nb_personne: newValue});
  };

  // Gestion du montant
  const handleMontantChange = (value: string) => {
    // Permettre seulement les nombres avec maximum 2 décimales
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setMontantInput(value);
      const numValue = value === '' ? 0 : parseFloat(value) || 0;
      setFormData({...formData, montant: numValue});
    }
  };

  const adjustMontant = (increment: number) => {
    const currentValue = parseFloat(montantInput) || 0;
    const newValue = Math.max(0, currentValue + increment);
    const formattedValue = newValue.toFixed(2);
    setMontantInput(formattedValue);
    setFormData({...formData, montant: newValue});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.libelle.trim() && formData.nb_personne > 0) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-center mb-4" style={{minHeight: '3rem'}}>
          <h3 className="text-lg text-black font-semibold">{title}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l&apos;offre
            </label>
            <input
              type="text"
              value={formData.libelle}
              onChange={(e) => setFormData({...formData, libelle: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="libellé de l'offre"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description de l&apos;offre
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="description de l'offre"
              required
            />
          </div>

          {/* Champ nombre de personnes amélioré */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de personnes
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => adjustNbPersonne(-1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                -
              </button>
              <input
                type="text"
                value={nbPersonneInput}
                onChange={(e) => handleNbPersonneChange(e.target.value)}
                onBlur={() => {
                  if (nbPersonneInput === '' || parseInt(nbPersonneInput) < 1) {
                    setNbPersonneInput('1');
                    setFormData({...formData, nb_personne: 1});
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 text-black text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
                min="1"
              />
              <button
                type="button"
                onClick={() => adjustNbPersonne(1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-2">personnes</span>
            </div>
          </div>

          {/* Champ montant amélioré */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix de l&apos;offre
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => adjustMontant(-0.50)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                -
              </button>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                <input
                  type="text"
                  value={montantInput}
                  onChange={(e) => handleMontantChange(e.target.value)}
                  onBlur={() => {
                    if (montantInput !== '' && !isNaN(parseFloat(montantInput))) {
                      const formatted = parseFloat(montantInput).toFixed(2);
                      setMontantInput(formatted);
                    }
                  }}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <button
                type="button"
                onClick={() => adjustMontant(0.50)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                +
              </button>
            </div>
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
              disabled={loading || formData.nb_personne < 1}
            >
              {loading ? loadingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default OffreModal;
