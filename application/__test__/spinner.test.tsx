import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Spinner from '@/components/spinner';

describe('Spinner', () => {
  it('affiche le spinner avec les paramètres par défaut', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Chargement en cours');
    
    // Classes par défaut (medium, blue)
    expect(spinner).toHaveClass('w-6', 'h-6', 'border-blue-600', 'border-t-transparent');
  });

  it('affiche le texte accessible', () => {
    render(<Spinner />);
    
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
    expect(screen.getByText('Chargement...')).toHaveClass('sr-only');
  });

  it('applique la taille small correctement', () => {
    render(<Spinner size="small" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  it('applique la taille medium correctement', () => {
    render(<Spinner size="medium" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-6', 'h-6');
  });

  it('applique la taille large correctement', () => {
    render(<Spinner size="large" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('gère une taille invalide en utilisant la taille par défaut', () => {
    // @ts-ignore - Test d'une valeur invalide
    render(<Spinner size="invalid" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-6', 'h-6'); // medium par défaut
  });

  it('applique la couleur blue correctement', () => {
    render(<Spinner color="blue" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('border-blue-600', 'border-t-transparent');
  });

  it('applique la couleur white correctement', () => {
    render(<Spinner color="white" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('border-white', 'border-t-transparent');
  });

  it('applique la couleur gray correctement', () => {
    render(<Spinner color="gray" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('border-gray-600', 'border-t-transparent');
  });

  it('gère une couleur invalide en utilisant la couleur par défaut', () => {
    // @ts-ignore - Test d'une valeur invalide
    render(<Spinner color="invalid" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('border-blue-600', 'border-t-transparent'); // blue par défaut
  });

  it('applique les classes CSS personnalisées', () => {
    const customClass = 'custom-spinner-class';
    render(<Spinner className={customClass} />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(customClass);
  });

  it('combine correctement toutes les props', () => {
    render(
      <Spinner 
        size="large" 
        color="white" 
        className="custom-class" 
      />
    );
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(
      'w-8', 'h-8', // large
      'border-white', 'border-t-transparent', // white
      'custom-class', // custom
      'border-2', 'border-solid', 'rounded-full', 'animate-spin' // toujours présentes
    );
  });

  it('a les attributs d\'accessibilité corrects', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Chargement en cours');
    
    const srText = screen.getByText('Chargement...');
    expect(srText).toHaveClass('sr-only');
  });

  it('maintient les classes de base peu importe les props', () => {
    render(<Spinner size="small" color="gray" className="custom" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(
      'border-2',
      'border-solid', 
      'rounded-full',
      'animate-spin'
    );
  });

  it('gère les props undefined gracieusement', () => {
    render(<Spinner size={undefined} color={undefined} className={undefined} />);
    
    const spinner = screen.getByRole('status');
    // Devrait utiliser les valeurs par défaut
    expect(spinner).toHaveClass('w-6', 'h-6', 'border-blue-600', 'border-t-transparent');
  });

  it('peut être utilisé avec des combinaisons de props variées', () => {
    const testCases = [
      { size: 'small' as const, color: 'blue' as const },
      { size: 'medium' as const, color: 'white' as const },
      { size: 'large' as const, color: 'gray' as const },
    ];

    testCases.forEach(({ size, color }, index) => {
      const { unmount } = render(<Spinner size={size} color={color} />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      
      unmount(); // Nettoyer pour le test suivant
    });
  });
});
