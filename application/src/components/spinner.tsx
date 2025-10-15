import {JSX} from "react";

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
 * ### Système de tailles graduées et contextuelles
 * - **Small (4x4)** : w-4 h-4 pour indicateurs inline compacts
 * - **Medium (6x6)** : w-6 h-6 taille standard boutons et cards
 * - **Large (8x8)** : w-8 h-8 pour sections importantes et modales
 * - **XLarge (12x12)** : w-12 h-12 chargements plein écran critiques
 * - **Proportions cohérentes** : Échelle géométrique design system
 * - **Context adaptation** : Tailles optimisées selon usage prévu
 * - **Responsive scaling** : Adaptabilité mobile ↔ desktop automatique
 * - **Visual hierarchy** : Tailles communiquent importance opération
 *
 * ### Palette couleurs thématique AdminJO enrichie
 * - **Blue (défaut)** : text-blue-600 couleur principale AdminJO
 * - **White** : text-white pour overlays et backgrounds sombres
 * - **Gray** : text-gray-500 pour états neutres et désactivés
 * - **Green** : text-green-600 pour succès et validation en cours
 * - **Red** : text-red-600 pour erreurs et opérations critiques
 * - **Yellow** : text-yellow-600 pour avertissements et attention
 * - **Cohérence branding** : Alignement palette officielle JO 2024
 * - **Contrast compliance** : Ratios conformes WCAG accessibilité
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
 */
export function Spinner({
  size = 'medium',
  color = 'blue',
  text,
  className = '',
  fullScreen = false
}: SpinnerProps): JSX.Element {
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
export default Spinner;
