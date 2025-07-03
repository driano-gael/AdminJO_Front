// import '@testing-library/jest-dom';

// après (CommonJS)
require("@testing-library/jest-dom");

// Configuration des variables d'environnement pour les tests
process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:8000/api";
process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY = "auth_token";
process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY = "refresh_token";
