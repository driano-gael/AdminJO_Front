import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvenementsTableRow from '../../../../src/components/componentsEvenement/evenements/EvenementsTableRow';
import { Evenement } from '../../../../src/types/sportEvenement/evenement';
import {Epreuve} from "@/types/sportEvenement/epreuve";

// Mock des composants
jest.mock('../../../../src/components/componentsEvenement/evenements/EvenementsStatus', () => {
  return function MockEventStatus({ date, time }: any) {
    return (
      <div data-testid="event-status">
        Status for {date} at {time}
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/evenements/EvenementEpreuves', () => {
  return function MockEvenementEpreuve({ epreuves }: any) {
    return (
      <div data-testid="evenement-epreuves">
        {epreuves?.length} épreuves
      </div>
    );
  };
});

describe('EvenementsTableRow', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockEvent: Evenement = {
    id: 1,
    description: 'Finale 100m hommes',
    date: '2024-07-28',
    horraire: '20:30',
    lieu: {
      id: 1,
      nom: 'Stade de France'
    },
    epreuves: [
      { id: 1, libelle: '100m Sprint', discipline: { id: 1, nom: 'Athlétisme', icone: 'athletics.svg'},genre: 'hommes', tour: 'finale' },
      { id: 2, libelle: '200m Sprint', discipline: { id: 1, nom: 'Athlétisme' , icone: 'athletics.svg'},genre: 'hommes', tour: 'finale' }
    ]
  };


  const defaultProps = {
    event: mockEvent,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete
  };

  const renderWithTable = (component: React.ReactElement) => {
    return render(
      <table>
        <tbody>
          {component}
        </tbody>
      </table>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render event description', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      expect(screen.getByText('Finale 100m hommes')).toBeInTheDocument();
    });

    it('should render event date formatted in French', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      expect(screen.getByText('28/07/2024')).toBeInTheDocument();
    });

    it('should render event time', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      expect(screen.getByText('20:30')).toBeInTheDocument();
    });

    it('should render venue name', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      expect(screen.getByText('Stade de France')).toBeInTheDocument();
    });

    it('should render edit and bouton de suppressions', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      expect(screen.getByText('Modifier')).toBeInTheDocument();
      expect(screen.getByText('Supprimer')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render EventStatus component with correct props', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      expect(screen.getByTestId('event-status')).toBeInTheDocument();
      expect(screen.getByText('Status for 2024-07-28 at 20:30')).toBeInTheDocument();
    });

    it('should render EvenementEpreuve component with correct props', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      expect(screen.getByTestId('evenement-epreuves')).toBeInTheDocument();
      expect(screen.getByText('2 épreuves')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onEdit when edit bouton est cliquÃ©', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const editButton = screen.getByText('Modifier');
      fireEvent.click(editButton);
      
      expect(mockOnEdit).toHaveBeenCalledWith(mockEvent);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when delete bouton est cliquÃ©', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const deleteButton = screen.getByText('Supprimer');
      fireEvent.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledWith(mockEvent.id);
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple button clicks correctement', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const editButton = screen.getByText('Modifier');
      const deleteButton = screen.getByText('Supprimer');
      
      fireEvent.click(editButton);
      fireEvent.click(deleteButton);
      fireEvent.click(editButton);
      
      expect(mockOnEdit).toHaveBeenCalledTimes(2);
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling and CSS Classes', () => {
    it('should have hover styling on ligne de tableau', () => {
      const { container } = renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const tableRow = container.querySelector('tr');
      expect(tableRow).toHaveClass('hover:bg-gray-50');
    });

    it('should have correct styling for description cell', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const descriptionDiv = screen.getByText('Finale 100m hommes');
      expect(descriptionDiv).toHaveClass('text-sm', 'font-medium', 'text-gray-900');
    });

    it('should have correct styling for date cell', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const dateDiv = screen.getByText('28/07/2024');
      expect(dateDiv).toHaveClass('text-sm', 'text-gray-900');
      
      const timeDiv = screen.getByText('20:30');
      expect(timeDiv).toHaveClass('text-xs', 'text-gray-500');
    });

    it('should have correct styling for venue cell', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const venueDiv = screen.getByText('Stade de France');
      expect(venueDiv).toHaveClass('text-sm', 'text-gray-900');
    });

    it("", () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const editButton = screen.getByText('Modifier');
      expect(editButton).toHaveClass('text-blue-600', 'hover:text-blue-900', 'mr-3');
    });

    it('should have correct styling for bouton de suppression', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const deleteButton = screen.getByText('Supprimer');
      expect(deleteButton).toHaveClass('text-red-600', 'hover:text-red-900');
    });
  });

  describe('Data Display', () => {
    it('should format date correctement for different locales', () => {
      const eventWithDifferentDate = {
        ...mockEvent,
        date: '2024-12-25'
      };
      
      renderWithTable(<EvenementsTableRow {...defaultProps} event={eventWithDifferentDate} />);
      
      expect(screen.getByText('25/12/2024')).toBeInTheDocument();
    });

    it('should display different event descriptions', () => {
      const eventWithDifferentDescription = {
        ...mockEvent,
        description: 'Demi-finale natation 200m'
      };
      
      renderWithTable(<EvenementsTableRow {...defaultProps} event={eventWithDifferentDescription} />);
      
      expect(screen.getByText('Demi-finale natation 200m')).toBeInTheDocument();
    });

    it('should display different venue names', () => {
      const eventWithDifferentVenue = {
        ...mockEvent,
        lieu: { id: 2, nom: 'Centre Aquatique' }
      };
      
      renderWithTable(<EvenementsTableRow {...defaultProps} event={eventWithDifferentVenue} />);
      
      expect(screen.getByText('Centre Aquatique')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle events with no epreuves', () => {
      const eventWithNoEpreuves = {
        ...mockEvent,
        epreuves: []
      };
      
      renderWithTable(<EvenementsTableRow {...defaultProps} event={eventWithNoEpreuves} />);
      
      expect(screen.getByText('0 épreuves')).toBeInTheDocument();
    });

    it('should handle events with undefined epreuves', () => {
      const eventWithUndefinedEpreuves = {
        ...mockEvent,
        epreuves: undefined as any
      };
      
      renderWithTable(<EvenementsTableRow {...defaultProps} event={eventWithUndefinedEpreuves} />);
      
      expect(screen.getByTestId('evenement-epreuves')).toBeInTheDocument();
    });

    it('should handle different time formats', () => {
      const eventWithDifferentTime = {
        ...mockEvent,
        horraire: '09:00'
      };
      
      renderWithTable(<EvenementsTableRow {...defaultProps} event={eventWithDifferentTime} />);
      
      expect(screen.getByText('09:00')).toBeInTheDocument();
      expect(screen.getByText('Status for 2024-07-28 at 09:00')).toBeInTheDocument();
    });

    it('should handle long descriptions gracefully', () => {
      const eventWithLongDescription = {
        ...mockEvent,
        description: 'Très longue description d\'un événement sportif important qui pourrait dépasser la largeur normale de la cellule'
      };
      
      renderWithTable(<EvenementsTableRow {...defaultProps} event={eventWithLongDescription} />);
      
      expect(screen.getByText(/Très longue description/)).toBeInTheDocument();
    });

    it('should handle long venue names gracefully', () => {
      const eventWithLongVenueName = {
        ...mockEvent,
        lieu: { id: 3, nom: 'Centre Aquatique Olympique de Paris La Défense Arena' }
      };
      
      renderWithTable(<EvenementsTableRow {...defaultProps} event={eventWithLongVenueName} />);
      
      expect(screen.getByText('Centre Aquatique Olympique de Paris La Défense Arena')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper table structure', () => {
      const { container } = renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const tableRow = container.querySelector('tr');
      const tableCells = container.querySelectorAll('td');
      
      expect(tableRow).toBeInTheDocument();
      expect(tableCells).toHaveLength(6); // description, epreuves, date/time, venue, status, actions
    });

    it('should have accessible button elements', () => {
      renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: 'Modifier' });
      const deleteButton = screen.getByRole('button', { name: 'Supprimer' });
      
      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    it('should maintain proper cell padding and whitespace', () => {
      const { container } = renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const cells = container.querySelectorAll('td');
      
      cells.forEach(cell => {
        expect(cell).toHaveClass('px-6', 'py-4');
      });
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      // Re-render with same props
      rerender(
        <table>
          <tbody>
            <EvenementsTableRow {...defaultProps} />
          </tbody>
        </table>
      );
      
      expect(screen.getByText('Finale 100m hommes')).toBeInTheDocument();
    });

    it('should handle prop changes correctement', () => {
      const { rerender } = renderWithTable(<EvenementsTableRow {...defaultProps} />);
      
      const newEvent = {
        ...mockEvent,
        description: 'Nouvelle description'
      };
      
      rerender(
        <table>
          <tbody>
            <EvenementsTableRow {...defaultProps} event={newEvent} />
          </tbody>
        </table>
      );
      
      expect(screen.getByText('Nouvelle description')).toBeInTheDocument();
      expect(screen.queryByText('Finale 100m hommes')).not.toBeInTheDocument();
    });
  });
});
