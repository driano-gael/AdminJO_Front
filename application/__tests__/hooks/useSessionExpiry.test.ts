import { renderHook } from '@testing-library/react';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { useAuth } from '@/contexts/authContext';

// Mock des dépendances
jest.mock('@/contexts/authContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock des événements window
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockDispatchEvent = jest.fn();

// Mock window
Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true
});

Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent,
  writable: true
});

describe('useSessionExpiry', () => {
  const mockForceLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });
  });

  it('should add event listener for sessionExpired on mount', () => {
    renderHook(() => useSessionExpiry());

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'sessionExpired',
      expect.any(Function)
    );
  });

  it('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() => useSessionExpiry());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'sessionExpired',
      expect.any(Function)
    );
  });

  it('should call forceLogout when sessionExpired event is triggered and user is authenticated', () => {
    renderHook(() => useSessionExpiry());

    // Récupérer la fonction de callback
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Simuler l'événement
    eventHandler();

    expect(mockForceLogout).toHaveBeenCalled();
  });

  it('should not call forceLogout when sessionExpired event is triggered and user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    renderHook(() => useSessionExpiry());

    // Récupérer la fonction de callback
    const eventHandler = mockAddEventListener.mock.calls[0][1];
    
    // Simuler l'événement
    eventHandler();

    expect(mockForceLogout).not.toHaveBeenCalled();
  });

  it('should update event listener when authentication state changes', () => {
    const { rerender } = renderHook(() => useSessionExpiry());

    // Initialement authentifié
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);

    // Changer l'état d'authentification
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: mockForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    rerender();

    // L'ancien listener doit être supprimé et un nouveau ajouté
    expect(mockRemoveEventListener).toHaveBeenCalled();
    expect(mockAddEventListener).toHaveBeenCalledTimes(2);
  });

  it('should handle different forceLogout functions', () => {
    const newForceLogout = jest.fn();
    
    const { rerender } = renderHook(() => useSessionExpiry());

    // Changer la fonction forceLogout
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: newForceLogout,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    rerender();

    // Récupérer la nouvelle fonction de callback
    const eventHandler = mockAddEventListener.mock.calls[1][1];
    
    // Simuler l'événement
    eventHandler();

    expect(newForceLogout).toHaveBeenCalled();
    expect(mockForceLogout).not.toHaveBeenCalled();
  });
});

describe('emitSessionExpired utility function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch sessionExpired event when window is available', () => {
    const { emitSessionExpired } = require('@/hooks/useSessionExpiry');
    
    emitSessionExpired();

    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'sessionExpired'
      })
    );
  });

  it('should handle case when window is undefined', () => {
    // Mock window as undefined
    const originalWindow = global.window;
    // @ts-ignore
    global.window = undefined;

    const { emitSessionExpired } = require('@/hooks/useSessionExpiry');
    
    expect(() => {
      emitSessionExpired();
    }).not.toThrow();

    // Restore window
    global.window = originalWindow;
  });
});
