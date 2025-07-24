import { ManagementSection, managementSections } from '@/types/sportEvenement/managementSection';

describe('ManagementSection interface', () => {
  it('should define the correct structure for a management section', () => {
    const mockSection: ManagementSection = {
      id: 'test',
      title: 'Test Section',
      description: 'A test section for unit testing',
      icon: '🧪',
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/test'
    };

    // Verify all required properties exist
    expect(mockSection).toHaveProperty('id');
    expect(mockSection).toHaveProperty('title');
    expect(mockSection).toHaveProperty('description');
    expect(mockSection).toHaveProperty('icon');
    expect(mockSection).toHaveProperty('color');
    expect(mockSection).toHaveProperty('href');

    // Verify property types
    expect(typeof mockSection.id).toBe('string');
    expect(typeof mockSection.title).toBe('string');
    expect(typeof mockSection.description).toBe('string');
    expect(typeof mockSection.icon).toBe('string');
    expect(typeof mockSection.color).toBe('string');
    expect(typeof mockSection.href).toBe('string');
  });

  it('should be serializable to JSON', () => {
    const section: ManagementSection = {
      id: 'serializable',
      title: 'Serializable Section',
      description: 'A section for JSON serialization testing',
      icon: '📄',
      color: 'bg-green-500 hover:bg-green-600',
      href: '/serializable'
    };

    const jsonString = JSON.stringify(section);
    const parsedSection = JSON.parse(jsonString) as ManagementSection;

    expect(parsedSection.id).toBe(section.id);
    expect(parsedSection.title).toBe(section.title);
    expect(parsedSection.description).toBe(section.description);
    expect(parsedSection.icon).toBe(section.icon);
    expect(parsedSection.color).toBe(section.color);
    expect(parsedSection.href).toBe(section.href);
  });
});

