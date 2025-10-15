import BackToEventsButton from '../shared/BackToEventsButton';

/**
 * Composant DisciplinesHeader - En-tête de gestion des disciplines sportives AdminJO
 *
 * @name DisciplinesHeader
 *
 * Ce composant fournit l'interface d'en-tête pour la section de gestion des disciplines
 * sportives des Jeux Olympiques. Il affiche le titre de la page avec icône thématique,
 * le bouton de navigation retour vers les événements, et le bouton d'ajout d'une nouvelle
 * discipline. Il suit les standards de design du système AdminJO avec une mise en page
 * horizontale équilibrée et navigation contextuelle.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Titre et identification thématique
 * - **Titre principal** : "Gestion des Disciplines" avec typographie imposante
 * - **Icône thématique** : Emoji coureur (🏃) pour contexte olympique sportif
 * - **Cohérence** : Style aligné avec autres modules AdminJO (événements, offres)
 *
 * ### Navigation contextuelle - Retour événements
 * - **Composant** : BackToEventsButton importé depuis shared/BackToEventsButton
 * - **Position** : Côté gauche du header pour navigation logique
 * - **Contexte** : Les disciplines font partie de la gestion des événements
 * - **UX** : Permet retour rapide vers liste événements sans perdre contexte
 * - **Hiérarchie** : Navigation parent-enfant claire (événements > disciplines)
 *
 * ### Action de création discipline
 * - **Bouton primaire** : "+ Nouvelle Discipline" avec style bleu AdminJO
 * - **Callback** : onCreateClick pour déclenchement modal/formulaire
 *
 * ## Structure et design avancé
 *
 * ### Architecture du header trois zones
 * - **Zone gauche** : BackToEventsButton pour navigation retour
 * - **Zone centre** : Titre principal avec icône pour identification
 * - **Zone droite** : Bouton d'action principal pour création
 *
 * ### Éléments d'interface spécialisés
 * - **Navigation contextuelle** : Retour vers section parent (événements)
 * - **Titre descriptif** : Identification claire de la sous-section
 * - **Icône contextuelle** : Emoji sportif pour thème olympique
 * - **Bouton d'action** : CTA principal pour création discipline
 * - **Hiérarchie claire** : Navigation breadcrumb visuelle implicite
 *
 * ## Interactions et comportements
 *
 * ### Interaction principale création
 * - **Click bouton** : Déclenche onCreateClick() callback
 *
 * ### Interaction navigation retour
 * - **Composant délégué** : BackToEventsButton gère sa propre logique
 * - **Navigation contextuelle** : Retour vers gestion événements
 * - **Préservation état** : Navigation sans perte de données
 *
 * ## Navigation et architecture
 *
 * ### Position dans l'architecture
 * - **Module parent** : Événements sportifs
 * - **Sous-module** : Disciplines (catégories de sports)
 * - **Relations** : Disciplines → Épreuves → Événements
 * - **Navigation** : BackToEventsButton pour remontée hiérarchique
 * - **Contexte** : Partie intégrante gestion événementielle
 *
 * ### Intégration avec BackToEventsButton
 * - **Composant partagé** : Utilisé dans plusieurs sous-modules
 * - **Logique déléguée** : Navigation gérée par composant shared
 * - **Style cohérent** : Design aligné avec boutons système
 * - **Réutilisabilité** : Pattern commun pour sous-modules
 *
 * ## Intégration système et architecture
 *
 * ### Utilisation dans l'architecture
 * - **Parent** : DisciplinesManagement l'utilise comme header
 * - **Position** : Premier élément de la page disciplines
 * - **Callback** : Déclenche ouverture DisciplineModal
 * - **Navigation** : BackToEventsButton pour remontée niveau
 * - **Isolation** : Composant autonome avec dépendance shared
 *
 * ### Rôle dans l'UX globale
 * - **Point d'entrée** : Première interaction utilisateur
 * - **Navigation** : Identification section + retour contexte
 * - **Action primaire** : Création de nouvelles disciplines
 * - **Branding** : Cohérence visuelle AdminJO olympique
 * - **Hiérarchie** : Clarification position dans arborescence
 *
 * @param {DisciplinesHeaderProps} props - Configuration du header des disciplines
 * @param {Function} props.onCreateClick - Callback déclenché lors du clic sur "Nouvelle Discipline"
 *
 * @returns {JSX.Element} Header avec navigation, titre et bouton de création de discipline
 *
 * @see {@link DisciplinesManagement} - Composant parent utilisant ce header
 * @see {@link DisciplineModal} - Modal ouverte par le bouton de création
 * @see {@link BackToEventsButton} - Composant de navigation vers événements
 */
interface DisciplinesHeaderProps {
  onCreateClick: () => void;
}

export function DisciplinesHeader({ onCreateClick }: DisciplinesHeaderProps) {
  return (
    <header className="bg-white shadow-md">
        <div className="flex justify-between items-center py-6 px-6">
            <BackToEventsButton />
            <h1 className="text-3xl font-bold text-gray-900">
              🏃 Gestion des Disciplines
            </h1>
          
          <button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Nouvelle Discipline
          </button>
        </div>
    </header>
  );
}
export default DisciplinesHeader;
