import { Evenement, ExtendEvenement } from '@/types/sportEvenement/evenement';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Lieu } from '@/types/sportEvenement/lieu';
import { Discipline } from '@/types/sportEvenement/discipline';

describe('Evenement interface', () => {
  const mockLieu: Lieu = {
    id: 1,
    nom: 'Stade de France'
  };

  const mockDiscipline: Discipline = {
    id: 1,
    nom: 'Athlétisme',
    icone: 'athletics.svg'
  };

  const mockEpreuve: Epreuve = {
    id: 1,
    libelle: '100m sprint hommes',
    genre: 'hommes',
    tour: 'finale',
    discipline: mockDiscipline
  };

  it('should define the correct structure for an evenement', () => {
    const mockEvenement: Evenement = {
      id: 1,
      description: 'Finale du 100m sprint hommes',
      lieu: mockLieu,
      date: '2024-08-01',
      horraire: '20:00',
      epreuves: [mockEpreuve]
    };

    // Verify all required properties exist
    expect(mockEvenement).toHaveProperty('id');
    expect(mockEvenement).toHaveProperty('description');
    expect(mockEvenement).toHaveProperty('lieu');
    expect(mockEvenement).toHaveProperty('date');
    expect(mockEvenement).toHaveProperty('horraire');
    expect(mockEvenement).toHaveProperty('epreuves');

    // Verify property types
    expect(typeof mockEvenement.id).toBe('number');
    expect(typeof mockEvenement.description).toBe('string');
    expect(typeof mockEvenement.lieu).toBe('object');
    expect(typeof mockEvenement.date).toBe('string');
    expect(typeof mockEvenement.horraire).toBe('string');
    expect(Array.isArray(mockEvenement.epreuves)).toBe(true);
  });

  it('should work with empty epreuves array', () => {
    const evenementWithoutEpreuves: Evenement = {
      id: 2,
      description: 'Cérémonie d\'ouverture',
      lieu: mockLieu,
      date: '2024-07-26',
      horraire: '20:00',
      epreuves: []
    };

    expect(evenementWithoutEpreuves.epreuves).toEqual([]);
    expect(evenementWithoutEpreuves.epreuves.length).toBe(0);
  });

  it('should handle multiple epreuves correctly', () => {
    const multipleEpreuves: Epreuve[] = [
      {
        id: 1,
        libelle: '100m sprint hommes',
        genre: 'hommes',
        tour: 'finale',
        discipline: mockDiscipline
      },
      {
        id: 2,
        libelle: '200m sprint femmes',
        genre: 'femmes',
        tour: 'demi-finale',
        discipline: mockDiscipline
      },
      {
        id: 3,
        libelle: 'Relais 4x100m mixte',
        genre: 'mixte',
        tour: 'qualifications',
        discipline: mockDiscipline
      }
    ];

    const evenementWithMultipleEpreuves: Evenement = {
      id: 3,
      description: 'Journée de sprints',
      lieu: mockLieu,
      date: '2024-08-02',
      horraire: '10:00',
      epreuves: multipleEpreuves
    };

    expect(evenementWithMultipleEpreuves.epreuves.length).toBe(3);
    expect(evenementWithMultipleEpreuves.epreuves[0].libelle).toBe('100m sprint hommes');
    expect(evenementWithMultipleEpreuves.epreuves[2].libelle).toBe('Relais 4x100m mixte');
  });

  it('should handle different date formats', () => {
    const evenementsWithDifferentDates: Evenement[] = [
      {
        id: 1,
        description: 'Event 1',
        lieu: mockLieu,
        date: '2024-08-01',
        horraire: '09:00',
        epreuves: []
      },
      {
        id: 2,
        description: 'Event 2',
        lieu: mockLieu,
        date: '01/08/2024',
        horraire: '14:30',
        epreuves: []
      },
      {
        id: 3,
        description: 'Event 3',
        lieu: mockLieu,
        date: '2024-08-01T00:00:00Z',
        horraire: '21:45',
        epreuves: []
      }
    ];

    evenementsWithDifferentDates.forEach(evenement => {
      expect(typeof evenement.date).toBe('string');
      expect(evenement.date.length).toBeGreaterThan(0);
    });
  });

  it('should handle different time formats', () => {
    const evenementsWithDifferentTimes: Evenement[] = [
      {
        id: 1,
        description: 'Morning Event',
        lieu: mockLieu,
        date: '2024-08-01',
        horraire: '09:00',
        epreuves: []
      },
      {
        id: 2,
        description: 'Afternoon Event',
        lieu: mockLieu,
        date: '2024-08-01',
        horraire: '14:30:45',
        epreuves: []
      },
      {
        id: 3,
        description: 'Evening Event',
        lieu: mockLieu,
        date: '2024-08-01',
        horraire: '9:00 PM',
        epreuves: []
      }
    ];

    evenementsWithDifferentTimes.forEach(evenement => {
      expect(typeof evenement.horraire).toBe('string');
      expect(evenement.horraire.length).toBeGreaterThan(0);
    });
  });

  it('should be serializable to JSON', () => {
    const evenement: Evenement = {
      id: 42,
      description: 'Finale du marathon',
      lieu: mockLieu,
      date: '2024-08-11',
      horraire: '07:00',
      epreuves: [mockEpreuve]
    };

    const jsonString = JSON.stringify(evenement);
    const parsedEvenement = JSON.parse(jsonString) as Evenement;

    expect(parsedEvenement.id).toBe(evenement.id);
    expect(parsedEvenement.description).toBe(evenement.description);
    expect(parsedEvenement.lieu.nom).toBe(evenement.lieu.nom);
    expect(parsedEvenement.epreuves.length).toBe(evenement.epreuves.length);
  });

  it('should maintain referential equality for identical objects', () => {
    const evenement1: Evenement = {
      id: 1,
      description: 'Swimming Finals',
      lieu: mockLieu,
      date: '2024-08-03',
      horraire: '19:30',
      epreuves: [mockEpreuve]
    };
    const evenement2: Evenement = {
      id: 1,
      description: 'Swimming Finals',
      lieu: mockLieu,
      date: '2024-08-03',
      horraire: '19:30',
      epreuves: [mockEpreuve]
    };

    expect(evenement1).toEqual(evenement2);
    expect(evenement1.lieu).toEqual(evenement2.lieu);
  });
});

