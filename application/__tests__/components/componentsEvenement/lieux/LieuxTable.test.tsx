import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LieuxTable from '@/components/componentsEvenement/lieux/LieuxTable';
import { Lieu } from '@/types/sportEvenement/lieu';

// Mock des composants
jest.mock('@/components/componentsEvenement/lieux/LieuxTableRow', () => {
  return function MockLieuxTableRow({ lieu, onEdit, onDelete }: any) {
    return (
      <tr data-testid={`lieu-row-${lieu.id}`}>
        <td>{lieu.nom}</td>
        <td>
          <button onClick={() => onEdit(lieu)}>Modifier</button>
          <button onClick={() => onDelete(lieu.id)}>Supprimer</button>
        </td>
      </tr>
    );
  };
});

jest.mock('@/components/spinner', () => {
  return function MockSpinner({ size }: { size?: string }) {
    return <div data-testid="spinner" data-size={size}>Loading...</div>;
  };
});

describe('LieuxTable', () => {
  const mockLieux: Lieu[] = [
    { id: 1, nom: 'Stade de France' },
    { id: 2, nom: 'Roland-Garros' },
    { id: 3, nom: 'Arena Bercy' }
  ];

  const mockOnRefresh = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const defaultProps = {
    lieux: mockLieux,
    loading: false,
    searchTerm: '',
    onRefresh: mockOnRefresh,
    onDelete: mockOnDelete,
    onEdit: mockOnEdit,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render table with lieux data', () => {
    render(<LieuxTable {...defaultProps} />);
    
    expect(screen.getByText('Lieux (3)')).toBeInTheDocument();
    expect(screen.getByTestId('lieu-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('lieu-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('lieu-row-3')).toBeInTheDocument();
  });

  it('should render table headers correctement', () => {
    render(<LieuxTable {...defaultProps} />);
    
    expect(screen.getByText('Nom du Lieu')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should show refresh button', () => {
    render(<LieuxTable {...defaultProps} />);
    
    const refreshButton = screen.getByText('🔄 Actualiser');
    expect(refreshButton).toBeInTheDocument();
  });

  it('should call onRefresh when refresh bouton est cliquÃ©', () => {
    render(<LieuxTable {...defaultProps} />);
    
    const refreshButton = screen.getByText('🔄 Actualiser');
    fireEvent.click(refreshButton);
    
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    render(<LieuxTable {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should disable refresh button when loading', () => {
    render(<LieuxTable {...defaultProps} loading={true} />);
    
    const refreshButton = screen.getByText('🔄 Actualiser');
    expect(refreshButton).toBeDisabled();
  });

  it("", () => {
    const errorMessage = 'Erreur lors du chargement des lieux';
    render(<LieuxTable {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass('text-sm', 'text-red-600', 'bg-red-50');
  });

  it('should show empty state when no lieux and not loading', () => {
    render(<LieuxTable {...defaultProps} lieux={[]} />);
    
    expect(screen.getByText('Aucun lieu')).toBeInTheDocument();
    expect(screen.getByText('Commencez par créer votre premier lieu')).toBeInTheDocument();
  });

  it('should show no search results when search term exists but no lieux', () => {
    render(<LieuxTable {...defaultProps} lieux={[]} searchTerm="inexistant" />);
    
    expect(screen.getByText('Aucun lieu trouvé')).toBeInTheDocument();
    expect(screen.getByText(/inexistant/)).toBeInTheDocument();
  });

  it('should show loading message when loading with empty lieux', () => {
    render(<LieuxTable {...defaultProps} lieux={[]} loading={true} />);
    
    expect(screen.getByText('Chargement des lieux...')).toBeInTheDocument();
    const spinners = screen.getAllByTestId('spinner');
    expect(spinners.find(spinner => spinner.getAttribute('data-size') === 'medium')).toBeInTheDocument();
  });

  it('should handle edit action from row', () => {
    render(<LieuxTable {...defaultProps} />);
    
    const editButton = screen.getAllByText('Modifier')[0];
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockLieux[0]);
  });

  it('should handle delete action from row', () => {
    render(<LieuxTable {...defaultProps} />);
    
    const deleteButton = screen.getAllByText('Supprimer')[0];
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockLieux[0].id);
  });

  it('should display correct count in header', () => {
    render(<LieuxTable {...defaultProps} />);
    expect(screen.getByText('Lieux (3)')).toBeInTheDocument();

    render(<LieuxTable {...defaultProps} lieux={[]} />);
    expect(screen.getByText('Lieux (0)')).toBeInTheDocument();

    render(<LieuxTable {...defaultProps} lieux={[mockLieux[0]]} />);
    expect(screen.getByText('Lieux (1)')).toBeInTheDocument();
  });

  it('should have correct table structure', () => {
    render(<LieuxTable {...defaultProps} />);
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('min-w-full', 'divide-y', 'divide-gray-200');
  });

  it('should have proper styling classes', () => {
    render(<LieuxTable {...defaultProps} />);
    
    const container = screen.getByText('Lieux (3)').closest('div')?.parentElement?.parentElement;
    expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden');
  });

  it('should render with single lieu', () => {
    const singleLieu = [mockLieux[0]];
    render(<LieuxTable {...defaultProps} lieux={singleLieu} />);
    
    expect(screen.getByText('Lieux (1)')).toBeInTheDocument();
    expect(screen.getByTestId('lieu-row-1')).toBeInTheDocument();
    expect(screen.queryByTestId('lieu-row-2')).not.toBeInTheDocument();
  });

  it('should handle table with many lieux', () => {
    const manyLieux: Lieu[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      nom: `Lieu ${i + 1}`
    }));

    render(<LieuxTable {...defaultProps} lieux={manyLieux} />);
    
    expect(screen.getByText('Lieux (10)')).toBeInTheDocument();
    manyLieux.forEach(lieu => {
      expect(screen.getByTestId(`lieu-row-${lieu.id}`)).toBeInTheDocument();
    });
  });

  it('should maintain responsive design', () => {
    render(<LieuxTable {...defaultProps} />);
    
    const tableContainer = screen.getByRole('table').parentElement;
    expect(tableContainer).toHaveClass('overflow-x-auto');
  });

  it('should show proper header styling', () => {
    render(<LieuxTable {...defaultProps} />);
    
    const headerRow = screen.getByText('Nom du Lieu').closest('tr');
    expect(headerRow?.parentElement).toHaveClass('bg-gray-50');
  });

  it('should handle error without lieux', () => {
    render(<LieuxTable {...defaultProps} lieux={[]} error="Network error" />);
    
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByText('Aucun lieu')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<LieuxTable {...defaultProps} />);
    
    const table = screen.getByRole('table');
    const refreshButton = screen.getByRole('button', { name: '🔄 Actualiser' });
    
    expect(table).toBeInTheDocument();
    expect(refreshButton).toBeInTheDocument();
  });
});
