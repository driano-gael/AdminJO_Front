import { useState, useEffect } from 'react';
import { lieuApi } from '@/lib/api/services/evenementSports/lieuService';
import { epreuveApi } from '@/lib/api/services/evenementSports/epreuveService';
import { Lieu } from '@/types/sportEvenement/lieu'; 
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Evenement } from '@/types/sportEvenement/evenement';
import { CreateEvenementRequest } from '@/lib/api/services/evenementSports/evenementService';

// Interface étendue pour inclure les épreuves
interface CreateEvenementWithEpreuvesRequest extends CreateEvenementRequest {
  epreuveIds?: number[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: CreateEvenementWithEpreuvesRequest) => void;
  loading: boolean;
  error: string | null;
  evenement?: Evenement;
}

/**
 * Composant EvenementModal - Modal avancé de création/édition d'événements sportifs olympiques AdminJO
 *
 * @name EvenementModal
 *
 * Ce composant fournit une interface modale sophistiquée pour la création et modification d'événements
 * sportifs olympiques avec sélection d'épreuves hiérarchique par discipline. Il gère deux modes distincts
 * (création/édition), validation multicritères, chargement dynamique des données relationnelles (lieux,
 * épreuves), interface de sélection d'épreuves avec arborescence expandable par discipline, et gestion
 * d'états complexes. Conçu pour l'administration JO 2024 avec UX optimisée pour relations multiples.
 *
 * ## Fonctionnalités principales spécialisées événements olympiques
 *
 * ### Dual-mode : Création et Édition événements complexes
 * - **Mode création** : evenement === undefined, formulaire vide avec listes vides
 * - **Mode édition** : evenement fourni, formulaire pré-rempli + épreuves associées
 * - **Titre dynamique** : "Créer un nouvel événement" vs "Modifier l'événement"
 * - **Bouton contextuel** : "Créer" vs "Modifier" selon le mode
 * - **États de chargement** : "Création..." vs "Modification..." pendant traitement
 * - **Initialisation différentielle** : Reset vs population selon mode
 *
 * ### Formulaire événement complet avec relations
 * - **Description événement** : Champ texte requis pour nom événement sportif
 * - **Lieu olympique** : Dropdown obligatoire avec lieux chargés dynamiquement
 * - **Date événement** : Input date HTML5 pour planning JO 2024
 * - **Horaire précis** : Input time pour timing exact compétitions
 * - **Épreuves multiples** : Sélecteur hiérarchique sophistiqué par discipline
 * - **Validation temps réel** : Contrôles immédiats lors de la saisie
 *
 * ### Sélecteur d'épreuves hiérarchique avancé (fonctionnalité unique)
 * - **Organisation par discipline** : Épreuves groupées et triées alphabétiquement
 * - **Compteurs intelligents** : "(X/Y)" épreuves sélectionnées par discipline
 * - **Tags épreuves** : Badges cliquables avec suppression individuelle
 * - **Disponibilité** : Filtrage épreuves libres vs déjà assignées
 * - **État événement** : Indicateurs visuels si épreuve déjà assignée
 *
 * ## Architecture de données et état complexe
 *
 * ### 🏗Structure d'état événement étendue
 * - **formData** : CreateEvenementRequest avec description, lieuId, date, horraire
 * - **selectedEpreuves** : Array number[] des IDs épreuves sélectionnées
 * - **lieux** : Array Lieu[] chargé dynamiquement via API
 * - **epreuves** : Array Epreuve[] filtrées selon disponibilité
 * - **expandedDisciplines** : Set<number> pour état expansion disciplines
 * - **Interface étendue** : CreateEvenementWithEpreuvesRequest avec epreuveIds
 *
 * ### useEffect de chargement données multiples
 * - **Déclencheur initialisation** : evenement, isEditing pour mode édition/création
 * - **Chargement lieux** : lieuApi.getAll() avec tri alphabétique
 * - **Chargement épreuves** : epreuveApi.getAll() avec filtrage disponibilité
 * - **Mode édition** : Pré-remplissage form + épreuves associées
 * - **Mode création** : Reset form + sélection épreuves vide
 * - **Gestion erreurs** : Console.error pour échecs API
 *
 * ### Filtrage épreuves selon disponibilité et mode
 * - **Épreuves libres** : !epreuve.evenement pour disponibilité
 * - **Mode édition exception** : Inclusion épreuves événement actuel
 * - **Logique conditionnelle** : epreuve.evenement?.id === evenement.id
 *
 * ### Organisation hiérarchique par discipline
 * - **Groupement** : epreuvesByDiscipline via reduce() par discipline.id
 * - **Tri disciplines** : Alphabétique via localeCompare() français
 * - **Discipline headers** : Expandable avec compteurs et chevrons
 *
 * ### Checkboxes épreuves avec états visuels
 * - **Checkboxes natives** : type="checkbox" pour accessibilité
 * - **État contrôlé** : checked={selectedEpreuves.includes(epreuve.id)}
 * - **Toggle handler** : handleEpreuveToggle pour ajout/suppression
 * - **Indicateurs assignation** : Badge jaune si épreuve déjà assignée
 * - **Hover effects** : hover:bg-gray-50 pour feedback
 *
 * ## Gestion d'interactions utilisateur complexes
 *
 * ### Sélection/désélection épreuves
 * - **Toggle logic** : includes() pour vérification + filter/spread
 * - **Performance optimisée** : prev callback pour éviter recalculs
 * - **État immutable** : Nouvelle array à chaque changement
 * - **Synchronisation** : Tags et checkboxes synchronisés
 * - **Feedback immédiat** : Mise à jour visuelle instantanée
 *
 * ### Expansion/contraction disciplines
 * - **Set management** : expandedDisciplines avec add/delete
 * - **Toggle efficient** : new Set(prev) pour immutabilité
 * - **État persistant** : Expansion maintenue pendant session
 *
 * ### Soumission et validation événement complet
 * - **Validation multicritères** : description + lieuId > 0 + date + horraire
 * - **Extension interface** : epreuveIds ajouté à CreateEvenementRequest
 * - **Spread operator** : {...formData, epreuveIds: selectedEpreuves}
 * - **Prévention default** : e.preventDefault() pour contrôle soumission
 * - **Loading state** : Boutons disabled pendant traitement serveur
 *
 * ## Chargement dynamique données relationnelles
 *
 * ### Gestion lieux olympiques API
 * - **Chargement async** : lieuApi.getAll() dans useEffect
 * - **Tri alphabétique** : sort((a, b) => a.nom.localeCompare(b.nom))
 * - **Gestion erreurs** : try/catch avec console.error
 * - **Select population** : map() pour options dynamiques
 * - **Placeholder** : "Sélectionnez un lieu" pour guidance
 * - **Validation** : lieuId > 0 requis pour soumission
 *
 * ### Gestion épreuves disponibles API
 * - **Chargement conditionnel** : Selon mode édition/création
 * - **Filtrage disponibilité** : Épreuves sans événement + exceptions mode édition
 * - **Logique complexe** : Multi-conditions pour inclusion/exclusion
 * - **Performance** : Filtrage côté client après chargement unique
 * - **État synchronisé** : selectedEpreuves mis à jour selon mode
 *
 * @param {Props} props - Configuration de la modal événements
 * @param {boolean} props.isOpen - Contrôle la visibilité de la modal
 * @param {Function} props.onClose - Callback de fermeture de la modal
 * @param {Function} props.onSave - Callback de sauvegarde avec données événement étendues
 * @param {boolean} props.loading - État de chargement pour désactiver contrôles
 * @param {string | null} props.error - Message d'erreur serveur à afficher
 * @param {Evenement} [props.evenement] - Événement à éditer (undefined = mode création)
 *
 * @returns {JSX.Element | null} Modal de création/édition événement ou null si fermée
 *
 * @see {@link EvenementsManagement} - Composant parent gérant cette modal
 * @see {@link Evenement} - Interface TypeScript des données d'événement
 * @see {@link CreateEvenementRequest} - Interface création événement de base
 * @see {@link CreateEvenementWithEpreuvesRequest} - Interface étendue avec épreuves
 * @see {@link Lieu} - Interface lieux olympiques
 * @see {@link Epreuve} - Interface épreuves avec disponibilité
 *
 */
