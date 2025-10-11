import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EpreuvesManagement from '../../../../src/components/componentsEvenement/epreuve/EpreuvesManagement';
import { Epreuve } from '../../../../src/types/sportEvenement/epreuve';
import { Discipline } from '../../../../src/types/sportEvenement/discipline';

// Mock des hooks
const mockUseEpreuvesManagement = {
  epreuves: [] as Epreuve[],
  disciplines: [] as Discipline[],
  searchTerm: '',
  selectedDisciplineId: null as number | null,
  loading: false,
  error: null as string | null,
  createLoading: false,
  createError: null as string | null,
  loadEpreuves: jest.fn(),
  createEpreuve: jest.fn(),
  updateEpreuve: jest.fn(),
  deleteEpreuve: jest.fn(),
  handleSearch: jest.fn(),
  handleDisciplineFilter: jest.fn(),
  setCreateError: jest.fn()
};

jest.mock('../../../../src/hooks/useEpreuvesManagement', () => ({
  useEpreuvesManagement: () => mockUseEpreuvesManagement
}));

jest.mock('../../../../src/hooks/useSessionExpiry', () => ({
  useSessionExpiry: jest.fn()
}));

// Mock des composants
jest.mock('../../../../src/components/notification', () => {
  return function MockNotification({ message, type, onClose }: any) {
    return (
      <div data-testid="notification" data-type={type}>
        {message}
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/epreuve/EpreuvesHeader', () => {
  return function MockEpreuvesHeader({ onCreateClick }: any) {
    return (
      <div data-testid="epreuves-header">
        <button onClick={onCreateClick}>Create Epreuve</button>
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/epreuve/SearchAndFilters', () => {
  return function MockSearchAndFilters({ searchTerm, selectedDisciplineId, disciplines, onSearch, onDisciplineFilter }: any) {
    return (
      <div data-testid="search-filters">
        <input 
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search epreuves"
        />
        <select 
          value={selectedDisciplineId || ''}
          onChange={(e) => onDisciplineFilter(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All disciplines</option>
          {disciplines.map((discipline: Discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.nom}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/epreuve/EpreuvesTable', () => {
  return function MockEpreuvesTable({ epreuves, onRefresh, onDelete, onEdit, loading, error }: any) {
    return (
      <div data-testid="epreuves-table">
        <button onClick={onRefresh}>Refresh</button>
        {epreuves.map((epreuve: Epreuve) => (
          <div key={epreuve.id} data-testid={`epreuve-${epreuve.id}`}>
            {epreuve.libelle} - {epreuve.discipline.nom}
            <button onClick={() => onEdit(epreuve)}>Edit</button>
            <button onClick={() => onDelete(epreuve.id)}>Delete</button>
          </div>
        ))}
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/epreuve/EpreuveModal', () => {
  return function MockEpreuveModal({ isOpen, onClose, onSave, loading, error, epreuve, disciplines }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="epreuve-modal">
        <div>{epreuve ? 'Edit Mode' : 'Create Mode'}</div>
        <button onClick={() => onSave({ libelle: 'Test Epreuve', disciplineId: 1 })}>Save</button>
        <button onClick={onClose}>Close</button>
        {loading && <div>Modal Loading...</div>}
        {error && <div>Modal Error: {error}</div>}
        <div>Disciplines: {disciplines?.length || 0}</div>
      </div>
    );
  };
});

describe('EpreuvesManagement', () => {
  const mockDisciplines: Discipline[] = [
    { id: 1, nom: 'Athlétisme', icone: 'athletics.svg' },
    { id: 2, nom: 'Natation', icone: 'swimming.svg' }
  ];

  const mockEpreuves: Epreuve[] = [
    {
      id: 1,
      libelle: '100m sprint',
      genre: 'hommes',
      tour: 'finale',
      discipline: mockDisciplines[0]
    },
    {
      id: 2,
      libelle: '200m nage libre',
      genre: 'femmes',
      tour: 'demi-finale',
      discipline: mockDisciplines[1]
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock return values
    mockUseEpreuvesManagement.epreuves = mockEpreuves;
    mockUseEpreuvesManagement.disciplines = mockDisciplines;
    mockUseEpreuvesManagement.searchTerm = '';
    mockUseEpreuvesManagement.selectedDisciplineId = null;
    mockUseEpreuvesManagement.loading = false;
    mockUseEpreuvesManagement.error = null;
    mockUseEpreuvesManagement.createLoading = false;
    mockUseEpreuvesManagement.createError = null;
  });

  it('should render all main components', () => {
    render(<EpreuvesManagement />);
    
    expect(screen.getByTestId('epreuves-header')).toBeInTheDocument();
    expect(screen.getByTestId('search-filters')).toBeInTheDocument();
    expect(screen.getByTestId('epreuves-table')).toBeInTheDocument();
  });

  it('should call useSessionExpiry hook', () => {
    const { useSessionExpiry } = require('../../../../src/hooks/useSessionExpiry');
    render(<EpreuvesManagement />);
    
    expect(useSessionExpiry).toHaveBeenCalled();
  });

  describe('Modal Management', () => {
    it('should open modal in create mode when header create bouton est cliquÃ©', () => {
      render(<EpreuvesManagement />);
      
      const createButton = screen.getByText('Create Epreuve');
      fireEvent.click(createButton);
      
      expect(screen.getByTestId('epreuve-modal')).toBeInTheDocument();
      expect(screen.getByText('Create Mode')).toBeInTheDocument();
    });

    it('should open modal in edit mode when table edit bouton est cliquÃ©', () => {
      render(<EpreuvesManagement />);
      
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      expect(screen.getByTestId('epreuve-modal')).toBeInTheDocument();
      expect(screen.getByText('Edit Mode')).toBeInTheDocument();
    });

    it('should close modal when close bouton est cliquÃ©', () => {
      render(<EpreuvesManagement />);
      
      // Open modal first
      const createButton = screen.getByText('Create Epreuve');
      fireEvent.click(createButton);
      
      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      expect(screen.queryByTestId('epreuve-modal')).not.toBeInTheDocument();
    });

    it('should pass disciplines to modal', () => {
      render(<EpreuvesManagement />);
      
      const createButton = screen.getByText('Create Epreuve');
      fireEvent.click(createButton);
      
      expect(screen.getByText('Disciplines: 2')).toBeInTheDocument();
    });
  });

  describe('Epreuve Operations', () => {
    it('should handle epreuve creation avec succÃ¨s', async () => {
      mockUseEpreuvesManagement.createEpreuve.mockResolvedValueOnce({ 
        id: 3, 
        libelle: 'Test Epreuve', 
        discipline: { id: 1, nom: 'Athlétisme' }
      });
      render(<EpreuvesManagement />);
      
      // Open create modal
      const createButton = screen.getByText('Create Epreuve');
      fireEvent.click(createButton);
      
      // Save epreuve
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockUseEpreuvesManagement.createEpreuve).toHaveBeenCalledWith({ 
          libelle: 'Test Epreuve', 
          disciplineId: 1 
        });
      });
      
      // Check success notification
      await waitFor(() => {
        expect(screen.getByTestId('notification')).toBeInTheDocument();
        expect(screen.getByTestId('notification')).toHaveAttribute('data-type', 'success');
        expect(screen.getByText('Épreuve créée avec succès !')).toBeInTheDocument();
      });
    });

    it('should handle epreuve update avec succÃ¨s', async () => {
      mockUseEpreuvesManagement.updateEpreuve.mockResolvedValueOnce({ 
        id: 1, 
        libelle: 'Test Epreuve', 
        discipline: { id: 1, nom: 'Athlétisme' }
      });
      render(<EpreuvesManagement />);
      
      // Open edit modal
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      // Save epreuve
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockUseEpreuvesManagement.updateEpreuve).toHaveBeenCalledWith(
          mockEpreuves[0].id, 
          { libelle: 'Test Epreuve', disciplineId: 1 }
        );
      });
      
      // Check success notification
      await waitFor(() => {
        expect(screen.getByTestId('notification')).toBeInTheDocument();
        expect(screen.getByText('Épreuve modifiée avec succès !')).toBeInTheDocument();
      });
    });

    it('should handle epreuve deletion avec succÃ¨s', async () => {
      mockUseEpreuvesManagement.deleteEpreuve.mockResolvedValueOnce(undefined);
      render(<EpreuvesManagement />);
      
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(mockUseEpreuvesManagement.deleteEpreuve).toHaveBeenCalledWith(mockEpreuves[0].id);
      });
      
      // Check success notification
      await waitFor(() => {
        expect(screen.getByTestId('notification')).toBeInTheDocument();
        expect(screen.getByText('Épreuve supprimée avec succès !')).toBeInTheDocument();
      });
    });

    it('should handle epreuve deletion error', async () => {
      mockUseEpreuvesManagement.deleteEpreuve.mockRejectedValueOnce(new Error('Delete failed'));
      
      render(<EpreuvesManagement />);
      
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByText('Erreur lors de la suppression de l\'épreuve')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('notification')).toHaveAttribute('data-type', 'error');
    });
  });

  describe('Search and Filter Integration', () => {
    it('should handle search input changes', () => {
      render(<EpreuvesManagement />);
      
      const searchInput = screen.getByPlaceholderText('Search epreuves');
      fireEvent.change(searchInput, { target: { value: '100m' } });
      
      expect(mockUseEpreuvesManagement.handleSearch).toHaveBeenCalledWith('100m');
    });

    it('should handle discipline filter changes', () => {
      render(<EpreuvesManagement />);
      
      const disciplineSelect = screen.getByRole('combobox');
      fireEvent.change(disciplineSelect, { target: { value: '1' } });
      
      expect(mockUseEpreuvesManagement.handleDisciplineFilter).toHaveBeenCalledWith(1);
    });

    it('should handle discipline filter reset', () => {
      render(<EpreuvesManagement />);
      
      const disciplineSelect = screen.getByRole('combobox');
      fireEvent.change(disciplineSelect, { target: { value: '' } });
      
      expect(mockUseEpreuvesManagement.handleDisciplineFilter).toHaveBeenCalledWith(null);
    });

    it('should pass search term to components', () => {
      mockUseEpreuvesManagement.searchTerm = '100m';
      
      render(<EpreuvesManagement />);
      
      const searchInput = screen.getByDisplayValue('100m');
      expect(searchInput).toBeInTheDocument();
    });

    it('should pass selected discipline to components', () => {
      mockUseEpreuvesManagement.selectedDisciplineId = 1;
      
      render(<EpreuvesManagement />);
      
      const disciplineSelect = screen.getByRole('combobox');
      expect(disciplineSelect).toHaveValue('1');
    });
  });

  describe('Data Loading', () => {
    it('should handle refresh from table', () => {
      render(<EpreuvesManagement />);
      
      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);
      
      expect(mockUseEpreuvesManagement.loadEpreuves).toHaveBeenCalled();
    });

    it('should display loading state', () => {
      mockUseEpreuvesManagement.loading = true;
      
      render(<EpreuvesManagement />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display error state', () => {
      mockUseEpreuvesManagement.error = 'Test error';
      
      render(<EpreuvesManagement />);
      
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
  });

  describe('Notification Management', () => {
    it('should close notification when close bouton est cliquÃ©', async () => {
      mockUseEpreuvesManagement.createEpreuve.mockResolvedValueOnce({ 
        id: 3, 
        libelle: 'Test Epreuve', 
        discipline: { id: 1, nom: 'Athlétisme' }
      });
      render(<EpreuvesManagement />);
      
      // Trigger notification
      const createButton = screen.getByText('Create Epreuve');
      fireEvent.click(createButton);
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('notification')).toBeInTheDocument();
      });
      
      // Close notification
      const closeNotificationButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeNotificationButton);
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });

    it('should not show notification initially', () => {
      render(<EpreuvesManagement />);
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });
  });

  describe('Modal State Management', () => {
    it('should reset modal state when closing', () => {
      render(<EpreuvesManagement />);
      
      // Open modal in edit mode
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      expect(screen.getByText('Edit Mode')).toBeInTheDocument();
      
      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      // Open modal again - should be in create mode
      const createButton = screen.getByText('Create Epreuve');
      fireEvent.click(createButton);
      
      expect(screen.getByText('Create Mode')).toBeInTheDocument();
    });

    it('should clear create error when closing modal', () => {
      render(<EpreuvesManagement />);
      
      // Open modal
      const createButton = screen.getByText('Create Epreuve');
      fireEvent.click(createButton);
      
      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      expect(mockUseEpreuvesManagement.setCreateError).toHaveBeenCalledWith(null);
    });
  });

  describe('Error Handling', () => {
    it('should handle creation errors gracefully', async () => {
      mockUseEpreuvesManagement.createEpreuve.mockRejectedValueOnce(new Error('Creation failed'));
      
      render(<EpreuvesManagement />);
      
      // Open create modal and try to save
      const createButton = screen.getByText('Create Epreuve');
      fireEvent.click(createButton);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      // Error should be handled by the hook, no notification should appear
      await waitFor(() => {
        expect(mockUseEpreuvesManagement.createEpreuve).toHaveBeenCalled();
      });
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });

    it('should handle update errors gracefully', async () => {
      mockUseEpreuvesManagement.updateEpreuve.mockRejectedValueOnce(new Error('Update failed'));
      
      render(<EpreuvesManagement />);
      
      // Open edit modal and try to save
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      // Error should be handled by the hook, no notification should appear
      await waitFor(() => {
        expect(mockUseEpreuvesManagement.updateEpreuve).toHaveBeenCalled();
      });
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('should have correct layout structure', () => {
      render(<EpreuvesManagement />);
      
      const container = screen.getByTestId('epreuves-header').parentElement;
      expect(container).toHaveClass('min-h-screen');
      expect(container).toHaveClass('bg-base-200');
    });

    it('should have proper main content styling', () => {
      render(<EpreuvesManagement />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'py-8', 'px-4', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Integration with useEpreuvesManagement', () => {
    it('should pass correct props to EpreuvesTable', () => {
      render(<EpreuvesManagement />);
      
      // Verify that table receives the epreuves
      expect(screen.getByText('100m sprint - Athlétisme')).toBeInTheDocument();
      expect(screen.getByText('200m nage libre - Natation')).toBeInTheDocument();
    });

    it('should pass correct props to SearchAndFilters', () => {
      mockUseEpreuvesManagement.searchTerm = 'Test Search';
      mockUseEpreuvesManagement.selectedDisciplineId = 2;
      
      render(<EpreuvesManagement />);
      
      expect(screen.getByDisplayValue('Test Search')).toBeInTheDocument();
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('2');
    });
  });
});
