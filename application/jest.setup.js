// import '@testing-library/jest-dom';

// après (CommonJS)
require("@testing-library/jest-dom");

// Configuration des variables d'environnement pour les tests
process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:8000/api";
process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY = "auth_token";
process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY = "refresh_token";

// Suppression des warnings React act() dans les tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('An update to TestComponent inside a test was not wrapped in act') ||
       args[0].includes('Error setting tokens:') ||
       args[0].includes('Error getting auth token:'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
