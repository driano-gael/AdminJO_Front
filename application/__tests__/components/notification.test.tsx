import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notification from '@/components/notification';

describe('Notification Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render notification with message', () => {
    render(
      <Notification 
        message="Test message" 
        type="success" 
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render error notification with red background', () => {
    render(
      <Notification 
        message="Error message" 
        type="error" 
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should render success notification with green background', () => {
    render(
      <Notification 
        message="Success message" 
        type="success" 
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it("should call onClose when close bouton est cliqué", async () => {
    render(
      <Notification 
        message="Test message" 
        type="info" 
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    // Attendre que le timeout de l'animation se termine (300ms)
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }, { timeout: 500 });
  });
});
