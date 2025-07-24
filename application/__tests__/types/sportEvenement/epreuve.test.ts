import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Discipline } from '@/types/sportEvenement/discipline';
import { Evenement } from '@/types/sportEvenement/evenement';
import { Lieu } from '@/types/sportEvenement/lieu';

describe('Epreuve interface', () => {
  const mockDiscipline: Discipline = {
    id: 1,
    nom: 'Athlétisme'
  };

  const mockLieu: Lieu = {
    id: 1,
    nom: 'Stade de France'
  };

  const mockEvenement: Evenement = {
    id: 1,
    description: 'Finale du 100m hommes',
    lieu: mockLieu,
    date: '2024-08-01',
    horraire: '20:00',
    epreuves: []
  };

  it('should define the correct structure for an epreuve', () => {
    const mockEpreuve: Epreuve = {
      id: 1,
      libelle: '100m sprint hommes',
      discipline: mockDiscipline,
      evenement: mockEvenement
    };

    // Verify all required properties exist
    expect(mockEpreuve).toHaveProperty('id');
    expect(mockEpreuve).toHaveProperty('libelle');
    expect(mockEpreuve).toHaveProperty('discipline');
    expect(mockEpreuve).toHaveProperty('evenement');

    // Verify property types
    expect(typeof mockEpreuve.id).toBe('number');
    expect(typeof mockEpreuve.libelle).toBe('string');
    expect(typeof mockEpreuve.discipline).toBe('object');
    expect(mockEpreuve.discipline).toHaveProperty('id');
    expect(mockEpreuve.discipline).toHaveProperty('nom');
  });

  it('should work with null evenement', () => {
    const epreuveWithoutEvent: Epreuve = {
      id: 2,
      libelle: '200m sprint femmes',
      discipline: mockDiscipline,
      evenement: null
    };

    expect(epreuveWithoutEvent.evenement).toBeNull();
    expect(epreuveWithoutEvent.discipline).toBeDefined();
  });

  it('should work without evenement property', () => {
    const epreuveWithoutEvent: Epreuve = {
      id: 3,
      libelle: '400m haies hommes',
      discipline: mockDiscipline
    };

    expect(epreuveWithoutEvent.evenement).toBeUndefined();
    expect(epreuveWithoutEvent.discipline).toBeDefined();
  });

  it('should work with different athletics events', () => {
    const athleticsEpreuves: Epreuve[] = [
      {
        id: 1,
        libelle: '100m sprint hommes',
        discipline: mockDiscipline,
        evenement: mockEvenement
      },
      {
        id: 2,
        libelle: '200m sprint femmes',
        discipline: mockDiscipline,
        evenement: null
      },
      {
        id: 3,
        libelle: '110m haies hommes',
        discipline: mockDiscipline
      },
      {
        id: 4,
        libelle: 'Marathon hommes',
        discipline: mockDiscipline,
        evenement: mockEvenement
      }
    ];

    athleticsEpreuves.forEach(epreuve => {
      expect(epreuve.id).toBeGreaterThan(0);
      expect(epreuve.libelle).toBeTruthy();
      expect(epreuve.discipline).toBeDefined();
      expect(epreuve.discipline.nom).toBe('Athlétisme');
    });
  });

  it('should work with different sport disciplines', () => {
    const natationDiscipline: Discipline = { id: 2, nom: 'Natation' };
    const gymnasticDiscipline: Discipline = { id: 3, nom: 'Gymnastique' };

    const diverseEpreuves: Epreuve[] = [
      {
        id: 10,
        libelle: '50m nage libre hommes',
        discipline: natationDiscipline,
        evenement: mockEvenement
      },
      {
        id: 11,
        libelle: '100m papillon femmes',
        discipline: natationDiscipline
      },
      {
        id: 12,
        libelle: 'Sol individuel hommes',
        discipline: gymnasticDiscipline,
        evenement: null
      }
    ];

    expect(diverseEpreuves[0].discipline.nom).toBe('Natation');
    expect(diverseEpreuves[1].discipline.nom).toBe('Natation');
    expect(diverseEpreuves[2].discipline.nom).toBe('Gymnastique');
  });

  it('should be serializable to JSON', () => {
    const epreuve: Epreuve = {
      id: 42,
      libelle: 'Saut en longueur femmes',
      discipline: mockDiscipline,
      evenement: mockEvenement
    };

    const jsonString = JSON.stringify(epreuve);
    const parsedEpreuve = JSON.parse(jsonString) as Epreuve;

    expect(parsedEpreuve.id).toBe(epreuve.id);
    expect(parsedEpreuve.libelle).toBe(epreuve.libelle);
    expect(parsedEpreuve.discipline.id).toBe(epreuve.discipline.id);
    expect(parsedEpreuve.discipline.nom).toBe(epreuve.discipline.nom);
  });

  it('should maintain referential equality for identical objects', () => {
    const epreuve1: Epreuve = {
      id: 1,
      libelle: 'Relais 4x100m hommes',
      discipline: mockDiscipline,
      evenement: mockEvenement
    };
    const epreuve2: Epreuve = {
      id: 1,
      libelle: 'Relais 4x100m hommes',
      discipline: mockDiscipline,
      evenement: mockEvenement
    };

    expect(epreuve1).toEqual(epreuve2);
    expect(epreuve1.discipline).toEqual(epreuve2.discipline);
  });

  it('should distinguish between different epreuves', () => {
    const epreuve1: Epreuve = {
      id: 1,
      libelle: 'Lancer du poids hommes',
      discipline: mockDiscipline
    };
    const epreuve2: Epreuve = {
      id: 2,
      libelle: 'Lancer du disque femmes',
      discipline: mockDiscipline
    };

    expect(epreuve1).not.toEqual(epreuve2);
    expect(epreuve1.id).not.toBe(epreuve2.id);
    expect(epreuve1.libelle).not.toBe(epreuve2.libelle);
  });

  it('should handle complex discipline relationships', () => {
    const complexDiscipline: Discipline = {
      id: 99,
      nom: 'Triathlon - Natation, Cyclisme, Course à pied'
    };

    const triathlonEpreuve: Epreuve = {
      id: 99,
      libelle: 'Triathlon individuel hommes',
      discipline: complexDiscipline,
      evenement: mockEvenement
    };

    expect(triathlonEpreuve.discipline.nom).toContain('Triathlon');
    expect(triathlonEpreuve.discipline.nom).toContain('Natation');
    expect(triathlonEpreuve.discipline.nom).toContain('Cyclisme');
  });

  it('should work with edge case values', () => {
    const edgeCaseEpreuves: Epreuve[] = [
      {
        id: 0,
        libelle: '',
        discipline: { id: 0, nom: '' },
        evenement: null
      },
      {
        id: -1,
        libelle: 'Test Event',
        discipline: { id: -1, nom: 'Test Sport' }
      },
      {
        id: Number.MAX_SAFE_INTEGER,
        libelle: 'Very long event name with many characters',
        discipline: { id: 1, nom: 'Long discipline name' },
        evenement: mockEvenement
      }
    ];

    edgeCaseEpreuves.forEach(epreuve => {
      expect(typeof epreuve.id).toBe('number');
      expect(typeof epreuve.libelle).toBe('string');
      expect(typeof epreuve.discipline).toBe('object');
    });
  });

  it('should handle nested object mutations correctly', () => {
    const originalEpreuve: Epreuve = {
      id: 100,
      libelle: 'Original Event',
      discipline: { ...mockDiscipline }
    };

    const modifiedEpreuve = { ...originalEpreuve };
    modifiedEpreuve.libelle = 'Modified Event';
    modifiedEpreuve.discipline.nom = 'Modified Sport';

    expect(originalEpreuve.libelle).toBe('Original Event');
    expect(originalEpreuve.discipline.nom).toBe('Modified Sport'); // Shallow copy limitation
  });
});
