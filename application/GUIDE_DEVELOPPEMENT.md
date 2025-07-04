# 🚀 Guide de Développement - AdminJO Frontend

## 📋 Introduction

Ce guide explique comment développer et maintenir l'application AdminJO Frontend avec la nouvelle architecture d'authentification améliorée.

## 🏗️ Architecture Actuelle

### Structure Principale

```
src/
├── components/
│   ├── connexion/
│   │   ├── authGuard.tsx          # 🛡️ Protection centralisée
│   │   ├── loginAdminForm.tsx     # 🔐 Formulaire de connexion
│   │   └── SessionExpiredModal.tsx # ⏰ Modal d'expiration
│   ├── dashboard/
│   │   ├── Dashboard.tsx          # 📊 Dashboard principal
│   │   └── ManagementDashboard.tsx # 🎛️ Dashboard de gestion
│   └── management/
│       ├── EventsManagement.tsx   # 🏃 Gestion des événements
│       ├── LieuxManagement.tsx    # 📍 Gestion des lieux
│       ├── DisciplinesManagement.tsx # 🏅 Gestion des disciplines
│       └── EpreuvesManagement.tsx # 🏆 Gestion des épreuves
├── contexts/
│   └── authContext.tsx           # 🔐 Contexte d'authentification
├── hooks/
│   ├── useSessionExpiry.ts       # ⏰ Hook d'expiration
│   └── useMobile.ts             # 📱 Hook responsive
└── lib/
    └── api/
        ├── auth/
        │   └── authService.ts    # 🔐 Service d'authentification
        └── core/
            ├── tokenHelpers.ts   # 🔑 Gestion des tokens
            ├── httpHelpers.ts    # 🌐 Helpers HTTP
            └── fetchWrappers.ts  # 📡 Wrappers de fetch
```

## 🔐 Gestion de l'Authentification

### 1. Protection d'un Nouveau Composant

```tsx
"use client";

import { useAuth } from "@/contexts/authContext";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import AuthGuard from "@/components/connexion/authGuard";

/**
 * Nouveau composant protégé
 */
function MonNouveauComposant() {
  // 1. Ajouter la surveillance d'expiration
  useSessionExpiry();

  // 2. Accéder à l'état d'authentification
  const { user, isAuthenticated } = useAuth();

  // 3. Logique du composant
  return (
    <AuthGuard>
      <div>
        <h1>Contenu protégé</h1>
        <p>Utilisateur connecté : {user?.email}</p>
      </div>
    </AuthGuard>
  );
}

export default MonNouveauComposant;
```

### 2. Gestion des Erreurs d'Authentification

```tsx
// Dans un service API
async function monServiceAPI() {
  try {
    const response = await fetch("/api/data");

    // Vérifier si la session a expiré
    if (response.status === 401) {
      // Déclencher l'expiration de session
      emitSessionExpired();
      throw new Error("Session expirée");
    }

    return response.json();
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
}
```

### 3. Test d'Expiration de Session

```tsx
import { emitSessionExpired } from "@/hooks/useSessionExpiry";

function TestComponent() {
  const handleTestExpiration = () => {
    // Simuler une expiration de session
    emitSessionExpired();
  };

  return <button onClick={handleTestExpiration}>Tester l'expiration</button>;
}
```

## 📊 Ajout d'un Nouveau Dashboard

### 1. Créer le Composant

```tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import AuthGuard from "@/components/connexion/authGuard";

/**
 * Nouveau dashboard
 */
function NouveauDashboard() {
  useSessionExpiry();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Nouveau Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{user?.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Votre contenu ici */}
        </main>
      </div>
    </AuthGuard>
  );
}

export default NouveauDashboard;
```

### 2. Intégrer au Dashboard Principal

