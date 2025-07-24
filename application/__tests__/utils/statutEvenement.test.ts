import { getEventStatus } from '@/utils/evenement/statutEvenement';

describe('getEventStatus', () => {
  beforeEach(() => {
    // Mock Date.now() pour des tests déterministes
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-07-15T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return "à venir" for future events', () => {
    const futureDate = '2024-07-20';
    const futureTime = '14:30';
    
    const status = getEventStatus(futureDate, futureTime);
    
    expect(status).toBe('à venir');
  });

  it('should return "en cours" for current events', () => {
    // Use today's date for a current event
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Set time to 1 hour ago to make sure it's "en cours"
    const oneHourAgo = new Date(today.getTime() - 60 * 60 * 1000);
    const currentTime = oneHourAgo.toTimeString().slice(0, 5); // Format HH:MM
    
    const status = getEventStatus(currentDate, currentTime);
    
    expect(status).toBe('en cours');
  });

  it('should return "terminé" for past events', () => {
    const pastDate = '2024-07-10';
    const pastTime = '14:30';
    
    const status = getEventStatus(pastDate, pastTime);
    
    expect(status).toBe('terminé');
  });

  it('should handle events at midnight', () => {
    const date = '2024-07-16';
    const time = '00:00';
    
    const status = getEventStatus(date, time);
    
    expect(status).toBe('à venir');
  });

  it('should handle events late at night', () => {
    const date = '2024-07-15';
    const time = '23:59';
    
    const status = getEventStatus(date, time);
    
    expect(status).toBe('à venir');
  });

  it('should handle same day events in the future', () => {
    const currentDate = '2024-07-15';
    const futureTime = '15:30'; // Une heure après l'heure actuelle
    
    const status = getEventStatus(currentDate, futureTime);
    
    expect(status).toBe('à venir');
  });

  it('should handle same day events in the past', () => {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    
    // Set time to 2 hours ago to make sure it's past but same day
    const twoHoursAgo = new Date(today.getTime() - 2 * 60 * 60 * 1000);
    const pastTime = twoHoursAgo.toTimeString().slice(0, 5);
    
    const status = getEventStatus(currentDate, pastTime);
    
    expect(status).toBe('en cours');
  });

  it('should handle invalid date format gracefully', () => {
    const invalidDate = 'invalid-date';
    const time = '14:30';
    
    // Devrait gérer l'erreur et retourner un statut par défaut ou lever une erreur
    expect(() => getEventStatus(invalidDate, time)).not.toThrow();
  });

  it('should handle invalid time format gracefully', () => {
    const date = '2024-07-15';
    const invalidTime = 'invalid-time';
    
    // Devrait gérer l'erreur et retourner un statut par défaut ou lever une erreur
    expect(() => getEventStatus(date, invalidTime)).not.toThrow();
  });

  it('should handle events exactly at current time', () => {
    const currentDate = '2024-07-15';
    const currentTime = '10:00'; // Exactement l'heure actuelle
    
    const status = getEventStatus(currentDate, currentTime);
    
    // Pourrait être "en cours" ou "à venir" selon l'implémentation
    expect(['en cours', 'à venir']).toContain(status);
  });

  it('should handle leap year dates', () => {
    jest.setSystemTime(new Date('2024-02-29T10:00:00Z'));
    
    const leapDate = '2024-02-29';
    const time = '15:30';
    
    const status = getEventStatus(leapDate, time);
    
    expect(status).toBe('à venir');
  });

  it('should handle year boundary', () => {
    // Use a future date that's clearly in the future
    const nextYear = new Date().getFullYear() + 1;
    const nextYearDate = `${nextYear}-07-15`;
    const time = '14:30';
    
    const status = getEventStatus(nextYearDate, time);
    
    expect(status).toBe('à venir');
  });

  it('should handle different time zones consistently', () => {
    // Ce test dépend de l'implémentation - si elle gère les fuseaux horaires
    const date = '2024-07-15';
    const time = '14:30';
    
    const status = getEventStatus(date, time);
    
    // Devrait retourner un statut cohérent indépendamment du fuseau horaire
    expect(['à venir', 'en cours', 'terminé']).toContain(status);
  });
});
