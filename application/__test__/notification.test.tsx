import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notification from '@/components/notification';

describe('Notification', () => {
  let mockOnClose: jest.Mock;

  beforeEach(() => {
    mockOnClose = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('affiche le message de notification', () => {
    render(
      <Notification 
        message="Message de test" 
        onClose={mockOnClose} 
      />
    );

    expect(screen.getByText('Message de test')).toBeInTheDocument();
  });

  it('affiche le bouton de fermeture', () => {
    render(
      <Notification 
        message="Message de test" 
        onClose={mockOnClose} 
      />
    );

    const closeButton = screen.getByRole('button', { name: /fermer/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveTextContent('×');
  });

  it('appelle onClose quand le bouton fermer est cliqué', () => {
    render(
      <Notification 
        message="Message de test" 
        onClose={mockOnClose} 
      />
    );

    const closeButton = screen.getByRole('button', { name: /fermer/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applique les bonnes classes CSS pour le type error (par défaut)', () => {
    const { container } = render(
      <Notification 
        message="Message d'erreur" 
        onClose={mockOnClose} 
      />
    );

    const notification = container.firstChild as HTMLElement;
    expect(notification).toHaveClass('bg-red-500', 'border-red-600');
  });

  it('applique les bonnes classes CSS pour le type success', () => {
    const { container } = render(
      <Notification 
        message="Message de succès" 
        type="success"
        onClose={mockOnClose} 
      />
    );

    const notification = container.firstChild as HTMLElement;
    expect(notification).toHaveClass('bg-green-500', 'border-green-600');
  });

  it('applique les bonnes classes CSS pour le type info', () => {
    const { container } = render(
      <Notification 
        message="Message d'information" 
        type="info"
        onClose={mockOnClose} 
      />
    );

    const notification = container.firstChild as HTMLElement;
    expect(notification).toHaveClass('bg-blue-500', 'border-blue-600');
  });

  it('ferme automatiquement après la durée par défaut (3000ms)', () => {
    render(
      <Notification 
        message="Message de test" 
        onClose={mockOnClose} 
      />
    );

    expect(mockOnClose).not.toHaveBeenCalled();

    // Laisser React initialiser le composant
    jest.advanceTimersByTime(0);
    
    // Avancer de 3000ms
    jest.advanceTimersByTime(3000);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('ferme automatiquement après une durée personnalisée', () => {
    render(
      <Notification 
        message="Message de test" 
        duration={5000}
        onClose={mockOnClose} 
      />
    );

    expect(mockOnClose).not.toHaveBeenCalled();

    // Laisser React initialiser le composant
    jest.advanceTimersByTime(0);

    // Avancer de 4999ms (pas encore fermé)
    jest.advanceTimersByTime(4999);
    expect(mockOnClose).not.toHaveBeenCalled();

    // Avancer de 1ms de plus (maintenant fermé)
    jest.advanceTimersByTime(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('utilise une durée minimale de 2500ms pour les notifications de succès', () => {
    render(
      <Notification 
        message="Message de succès" 
        type="success"
        duration={1000} // Plus court que le minimum
        onClose={mockOnClose} 
      />
    );

    // Laisser React initialiser le composant
    jest.advanceTimersByTime(0);

    // Avancer de 1000ms (durée demandée, mais pas suffisante)
    jest.advanceTimersByTime(1000);
    expect(mockOnClose).not.toHaveBeenCalled();

    // Avancer jusqu'à 2500ms (durée minimale)
    jest.advanceTimersByTime(1500);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('affiche la barre de progression avec la bonne couleur selon le type', () => {
    const { container: errorContainer } = render(
      <Notification 
        message="Erreur" 
        type="error"
        onClose={mockOnClose} 
      />
    );

    const errorProgressBar = errorContainer.querySelector('.bg-red-300');
    expect(errorProgressBar).toBeInTheDocument();

    const { container: successContainer } = render(
      <Notification 
        message="Succès" 
        type="success"
        onClose={mockOnClose} 
      />
    );

    const successProgressBar = successContainer.querySelector('.bg-green-300');
    expect(successProgressBar).toBeInTheDocument();

    const { container: infoContainer } = render(
      <Notification 
        message="Info" 
        type="info"
        onClose={mockOnClose} 
      />
    );

    const infoProgressBar = infoContainer.querySelector('.bg-blue-300');
    expect(infoProgressBar).toBeInTheDocument();
  });

  it('nettoie les timers lors du démontage du composant', () => {
    const { unmount } = render(
      <Notification 
        message="Message de test" 
        onClose={mockOnClose} 
      />
    );

    // Démonter avant que le timer se déclenche
    unmount();

    // Avancer les timers
    jest.advanceTimersByTime(3000);

    // onClose ne devrait pas être appelé après démontage
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('gère les changements de props correctement', () => {
    const { rerender } = render(
      <Notification 
        message="Premier message" 
        duration={2000}
        onClose={mockOnClose} 
      />
    );

    // Laisser React initialiser le composant
    jest.advanceTimersByTime(0);

    // Changer les props
    rerender(
      <Notification 
        message="Deuxième message" 
        duration={4000}
        onClose={mockOnClose} 
      />
    );

    expect(screen.getByText('Deuxième message')).toBeInTheDocument();

    // Le timer devrait utiliser la nouvelle durée
    jest.advanceTimersByTime(2000);
    expect(mockOnClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
