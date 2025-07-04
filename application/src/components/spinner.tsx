/**
 * Composant Spinner - Indicateur de chargement
 * 
 * Ce composant affiche un indicateur de chargement rotatif (spinner) personnalisable
 * avec différentes tailles et couleurs. Il est utilisé pour indiquer aux utilisateurs
 * qu'une opération est en cours.
 * 
 * Fonctionnalités :
 * - Tailles configurables (small, medium, large)
 * - Couleurs configurables (blue, white, gray)
 * - Classes CSS personnalisables
 * - Accessible avec attributs ARIA
 * - Animation CSS fluide
 * 
 * Utilisation :
 * <Spinner size="large" color="blue" />
 * <Spinner size="small" color="white" className="mx-auto" />
 */

'use client';

/**
 * Props pour le composant Spinner
 */
type Props = {
  /** Taille du spinner */
  size?: 'small' | 'medium' | 'large';
  /** Couleur du spinner */
  color?: 'blue' | 'white' | 'gray';
  /** Classes CSS supplémentaires */
  className?: string;
}

/**
 * Composant Spinner - Indicateur de chargement rotatif
 * 
 * @param props - Les propriétés du composant
 * @returns JSX.Element - L'indicateur de chargement
 */
export default function Spinner({ size = 'medium', color = 'blue', className = '' }: Props) {
  
  /**
   * Détermine les classes CSS pour la taille du spinner
   * @returns string - Classes CSS de taille
   */
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'medium':
        return 'w-6 h-6';
      case 'large':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  /**
   * Détermine les classes CSS pour la couleur du spinner
   * @returns string - Classes CSS de couleur
   */
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'border-blue-600 border-t-transparent';
      case 'white':
        return 'border-white border-t-transparent';
      case 'gray':
        return 'border-gray-600 border-t-transparent';
      default:
        return 'border-blue-600 border-t-transparent';
    }
  };

  return (
    <div 
      className={`${getSizeClasses()} border-2 border-solid ${getColorClasses()} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Chargement en cours"
    >
      {/* Texte accessible pour les lecteurs d'écran */}
      <span className="sr-only">Chargement...</span>
    </div>
  );
}
