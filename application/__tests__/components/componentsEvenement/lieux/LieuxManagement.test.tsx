import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LieuxManagement from '../../../../src/components/componentsEvenement/lieux/LieuxManagement';
import { Lieu } from '../../../../src/types/sportEvenement/lieu';

// Mock des hooks
const mockUseLieuxManagement = {
  lieux: [] as Lieu[],
  loading: false,
  error: null as string | null,
  searchTerm: '',
  createLoading: false,
  createError: null as string | null,
  loadLieux: jest.fn(),
  createLieu: jest.fn(),
  updateLieu: jest.fn(),
  deleteLieu: jest.fn(),
  handleSearch: jest.fn(),
  setCreateError: jest.fn()
};

jest.mock('../../../../src/hooks/useLieuxManagement', () => ({
  useLieuxManagement: () => mockUseLieuxManagement
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

jest.mock('../../../../src/components/componentsEvenement/lieux/LieuxHeader', () => {
  return function MockLieuxHeader({ onCreateClick }: any) {
    return (
      <div data-testid="lieux-header">
        <button onClick={onCreateClick}>Create Lieu</button>
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/lieux/SearchAndFilters', () => {
  return function MockSearchAndFilters({ searchTerm, onSearch }: any) {
    return (
      <div data-testid="search-filters">
        <input 
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search lieux"
        />
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/lieux/LieuxTable', () => {
  return function MockLieuxTable({ lieux, onRefresh, onDelete, onEdit, loading, error }: any) {
    return (
      <div data-testid="lieux-table">
        <button onClick={onRefresh}>Refresh</button>
        {lieux.map((lieu: Lieu) => (
          <div key={lieu.id} data-testid={`lieu-${lieu.id}`}>
            {lieu.nom}
            <button onClick={() => onEdit(lieu)}>Edit</button>
            <button onClick={() => onDelete(lieu.id)}>Delete</button>
          </div>
        ))}
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
      </div>
    );
  };
});

jest.mock('../../../../src/components/componentsEvenement/lieux/LieuModal', () => {
  return function MockLieuModal({ isOpen, onClose, onSave, loading, error, lieu }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="lieu-modal">
        <div>{lieu ? 'Edit Mode' : 'Create Mode'}</div>
        <button onClick={() => onSave({ nom: 'Test Lieu' })}>Save</button>
        <button onClick={onClose}>Close</button>
        {loading && <div>Modal Loading...</div>}
        {error && <div>Modal Error: {error}</div>}
      </div>
    );
  };
});

describe('LieuxManagement', () => {
  const mockLieux: Lieu[] = [
    { id: 1, nom: 'Stade de France' },
    { id: 2, nom: 'Roland-Garros' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock return values
    mockUseLieuxManagement.lieux = mockLieux;
    mockUseLieuxManagement.searchTerm = '';
    mockUseLieuxManagement.loading = false;
    mockUseLieuxManagement.error = null;
    mockUseLieuxManagement.createLoading = false;
    mockUseLieuxManagement.createError = null;
  });

  it('should render all main components', () => {
    render(<LieuxManagement />);
    
    expect(screen.getByTestId('lieux-header')).toBeInTheDocument();
    expect(screen.getByTestId('search-filters')).toBeInTheDocument();
    expect(screen.getByTestId('lieux-table')).toBeInTheDocument();
  });

  it('should call useSessionExpiry hook', () => {
    const { useSessionExpiry } = require('../../../../src/hooks/useSessionExpiry');
    render(<LieuxManagement />);
    
    expect(useSessionExpiry).toHaveBeenCalled();
  });

  describe('Modal Management', () => {
    it('should open modal in create mode when header create bouton est cliquÃ©', () => {
      render(<LieuxManagement />);
      
      const createButton = screen.getByText('Create Lieu');
      fireEvent.click(createButton);
      
      expect(screen.getByTestId('lieu-modal')).toBeInTheDocument();
      expect(screen.getByText('Create Mode')).toBeInTheDocument();
    });

    it('should open modal in edit mode when table edit bouton est cliquÃ©', () => {
      render(<LieuxManagement />);
      
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      expect(screen.getByTestId('lieu-modal')).toBeInTheDocument();
      expect(screen.getByText('Edit Mode')).toBeInTheDocument();
    });

    it('should close modal when close bouton est cliquÃ©', () => {
      render(<LieuxManagement />);
      
      // Open modal first
      const createButton = screen.getByText('Create Lieu');
      fireEvent.click(createButton);
      
      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      expect(screen.queryByTestId('lieu-modal')).not.toBeInTheDocument();
    });
  });

  describe('Lieu Operations', () => {
    it('should handle lieu creation avec succÃ¨s', async () => {
      mockUseLieuxManagement.createLieu.mockResolvedValueOnce({ id: 3, nom: 'Test Lieu' });
      render(<LieuxManagement />);
      
      // Open create modal
      const createButton = screen.getByText('Create Lieu');
      fireEvent.click(createButton);
      
      // Save lieu
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockUseLieuxManagement.createLieu).toHaveBeenCalledWith({ nom: 'Test Lieu' });
      });
      
      // Check success notification
      await waitFor(() => {
        expect(screen.getByTestId('notification')).toBeInTheDocument();
        expect(screen.getByTestId('notification')).toHaveAttribute('data-type', 'success');
        expect(screen.getByText('Lieu créé avec succès !')).toBeInTheDocument();
      });
    });

    it('should handle lieu update avec succÃ¨s', async () => {
      mockUseLieuxManagement.updateLieu.mockResolvedValueOnce({ id: 1, nom: 'Test Lieu' });
      render(<LieuxManagement />);
      
      // Open edit modal
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      // Save lieu
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockUseLieuxManagement.updateLieu).toHaveBeenCalledWith(mockLieux[0].id, { nom: 'Test Lieu' });
      });
      
      // Check success notification
      await waitFor(() => {
        expect(screen.getByTestId('notification')).toBeInTheDocument();
        expect(screen.getByText('Lieu modifié avec succès !')).toBeInTheDocument();
      });
    });

    it('should handle lieu deletion avec succÃ¨s', async () => {
      mockUseLieuxManagement.deleteLieu.mockResolvedValueOnce(undefined);
      render(<LieuxManagement />);
      
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(mockUseLieuxManagement.deleteLieu).toHaveBeenCalledWith(mockLieux[0].id);
      });
      
      // Check success notification
      await waitFor(() => {
        expect(screen.getByTestId('notification')).toBeInTheDocument();
        expect(screen.getByText('Lieu supprimé avec succès !')).toBeInTheDocument();
      });
    });

    it('should handle lieu deletion error', async () => {
      mockUseLieuxManagement.deleteLieu.mockRejectedValueOnce(new Error('Delete failed'));
      
      render(<LieuxManagement />);
      
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByText('Erreur lors de la suppression du lieu')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('notification')).toHaveAttribute('data-type', 'error');
    });
  });

  describe('Search Integration', () => {
    it('should handle search input changes', () => {
      render(<LieuxManagement />);
      
      const searchInput = screen.getByPlaceholderText('Search lieux');
      fireEvent.change(searchInput, { target: { value: 'Stade' } });
      
      expect(mockUseLieuxManagement.handleSearch).toHaveBeenCalledWith('Stade');
    });

    it('should pass search term to components', () => {
      mockUseLieuxManagement.searchTerm = 'Roland';
      
      render(<LieuxManagement />);
      
      const searchInput = screen.getByDisplayValue('Roland');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should handle refresh from table', () => {
      render(<LieuxManagement />);
      
      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);
      
      expect(mockUseLieuxManagement.loadLieux).toHaveBeenCalled();
    });

    it('should display loading state', () => {
      mockUseLieuxManagement.loading = true;
      
      render(<LieuxManagement />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display error state', () => {
      mockUseLieuxManagement.error = 'Test error';
      
      render(<LieuxManagement />);
      
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
  });

  describe('Notification Management', () => {
    it('should close notification when close bouton est cliquÃ©', async () => {
      mockUseLieuxManagement.createLieu.mockResolvedValueOnce({ id: 3, nom: 'Test Lieu' });
      render(<LieuxManagement />);
      
      // Trigger notification
      const createButton = screen.getByText('Create Lieu');
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
      render(<LieuxManagement />);
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });
  });

  describe('Modal State Management', () => {
    it('should reset modal state when closing', () => {
      render(<LieuxManagement />);
      
      // Open modal in edit mode
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      expect(screen.getByText('Edit Mode')).toBeInTheDocument();
      
      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      // Open modal again - should be in create mode
      const createButton = screen.getByText('Create Lieu');
      fireEvent.click(createButton);
      
      expect(screen.getByText('Create Mode')).toBeInTheDocument();
    });

    it('should clear create error when closing modal', () => {
      render(<LieuxManagement />);
      
      // Open modal
      const createButton = screen.getByText('Create Lieu');
      fireEvent.click(createButton);
      
      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      expect(mockUseLieuxManagement.setCreateError).toHaveBeenCalledWith(null);
    });
  });

  describe('Error Handling', () => {
    it('should handle creation errors gracefully', async () => {
      mockUseLieuxManagement.createLieu.mockRejectedValueOnce(new Error('Creation failed'));
      
      render(<LieuxManagement />);
      
      // Open create modal and try to save
      const createButton = screen.getByText('Create Lieu');
      fireEvent.click(createButton);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      // Error should be handled by the hook, no notification should appear
      await waitFor(() => {
        expect(mockUseLieuxManagement.createLieu).toHaveBeenCalled();
      });
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });

    it('should handle update errors gracefully', async () => {
      mockUseLieuxManagement.updateLieu.mockRejectedValueOnce(new Error('Update failed'));
      
      render(<LieuxManagement />);
      
      // Open edit modal and try to save
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      // Error should be handled by the hook, no notification should appear
      await waitFor(() => {
        expect(mockUseLieuxManagement.updateLieu).toHaveBeenCalled();
      });
      
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('should have correct layout structure', () => {
      render(<LieuxManagement />);
      
      const container = screen.getByTestId('lieux-header').parentElement;
      expect(container).toHaveClass('min-h-screen');
      expect(container).toHaveClass('bg-base-200');
    });

    it('should have proper main content styling', () => {
      render(<LieuxManagement />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'py-8', 'px-4', 'sm:px-6', 'lg:px-8');
    });
  });
});