describe('ExtendEvenement interface', () => {
  const mockLieu: Lieu = {
    id: 1,
    nom: 'Stade de France'
  };

  it('should extend Evenement with additional properties', () => {
    const extendedEvenement: ExtendEvenement = {
      id: 1,
      description: 'Finale du 100m sprint hommes',
      lieu: mockLieu,
      date: '2024-08-01',
      horraire: '20:00',
      epreuves: [],
      sports: 'Athlétisme',
      status: 'à venir',
      capacity: 80000,
      ticketsSold: 75000
    };

    // Verify base properties
    expect(extendedEvenement).toHaveProperty('id');
    expect(extendedEvenement).toHaveProperty('description');
    expect(extendedEvenement).toHaveProperty('lieu');
    expect(extendedEvenement).toHaveProperty('date');
    expect(extendedEvenement).toHaveProperty('horraire');
    expect(extendedEvenement).toHaveProperty('epreuves');

    // Verify extended properties
    expect(extendedEvenement).toHaveProperty('sports');
    expect(extendedEvenement).toHaveProperty('status');
    expect(extendedEvenement).toHaveProperty('capacity');
    expect(extendedEvenement).toHaveProperty('ticketsSold');

    // Verify extended property types
    expect(typeof extendedEvenement.sports).toBe('string');
    expect(['à venir', 'en cours', 'terminé']).toContain(extendedEvenement.status);
    expect(typeof extendedEvenement.capacity).toBe('number');
    expect(typeof extendedEvenement.ticketsSold).toBe('number');
  });

  it('should work with all status values', () => {
    const statuses: Array<'à venir' | 'en cours' | 'terminé'> = ['à venir', 'en cours', 'terminé'];

    statuses.forEach(status => {
      const evenement: ExtendEvenement = {
        id: 1,
        description: 'Test Event',
        lieu: mockLieu,
        date: '2024-08-01',
        horraire: '10:00',
        epreuves: [],
        status: status
      };

      expect(evenement.status).toBe(status);
      expect(['à venir', 'en cours', 'terminé']).toContain(evenement.status!);
    });
  });

  it('should work without optional extended properties', () => {
    const minimalExtendedEvenement: ExtendEvenement = {
      id: 1,
      description: 'Minimal Event',
      lieu: mockLieu,
      date: '2024-08-01',
      horraire: '10:00',
      epreuves: []
    };

    expect(minimalExtendedEvenement.sports).toBeUndefined();
    expect(minimalExtendedEvenement.status).toBeUndefined();
    expect(minimalExtendedEvenement.capacity).toBeUndefined();
    expect(minimalExtendedEvenement.ticketsSold).toBeUndefined();
  });

  it('should work with partial extended properties', () => {
    const partialExtendedEvenement: ExtendEvenement = {
      id: 1,
      description: 'Partial Event',
      lieu: mockLieu,
      date: '2024-08-01',
      horraire: '10:00',
      epreuves: [],
      sports: 'Natation',
      status: 'en cours'
    };

    expect(partialExtendedEvenement.sports).toBe('Natation');
    expect(partialExtendedEvenement.status).toBe('en cours');
    expect(partialExtendedEvenement.capacity).toBeUndefined();
    expect(partialExtendedEvenement.ticketsSold).toBeUndefined();
  });

  it('should handle capacity and ticket calculations', () => {
    const soldOutEvent: ExtendEvenement = {
      id: 1,
      description: 'Sold Out Event',
      lieu: mockLieu,
      date: '2024-08-01',
      horraire: '20:00',
      epreuves: [],
      capacity: 50000,
      ticketsSold: 50000,
      status: 'à venir'
    };

    const partiallyFilledEvent: ExtendEvenement = {
      id: 2,
      description: 'Partially Filled Event',
      lieu: mockLieu,
      date: '2024-08-02',
      horraire: '15:00',
      epreuves: [],
      capacity: 80000,
      ticketsSold: 45000,
      status: 'à venir'
    };

    expect(soldOutEvent.ticketsSold).toBe(soldOutEvent.capacity);
    expect(partiallyFilledEvent.ticketsSold! < partiallyFilledEvent.capacity!).toBe(true);
  });

  it('should be serializable to JSON', () => {
    const extendedEvenement: ExtendEvenement = {
      id: 99,
      description: 'Extended Event',
      lieu: mockLieu,
      date: '2024-08-15',
      horraire: '18:00',
      epreuves: [],
      sports: 'Basketball',
      status: 'terminé',
      capacity: 20000,
      ticketsSold: 19500
    };

    const jsonString = JSON.stringify(extendedEvenement);
    const parsedEvent = JSON.parse(jsonString) as ExtendEvenement;

    expect(parsedEvent.sports).toBe(extendedEvenement.sports);
    expect(parsedEvent.status).toBe(extendedEvenement.status);
    expect(parsedEvent.capacity).toBe(extendedEvenement.capacity);
    expect(parsedEvent.ticketsSold).toBe(extendedEvenement.ticketsSold);
  });

  it('should work with different sports types', () => {
    const sportsEvents: ExtendEvenement[] = [
      {
        id: 1,
        description: 'Athletics Final',
        lieu: mockLieu,
        date: '2024-08-01',
        horraire: '20:00',
        epreuves: [],
        sports: 'Athlétisme'
      },
      {
        id: 2,
        description: 'Swimming Championship',
        lieu: mockLieu,
        date: '2024-08-02',
        horraire: '19:00',
        epreuves: [],
        sports: 'Natation'
      },
      {
        id: 3,
        description: 'Gymnastics Competition',
        lieu: mockLieu,
        date: '2024-08-03',
        horraire: '16:00',
        epreuves: [],
        sports: 'Gymnastique'
      }
    ];

    sportsEvents.forEach(event => {
      expect(event.sports).toBeTruthy();
      expect(typeof event.sports).toBe('string');
    });
  });
});
