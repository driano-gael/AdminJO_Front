import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisciplinesHeader from '../../../../src/components/componentsEvenement/discipline/DisciplinesHeader';

// Mock du composant BackToEventsButton
jest.mock('../../../../src/components/componentsEvenement/shared/BackToEventsButton', () => {
  return function MockBackToEventsButton() {
    return <button data-testid="back-to-events">Retour aux événements</button>;
  };
});

describe('DisciplinesHeader', () => {
  const mockOnCreateClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render header with correct title', () => {
    render(<DisciplinesHeader onCreateClick={mockOnCreateClick} />);
    
    expect(screen.getByText('🏃 Gestion des Disciplines')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('🏃 Gestion des Disciplines');
  });

  it('should render bouton de crÃ©ation with correct text', () => {
    render(<DisciplinesHeader onCreateClick={mockOnCreateClick} />);
    
    const createButton = screen.getByText('+ Nouvelle Discipline');
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  });

  it('should render back to events button', () => {
    render(<DisciplinesHeader onCreateClick={mockOnCreateClick} />);
    
    expect(screen.getByTestId('back-to-events')).toBeInTheDocument();
  });

  it('should call onCreateClick when create bouton est cliquÃ©', () => {
    render(<DisciplinesHeader onCreateClick={mockOnCreateClick} />);
    
    const createButton = screen.getByText('+ Nouvelle Discipline');
    fireEvent.click(createButton);
    
    expect(mockOnCreateClick).toHaveBeenCalledTimes(1);
  });

  it('should have correct header structure and styling', () => {
    render(<DisciplinesHeader onCreateClick={mockOnCreateClick} />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'shadow-md');
    
    const container = header.querySelector('div');
    expect(container).toHaveClass('flex', 'justify-between', 'items-center', 'py-6', 'px-6');
  });

  it('should have proper button styling', () => {
    render(<DisciplinesHeader onCreateClick={mockOnCreateClick} />);
    
    const createButton = screen.getByText('+ Nouvelle Discipline');
    expect(createButton).toHaveClass(
      'bg-blue-600',
      'hover:bg-blue-700',
      'text-white',
      'px-4',
      'py-2',
      'rounded-md',
      'text-sm',
      'font-medium',
      'transition-colors'
    );
  });

  it('should handle multiple clicks correctement', () => {
    render(<DisciplinesHeader onCreateClick={mockOnCreateClick} />);
    
    const createButton = screen.getByText('+ Nouvelle Discipline');
    
    fireEvent.click(createButton);
    fireEvent.click(createButton);
    fireEvent.click(createButton);
    
    expect(mockOnCreateClick).toHaveBeenCalledTimes(3);
  });

  it('should be accessible', () => {
    render(<DisciplinesHeader onCreateClick={mockOnCreateClick} />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    
    const button = screen.getByRole('button', { name: '+ Nouvelle Discipline' });
    expect(button).toBeInTheDocument();
  });

  it('should maintain consistent layout', () => {
    render(<DisciplinesHeader onCreateClick={mockOnCreateClick} />);
    
    // Vérifier que tous les éléments principaux sont présents
    expect(screen.getByTestId('back-to-events')).toBeInTheDocument();
    expect(screen.getByText('🏃 Gestion des Disciplines')).toBeInTheDocument();
    expect(screen.getByText('+ Nouvelle Discipline')).toBeInTheDocument();
  });
});
