import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LieuxTableRow from '@/components/componentsEvenement/lieux/LieuxTableRow';
import { Lieu } from '@/types/sportEvenement/lieu';

describe('LieuxTableRow', () => {
  const mockLieu: Lieu = {
    id: 1,
    nom: 'Stade de France'
  };

  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const defaultProps = {
    lieu: mockLieu,
    onDelete: mockOnDelete,
    onEdit: mockOnEdit
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

  it('should render lieu name correctly', () => {
    renderWithTable(
      <table>
        <tbody>
          <LieuxTableRow {...defaultProps} />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('Stade de France')).toBeInTheDocument();
  });

  it('should render edit button', () => {
    renderWithTable(
      <table>
        <tbody>
          <LieuxTableRow {...defaultProps} />
        </tbody>
      </table>
    );
    
    const editButton = screen.getByText('Modifier');
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass('text-blue-600', 'hover:text-blue-900');
  });

  it('should render delete button', () => {
    renderWithTable(<LieuxTableRow {...defaultProps} />);
    
    const deleteButton = screen.getByText('Supprimer');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass('text-red-600', 'hover:text-red-900');
  });

  it('should call onEdit with lieu when edit button is clicked', () => {
    renderWithTable(<LieuxTableRow {...defaultProps} />);
    
    const editButton = screen.getByText('Modifier');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockLieu);
  });

  it('should call onDelete with lieu id when delete button is clicked', () => {
    renderWithTable(<LieuxTableRow {...defaultProps} />);
    
    const deleteButton = screen.getByText('Supprimer');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockLieu.id);
  });

  it('should render with different lieu data', () => {
    const differentLieu: Lieu = {
      id: 42,
      nom: 'Roland-Garros'
    };

    renderWithTable(
      <LieuxTableRow 
        {...defaultProps} 
        lieu={differentLieu}
      />
    );
    
    expect(screen.getByText('Roland-Garros')).toBeInTheDocument();
    
    const editButton = screen.getByText('Modifier');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(differentLieu);
  });

  it('should handle lieu with special characters in name', () => {
    const specialLieu: Lieu = {
      id: 3,
      nom: 'Palais des Sports - Léo Lagrange'
    };

    renderWithTable(
      <LieuxTableRow 
        {...defaultProps} 
        lieu={specialLieu}
      />
    );
    
    expect(screen.getByText('Palais des Sports - Léo Lagrange')).toBeInTheDocument();
  });

  it('should handle lieu with very long name', () => {
    const longNameLieu: Lieu = {
      id: 4,
      nom: 'Centre Nautique Olympique de Paris La Défense Arena Nanterre Hauts-de-Seine'
    };

    renderWithTable(
      <LieuxTableRow 
        {...defaultProps} 
        lieu={longNameLieu}
      />
    );
    
    expect(screen.getByText('Centre Nautique Olympique de Paris La Défense Arena Nanterre Hauts-de-Seine')).toBeInTheDocument();
  });

  it('should have correct table row structure', () => {
    renderWithTable(
      <table>
        <tbody>
          <LieuxTableRow {...defaultProps} />
        </tbody>
      </table>
    );
    
    const row = screen.getByRole('row');
    expect(row).toBeInTheDocument();
    expect(row).toHaveClass('hover:bg-gray-50');
  });

  it('should have correct cell structure', () => {
    renderWithTable(
      <table>
        <tbody>
          <LieuxTableRow {...defaultProps} />
        </tbody>
      </table>
    );
    
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(2);
    
    // First cell (name)
    expect(cells[0]).toHaveClass('px-6', 'py-4', 'whitespace-nowrap');
    
    // Second cell (actions)
    expect(cells[1]).toHaveClass('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium');
  });

  it('should handle multiple clicks on buttons', () => {
    renderWithTable(<LieuxTableRow {...defaultProps} />);
    
    const editButton = screen.getByText('Modifier');
    const deleteButton = screen.getByText('Supprimer');
    
    fireEvent.click(editButton);
    fireEvent.click(editButton);
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(2);
    expect(mockOnDelete).toHaveBeenCalledTimes(2);
  });

  it('should maintain button spacing', () => {
    renderWithTable(<LieuxTableRow {...defaultProps} />);
    
    const editButton = screen.getByText('Modifier');
    expect(editButton).toHaveClass('mr-3');
  });

  it('should handle lieu with minimum data', () => {
    const minimalLieu: Lieu = {
      id: 0,
      nom: ''
    };

    renderWithTable(
      <LieuxTableRow 
        {...defaultProps} 
        lieu={minimalLieu}
      />
    );
    
    // Should render even with empty name - find the first cell (name cell)
    const cells = screen.getAllByRole('cell');
    const nameCell = cells[0]; // First cell is the name cell
    const nameDiv = nameCell.querySelector('div');
    expect(nameDiv).toHaveClass('text-sm', 'font-medium', 'text-gray-900');
    expect(nameDiv).toHaveTextContent('');
  });

  it('should have proper text styling for lieu name', () => {
    renderWithTable(<LieuxTableRow {...defaultProps} />);
    
    const lieuName = screen.getByText('Stade de France');
    expect(lieuName).toHaveClass('text-sm', 'font-medium', 'text-gray-900');
  });

  it('should be accessible', () => {
    renderWithTable(
      <table>
        <tbody>
          <LieuxTableRow {...defaultProps} />
        </tbody>
      </table>
    );
    
    const editButton = screen.getByRole('button', { name: 'Modifier' });
    const deleteButton = screen.getByRole('button', { name: 'Supprimer' });
    
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });
});