```tsx
// Dans Dashboard.tsx
import NouveauDashboard from "./NouveauDashboard";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div>
      {/* Navigation */}
      <nav>
        <button onClick={() => setActiveSection("nouveau")}>
          Nouveau Dashboard
        </button>
      </nav>

      {/* Contenu conditionnel */}
      {activeSection === "nouveau" && (
        <NouveauDashboard onBack={() => setActiveSection("dashboard")} />
      )}
    </div>
  );
}
```

## 🎛️ Gestion des Données

### 1. Créer un Nouveau Service

```tsx
// src/lib/api/eventServices/nouveauService.ts

import { authFetch } from "../core/fetchWrappers";

/**
 * Interface pour les données
 */
interface NouvelleEntite {
  id: number;
  nom: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service pour gérer les nouvelles entités
 */
export class NouveauService {
  private baseUrl = "/api/nouvelles-entites";

  /**
   * Récupérer toutes les entités
   */
  async getAll(): Promise<NouvelleEntite[]> {
    const response = await authFetch(this.baseUrl);
    return response.json();
  }

  /**
   * Créer une nouvelle entité
   */
  async create(
    data: Omit<NouvelleEntite, "id" | "createdAt" | "updatedAt">
  ): Promise<NouvelleEntite> {
    const response = await authFetch(this.baseUrl, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Mettre à jour une entité
   */
  async update(
    id: number,
    data: Partial<NouvelleEntite>
  ): Promise<NouvelleEntite> {
    const response = await authFetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Supprimer une entité
   */
  async delete(id: number): Promise<void> {
    await authFetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
  }
}

export const nouveauService = new NouveauService();
```

### 2. Créer le Composant de Gestion

```tsx
// src/components/management/NouvelleEntiteManagement.tsx

"use client";

import { useState, useEffect } from "react";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { nouveauService } from "@/lib/api/eventServices/nouveauService";
import { NouvelleEntite } from "@/types/nouvelles-entites";
import Spinner from "@/components/spinner";
import Notification from "@/components/notification";

interface NouvelleEntiteManagementProps {
  onBack: () => void;
}

function NouvelleEntiteManagement({ onBack }: NouvelleEntiteManagementProps) {
  useSessionExpiry();

  const [entites, setEntites] = useState<NouvelleEntite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Charger les données
  useEffect(() => {
    loadEntites();
  }, []);

  const loadEntites = async () => {
    try {
      setIsLoading(true);
      const data = await nouveauService.getAll();
      setEntites(data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setNotification({
        message: "Erreur lors du chargement des données",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (
    data: Omit<NouvelleEntite, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await nouveauService.create(data);
      setNotification({
        message: "Entité créée avec succès",
        type: "success",
      });
      loadEntites();
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      setNotification({
        message: "Erreur lors de la création",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Nouvelles Entités</h1>
        <button
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Retour
        </button>
      </div>

      {/* Contenu */}
      <div className="grid gap-6">
        {entites.map((entite) => (
          <div key={entite.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{entite.nom}</h3>
            <p className="text-gray-600">{entite.description}</p>
          </div>
        ))}
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default NouvelleEntiteManagement;
```

## 🧪 Tests

### 1. Test d'un Composant Protégé

```tsx
// __tests__/nouveauComposant.test.tsx

import { render, screen } from "@testing-library/react";
import { AuthContext } from "@/contexts/authContext";
import NouveauComposant from "@/components/NouveauComposant";

// Mock du contexte d'authentification
const mockAuthContext = {
  user: { email: "test@example.com" },
  isAuthenticated: true,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  forceLogout: jest.fn(),
  currentRoute: null,
  saveCurrentRoute: jest.fn(),
  getAndClearSavedRoute: jest.fn(),
};

describe("NouveauComposant", () => {
  it("affiche le contenu quand utilisateur connecté", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <NouveauComposant />
      </AuthContext.Provider>
    );

    expect(screen.getByText("Contenu protégé")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("affiche le formulaire de connexion quand non connecté", () => {
    const unauthenticatedContext = {
      ...mockAuthContext,
      isAuthenticated: false,
      user: null,
    };

    render(
      <AuthContext.Provider value={unauthenticatedContext}>
        <NouveauComposant />
      </AuthContext.Provider>
    );

    expect(screen.getByText("Connexion")).toBeInTheDocument();
  });
});
```

