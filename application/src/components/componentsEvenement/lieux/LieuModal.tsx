import { useState, useEffect } from 'react';
import { CreateLieuRequest } from '@/lib/api/services/evenementSports/lieuService';
import { Lieu } from '@/types/sportEvenement/lieu';

/**
 * Composant LieuModal - Modal de création/édition des lieux olympiques AdminJO
 *
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
 * ### 🎯 Modes adaptatifs création vs édition lieu
 * - **Détection automatique** : `isEditing = Boolean(lieu)` pour mode switch
 * - **Mode création** : lieu=undefined, formulaire vierge, titre "Créer un nouveau lieu"
 * - **Mode édition** : lieu=objet, pré-remplissage données, titre "Modifier le lieu"
 * - **Labels dynamiques** : submitLabel "Créer"/"Modifier" selon contexte
 * - **Loading adaptatif** : loadingLabel "Création..."/"Modification..." contextualisé
 * - **Reset intelligent** : Formulaire réinitialisé selon mode via useEffect
 * - **Validation unifiée** : Même logique validation pour création/édition
 *
 * ### 🖼️ Interface modal overlay responsive
 * - **Overlay backdrop** : fixed inset-0 bg-black bg-opacity-50 pour isolation
 * - **Centrage parfait** : flex items-center justify-center pour position optimale
 * - **Z-index élevé** : z-50 pour superposition garantie autres éléments
 * - **Container modal** : bg-white rounded-lg avec max-w-md largeur contrôlée
 * - **Padding responsive** : p-6 respiration généreuse, mx-4 margins sécurité mobile
 * - **Fermeture overlay** : Pas de clic backdrop (sécurité données formulaire)
 * - **Accessibilité** : Structure modal respectant standards ARIA (potentiel amélioration)
 *
 * ### 📋 Structure formulaire spécialisée lieu olympique
 * - **Champ unique nom** : Input text pour désignation établissement sportif
 * - **Placeholder contextuel** : "Ex: Stade de France" pour guider saisie
 * - **Validation HTML5** : required sur input nom pour validation basique
 * - **Validation JavaScript** : trim() pour éviter espaces uniquement
 * - **État contrôlé** : formData state local avec CreateLieuRequest interface
 * - **Synchronisation** : useEffect pour mise à jour formData selon lieu prop
 * - **Actions doubles** : Annuler (fermeture) + Soumettre (création/modification)
 *
 * ## Gestion d'état et cycle de vie modal
 *
 * ### 🔄 État local formulaire et synchronisation
 * - **formData state** : useState<CreateLieuRequest> pour données formulaire
 * - **Structure initiale** : {nom: ''} minimal requis création lieu
 * - **Synchronisation props** : useEffect(lieu) pour pré-remplissage édition
 * - **Reset création** : formData vide si lieu=undefined
 * - **Reset édition** : formData.nom = lieu.nom si lieu présent
 * - **Dépendance effect** : [lieu] pour re-sync changement lieu prop
 * - **Immutabilité** : Spread operator {...formData, nom} pour updates
 *
 * ### 🎛️ Contrôle visibilité et états modal
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
 * ### ➕ Processus création nouveau lieu olympique
 * 1. **Ouverture modal** : isOpen=true, lieu=undefined → mode création
 * 2. **Initialisation** : formData={nom: ''} formulaire vierge
 * 3. **Saisie utilisateur** : Input nom lieu avec placeholder guide
 * 4. **Validation** : trim() vérification nom non-vide
 * 5. **Soumission** : onSave(formData) avec CreateLieuRequest
 * 6. **États loading** : disabled boutons, label "Création..."
 * 7. **Gestion retour** : Success=fermeture, Error=maintien+affichage
 *
 * ### ✏️ Processus modification lieu existant
 * 1. **Ouverture modal** : isOpen=true, lieu=objetLieu → mode édition
 * 2. **Pré-remplissage** : useEffect set formData.nom = lieu.nom
 * 3. **Modification** : Utilisateur édite nom pré-rempli
 * 4. **Validation identique** : Même logique que création
 * 5. **Soumission** : onSave(formData) pour update lieu
 * 6. **Loading adapté** : Label "Modification..." contextualisé
 * 7. **Persistance** : Données maintenues si erreur modification
 *
 * ### 🚫 Processus annulation et fermeture
 * - **Bouton Annuler** : onClick={onClose} fermeture sans sauvegarde
 * - **Disabled loading** : Annulation bloquée pendant soumission
 * - **Perte données** : Warning implicite perte saisie (amélioration UX)
 * - **Reset formulaire** : Parent responsibility réinitialiser état
 *
 * ## Interface utilisateur et expérience modale
 *
 * ### 🎨 Design et présentation formulaire lieu
 * - **Header centré** : Titre avec minHeight 3rem pour stabilité layout
 * - **Titre dynamique** : "Créer un nouveau lieu" vs "Modifier le lieu"
 * - **Typographie** : text-lg text-black font-semibold pour hiérarchie
 * - **Espacement** : space-y-4 formulaire + pt-4 séparation boutons
 * - **Input styling** : border-gray-300 + focus:ring-blue-500 cohérence AdminJO
 * - **Placeholder contextualisé** : "Ex: Stade de France" guide olympique
 * - **Largeur complète** : w-full input pour utilisation espace modal
 *
 * ### 🔘 Boutons d'action et états interactifs
 * - **Bouton Annuler** : Secondaire gray-200 hover:gray-300 style
 * - **Bouton Principal** : bg-blue-600 hover:blue-700 AdminJO theme
 * - **États disabled** : disabled={loading} sur les deux boutons
 * - **Labels adaptatifs** : "Créer"/"Modifier" + "Création..."/"Modification..."
 * - **Couleur disabled** : disabled:bg-blue-300 feedback visuel
 * - **Espacement** : space-x-3 séparation horizontale boutons
 * - **Position** : justify-end alignement droite standard formulaires
 *
 * ### 🚨 Gestion d'erreurs et feedback utilisateur
 * - **Bandeau erreur** : Conditional {error && ...} affichage
 * - **Style erreur** : text-red-600 bg-red-50 p-2 rounded cohérent
 * - **Position** : Entre titre et formulaire pour visibilité
 * - **Persistance** : Erreur reste affichée jusqu'à nouvelle soumission
 * - **Contenu brut** : Affichage direct message error string
 * - **Pas de dismiss** : Erreur effacée par action utilisateur uniquement
 *
 * ## Validation et sécurité données lieu
 *
 * ### ✅ Validation côté client implémentée
 * - **Required HTML5** : Attribut required sur input nom
 * - **Validation JavaScript** : if (formData.nom.trim()) avant soumission
 * - **Whitespace handling** : trim() élimine espaces début/fin
 * - **Validation minimale** : Seulement nom non-vide requis actuellement
 * - **UX validation** : Feedback browser built-in pour required
 * - **Prévention submit** : handleSubmit preventDefault + validation
 *
 * ### 🔒 Sécurité et robustesse formulaire
 * - **Interface TypeScript** : CreateLieuRequest pour structure données
 * - **Props validation** : Interface Props stricte pour contrat
 * - **Controlled inputs** : value={formData.nom} état contrôlé
 * - **Immutable updates** : Spread operator préserve immutabilité
 * - **Sanitisation** : trim() basique (XSS prevention côté serveur assumée)
 * - **Error boundaries** : Pas implémenté (délégué composants parents)
 *
 * ## Responsive design et accessibilité modale
 *
 * ### 📱 Adaptation responsive modal
 * - **Largeur adaptative** : max-w-md container + mx-4 marges sécurité
 * - **Full width mobile** : w-full avec marges pour écrans étroits
 * - **Input responsive** : w-full utilisation complète largeur modal
 * - **Padding adaptatif** : p-6 confortable desktop et mobile
 * - **Overlay responsive** : fixed inset-0 couvre tout viewport
 * - **Touch-friendly** : py-2 inputs + boutons dimensionnés tactile
 * - **Centrage universel** : flex centering fonctionne tous écrans
 *
 * ### ♿ Accessibilité et navigation clavier
 * - **Sémantique HTML** : Form/input structure native accessible
 * - **Focus visible** : focus:ring-2 sur input pour navigation clavier
 * - **Tab navigation** : Ordre tabulation logique input → boutons
 * - **Submit form** : Enter dans input déclenche handleSubmit
 * - **Escape key** : Pas implémenté fermeture ESC (amélioration)
 * - **Focus trap** : Pas implémenté confinement focus modal
 * - **ARIA labels** : Pas d'attributs ARIA spécifiques (amélioration)
 * - **Screen readers** : Titre et labels lisibles synthèse vocale
 *
 * ## Performance et optimisations modal
 *
 * ### ⚡ Optimisations actuelles implémentées
 * - **Conditional render** : return null si !isOpen évite DOM inutile
 * - **State local minimal** : Seulement formData nécessaire
 * - **Effect ciblé** : useEffect([lieu]) dépendance précise
 * - **Immutable updates** : Spread operator évite mutations
 * - **CSS statique** : Classes Tailwind pré-compilées
 * - **Callbacks stables** : Props functions présumées stables parent
 *
 * ### 🎯 Améliorations performance possibles
 * - **React.memo** : Mémorisation si re-renders fréquents
 * - **useCallback** : Mémorisation handleSubmit si instable
 * - **Portal modal** : React Portal pour rendu hors arbre DOM
 * - **Animation optimisée** : CSS transforms vs layout changes
 * - **Lazy validation** : Validation différée onBlur vs onChange
 * - **Debounced sync** : Synchronisation différée si lieu change fréquent
 *
 * ## Intégration écosystème et architecture lieux AdminJO
 *
 * ### 🔗 Communication avec LieuxManagement parent
 * - **Props descendantes** : isOpen, loading, error, lieu depuis parent
 * - **Callbacks ascendants** : onClose, onSave vers LieuxManagement
 * - **Data flow** : Formulaire → onSave → API call → notification
 * - **Error handling** : Erreurs API remontées via error prop
 * - **State external** : Modal stateless pour logique métier
 * - **Lifecycle parent** : Ouverture/fermeture contrôlée parent
 *
 * ### 📊 Types et interfaces partagées
 * - **CreateLieuRequest** : Interface API standardisée création/modification
 * - **Lieu** : Type entité pour mode édition
 * - **Props interface** : Contrat strict composant modal
 * - **Consistency** : Mêmes types que services et hooks
 * - **Extensibility** : Interfaces adaptables évolutions futures
 * - **Type safety** : TypeScript strict validation compilation
 *
 * ## Contexte métier lieux olympiques JO 2024
 *
 * ### 🏅 Spécificités domaine infrastructure olympique
 * - **Terminologie** : "lieu" pour établissements sportifs JO
 * - **Exemples concrets** : Placeholder "Stade de France" guide utilisateur
 * - **Nomenclature** : Noms officiels établissements olympiques
 * - **Simplicité** : Formulaire épuré focalisé essentiel (nom uniquement)
 * - **Standards CIO** : Respect conventions nommage infrastructure
 * - **Legacy planning** : Préparation héritage post-JO équipements
 *
 * ### 📍 Types d'établissements gérés contexte
 * - **Stades** : Football, athlétisme, cérémonies ouverture/fermeture
 * - **Centres aquatiques** : Natation, plongeon, water-polo, natation synchronisée
 * - **Arenas couvertes** : Basketball, volleyball, handball, sports combat
 * - **Sites temporaires** : Beach-volley, BMX, skateboard installations éphémères
 * - **Centres entraînement** : Préparation équipes, échauffement athlètes
 * - **Infrastructure support** : Médias, broadcast, services organisateurs
 *
 * ## Limitations actuelles et améliorations futures
 *
 * ### ❌ Fonctionnalités manquantes actuellement
 * - **Champs étendus** : Adresse, capacité, coordonnées GPS manquants
 * - **Validation avancée** : Pas de contraintes longueur, format, unicité
 * - **Photos upload** : Pas d'interface ajout images établissement
 * - **Géolocalisation** : Pas de carte intégrée localisation
 * - **Catégorisation** : Pas de type lieu (stade/centre/arena)
 * - **Métadonnées** : Statut, disponibilité, configuration manquants
 * - **Focus trap** : Pas de confinement focus dans modal
 * - **Escape key** : Fermeture ESC non implémentée
 *
 * ### 🚀 Évolutions possibles modal lieu
 * - **Formulaire étendu** : Champs adresse, capacité, type établissement
 * - **Upload images** : Galerie photos lieu avec drag & drop
 * - **Carte interactive** : Sélection coordonnées GPS sur carte
 * - **Validation temps réel** : Feedback instantané pendant saisie
 * - **Auto-complétion** : Suggestions noms basées existants
 * - **Templates lieux** : Pré-configurations par type établissement
 * - **Prévisualisation** : Aperçu fiche lieu avant sauvegarde
 * - **Import données** : Ajout batch lieux via CSV/Excel
 * - **Historique modifications** : Journal changements lieu
 * - **Workflow approbation** : Validation hiérarchique créations
 *
 * ### 🔧 Améliorations UX et techniques
 * - **Animation entrée/sortie** : Transitions fluides ouverture/fermeture
 * - **Focus management** : Focus trap + restoration après fermeture
 * - **Keyboard shortcuts** : ESC fermeture, Ctrl+S sauvegarde rapide
 * - **Offline support** : Sauvegarde brouillon localStorage
 * - **Auto-save** : Sauvegarde automatique périodique brouillon
 * - **Dirty form warning** : Alert perte données si fermeture
 * - **Progress indicator** : Étapes formulaire si complexification
 * - **Field validation** : Validation temps réel par champ
 * - **Error recovery** : Suggestions correction erreurs validation
 * - **Success feedback** : Animation confirmation sauvegarde réussie
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
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Mode création
 * <LieuModal
 *   isOpen={showCreateModal}
 *   onClose={() => setShowCreateModal(false)}
 *   onSave={(data) => createLieu(data)}
 *   loading={isCreating}
 *   error={createError}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Mode édition
 * <LieuModal
 *   isOpen={showEditModal}
 *   onClose={() => setShowEditModal(false)}
 *   onSave={(data) => updateLieu(selectedLieu.id, data)}
 *   loading={isUpdating}
 *   error={updateError}
 *   lieu={selectedLieu}
 * />
 * ```
 */
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lieuData: CreateLieuRequest) => void;
    loading: boolean;
    error: string | null;
    lieu?: Lieu;
}

export default function LieuModal({ 
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
