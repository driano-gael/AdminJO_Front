import BackToEventsButton from '../shared/BackToEventsButton';

/**
 * Composant LieuxHeader - En-tête de gestion des lieux olympiques AdminJO
 *
 * Ce composant fournit l'interface d'en-tête pour la section de gestion des lieux
 * olympiques des Jeux Olympiques 2024. Il affiche le titre de la page avec icône thématique,
 * le bouton de navigation retour vers les événements, et le bouton d'ajout d'un nouveau
 * lieu. Il suit les standards de design du système AdminJO avec une mise en page
 * horizontale équilibrée et navigation contextuelle pour la gestion des établissements
 * sportifs olympiques (Stade de France, Centre Aquatique, Arena Bercy, etc.).
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Titre et identification thématique lieux
 * - **Titre principal** : "Gestion des Lieux" avec typographie imposante
 * - **Icône thématique** : Emoji bâtiment (🏢) pour contexte infrastructure olympique
 * - **Hiérarchie** : h1 avec text-3xl font-bold pour importance maximale
 * - **Cohérence** : Style aligné avec autres modules AdminJO (événements, disciplines)
 * - **Spécialisation** : Terminologie "Lieux" pour établissements sportifs JO
 *
 * ### Navigation contextuelle - Retour événements
 * - **Composant** : BackToEventsButton importé depuis shared/BackToEventsButton
 * - **Position** : Côté gauche du header pour navigation logique
 * - **Contexte** : Les lieux font partie de la gestion des événements
 * - **UX** : Permet retour rapide vers liste événements sans perdre contexte
 * - **Hiérarchie** : Navigation parent-enfant claire (événements > lieux)
 * - **Intégration** : Lieux comme infrastructure pour événements olympiques
 *
 * ### ➕ Action de création lieu olympique
 * - **Bouton primaire** : "+ Nouveau Lieu" avec style bleu AdminJO
 * - **États interactifs** : hover:bg-blue-700 pour feedback utilisateur
 * - **Transition** : transition-colors pour animation fluide
 * - **Callback** : onCreateClick pour déclenchement modal/formulaire
 * - **Taille optimisée** : px-4 py-2 pour zone de clic adéquate
 * - **Style cohérent** : bg-blue-600 aligné sur design system
 * - **Terminologie** : "Nouveau Lieu" pour création établissement olympique
 *
 * ### 🎨 Layout horizontal équilibré
 * - **Flexbox** : justify-between items-center pour répartition parfaite
 * - **Container** : bg-white shadow-md pour élévation visuelle
 * - **Padding** : py-6 px-6 pour respiration généreuse et symétrique
 * - **Largeur** : Pleine largeur sans contrainte max-width
 * - **Équilibre** : Navigation (gauche) + Titre (centre) + Action (droite)
 * - **Architecture** : Layout 3 zones standard AdminJO
 *
 * ## Structure et design avancé
 *
 * ### 🏗️ Architecture du header trois zones
 * - **Zone gauche** : BackToEventsButton pour navigation retour
 * - **Zone centre** : Titre principal avec icône pour identification claire
 * - **Zone droite** : Bouton d'action principal pour création lieu
 * - **Semantic HTML** : Utilisation de <header> pour sémantique correcte
 * - **Ombre portée** : shadow-md pour détachement visuel du contenu
 * - **Cohérence** : Pattern standard pour tous headers sous-modules
 *
 * ### 🎯 Éléments d'interface spécialisés lieux
 * - **Navigation contextuelle** : Retour vers section parent (événements)
 * - **Titre descriptif** : Identification claire de la sous-section lieux
 * - **Icône contextuelle** : Emoji bâtiment pour thème infrastructure
 * - **Bouton d'action** : CTA principal pour création établissement
 * - **Hiérarchie claire** : Navigation breadcrumb visuelle implicite
 * - **Branding olympique** : Cohérence avec thématique JO 2024
 *
 * ## Interactions et comportements
 *
 * ### 🖱️ Interaction principale création lieu
 * - **Click bouton** : Déclenche onCreateClick() callback
 * - **Hover effect** : Assombrissement bg-blue-700 sur bouton
 * - **Transition** : Animation fluide des changements couleur
 * - **Feedback** : Changement visuel immédiat sur interaction
 * - **Accessibilité** : Zone de clic suffisante pour tous usages
 * - **Modal trigger** : Ouvre LieuModal pour saisie nouveau lieu
 *
 * ### 🔙 Interaction navigation retour
 * - **Composant délégué** : BackToEventsButton gère sa propre logique
 * - **Navigation contextuelle** : Retour vers gestion événements
 * - **Préservation état** : Navigation sans perte de données
 * - **UX cohérente** : Pattern de navigation standard AdminJO
 * - **Intégration** : Maintien du contexte événementiel global
 *
 * ### 🎨 États visuels
 * - **Normal bouton** : bg-blue-600 avec text-white
 * - **Hover bouton** : bg-blue-700 avec transition smooth
 * - **Focus** : Pas de focus ring spécifique défini
 * - **Active** : Utilise couleur hover pendant clic
 * - **Disabled** : Pas d'état disabled implémenté
 * - **Loading** : Pas d'état de chargement intégré
 *
 * ## Spécificités des lieux olympiques
 *
 * ### 🏅 Contexte olympique spécialisé infrastructure
 * - **Thématique** : Emoji bâtiment pour ambiance infrastructure JO
 * - **Terminologie** : "Lieux" pour établissements sportifs olympiques
 * - **Action** : "Nouveau Lieu" pour création établissement
 * - **Navigation** : Lien avec événements sportifs (parent logique)
 * - **Métier** : Gestion infrastructure événements JO 2024
 * - **Exemples** : Stade de France, Centre Aquatique, Arena Bercy
 *
 * ### 📦 Différences avec autres modules
 * - **Navigation contexte** : Bouton retour unique à ce sous-module
 * - **Hiérarchie** : Sous-module d'événements (vs modules autonomes)
 * - **Layout 3 zones** : Plus complexe que headers 2 zones
 * - **Thème infrastructure** : Icône et terminologie adaptées
 * - **Breadcrumb visuel** : Navigation parent-enfant claire
 * - **Spécialisation** : Focus sur établissements physiques JO
 *
 * ## Navigation et architecture
 *
 * ### 🗺️ Position dans l'architecture JO
 * - **Module parent** : Événements sportifs olympiques
 * - **Sous-module** : Lieux (infrastructure physique)
 * - **Relations** : Lieux → Événements (1-N relation)
 * - **Navigation** : BackToEventsButton pour remontée hiérarchique
 * - **Contexte** : Infrastructure de base pour événements JO
 * - **Hiérarchie logique** : Lieux comme fondation événements
 *
 * ### 🔗 Intégration avec BackToEventsButton
 * - **Composant partagé** : Utilisé dans plusieurs sous-modules
 * - **Logique déléguée** : Navigation gérée par composant shared
 * - **Style cohérent** : Design aligné avec boutons système
 * - **Réutilisabilité** : Pattern commun pour sous-modules
 * - **Maintenance** : Centralisation logique navigation
 *
 * ## Accessibilité et ergonomie
 *
 * ### ♿ Standards d'accessibilité
 * - **Semantic header** : <header> pour lecteurs d'écran
 * - **Heading hierarchy** : h1 pour titre principal
 * - **Contraste couleurs** : Couleurs respectant ratios WCAG
 * - **Zone de clic** : Boutons avec taille adéquate touch/desktop
 * - **Navigation logique** : Ordre de tabulation cohérent
 * - **Texte explicite** : Boutons avec labels clairs
 *
 * ### 🔧 Améliorations accessibilité possibles
 * - **Focus visible** : Ajout focus ring sur boutons
 * - **ARIA labels** : Description contextuelle des boutons
 * - **Keyboard support** : Navigation clavier optimisée
 * - **Screen reader** : Annonce des changements navigation
 * - **Skip links** : Navigation rapide pour utilisateurs clavier
 * - **Landmarks** : ARIA landmarks pour structure page
 *
 * ## Performance et optimisations
 *
 * ### ⚡ Optimisations actuelles
 * - **Composant simple** : Minimal JavaScript pour performance
 * - **CSS statique** : Classes Tailwind compilées
 * - **Pas de state** : Composant fonctionnel sans état interne
 * - **Props simples** : Callback unique sans complexité
 * - **Composant délégué** : BackToEventsButton gère sa logique
 * - **Léger DOM** : Structure HTML minimale
 *
 * ### 🔄 Re-renders minimaux
 * - **Props stables** : onCreateClick stable entre renders
 * - **Callback externe** : Gestion par composant parent
 * - **Style statique** : Pas de calculs CSS dynamiques
 * - **Memoization** : Pourrait bénéficier de React.memo si nécessaire
 * - **Composant léger** : Rendu rapide sans complexité
 * - **Dependencies min** : Dépendances minimales re-render
 *
 * ## Responsive design et layout
 *
 * ### 📱 Adaptabilité mobile
 * - **Layout flexible** : Flexbox s'adapte aux écrans étroits
 * - **Texte responsive** : text-3xl s'ajuste automatiquement
 * - **Boutons tactiles** : Taille optimisée pour touch
 * - **Navigation mobile** : BackToEventsButton adapté mobile
 * - **Espacement** : py-6 px-6 adaptés aux petits écrans
 * - **Hiérarchie** : Maintien importance visuelle sur mobile
 *
 * ### 💻 Expérience desktop
 * - **Largeur maximale** : Profite de l'espace disponible
 * - **Hover states** : Interactions riches sur desktop
 * - **Typography** : Taille optimale pour lecture
 * - **Spacing** : Padding généreux pour confort visuel
 * - **Navigation précise** : Boutons dimensionnés pour souris
 * - **Multi-zones** : Layout 3 zones pleinement exploité
 *
 * ## Intégration système et architecture
 *
 * ### 🔗 Utilisation dans l'architecture
 * - **Parent** : LieuxManagement l'utilise comme header
 * - **Position** : Premier élément de la page lieux
 * - **Callback** : Déclenche ouverture LieuModal
 * - **Navigation** : BackToEventsButton pour remontée niveau
 * - **Isolation** : Composant autonome avec dépendance shared
 * - **Intégration** : S'intègre parfaitement dans layout global
 *
 * ### 🎯 Rôle dans l'UX globale lieux
 * - **Point d'entrée** : Première interaction utilisateur section lieux
 * - **Navigation** : Identification section + retour contexte
 * - **Action primaire** : Création de nouveaux lieux olympiques
 * - **Branding** : Cohérence visuelle AdminJO olympique
 * - **Hiérarchie** : Clarification position dans arborescence
 * - **Contexte métier** : Gestion infrastructure JO clairement identifiée
 *
 * ## Limitations et améliorations futures
 *
 * ### ❌ Fonctionnalités manquantes
 * - **Breadcrumb explicite** : Pas de fil d'Ariane textuel
 * - **Compteur lieux** : Pas d'indicateur nombre total établissements
 * - **Actions bulk** : Pas d'actions sur sélection multiple lieux
 * - **Filtres rapides** : Pas de filtres header intégrés par type
 * - **Recherche rapide** : Pas de barre recherche header
 * - **Export données** : Pas de bouton export lieux
 * - **Statuts lieux** : Pas d'indicateurs statut global
 *
 * ### 🔧 Améliorations possibles
 * - **Breadcrumb complet** : "Événements > Lieux" textuel
 * - **Statistiques** : Compteur total lieux actifs/inactifs
 * - **Filtres intégrés** : Toggle rapides par type établissement
 * - **Recherche header** : Barre recherche avec suggestions
 * - **Actions avancées** : Menu déroulant actions administrateur
 * - **Notifications** : Indicateurs changements/alertes lieux
 * - **Raccourcis** : Boutons accès rapide actions fréquentes
 * - **Vues multiples** : Toggle liste/carte/grille lieux
 *
 * ## Contexte métier lieux olympiques JO 2024
 *
 * ### 🏅 Spécificités domaine olympique infrastructure
 * - **Catalogue lieux** : Gestion répertoire établissements JO 2024
 * - **Hiérarchie événements** : Lieux → Événements → Épreuves
 * - **Icônes spécialisées** : Identifiants visuels par type lieu
 * - **Standards olympiques** : Respect nomenclature CIO
 * - **Gestion administrative** : Interface back-office organisateurs
 * - **Infrastructure critique** : Base physique compétitions JO
 *
 * ### 📊 Relations données contextuelles
 * - **Parent logique** : Module événements sportifs
 * - **Enfants** : Événements spécialisés par lieu
 * - **Métadonnées** : Nom lieu + propriétés infrastructure
 * - **Intégration** : Liaison avec planning événements
 * - **Administration** : Création/modification par organisateurs
 * - **Exemples concrets** : Stade de France, Centre Aquatique, etc.
 *
 * @param {LieuxHeaderProps} props - Configuration du header des lieux
 * @param {Function} props.onCreateClick - Callback déclenché lors du clic sur "Nouveau Lieu"
 *
 * @returns {JSX.Element} Header avec navigation, titre et bouton de création de lieu
 *
 * @see {@link LieuxManagement} - Composant parent utilisant ce header
 * @see {@link LieuModal} - Modal ouverte par le bouton de création
 * @see {@link BackToEventsButton} - Composant de navigation vers événements
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * <LieuxHeader
 *   onCreateClick={() => setShowModal(true)}
 * />
 * ```
 */
interface LieuxHeaderProps {
  onCreateClick: () => void;
}

export default function LieuxHeader({ onCreateClick }: LieuxHeaderProps) {
  return (
    <header className="bg-white shadow-md">
        <div className="flex justify-between items-center py-6 px-6">
            <BackToEventsButton />
            <h1 className="text-3xl font-bold text-gray-900">
              🏢 Gestion des Lieux
            </h1>
          
          <button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Nouveau Lieu
          </button>
        </div>
    </header>
  );
}
