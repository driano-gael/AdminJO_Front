import { dashboardSections, getDashboardSectionByUrl, DashboardSection } from '@/types/dashBoardSections/dashboardSections';

describe('dashboardSections', () => {
  it('should contain all expected sections', () => {
    expect(dashboardSections).toHaveLength(4);
    
    // Verify each section has required properties
    dashboardSections.forEach((section: DashboardSection) => {
      expect(section).toHaveProperty('url');
      expect(section).toHaveProperty('title');
      expect(section).toHaveProperty('description');
      expect(section).toHaveProperty('icon');
      expect(section).toHaveProperty('color');
      
      // Verify types
      expect(typeof section.url).toBe('string');
      expect(typeof section.title).toBe('string');
      expect(typeof section.description).toBe('string');
      expect(typeof section.icon).toBe('string');
      expect(typeof section.color).toBe('string');
    });
  });

  it('should have events management section', () => {
    const eventsSection = dashboardSections.find(s => s.url === '/pagesEvenements');
    
    expect(eventsSection).toBeDefined();
    expect(eventsSection?.title).toBe('Gestion des évènements sportif');
    expect(eventsSection?.description).toBe('Gérer événements, lieux, disciplines et épreuves');
    expect(eventsSection?.icon).toBe('📅');
    expect(eventsSection?.color).toBe('bg-indigo-500 hover:bg-indigo-600');
  });

  it('should have offers management section', () => {
    const offersSection = dashboardSections.find(s => s.url === '/offers');
    
    expect(offersSection).toBeDefined();
    expect(offersSection?.title).toBe('Gestion des Offres');
    expect(offersSection?.description).toBe('Configurer les offres de billets et tarifications');
    expect(offersSection?.icon).toBe('🎫');
    expect(offersSection?.color).toBe('bg-purple-500 hover:bg-purple-600');
  });

  it('should have users management section', () => {
    const usersSection = dashboardSections.find(s => s.url === '/users');
    
    expect(usersSection).toBeDefined();
    expect(usersSection?.title).toBe('Gestion des Utilisateurs');
    expect(usersSection?.description).toBe('Administrer les comptes utilisateurs et leurs permissions');
    expect(usersSection?.icon).toBe('👥');
    expect(usersSection?.color).toBe('bg-green-500 hover:bg-green-600');
  });

  it('should have employees management section', () => {
    const employeesSection = dashboardSections.find(s => s.url === '/employees');
    
    expect(employeesSection).toBeDefined();
    expect(employeesSection?.title).toBe('Gestion des Employés');
    expect(employeesSection?.description).toBe('Gérer le personnel et les équipes d\'organisation');
    expect(employeesSection?.icon).toBe('👨‍💼');
    expect(employeesSection?.color).toBe('bg-orange-500 hover:bg-orange-600');
  });

  it('should have unique URLs', () => {
    const urls = dashboardSections.map(s => s.url);
    const uniqueUrls = [...new Set(urls)];
    
    expect(urls.length).toBe(uniqueUrls.length);
  });

  it('should have valid color classes', () => {
    dashboardSections.forEach((section: DashboardSection) => {
      // Each color should be a Tailwind CSS background class with hover state
      expect(section.color).toMatch(/^bg-\w+-\d+\s+hover:bg-\w+-\d+$/);
    });
  });

  it('should have non-empty titles and descriptions', () => {
    dashboardSections.forEach((section: DashboardSection) => {
      expect(section.title.trim()).not.toBe('');
      expect(section.description.trim()).not.toBe('');
      expect(section.icon.trim()).not.toBe('');
    });
  });
});

describe('getDashboardSectionByUrl', () => {
  it('should return correct section for existing URL', () => {
    const section = getDashboardSectionByUrl('/pagesEvenements');
    
    expect(section).toBeDefined();
    expect(section?.url).toBe('/pagesEvenements');
    expect(section?.title).toBe('Gestion des évènements sportif');
  });

  it('should return correct section for users URL', () => {
    const section = getDashboardSectionByUrl('/users');
    
    expect(section).toBeDefined();
    expect(section?.url).toBe('/users');
    expect(section?.title).toBe('Gestion des Utilisateurs');
  });

  it('should return correct section for offers URL', () => {
    const section = getDashboardSectionByUrl('/offers');
    
    expect(section).toBeDefined();
    expect(section?.url).toBe('/offers');
    expect(section?.title).toBe('Gestion des Offres');
  });

  it('should return correct section for employees URL', () => {
    const section = getDashboardSectionByUrl('/employees');
    
    expect(section).toBeDefined();
    expect(section?.url).toBe('/employees');
    expect(section?.title).toBe('Gestion des Employés');
  });

  it('should return undefined for non-existing URL', () => {
    const section = getDashboardSectionByUrl('/non-existing');
    
    expect(section).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    const section = getDashboardSectionByUrl('');
    
    expect(section).toBeUndefined();
  });

  it('should return undefined for invalid URLs', () => {
    const invalidUrls = [
      '/PAGESEVENTS', // wrong case
      '/pages-events', // wrong format
      'pagesEvenements', // missing leading slash
      '/pagesEvenements/', // trailing slash
      '/pages/evenements' // different structure
    ];

    invalidUrls.forEach(url => {
      const section = getDashboardSectionByUrl(url);
      expect(section).toBeUndefined();
    });
  });

  it('should be case sensitive', () => {
    const section = getDashboardSectionByUrl('/PAGESEVENEMENTS');
    
    expect(section).toBeUndefined();
  });

  it('should handle null and undefined gracefully', () => {
    // @ts-expect-error - Testing invalid input
    expect(getDashboardSectionByUrl(null)).toBeUndefined();
    
    // @ts-expect-error - Testing invalid input
    expect(getDashboardSectionByUrl(undefined)).toBeUndefined();
  });

  it('should work with all existing sections', () => {
    dashboardSections.forEach((expectedSection: DashboardSection) => {
      const foundSection = getDashboardSectionByUrl(expectedSection.url);
      
      expect(foundSection).toBeDefined();
      expect(foundSection).toEqual(expectedSection);
    });
  });

  it('should return exact object reference', () => {
    const url = '/pagesEvenements';
    const section = getDashboardSectionByUrl(url);
    const originalSection = dashboardSections.find(s => s.url === url);
    
    expect(section).toBe(originalSection);
  });
});
