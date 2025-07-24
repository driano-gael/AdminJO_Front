import { Discipline } from '@/types/sportEvenement/discipline';

describe('Discipline interface', () => {
  it('should define the correct structure for a discipline', () => {
    const mockDiscipline: Discipline = {
      id: 1,
      nom: 'Athlétisme'
    };

    // Verify all required properties exist
    expect(mockDiscipline).toHaveProperty('id');
    expect(mockDiscipline).toHaveProperty('nom');

    // Verify property types
    expect(typeof mockDiscipline.id).toBe('number');
    expect(typeof mockDiscipline.nom).toBe('string');
  });

  it('should work with different discipline examples', () => {
    const disciplines: Discipline[] = [
      { id: 1, nom: 'Athlétisme' },
      { id: 2, nom: 'Natation' },
      { id: 3, nom: 'Basketball' },
      { id: 4, nom: 'Tennis' },
      { id: 5, nom: 'Football' }
    ];

    disciplines.forEach(discipline => {
      expect(discipline.id).toBeGreaterThan(0);
      expect(discipline.nom).toBeTruthy();
      expect(discipline.nom.trim()).not.toBe('');
    });
  });

  it('should handle numeric IDs correctly', () => {
    const discipline: Discipline = {
      id: 999,
      nom: 'Gymnastique'
    };

    expect(Number.isInteger(discipline.id)).toBe(true);
    expect(discipline.id).toBeGreaterThan(0);
  });

  it('should handle special characters in nom', () => {
    const disciplinesWithSpecialChars: Discipline[] = [
      { id: 1, nom: 'Tir à l\'arc' },
      { id: 2, nom: 'Haltérophilie' },
      { id: 3, nom: 'Arts martiaux - Judo' },
      { id: 4, nom: 'Course d\'obstacles' }
    ];

    disciplinesWithSpecialChars.forEach(discipline => {
      expect(discipline.nom).toBeTruthy();
      expect(typeof discipline.nom).toBe('string');
    });
  });

  it('should be serializable to JSON', () => {
    const discipline: Discipline = {
      id: 42,
      nom: 'Escrime'
    };

    const jsonString = JSON.stringify(discipline);
    const parsedDiscipline = JSON.parse(jsonString) as Discipline;

    expect(parsedDiscipline.id).toBe(discipline.id);
    expect(parsedDiscipline.nom).toBe(discipline.nom);
  });

  it('should maintain referential equality for identical objects', () => {
    const discipline1: Discipline = { id: 1, nom: 'Cyclisme' };
    const discipline2: Discipline = { id: 1, nom: 'Cyclisme' };

    expect(discipline1).toEqual(discipline2);
    expect(discipline1.id).toBe(discipline2.id);
    expect(discipline1.nom).toBe(discipline2.nom);
  });

  it('should distinguish between different disciplines', () => {
    const discipline1: Discipline = { id: 1, nom: 'Volleyball' };
    const discipline2: Discipline = { id: 2, nom: 'Basketball' };

    expect(discipline1).not.toEqual(discipline2);
    expect(discipline1.id).not.toBe(discipline2.id);
    expect(discipline1.nom).not.toBe(discipline2.nom);
  });

  it('should work with empty and edge case values', () => {
    const edgeCaseDisciplines: Discipline[] = [
      { id: 0, nom: '' },
      { id: -1, nom: 'Test' },
      { id: Number.MAX_SAFE_INTEGER, nom: 'Very long discipline name with many characters' }
    ];

    edgeCaseDisciplines.forEach(discipline => {
      expect(typeof discipline.id).toBe('number');
      expect(typeof discipline.nom).toBe('string');
    });
  });
});
