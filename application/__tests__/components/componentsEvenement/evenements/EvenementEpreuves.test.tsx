import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvenementEpreuves from '../../../../src/components/componentsEvenement/evenements/EvenementEpreuves';
import { Epreuve } from '../../../../src/types/sportEvenement/epreuve';

describe('EvenementEpreuves', () => {
  const mockEpreuves: Epreuve[] = [
    {
      id: 1,
      libelle: '100m Sprint',
      discipline: { id: 1, nom: 'Athlétisme' }
    },
    {
      id: 2,
      libelle: 'Papillon 200m',
      discipline: { id: 2, nom: 'Natation' }
    },
    {
      id: 3,
      libelle: 'Marathon',
      discipline: { id: 1, nom: 'Athlétisme' }
    }
  ];

  describe('Basic Rendering', () => {
    it('should render multiple epreuves', () => {
      render(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      expect(screen.getByText('100m Sprint')).toBeInTheDocument();
      expect(screen.getByText('Papillon 200m')).toBeInTheDocument();
      expect(screen.getByText('Marathon')).toBeInTheDocument();
    });

    it('should render discipline names for each epreuve', () => {
      render(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      expect(screen.getAllByText('Athlétisme')).toHaveLength(2); // 100m and Marathon
      expect(screen.getByText('Natation')).toBeInTheDocument();
    });

    it('should render each epreuve in its own container', () => {
      const { container } = render(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      const epreuveContainers = container.querySelectorAll('.bg-green-100');
      expect(epreuveContainers).toHaveLength(3);
    });
  });

  describe('Single Epreuve', () => {
    it('should render single epreuve correctement', () => {
      const singleEpreuve = [mockEpreuves[0]];
      
      render(<EvenementEpreuves epreuves={singleEpreuve} />);
      
      expect(screen.getByText('100m Sprint')).toBeInTheDocument();
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    });

    it('should render epreuve without discipline', () => {
      const epreuveWithoutDiscipline: Epreuve[] = [{
        id: 1,
        libelle: 'Test Epreuve',
        discipline: null as any
      }];
      
      render(<EvenementEpreuves epreuves={epreuveWithoutDiscipline} />);
      
      expect(screen.getByText('Test Epreuve')).toBeInTheDocument();
      // Should not render discipline section when discipline is null
      expect(screen.queryByText('italic')).not.toBeInTheDocument();
    });

    it('should render epreuve with undefined discipline', () => {
      const epreuveWithUndefinedDiscipline: Epreuve[] = [{
        id: 1,
        libelle: 'Test Epreuve',
        discipline: undefined as any
      }];
      
      render(<EvenementEpreuves epreuves={epreuveWithUndefinedDiscipline} />);
      
      expect(screen.getByText('Test Epreuve')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should render "Aucune épreuve" when epreuves array is empty', () => {
      render(<EvenementEpreuves epreuves={[]} />);
      
      expect(screen.getByText('Aucune épreuve')).toBeInTheDocument();
    });

    it('should render "Aucune épreuve" when epreuves is null', () => {
      render(<EvenementEpreuves epreuves={null as any} />);
      
      expect(screen.getByText('Aucune épreuve')).toBeInTheDocument();
    });

    it('should render "Aucune épreuve" when epreuves is undefined', () => {
      render(<EvenementEpreuves epreuves={undefined as any} />);
      
      expect(screen.getByText('Aucune épreuve')).toBeInTheDocument();
    });
  });

  describe('Styling and CSS Classes', () => {
    it('should have correct base styling', () => {
      const { container } = render(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      const baseDiv = container.firstChild as HTMLElement;
      expect(baseDiv).toHaveClass('text-sm', 'text-gray-900');
    });

    it('should have correct container styling for multiple epreuves', () => {
      const { container } = render(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      const flexContainer = container.querySelector('.flex.flex-col.space-y-1');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should have correct styling for each epreuve item', () => {
      const { container } = render(<EvenementEpreuves epreuves={[mockEpreuves[0]]} />);
      
      const epreuveItem = container.querySelector('.bg-green-100');
      expect(epreuveItem).toHaveClass(
        'inline-block',
        'bg-green-100',
        'text-black',
        'px-2',
        'py-1',
        'rounded-full',
        'text-xs',
        'w-fit'
      );
    });

    it('should have correct styling for epreuve libelle', () => {
      render(<EvenementEpreuves epreuves={[mockEpreuves[0]]} />);
      
      const libelleDiv = screen.getByText('100m Sprint');
      expect(libelleDiv).toHaveClass('font-semibold');
    });

    it('should have correct styling for discipline name', () => {
      render(<EvenementEpreuves epreuves={[mockEpreuves[0]]} />);
      
      const disciplineDiv = screen.getByText('Athlétisme');
      expect(disciplineDiv).toHaveClass('text-black', 'text-xs', 'italic');
    });

    it('should have correct styling for empty state', () => {
      render(<EvenementEpreuves epreuves={[]} />);
      
      const emptyState = screen.getByText('Aucune épreuve');
      expect(emptyState).toHaveClass('text-gray-400');
    });
  });

  describe('Content Display', () => {
    it('should display epreuve libelles correctement', () => {
      render(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      mockEpreuves.forEach(epreuve => {
        expect(screen.getByText(epreuve.libelle)).toBeInTheDocument();
      });
    });

    it('should display discipline names correctement', () => {
      render(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      const uniqueDisciplines = [...new Set(mockEpreuves.map(e => e.discipline?.nom))];
      uniqueDisciplines.forEach(disciplineName => {
        if (disciplineName) {
          expect(screen.getAllByText(disciplineName)[0]).toBeInTheDocument();
        }
      });
    });

    it('should maintain correct order of epreuves', () => {
      const { container } = render(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      const epreuveItems = container.querySelectorAll('.bg-green-100');
      const epreuveTexts = Array.from(epreuveItems).map(item => 
        item.querySelector('.font-semibold')?.textContent
      );
      
      expect(epreuveTexts).toEqual(['100m Sprint', 'Papillon 200m', 'Marathon']);
    });
  });

  describe('Unique Key Handling', () => {
    it('should render epreuves with unique keys', () => {
      const epreuvesWithSameLabels: Epreuve[] = [
        { id: 1, libelle: 'Same Label', discipline: { id: 1, nom: 'Discipline 1' } },
        { id: 2, libelle: 'Same Label', discipline: { id: 2, nom: 'Discipline 2' } }
      ];
      
      render(<EvenementEpreuves epreuves={epreuvesWithSameLabels} />);
      
      expect(screen.getAllByText('Same Label')).toHaveLength(2);
      expect(screen.getByText('Discipline 1')).toBeInTheDocument();
      expect(screen.getByText('Discipline 2')).toBeInTheDocument();
    });

    it('should handle epreuves with duplicate IDs gracefully', () => {
      const epreuvesWithDuplicateIds: Epreuve[] = [
        { id: 1, libelle: 'First', discipline: { id: 1, nom: 'Discipline 1' } },
        { id: 1, libelle: 'Second', discipline: { id: 2, nom: 'Discipline 2' } }
      ];
      
      render(<EvenementEpreuves epreuves={epreuvesWithDuplicateIds} />);
      
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  describe('Large Data Sets', () => {
    it('should handle many epreuves efficiently', () => {
      const manyEpreuves: Epreuve[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        libelle: `Epreuve ${i + 1}`,
        discipline: { id: (i % 5) + 1, nom: `Discipline ${(i % 5) + 1}` }
      }));
      
      render(<EvenementEpreuves epreuves={manyEpreuves} />);
      
      expect(screen.getByText('Epreuve 1')).toBeInTheDocument();
      expect(screen.getByText('Epreuve 50')).toBeInTheDocument();
      
      const { container } = render(<EvenementEpreuves epreuves={manyEpreuves} />);
      const epreuveItems = container.querySelectorAll('.bg-green-100');
      expect(epreuveItems).toHaveLength(50);
    });
  });

  describe('Special Characters and Internationalization', () => {
    it('should handle special characters in epreuve names', () => {
      const epreuvesWithSpecialChars: Epreuve[] = [
        { id: 1, libelle: 'Épreuve côté français', discipline: { id: 1, nom: 'Athlétisme' } },
        { id: 2, libelle: '200m – Nage libre', discipline: { id: 2, nom: 'Natation' } },
        { id: 3, libelle: 'Saut à la perche (H)', discipline: { id: 1, nom: 'Athlétisme' } }
      ];
      
      render(<EvenementEpreuves epreuves={epreuvesWithSpecialChars} />);
      
      expect(screen.getByText('Épreuve côté français')).toBeInTheDocument();
      expect(screen.getByText('200m – Nage libre')).toBeInTheDocument();
      expect(screen.getByText('Saut à la perche (H)')).toBeInTheDocument();
    });

    it('should handle long epreuve names', () => {
      const epreuvesWithLongNames: Epreuve[] = [
        {
          id: 1,
          libelle: 'Très longue épreuve avec un nom extrêmement détaillé qui pourrait poser des problèmes de mise en page',
          discipline: { id: 1, nom: 'Discipline avec nom très long aussi' }
        }
      ];
      
      render(<EvenementEpreuves epreuves={epreuvesWithLongNames} />);
      
      expect(screen.getByText(/Très longue épreuve/)).toBeInTheDocument();
      expect(screen.getByText(/Discipline avec nom très long/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      const epreuveItems = container.querySelectorAll('[data-testid], .bg-green-100');
      expect(epreuveItems.length).toBeGreaterThan(0);
    });

    it('should be readable by screen readers', () => {
      render(<EvenementEpreuves epreuves={[mockEpreuves[0]]} />);
      
      // Text content should be accessible
      expect(screen.getByText('100m Sprint')).toBeInTheDocument();
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    });

    it('should handle empty state accessibly', () => {
      render(<EvenementEpreuves epreuves={[]} />);
      
      const emptyState = screen.getByText('Aucune épreuve');
      expect(emptyState.tagName.toLowerCase()).toBe('span');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      // Re-render with same props
      rerender(<EvenementEpreuves epreuves={mockEpreuves} />);
      
      expect(screen.getByText('100m Sprint')).toBeInTheDocument();
    });

    it('should handle prop changes correctement', () => {
      const { rerender } = render(<EvenementEpreuves epreuves={[mockEpreuves[0]]} />);
      
      expect(screen.getByText('100m Sprint')).toBeInTheDocument();
      
      rerender(<EvenementEpreuves epreuves={[mockEpreuves[1]]} />);
      
      expect(screen.queryByText('100m Sprint')).not.toBeInTheDocument();
      expect(screen.getByText('Papillon 200m')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle epreuves with missing libelle', () => {
      const epreuvesWithMissingLabels: Epreuve[] = [
        { id: 1, libelle: '', discipline: { id: 1, nom: 'Athlétisme' } }
      ];
      
      render(<EvenementEpreuves epreuves={epreuvesWithMissingLabels} />);
      
      // Should still render the container and discipline
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    });

    it('should handle epreuves with missing discipline names', () => {
      const epreuvesWithMissingDisciplineNames: Epreuve[] = [
        { id: 1, libelle: 'Test Epreuve', discipline: { id: 1, nom: '' } }
      ];
      
      render(<EvenementEpreuves epreuves={epreuvesWithMissingDisciplineNames} />);
      
      expect(screen.getByText('Test Epreuve')).toBeInTheDocument();
    });

    it('should handle malformed epreuve objects', () => {
      const malformedEpreuves: any[] = [
        { id: 1, libelle: 'Valid Epreuve', discipline: { id: 1, nom: 'Valid Discipline' } },
        { id: 2 }, // Missing libelle and discipline
        { libelle: 'Missing ID', discipline: { nom: 'Missing discipline ID' } }
      ];
      
      // Should not crash and render what it can
      render(<EvenementEpreuves epreuves={malformedEpreuves} />);
      
      expect(screen.getByText('Valid Epreuve')).toBeInTheDocument();
    });
  });
});
