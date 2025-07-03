'use client';

type Props = {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

export default function Spinner({ size = 'medium', color = 'blue', className = '' }: Props) {
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
      <span className="sr-only">Chargement...</span>
    </div>
  );
}
