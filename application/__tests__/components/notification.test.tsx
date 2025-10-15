import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notification from '@/components/notification';

describe('Notification', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders notification with message', () => {
    render(
      <Notification
        title="Test Title"
        message="Test message"
        type="success"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Notification
        title="Test Title"
        message="Test message"
        type="error"
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByLabelText('Fermer la notification'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('auto-closes after duration', async () => {
    render(
      <Notification
        title="Test Title"
        message="Test message"
        type="success"
        onClose={mockOnClose}
        duration={100}
      />
    );

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }, { timeout: 200 });
  });

  it('does not auto-close when persistent', async () => {
    render(
      <Notification
        title="Test Title"
        message="Test message"
        type="info"
        onClose={mockOnClose}
        persistent
        duration={100}
      />
    );

    await new Promise(resolve => setTimeout(resolve, 150));
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