export function EvenementModal({
  isOpen,
  onClose, 
  onSave, 
  loading, 
  error,
  evenement 
}: Props) {
  const [formData, setFormData] = useState<CreateEvenementRequest>({
    description: '',
    lieuId: 0,
    date: '',
    horraire: ''
  });

  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [selectedEpreuves, setSelectedEpreuves] = useState<number[]>([]);
  const [expandedDisciplines, setExpandedDisciplines] = useState<Set<number>>(new Set());

  // Déterminer si c'est une création ou une modification
  const isEditing = Boolean(evenement);
  const title = isEditing ? 'Modifier l\'événement' : 'Créer un nouvel événement';
  const submitLabel = isEditing ? 'Modifier' : 'Créer';
  const loadingLabel = isEditing ? 'Modification...' : 'Création...';

  // Initialiser le formulaire avec les données de l'événement en mode édition
  useEffect(() => {
    if (evenement) {
      setFormData({
        description: evenement.description,
        lieuId: evenement.lieu.id,
        date: evenement.date,
        horraire: evenement.horraire
      });
      // Initialiser les épreuves sélectionnées en mode édition
      setSelectedEpreuves(evenement.epreuves.map(epreuve => epreuve.id));
    } else {
      setFormData({
        description: '',
        lieuId: 0,
        date: '',
        horraire: ''
      });
      setSelectedEpreuves([]);
    }
  }, [evenement]);

useEffect(() => {
  const fetchLieux = async () => {
    try {
      const apiLieux = await lieuApi.getAll();
      const sortedLieux = apiLieux.sort((a, b) => a.nom.localeCompare(b.nom));
      setLieux(sortedLieux);
    } catch (err) {
      console.error('Erreur chargement lieux:', err);
    }
  };

  const fetchEpreuves = async () => {
    try {
      const apiEpreuves = await epreuveApi.getAll();
      
      // Filtrer les épreuves disponibles (sans événement assigné)
      // En mode édition, inclure aussi les épreuves de l'événement actuel
      const epreuvesDisponibles = apiEpreuves.filter(epreuve => {
        // Épreuve sans événement = disponible
        if (!epreuve.evenement) {
          return true;
        }
        
        // En mode édition, inclure les épreuves de l'événement actuel
        if (isEditing && evenement && epreuve.evenement?.id === evenement.id) {
          return true;
        }
        
        // Sinon, épreuve non disponible
        return false;
      });
      
      setEpreuves(epreuvesDisponibles);
    } catch (err) {
      console.error('Erreur chargement épreuves:', err);
    }
  };

  fetchLieux();
  fetchEpreuves();
}, [isEditing, evenement]); // Dépendances ajoutées pour recharger quand le mode change

  // Gérer la sélection/désélection d'une épreuve
  const handleEpreuveToggle = (epreuveId: number) => {
    setSelectedEpreuves(prev => {
      if (prev.includes(epreuveId)) {
        return prev.filter(id => id !== epreuveId);
      } else {
        return [...prev, epreuveId];
      }
    });
  };

  // Supprimer une épreuve sélectionnée (depuis les tags)
  const handleRemoveEpreuve = (epreuveId: number) => {
    setSelectedEpreuves(prev => prev.filter(id => id !== epreuveId));
  };

  // Gérer l'expansion/contraction d'une discipline
  const handleDisciplineToggle = (disciplineId: number) => {
    setExpandedDisciplines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(disciplineId)) {
        newSet.delete(disciplineId);
      } else {
        newSet.add(disciplineId);
      }
      return newSet;
    });
  };

  // Grouper les épreuves par discipline et trier alphabétiquement
  const epreuvesByDiscipline = epreuves.reduce((acc, epreuve) => {
    const disciplineId = epreuve.discipline?.id;
    if (disciplineId) {
      if (!acc[disciplineId]) {
        acc[disciplineId] = [];
      }
      acc[disciplineId].push(epreuve);
    }
    return acc;
  }, {} as Record<number, Epreuve[]>);

  // Obtenir les disciplines uniques triées alphabétiquement
  const disciplinesOrdered = Array.from(
    new Map(epreuves.map(e => e.discipline).filter(Boolean).map(d => [d!.id, d!])).values()
  ).sort((a, b) => a.nom.localeCompare(b.nom));

  // Obtenir les épreuves sélectionnées pour l'affichage
  const selectedEpreuvesData = epreuves.filter(epreuve => 
    selectedEpreuves.includes(epreuve.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.lieuId > 0 && formData.date && formData.horraire) {
      const eventDataWithEpreuves: CreateEvenementWithEpreuvesRequest = {
        ...formData,
        epreuveIds: selectedEpreuves
      };
      onSave(eventDataWithEpreuves);
    }
  };

  // Ne pas afficher le modal si isOpen est false
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto my-8 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg text-black font-semibold mb-4">{title}</h3>
        
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu
            </label>
            <select
              value={formData.lieuId}
              onChange={(e) => setFormData({ ...formData, lieuId: Number(e.target.value) })}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Sélectionnez un lieu</option>
              {lieux.map(lieu => (
                <option key={lieu.id} value={lieu.id}>
                  {lieu.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Épreuves ({selectedEpreuves.length} sélectionnée{selectedEpreuves.length > 1 ? 's' : ''})
            </label>
            
            {/* Épreuves sélectionnées (tags) */}
            {selectedEpreuvesData.length > 0 && (
              <div className="mb-3 p-2 bg-gray-50 rounded-md">
                <div className="flex flex-wrap gap-2">
                  {selectedEpreuvesData.map(epreuve => (
                    <span
                      key={epreuve.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-black"
                    >
                      <span className="font-medium">{epreuve.libelle}</span>
                      {epreuve.discipline && (
                        <span className="ml-1 text-black">({epreuve.discipline.nom})</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveEpreuve(epreuve.id)}
                        className="ml-1 text-black hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sélecteur hiérarchique par discipline */}
            <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
              {disciplinesOrdered.map(discipline => {
                const disciplineEpreuves = epreuvesByDiscipline[discipline.id] || [];
                const isExpanded = expandedDisciplines.has(discipline.id);
                const selectedInDiscipline = disciplineEpreuves.filter(e => selectedEpreuves.includes(e.id)).length;
                
                return (
                  <div key={discipline.id} className="border-b border-gray-200 last:border-b-0">
                    {/* Header de la discipline */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                      <div 
                        className="flex items-center flex-1"
                        onClick={() => handleDisciplineToggle(discipline.id)}
                      >
                        <span className={`mr-2 transform transition-transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
                          ▶
                        </span>
                        <span className="font-medium text-gray-900">{discipline.nom}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({selectedInDiscipline}/{disciplineEpreuves.length})
                        </span>
                      </div>
                    </div>
                    
                    {/* Épreuves de la discipline */}
                    {isExpanded && (
                      <div className="p-2 bg-white">
                        <div className="grid grid-cols-1 gap-2">
                          {disciplineEpreuves.map(epreuve => (
                            <label
                              key={epreuve.id}
                              className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedEpreuves.includes(epreuve.id)}
                                onChange={() => handleEpreuveToggle(epreuve.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {epreuve.libelle}
                                {epreuve.evenement && (
                                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    📅 {epreuve.evenement.description}
                                  </span>
                                )}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horaire
            </label>
            <input
              type="time"
              value={formData.horraire}
              onChange={(e) => setFormData({ ...formData, horraire: e.target.value })}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
export default EvenementModal;
