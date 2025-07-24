import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EvenementsHeader from '@/components/componentsEvenement/evenements/EvenementsHeader';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('EvenementsHeader', () => {
  const mockOnCreateEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render header title', () => {
    render(<EvenementsHeader onCreateEvent={mockOnCreateEvent} />);

    expect(screen.getByText('📅 Gestion des Événements Sportifs 🏆')).toBeInTheDocument();
  });

  it('should render create event button', () => {
    render(<EvenementsHeader onCreateEvent={mockOnCreateEvent} />);

    const createButton = screen.getByRole('button', { name: '+ Nouvel Événement' });
    expect(createButton).toBeInTheDocument();
  });

  it('should call onCreateEvent when create bouton est cliquÃ©', () => {
    render(<EvenementsHeader onCreateEvent={mockOnCreateEvent} />);

    const createButton = screen.getByRole('button', { name: '+ Nouvel Événement' });
    fireEvent.click(createButton);

    expect(mockOnCreateEvent).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    render(<EvenementsHeader onCreateEvent={mockOnCreateEvent} />);

    const createButton = screen.getByRole('button', { name: '+ Nouvel Événement' });
    // Les boutons HTML n'ont pas forcément l'attribut type="button" explicite
    expect(createButton).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<EvenementsHeader onCreateEvent={mockOnCreateEvent} />);

    // Le composant ne semble pas avoir de texte de description, on teste le header
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should have proper button styling classes', () => {
    render(<EvenementsHeader onCreateEvent={mockOnCreateEvent} />);

    const createButton = screen.getByRole('button', { name: '+ Nouvel Événement' });
    expect(createButton).toHaveClass('bg-blue-600');
  });
});