### 2. Test de Service API

```tsx
// __tests__/nouveauService.test.ts

import { nouveauService } from "@/lib/api/eventServices/nouveauService";

// Mock de fetch
global.fetch = jest.fn();

describe("NouveauService", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("récupère toutes les entités", async () => {
    const mockData = [{ id: 1, nom: "Test", description: "Description test" }];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await nouveauService.getAll();

    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("/api/nouvelles-entites");
  });

  it("gère les erreurs d'API", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(nouveauService.getAll()).rejects.toThrow();
  });
});
```

## 🎨 Styles et Interface

### 1. Conventions de Style

```tsx
// Classes Tailwind recommandées
const styles = {
  // Conteneurs
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  card: "bg-white rounded-lg shadow-md p-6",

  // Boutons
  primaryButton:
    "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors",
  secondaryButton:
    "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors",
  dangerButton:
    "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors",

  // Textes
  title: "text-2xl font-bold text-gray-900",
  subtitle: "text-lg font-semibold text-gray-800",
  body: "text-gray-600",

  // Layouts
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  flex: "flex items-center justify-between",
};
```

### 2. Composants Réutilisables

```tsx
// src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}

// src/components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
  className?: string;
}

function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
```

## 🔧 Configuration et Déploiement

### 1. Variables d'Environnement

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=refresh_token
```

### 2. Scripts de Développement

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 3. Commandes Utiles

```bash
# Développement
npm run dev

# Tests
npm run test
npm run test:watch

# Build de production
npm run build
npm run start

# Linting
npm run lint
```

## 📚 Bonnes Pratiques

### 1. Code

- **Toujours** utiliser `useSessionExpiry()` dans les composants protégés
- **Toujours** envelopper le contenu sensible dans `<AuthGuard>`
- **Toujours** gérer les erreurs d'API et déclencher `emitSessionExpired()` pour les 401
- **Toujours** ajouter des commentaires JSDoc pour les fonctions publiques

### 2. Tests

- **Tester** tous les composants protégés avec et sans authentification
- **Mocker** les appels API avec des données réalistes
- **Vérifier** la gestion des erreurs et l'expiration de session

### 3. Performance

- **Utiliser** `React.memo` pour les composants coûteux
- **Optimiser** les images avec Next.js Image
- **Lazy load** les composants lourds avec `React.lazy`

### 4. Sécurité

- **Valider** toutes les entrées utilisateur
- **Nettoyer** les données avant affichage
- **Gérer** les permissions côté serveur également

## 🚀 Déploiement

### 1. Build de Production

```bash
# Installation des dépendances
npm ci

# Build optimisé
npm run build

# Démarrage en production
npm start
```

### 2. Vérifications Pré-déploiement

```bash
# Tests
npm run test

# Linting
npm run lint

# Build sans erreurs
npm run build
```

## 🎯 Conclusion

Ce guide vous donne toutes les clés pour développer efficacement dans l'architecture AdminJO Frontend. N'hésitez pas à consulter la documentation technique (`GESTION_AUTHENTIFICATION.md`) pour des détails plus approfondis sur l'authentification.

**Ressources utiles :**

- 📖 `DOCUMENTATION.md` : Documentation complète
- 🔐 `GESTION_AUTHENTIFICATION.md` : Guide d'authentification
- 📋 `RECAPITULATIF_MODIFICATIONS.md` : Résumé des changements
- 📝 `COMMENTAIRES_RECAPITULATIF.md` : Détail des commentaires

**Support :**

- Consultez les logs de développement pour le débogage
- Utilisez les tests existants comme référence
- Respectez les conventions de code établies