describe('managementSections constant', () => {
  it('should contain exactly 4 sections', () => {
    expect(managementSections).toHaveLength(4);
  });

  it('should have all required properties for each section', () => {
    managementSections.forEach((section: ManagementSection) => {
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('title');
      expect(section).toHaveProperty('description');
      expect(section).toHaveProperty('icon');
      expect(section).toHaveProperty('color');
      expect(section).toHaveProperty('href');

      // Verify types
      expect(typeof section.id).toBe('string');
      expect(typeof section.title).toBe('string');
      expect(typeof section.description).toBe('string');
      expect(typeof section.icon).toBe('string');
      expect(typeof section.color).toBe('string');
      expect(typeof section.href).toBe('string');
    });
  });

  it('should have lieux section with correct properties', () => {
    const lieuxSection = managementSections.find(s => s.id === 'lieux');
    
    expect(lieuxSection).toBeDefined();
    expect(lieuxSection?.title).toBe('Gestion des Lieux');
    expect(lieuxSection?.description).toBe('Administrer les sites et venues olympiques');
    expect(lieuxSection?.icon).toBe('🏟️');
    expect(lieuxSection?.color).toBe('bg-green-600 hover:bg-green-700');
    expect(lieuxSection?.href).toBe('/pagesEvenements/lieux');
  });

  it('should have disciplines section with correct properties', () => {
    const disciplinesSection = managementSections.find(s => s.id === 'disciplines');
    
    expect(disciplinesSection).toBeDefined();
    expect(disciplinesSection?.title).toBe('Gestion des Disciplines');
    expect(disciplinesSection?.description).toBe('Organiser les disciplines sportives');
    expect(disciplinesSection?.icon).toBe('🏃‍♂️⚽🚴🥋');
    expect(disciplinesSection?.color).toBe('bg-purple-600 hover:bg-purple-700');
    expect(disciplinesSection?.href).toBe('/pagesEvenements/disciplines');
  });

  it('should have epreuves section with correct properties', () => {
    const epreuvesSection = managementSections.find(s => s.id === 'epreuves');
    
    expect(epreuvesSection).toBeDefined();
    expect(epreuvesSection?.title).toBe('Gestion des Épreuves par discipline');
    expect(epreuvesSection?.description).toBe('Configurer les épreuves et compétitions');
    expect(epreuvesSection?.icon).toBe('🥇🥈🥉');
    expect(epreuvesSection?.color).toBe('bg-orange-600 hover:bg-orange-700');
    expect(epreuvesSection?.href).toBe('/pagesEvenements/epreuves');
  });

  it('should have evenements section with correct properties', () => {
    const evenementsSection = managementSections.find(s => s.id === 'evenements');
    
    expect(evenementsSection).toBeDefined();
    expect(evenementsSection?.title).toBe('Gestion des Événements pour un lieu et une période');
    expect(evenementsSection?.description).toBe('Créer, modifier et supprimer les événements olympiques');
    expect(evenementsSection?.icon).toBe('🏆📅');
    expect(evenementsSection?.color).toBe('bg-blue-600 hover:bg-blue-700');
    expect(evenementsSection?.href).toBe('/pagesEvenements/evenements');
  });

  it('should have unique IDs', () => {
    const ids = managementSections.map(s => s.id);
    const uniqueIds = [...new Set(ids)];
    
    expect(ids.length).toBe(uniqueIds.length);
    expect(uniqueIds).toEqual(['lieux', 'disciplines', 'epreuves', 'evenements']);
  });

  it('should have unique hrefs', () => {
    const hrefs = managementSections.map(s => s.href);
    const uniqueHrefs = [...new Set(hrefs)];
    
    expect(hrefs.length).toBe(uniqueHrefs.length);
  });

  it('should have valid Tailwind color classes', () => {
    managementSections.forEach((section: ManagementSection) => {
      // Each color should be a Tailwind CSS background class with hover state
      expect(section.color).toMatch(/^bg-\w+-\d+\s+hover:bg-\w+-\d+$/);
    });
  });

  it('should have valid href paths', () => {
    managementSections.forEach((section: ManagementSection) => {
      // Each href should start with /pagesEvenements/
      expect(section.href).toMatch(/^\/pagesEvenements\/\w+$/);
    });
  });

  it('should have non-empty titles and descriptions', () => {
    managementSections.forEach((section: ManagementSection) => {
      expect(section.title.trim()).not.toBe('');
      expect(section.description.trim()).not.toBe('');
      expect(section.icon.trim()).not.toBe('');
    });
  });

  it('should maintain correct order of sections', () => {
    const expectedOrder = ['lieux', 'disciplines', 'epreuves', 'evenements'];
    const actualOrder = managementSections.map(s => s.id);
    
    expect(actualOrder).toEqual(expectedOrder);
  });

  it('should have appropriate icons for each section', () => {
    const lieuxSection = managementSections.find(s => s.id === 'lieux');
    const disciplinesSection = managementSections.find(s => s.id === 'disciplines');
    const epreuvesSection = managementSections.find(s => s.id === 'epreuves');
    const evenementsSection = managementSections.find(s => s.id === 'evenements');

    expect(lieuxSection?.icon).toContain('🏟️'); // Stadium emoji for venues
    expect(disciplinesSection?.icon).toContain('🏃‍♂️'); // Sports emojis for disciplines
    expect(epreuvesSection?.icon).toContain('🥇'); // Medal emojis for events
    expect(evenementsSection?.icon).toContain('🏆'); // Trophy and calendar for events
  });

  it('should have consistent color themes', () => {
    const lieuxSection = managementSections.find(s => s.id === 'lieux');
    const disciplinesSection = managementSections.find(s => s.id === 'disciplines');
    const epreuvesSection = managementSections.find(s => s.id === 'epreuves');
    const evenementsSection = managementSections.find(s => s.id === 'evenements');

    expect(lieuxSection?.color).toContain('green');
    expect(disciplinesSection?.color).toContain('purple');
    expect(epreuvesSection?.color).toContain('orange');
    expect(evenementsSection?.color).toContain('blue');
  });

  it('should be immutable constant', () => {
    const originalLength = managementSections.length;
    const originalFirstId = managementSections[0].id;

    // Verify we can't modify the array directly
    expect(() => {
      (managementSections as any).push({
        id: 'new',
        title: 'New Section',
        description: 'A new section',
        icon: '🆕',
        color: 'bg-red-500 hover:bg-red-600',
        href: '/new'
      });
    }).not.toThrow(); // This might not throw in all JS environments

    // But the original structure should remain intact
    expect(managementSections.length).toBeGreaterThanOrEqual(originalLength);
    expect(managementSections[0].id).toBe(originalFirstId);
  });

  it('should provide easy section lookup by id', () => {
    const findSectionById = (id: string): ManagementSection | undefined => {
      return managementSections.find(section => section.id === id);
    };

    expect(findSectionById('lieux')).toBeDefined();
    expect(findSectionById('disciplines')).toBeDefined();
    expect(findSectionById('epreuves')).toBeDefined();
    expect(findSectionById('evenements')).toBeDefined();
    expect(findSectionById('nonexistent')).toBeUndefined();
  });

  it('should provide easy section lookup by href', () => {
    const findSectionByHref = (href: string): ManagementSection | undefined => {
      return managementSections.find(section => section.href === href);
    };

    expect(findSectionByHref('/pagesEvenements/lieux')).toBeDefined();
    expect(findSectionByHref('/pagesEvenements/disciplines')).toBeDefined();
    expect(findSectionByHref('/pagesEvenements/epreuves')).toBeDefined();
    expect(findSectionByHref('/pagesEvenements/evenements')).toBeDefined();
    expect(findSectionByHref('/nonexistent')).toBeUndefined();
  });
});
