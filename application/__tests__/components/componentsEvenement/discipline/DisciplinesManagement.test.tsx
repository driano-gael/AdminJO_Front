import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisciplinesManagement from '../../../../src/components/componentsEvenement/discipline/DisciplinesManagement';
import { Discipline } from '../../../../src/types/sportEvenement/discipline';

// Mock des hooks
const mockUseDisciplinesManagement = {
  disciplines: [] as Discipline[],
  loading: false,
  error: null as string | null,
  searchTerm: '',
  createLoading: false,
  createError: null as string | null,
  loadDisciplines: jest.fn(),
  createDiscipline: jest.fn(),
  updateDiscipline: jest.fn(),
  deleteDiscipline: jest.fn(),
  handleSearch: jest.fn(),
  setCreateError: jest.fn()
};

jest.mock('../../../../src/hooks/useDisciplinesManagement', () => ({
  useDisciplinesManagement: () => mockUseDisciplinesManagement
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

jest.mock('../../../../src/components/componentsEvenement/discipline/DisciplinesHeader', () => {
  return function MockDisciplinesHeader({ onCreateClick }: any) {
    return (
      <div data-testid="disciplines-header">
        <button onClick={onCreateClick}>Create Discipline</button>
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/discipline/SearchAndFilters', () => {
  return function MockSearchAndFilters({ searchTerm, onSearch }: any) {
    return (
      <div data-testid="search-filters">
        <input 
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search disciplines"
        />
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/discipline/DisciplinesTable', () => {
  return function MockDisciplinesTable({ disciplines, onRefresh, onDelete, onEdit, loading, error }: any) {
    return (
      <div data-testid="disciplines-table">
        <button onClick={onRefresh}>Refresh</button>
        {disciplines.map((discipline: Discipline) => (
          <div key={discipline.id} data-testid={`discipline-${discipline.id}`}>
            {discipline.nom}
            <button onClick={() => onEdit(discipline)}>Edit</button>
            <button onClick={() => onDelete(discipline.id)}>Delete</button>
          </div>
        ))}
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/discipline/DisciplineModal', () => {
  return function MockDisciplineModal({ isOpen, onClose, onSave, loading, error, discipline }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="discipline-modal">
        <div>{discipline ? 'Edit Mode' : 'Create Mode'}</div>
        <button onClick={() => onSave({ nom: 'Test Discipline' })}>Save</button>
        <button onClick={onClose}>Close</button>
        {loading && <div>Modal Loading...</div>}
        {error && <div>Modal Error: {error}</div>}
      </div>
    );
  };
});

describe('DisciplinesManagement', () => {
  const mockDisciplines: Discipline[] = [
    { id: 1, nom: 'Football', icone: 'football.svg' },
    { id: 2, nom: 'Basketball', icone: 'basketball.svg' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock return values
    mockUseDisciplinesManagement.disciplines = mockDisciplines;
    mockUseDisciplinesManagement.searchTerm = '';
    mockUseDisciplinesManagement.loading = false;
    mockUseDisciplinesManagement.error = null;
    mockUseDisciplinesManagement.createLoading = false;
    mockUseDisciplinesManagement.createError = null;
  });

  it('should render all main components', () => {
    render(<DisciplinesManagement />);
    
    expect(screen.getByTestId('disciplines-header')).toBeInTheDocument();
    expect(screen.getByTestId('search-filters')).toBeInTheDocument();
    expect(screen.getByTestId('disciplines-table')).toBeInTheDocument();
  });

  it('should call useSessionExpiry hook', () => {
    const { useSessionExpiry } = require('../../../../src/hooks/useSessionExpiry');
    render(<DisciplinesManagement />);
    
    expect(useSessionExpiry).toHaveBeenCalled();
  });

  describe('Modal Management', () => {
    it('should open modal in create mode when header create bouton est cliquÃ©', () => {
      render(<DisciplinesManagement />);
      
      const createButton = screen.getByText('Create Discipline');
      fireEvent.click(createButton);
      
      expect(screen.getByTestId('discipline-modal')).toBeInTheDocument();
      expect(screen.getByText('Create Mode')).toBeInTheDocument();
    });

    it('should open modal in edit mode when table edit bouton est cliquÃ©', () => {
      render(<DisciplinesManagement />);
      
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      expect(screen.getByTestId('discipline-modal')).toBeInTheDocument();
      expect(screen.getByText('Edit Mode')).toBeInTheDocument();
    });

    it('should close modal when close bouton est cliquÃ©', () => {
      render(<DisciplinesManagement />);
      
      // Open modal first
      const createButton = screen.getByText('Create Discipline');
      fireEvent.click(createButton);
      
      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      expect(screen.queryByTestId('discipline-modal')).not.toBeInTheDocument();
    });
  });

  describe('Discipline Operations', () => {
    it('should handle discipline creation avec succÃ¨s', async () => {
      mockUseDisciplinesManagement.createDiscipline.mockResolvedValueOnce({ id: 3, nom: 'Test Discipline' });
      render(<DisciplinesManagement />);
      
      // Open create modal
      const createButton = screen.getByText('Create Discipline');
      fireEvent.click(createButton);
      
      // Save discipline
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockUseDisciplinesManagement.createDiscipline).toHaveBeenCalledWith({ nom: 'Test Discipline' });
      });
      
      // Check success notification
      await waitFor(() => {
        expect(screen.getByTestId('notification')).toBeInTheDocument();
        expect(screen.getByTestId('notification')).toHaveAttribute('data-type', 'success');
        expect(screen.getByText('Discipline créée avec succès !')).toBeInTheDocument();
      });
    });

    it('should handle discipline update avec succÃ¨s', async () => {
      mockUseDisciplinesManagement.updateDiscipline.mockResolvedValueOnce({ id: 1, nom: 'Test Discipline' });
      render(<DisciplinesManagement />);
      
      // Open edit modal
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      // Save discipline
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockUseDisciplinesManagement.updateDiscipline).toHaveBeenCalledWith(mockDisciplines[0].id, { nom: 'Test Discipline' });
      });
      
      // Check success notification
      await waitFor(() => {
        expect(screen.getByTestId('notification')).toBeInTheDocument();
        expect(screen.getByText('Discipline modifiée avec succès !')).toBeInTheDocument();
      });
    });

    it('should handle discipline deletion avec succÃ¨s', async () => {
      mockUseDisciplinesManagement.deleteDiscipline.mockResolvedValueOnce(undefined);
      render(<DisciplinesManagement />);
      
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(mockUseDisciplinesManagement.deleteDiscipline).toHaveBeenCalledWith(mockDisciplines[0].id);
      });
      
      // Check success notification
      await waitFor(() => {
        expect(screen.getByTestId('notification')).toBeInTheDocument();
        expect(screen.getByText('Discipline supprimée avec succès !')).toBeInTheDocument();
      });
    });

    it('should handle discipline deletion error', async () => {
      mockUseDisciplinesManagement.deleteDiscipline.mockRejectedValueOnce(new Error('Delete failed'));
      
      render(<DisciplinesManagement />);
      
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByText('Erreur lors de la suppression de la discipline')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('notification')).toHaveAttribute('data-type', 'error');
    });
  });

  describe('Search Integration', () => {
    it('should handle search input changes', () => {
      render(<DisciplinesManagement />);
      
      const searchInput = screen.getByPlaceholderText('Search disciplines');
      fireEvent.change(searchInput, { target: { value: 'Football' } });
      
      expect(mockUseDisciplinesManagement.handleSearch).toHaveBeenCalledWith('Football');
    });

    it('should pass search term to components', () => {
      mockUseDisciplinesManagement.searchTerm = 'Basketball';
      
      render(<DisciplinesManagement />);
      
      const searchInput = screen.getByDisplayValue('Basketball');
      expect(searchInput).toBeInTheDocument();
    });

    it('should refresh with search term when search term exists', () => {
      mockUseDisciplinesManagement.searchTerm = 'Football';
      
      render(<DisciplinesManagement />);
      
      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);
      
      expect(mockUseDisciplinesManagement.loadDisciplines).toHaveBeenCalledWith('Football');
    });

    it('should refresh without search term when no search term', () => {
      mockUseDisciplinesManagement.searchTerm = '';
      
      render(<DisciplinesManagement />);
      
      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);
      
      expect(mockUseDisciplinesManagement.loadDisciplines).toHaveBeenCalledWith();
    });

    it('should refresh without search term when search term is only whitespace', () => {
      mockUseDisciplinesManagement.searchTerm = '   ';
      
      render(<DisciplinesManagement />);
      
      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);
      
      expect(mockUseDisciplinesManagement.loadDisciplines).toHaveBeenCalledWith();
    });
  });

  describe('Data Loading', () => {
    it('should handle refresh from table', () => {
      render(<DisciplinesManagement />);
      
      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);
      
      expect(mockUseDisciplinesManagement.loadDisciplines).toHaveBeenCalled();
    });

    it('should display loading state', () => {
      mockUseDisciplinesManagement.loading = true;
      
      render(<DisciplinesManagement />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display error state', () => {
      mockUseDisciplinesManagement.error = 'Test error';
      
      render(<DisciplinesManagement />);
      
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
  });

  describe('Notification Management', () => {
    it('should close notification when close bouton est cliquÃ©', async () => {
      mockUseDisciplinesManagement.createDiscipline.mockResolvedValueOnce({ id: 3, nom: 'Test Discipline' });
      render(<DisciplinesManagement />);
      
      // Trigger notification
      const createButton = screen.getByText('Create Discipline');
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
      render(<DisciplinesManagement />);
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });
  });

  describe('Modal State Management', () => {
    it('should reset modal state when closing', () => {
      render(<DisciplinesManagement />);
      
      // Open modal in edit mode
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      expect(screen.getByText('Edit Mode')).toBeInTheDocument();
      
      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      // Open modal again - should be in create mode
      const createButton = screen.getByText('Create Discipline');
      fireEvent.click(createButton);
      
      expect(screen.getByText('Create Mode')).toBeInTheDocument();
    });

    it('should clear create error when closing modal', () => {
      render(<DisciplinesManagement />);
      
      // Open modal
      const createButton = screen.getByText('Create Discipline');
      fireEvent.click(createButton);
      
      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      expect(mockUseDisciplinesManagement.setCreateError).toHaveBeenCalledWith(null);
    });
  });

  describe('Error Handling', () => {
    it('should handle creation errors gracefully', async () => {
      mockUseDisciplinesManagement.createDiscipline.mockRejectedValueOnce(new Error('Creation failed'));
      
      render(<DisciplinesManagement />);
      
      // Open create modal and try to save
      const createButton = screen.getByText('Create Discipline');
      fireEvent.click(createButton);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      // Error should be handled by the hook, no notification should appear
      await waitFor(() => {
        expect(mockUseDisciplinesManagement.createDiscipline).toHaveBeenCalled();
      });
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });

    it('should handle update errors gracefully', async () => {
      mockUseDisciplinesManagement.updateDiscipline.mockRejectedValueOnce(new Error('Update failed'));
      
      render(<DisciplinesManagement />);
      
      // Open edit modal and try to save
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      // Error should be handled by the hook, no notification should appear
      await waitFor(() => {
        expect(mockUseDisciplinesManagement.updateDiscipline).toHaveBeenCalled();
      });
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('should have correct layout structure', () => {
      render(<DisciplinesManagement />);
      
      const container = screen.getByTestId('disciplines-header').parentElement;
      expect(container).toHaveClass('min-h-screen');
      expect(container).toHaveClass('bg-base-200');
    });

    it('should have proper main content styling', () => {
      render(<DisciplinesManagement />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'py-8', 'px-4', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Props Passing', () => {
    it('should pass correct props to DisciplinesTable', () => {
      mockUseDisciplinesManagement.disciplines = mockDisciplines;
      mockUseDisciplinesManagement.loading = true;
      mockUseDisciplinesManagement.error = 'Test error';
      mockUseDisciplinesManagement.searchTerm = 'Football';
      
      render(<DisciplinesManagement />);
      
      // Check that disciplines are displayed
      expect(screen.getByText('Football')).toBeInTheDocument();
      expect(screen.getByText('Basketball')).toBeInTheDocument();
      
      // Check loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      // Check error state
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });

    it('should pass correct props to DisciplineModal', () => {
      mockUseDisciplinesManagement.createLoading = true;
      mockUseDisciplinesManagement.createError = 'Modal error';
      
      render(<DisciplinesManagement />);
      
      // Open modal
      const createButton = screen.getByText('Create Discipline');
      fireEvent.click(createButton);
      
      // Check modal props
      expect(screen.getByText('Modal Loading...')).toBeInTheDocument();
      expect(screen.getByText('Modal Error: Modal error')).toBeInTheDocument();
    });

    it('should pass correct props to SearchAndFilters', () => {
      mockUseDisciplinesManagement.searchTerm = 'Test Search';
      
      render(<DisciplinesManagement />);
      
      const searchInput = screen.getByDisplayValue('Test Search');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should handle complex workflow: search, edit, and delete', async () => {
      mockUseDisciplinesManagement.updateDiscipline.mockResolvedValueOnce({ id: 1, nom: 'Updated Discipline' });
      mockUseDisciplinesManagement.deleteDiscipline.mockResolvedValueOnce(undefined);
      
      render(<DisciplinesManagement />);
      
      // Search
      const searchInput = screen.getByPlaceholderText('Search disciplines');
      fireEvent.change(searchInput, { target: { value: 'Football' } });
      expect(mockUseDisciplinesManagement.handleSearch).toHaveBeenCalledWith('Football');
      
      // Edit
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockUseDisciplinesManagement.updateDiscipline).toHaveBeenCalled();
      });
      
      // Close notification
      const closeNotificationButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeNotificationButton);
      
      // Delete
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(mockUseDisciplinesManagement.deleteDiscipline).toHaveBeenCalled();
      });
    });

    it('should handle multiple modal opens and closes', () => {
      render(<DisciplinesManagement />);
      
      // Open create modal
      const createButton = screen.getByText('Create Discipline');
      fireEvent.click(createButton);
      expect(screen.getByText('Create Mode')).toBeInTheDocument();
      
      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      expect(screen.queryByTestId('discipline-modal')).not.toBeInTheDocument();
      
      // Open edit modal
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      expect(screen.getByText('Edit Mode')).toBeInTheDocument();
      
      // Close modal again
      const closeButton2 = screen.getByText('Close');
      fireEvent.click(closeButton2);
      expect(screen.queryByTestId('discipline-modal')).not.toBeInTheDocument();
    });
  });
});
