import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EvenementsTable from '@/components/componentsEvenement/evenements/EvenementsTable';
import { ExtendEvenement, StatutEvenement } from '@/types/sportEvenement/evenement';
import {Epreuve} from "@/types/sportEvenement/epreuve";

describe('EvenementsTable', () => {
  const mockOnEdit = jest.fn();
  const mockOnDeleteEvent = jest.fn();
  const mockOnRefresh = jest.fn();

  const mockEpreuves: Epreuve[] = [
    {
      id: 1,
      libelle: '100m Sprint',
      genre: 'hommes',
      tour: 'finale',
      discipline: { id: 1, nom: 'Athlétisme', icone: 'athletics.svg' }
    },
    {
      id: 2,
      libelle: 'Papillon 200m',
      genre: 'femmes',
      tour: 'demi-finale',
      discipline: { id: 2, nom: 'Natation', icone: 'swimming.svg' }
    }
  ];

  const mockEvents: ExtendEvenement[] = [
    {
      id: 1,
      description: 'Finale 100m',
      date: '2024-07-15',
      horraire: '14:30',
      lieu: { id: 1, nom: 'Stade de France' },
      epreuves: [mockEpreuves[0]],
      sports: 'Athlétisme',
      status: StatutEvenement.A_VENIR,
      capacity: 80000,
      ticketsSold: 75000
    },
    {
      id: 2,
      description: 'Demi-finale Natation',
      date: '2024-07-16',
      horraire: '10:00',
      lieu: { id: 2, nom: 'Centre Aquatique' },
      epreuves: [mockEpreuves[1]],
      sports: 'Natation',
      status: StatutEvenement.EN_COURS,
      capacity: 15000,
      ticketsSold: 14500
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render table with events', () => {
    render(
      <EvenementsTable
        events={mockEvents}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('Finale 100m')).toBeInTheDocument();
    expect(screen.getByText('Demi-finale Natation')).toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(
      <EvenementsTable
        events={mockEvents}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('Événement')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Lieu')).toBeInTheDocument();
    expect(screen.getByText('Statut')).toBeInTheDocument();
    expect(screen.getByText('Épreuves')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should display event information correctement', () => {
    render(
      <EvenementsTable
        events={mockEvents}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    // Vérifier les données du premier événement
    expect(screen.getByText('Finale 100m')).toBeInTheDocument();
    expect(screen.getByText('Stade de France')).toBeInTheDocument();
  });

  it('should call onEdit when edit bouton est cliquÃ©', () => {
    render(
      <EvenementsTable
        events={mockEvents}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /modifier/i });
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockEvents[0]);
  });

  it('should call onDeleteEvent when delete bouton est cliquÃ©', () => {
    render(
      <EvenementsTable
        events={mockEvents}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDeleteEvent).toHaveBeenCalledWith(1);
  });

  it('should call onRefresh when refresh bouton est cliquÃ©', () => {
    render(
      <EvenementsTable
        events={mockEvents}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    const refreshButton = screen.getByRole('button', { name: /actualiser/i });
    fireEvent.click(refreshButton);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('should show correct number of events', () => {
    render(
      <EvenementsTable
        events={mockEvents}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('Événements (2)')).toBeInTheDocument();
  });

  it('should handle empty events list', () => {
    render(
      <EvenementsTable
        events={[]}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('Aucun événement')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(
      <EvenementsTable
        events={[]}
        loading={true}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    // Il y a plusieurs éléments avec "Chargement..." donc on utilise getAllByText
    const loadingElements = screen.getAllByText('Chargement...');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should show search results message when no results', () => {
    render(
      <EvenementsTable
        events={[]}
        loading={false}
        searchTerm="test search"
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('Aucun événement trouvé')).toBeInTheDocument();
    expect(screen.getByText(/test search/)).toBeInTheDocument();
  });

  it("", () => {
    render(
      <EvenementsTable
        events={mockEvents}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
        error="Une erreur s'est produite"
      />
    );

    expect(screen.getByText("Une erreur s'est produite")).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(
      <EvenementsTable
        events={mockEvents}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const refreshButton = screen.getByRole('button', { name: /actualiser/i });
    expect(refreshButton).toBeInTheDocument();
  });

  it('should disable refresh button when loading', () => {
    render(
      <EvenementsTable
        events={mockEvents}
        loading={true}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    const refreshButton = screen.getByRole('button', { name: /actualiser/i });
    expect(refreshButton).toBeDisabled();
  });

  it('should handle event with long description', () => {
    const eventWithLongDescription: ExtendEvenement = {
      ...mockEvents[0],
      description: 'Ceci est une très longue description qui devrait être affichée correctement dans le tableau'
    };

    render(
      <EvenementsTable
        events={[eventWithLongDescription]}
        loading={false}
        searchTerm=""
        onEdit={mockOnEdit}
        onDeleteEvent={mockOnDeleteEvent}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText(eventWithLongDescription.description)).toBeInTheDocument();
  });
});
