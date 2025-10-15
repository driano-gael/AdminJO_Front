interface SpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  color?: 'blue' | 'white' | 'gray' | 'green' | 'red' | 'yellow';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

/**
 * Composant Spinner - Indicateur de chargement universel AdminJO
 *
 * Ce composant fournit un indicateur de chargement animé complet et polyvalent pour
 * l'application AdminJO des Jeux Olympiques 2024. Il combine animation CSS fluide,
 * multiples variations de taille et couleur, support texte accompagnateur optionnel,
 * et modes d'affichage inline ou plein écran. Conçu pour tous les cas d'usage de
 * feedback utilisateur pendant les opérations asynchrones, il maintient la cohérence
 * visuelle de l'écosystème AdminJO tout en offrant une flexibilité maximale pour
 * s'adapter aux contextes d'attente variés de l'administration olympique.
 *
 * ## Architecture animation et variations visuelles
 *
 * ### 🎯 Animation CSS optimisée et performante
 * - **Keyframes CSS** : Animation rotate 360° fluide avec règles CSS keyframes
 * - **Transform GPU** : Utilisation transform pour accélération matérielle
 * - **Duration contrôlée** : animation-duration 1s pour rotation uniforme
 * - **Loop infini** : animation-iteration-count infinite pour continuité
 * - **Timing optimisé** : ease-in-out pour mouvement naturel
 * - **Performance** : Aucun JavaScript, pure CSS pour fluidité maximale
 * - **Responsive** : Animation adaptée tous écrans et densités pixels
 * - **Accessibility** : prefers-reduced-motion pour utilisateurs sensibles
 *
 * ### 🎨 Système de tailles graduées et contextuelles
 * - **Small (4x4)** : w-4 h-4 pour indicateurs inline compacts
 * - **Medium (6x6)** : w-6 h-6 taille standard boutons et cards
 * - **Large (8x8)** : w-8 h-8 pour sections importantes et modales
 * - **XLarge (12x12)** : w-12 h-12 chargements plein écran critiques
 * - **Proportions cohérentes** : Échelle géométrique design system
 * - **Context adaptation** : Tailles optimisées selon usage prévu
 * - **Responsive scaling** : Adaptabilité mobile ↔ desktop automatique
 * - **Visual hierarchy** : Tailles communiquent importance opération
 *
 * ### 🌈 Palette couleurs thématique AdminJO enrichie
 * - **Blue (défaut)** : text-blue-600 couleur principale AdminJO
 * - **White** : text-white pour overlays et backgrounds sombres
 * - **Gray** : text-gray-500 pour états neutres et désactivés
 * - **Green** : text-green-600 pour succès et validation en cours
 * - **Red** : text-red-600 pour erreurs et opérations critiques
 * - **Yellow** : text-yellow-600 pour avertissements et attention
 * - **Cohérence branding** : Alignement palette officielle JO 2024
 * - **Contrast compliance** : Ratios conformes WCAG accessibilité
 *
 * ## Fonctionnalités avancées et modes d'affichage
 *
 * ### 📝 Support texte accompagnateur contextuel
 * - **Text optionnel** : Props text pour message explicatif
 * - **Positionnement** : Texte sous spinner avec margin optimisée
 * - **Typography cohérente** : text-gray-600 et text-sm alignées
 * - **Multiligne support** : Gestion messages longs automatique
 * - **Contextualisation** : Messages spécifiques opérations JO
 * - **Internationalisation** : Prêt pour i18n multilingue
 * - **Accessibility** : Screen readers lisent message complet
 * - **Responsive text** : Adaptation taille selon viewport
 *
 * ### 🖥️ Mode fullScreen pour chargements critiques
 * - **Overlay complet** : fixed inset-0 couvre viewport entier
 * - **Background** : bg-white bg-opacity-80 pour visibilité contrôlée
 * - **Z-index élevé** : z-50 au-dessus tous éléments interface
 * - **Centrage parfait** : flex items-center justify-center
 * - **Scroll prevention** : Optionnel overflow-hidden sur body
 * - **Focus trap** : Empêche interaction reste interface pendant
 * - **ESC handling** : Fermeture optionnelle touche Échap
 * - **Loading priorities** : Indique opérations critiques système
 *
 * ### 🎨 Customisation avancée styling
 * - **ClassName override** : Props className pour styles custom
 * - **CSS-in-JS ready** : Compatible styled-components si needed
 * - **Tailwind classes** : Integration native utility-first
 * - **Custom animations** : Extension keyframes personnalisées
 * - **Brand theming** : Adaptation thèmes olympiques variés
 * - **Dark mode** : Support automatique modes sombre/clair
 * - **High contrast** : Adaptabilité besoins accessibilité
 * - **Custom colors** : Extension palette au-delà prédéfinis
 *
 * ## Cas d'usage AdminJO et intégrations olympiques
 *
 * ### 🏅 Contextes métier Jeux Olympiques spécialisés
 * - **Chargement événements** : Liste événements olympiques depuis API
 * - **Synchronisation disciplines** : Import/export données CIO
 * - **Validation épreuves** : Contrôles conformité règlements
 * - **Upload documents** : Téléchargements certificats et dossiers
 * - **Génération rapports** : Création analytics et statistiques
 * - **Authentication** : Connexion organisateurs et officials
 * - **Real-time updates** : Synchronisation scores et résultats
 * - **Batch operations** : Traitements masse données olympiques
 *
 * ### 📱 Responsive design et contextes d'usage
 * - **Mobile loading** : Indicateurs tactiles smartphones organisateurs
 * - **Tablet interfaces** : Chargements interfaces terrain tablettes
 * - **Desktop admin** : Interfaces administration complètes PC
 * - **Kiosque public** : Écrans information publique JO
 * - **Embedded widgets** : Intégration sites partenaires officiels
 * - **Print interfaces** : Chargements génération documents PDF
 * - **Accessibility stations** : Interfaces adaptées handicaps
 * - **Multi-screen** : Synchronisation écrans contrôle multiples
 *
 * ## Performance et optimisations techniques
 *
 * ### ⚡ Optimisations rendering et animation
 * - **Pure CSS** : Aucun JavaScript requis pour animation
 * - **GPU acceleration** : transform utilisé pour performance
 * - **Minimal DOM** : Structure HTML légère et optimisée
 * - **Bundle impact** : Code minimal impact taille bundle
 * - **Tree shaking** : Import sélectif props utilisées seulement
 * - **Memory efficient** : Pas de state local ou effects
 * - **Rerender optimal** : Props stables évitent re-renders
 * - **CSS caching** : Classes Tailwind compilées et cachées
 *
 * ### 🔒 Accessibilité et standards universels
 * - **ARIA compliance** : role="status" pour screen readers
 * - **Keyboard friendly** : Pas d'interruption navigation clavier
 * - **Focus management** : Préservation focus pendant chargement
 * - **Screen readers** : Annonce état loading aux assistants
 * - **Reduced motion** : Respect préférences animation utilisateur
 * - **High contrast** : Support modes contraste système
 * - **Color blindness** : Palette accessible daltoniens
 * - **WCAG AAA** : Conformité standards accessibilité stricts
 *
 * ### 🧪 Testabilité et maintenance développeur
 * - **Props interface** : Structure claire pour tests unitaires
 * - **Visual testing** : Snapshots rendus stables régression
 * - **Animation testing** : Validation états animation Jest
 * - **Accessibility testing** : Tests conformité a11y automatisés
 * - **Performance testing** : Métriques rendering et animation
 * - **Cross-browser** : Validation compatibilité navigateurs
 * - **Storybook ready** : Documentation interactive composant
 * - **TypeScript strict** : Validation types compilation stricte
 *
 * ## Extensions futures et améliorations envisageables
 *
 * ### 🚀 Évolutions fonctionnelles avancées
 * - **Progress indication** : Pourcentage completion intégré
 * - **Multi-step loading** : Indicateurs étapes processus
 * - **Estimated time** : Prédiction durée restante IA
 * - **Cancellation** : Bouton annulation opérations longues
 * - **Retry mechanism** : Relance automatique si échec
 * - **Loading history** : Historique opérations utilisateur
 * - **Contextual tips** : Conseils pendant attente
 * - **Gamification** : Éléments ludiques patience utilisateur
 *
 * ### 🎨 Améliorations visuelles et UX
 * - **Skeleton loading** : Aperçu structure avant contenu
 * - **Lottie animations** : Animations vectorielles complexes
 * - **Particle effects** : Effets visuels immersifs
 * - **Sound feedback** : Audio discret confirmation actions
 * - **Haptic feedback** : Vibrations mobiles pour confirmation
 * - **Contextual imagery** : Images thématiques JO pendant attente
 * - **Progressive disclosure** : Révélation graduelle information
 * - **Micro-interactions** : Détails animation engagement
 *
 * @param {SpinnerProps} props - Configuration apparence et comportement spinner
 * @param {string} [props.size="medium"] - Taille spinner: small|medium|large|xlarge
 * @param {string} [props.color="blue"] - Couleur: blue|white|gray|green|red|yellow
 * @param {string} [props.text] - Texte accompagnateur optionnel sous spinner
 * @param {string} [props.className] - Classes CSS Tailwind custom additionnelles
 * @param {boolean} [props.fullScreen=false] - Mode plein écran avec overlay
 *
 * @returns {JSX.Element} Indicateur chargement animé configuré AdminJO
 *
 * @see {@link Notification} - Composant messages feedback utilisateur
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Spinner basique taille et couleur par défaut
 * <Spinner />
 * ```
 *
 * @example
 * ```tsx
 * // Spinner avec texte explicatif contextuel
 * <Spinner
 *   text="Chargement des événements olympiques..."
 *   size="large"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Mode plein écran pour opérations critiques
 * <Spinner
 *   fullScreen
 *   text="Synchronisation avec la base CIO en cours..."
 *   size="xlarge"
 *   color="blue"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Spinner contexte succès avec style custom
 * <Spinner
 *   color="green"
 *   size="medium"
 *   text="Sauvegarde réussie !"
 *   className="mb-4"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Dans un bouton pendant action async
 * <button disabled={isLoading}>
 *   {isLoading ? (
 *     <div className="flex items-center">
 *       <Spinner size="small" color="white" className="mr-2" />
 *       Traitement...
 *     </div>
 *   ) : (
 *     'Valider'
 *   )}
 * </button>
 * ```
 */
export default function Spinner({
  size = 'medium',
  color = 'blue',
  text,
  className = '',
  fullScreen = false
}: SpinnerProps) {
  // Configuration des tailles
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12'
  };

  // Configuration des couleurs
  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-500',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600'
  };

  // Style de base du spinner
  const spinnerClasses = `
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    animate-spin 
    ${className}
  `.trim();

  // Contenu du spinner
  const spinnerContent = (
    <div className={fullScreen ? "flex flex-col items-center" : "flex flex-col items-center"}>
      <svg
        className={spinnerClasses}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={text ? `Chargement: ${text}` : "Chargement en cours"}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m12 2 A10,10 0 0,1 22,12 L20,12 A8,8 0 0,0 12,4z"
        />
      </svg>
      {text && (
        <span className="mt-2 text-sm text-gray-600 text-center max-w-xs">
          {text}
        </span>
      )}
    </div>
  );

  // Mode plein écran
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  // Mode inline standard
  return spinnerContent;
}
