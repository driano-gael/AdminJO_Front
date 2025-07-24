import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import SessionExpiredModal from '@/components/connexion/SessionExpiredModal';

// Mock timer functions
jest.useFakeTimers();

describe('SessionExpiredModal', () => {
  const mockOnClose = jest.fn();
  const mockOnReconnect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should not render when isOpen is false', () => {
    render(
      <SessionExpiredModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    expect(screen.queryByText('Session expirée')).not.toBeInTheDocument();
  });

  it('should render modal when isOpen is true', () => {
    render(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    expect(screen.getByText('Session expirée')).toBeInTheDocument();
    expect(screen.getByText(/Votre session a expiré/)).toBeInTheDocument();
    expect(screen.getByText(/dans 10 secondes/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Se reconnecter maintenant' })).toBeInTheDocument();
  });

  it('should display countdown starting at 10 seconds', () => {
    render(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    expect(screen.getByText(/dans 10 secondes/)).toBeInTheDocument();
  });

  it('should countdown correctement over time', async () => {
    render(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    expect(screen.getByText(/dans 10 secondes/)).toBeInTheDocument();

    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/dans 9 secondes/)).toBeInTheDocument();

    // Advance timer by 3 more seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText(/dans 6 secondes/)).toBeInTheDocument();
  });

  it('should call onReconnect when countdown reaches 0', async () => {
    render(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    // Advance timer by 10 seconds to complete countdown
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(mockOnReconnect).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should call onClose when Fermer bouton est cliquÃ©', async () => {
    render(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    const closeButton = screen.getByRole('button', { name: 'Fermer' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnReconnect).not.toHaveBeenCalled();
  });

  it('should call onReconnect when Se reconnecter maintenant bouton est cliquÃ©', async () => {
    render(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    const reconnectButton = screen.getByRole('button', { name: 'Se reconnecter maintenant' });
    fireEvent.click(reconnectButton);

    expect(mockOnReconnect).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should reset countdown when modal est fermÃ© and reopened', () => {
    const { rerender } = render(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    // Let some time pass
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText(/dans 7 secondes/)).toBeInTheDocument();

    // Close modal
    rerender(
      <SessionExpiredModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    // Reopen modal
    rerender(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    // Countdown should be reset to 10
    expect(screen.getByText(/dans 10 secondes/)).toBeInTheDocument();
  });

  it('should have correct CSS classes and styling', () => {
    render(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    // Check overlay
    const overlay = screen.getByText('Session expirée').closest('.fixed');
    expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50');

    // Check modal container
    const modalContainer = screen.getByText('Session expirée').closest('.bg-white');
    expect(modalContainer).toHaveClass('bg-white', 'rounded-lg', 'p-6', 'w-full', 'max-w-md', 'mx-4', 'text-center');

    // Check buttons
    const closeButton = screen.getByRole('button', { name: 'Fermer' });
    expect(closeButton).toHaveClass('px-4', 'py-2', 'text-sm', 'font-medium', 'text-gray-700', 'bg-gray-200', 'rounded-md');

    const reconnectButton = screen.getByRole('button', { name: 'Se reconnecter maintenant' });
    expect(reconnectButton).toHaveClass('px-4', 'py-2', 'text-sm', 'font-medium', 'text-white', 'bg-blue-600', 'rounded-md');
  });

  it('should display clock emoji icon', () => {
    render(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    expect(screen.getByText('⏰')).toBeInTheDocument();
  });

  it('should handle rapid state changes correctement', () => {
    const { rerender } = render(
      <SessionExpiredModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    // Rapidly toggle isOpen
    rerender(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    rerender(
      <SessionExpiredModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    rerender(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    // Should show correct countdown
    expect(screen.getByText(/dans 10 secondes/)).toBeInTheDocument();
    expect(mockOnReconnect).not.toHaveBeenCalled();
  });

  it('should clean up timer when component unmounts', () => {
    const { unmount } = render(
      <SessionExpiredModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onReconnect={mockOnReconnect} 
      />
    );

    // Start countdown
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Unmount component
    unmount();

    // Advance timer further - should not call onReconnect
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(mockOnReconnect).not.toHaveBeenCalled();
  });
});
