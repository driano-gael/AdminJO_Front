# Services API pour la Gestion des Événements

Ce dossier contient les services d'API pour la gestion des événements olympiques, organisés par modèle de données.

## Structure des Services

### 📁 Services Disponibles

- **`disciplineService.ts`** - Gestion des disciplines sportives
- **`lieuService.ts`** - Gestion des lieux/venues
- **`evenementService.ts`** - Gestion des événements
- **`epreuveService.ts`** - Gestion des épreuves
- **`index.ts`** - Export centralisé de tous les services

## 🚀 Utilisation

### Import des Services

```typescript
// Import individuel
import {
  disciplineApi,
  DisciplineService,
} from "@/lib/api/eventServices/disciplineService";

// Import multiple
import {
  disciplineApi,
  lieuApi,
  evenementApi,
  epreuveApi,
} from "@/lib/api/eventServices";

// Import de l'objet unifié
import { eventServices } from "@/lib/api/eventServices";
```

### Exemples d'Utilisation

#### 1. Gestion des Disciplines

```typescript
import { disciplineApi } from "@/lib/api/eventServices";

// Récupérer toutes les disciplines
const disciplines = await disciplineApi.getAll();

// Créer une nouvelle discipline
const newDiscipline = await disciplineApi.create({
  nom: "Athlétisme",
});

// Mettre à jour une discipline
const updatedDiscipline = await disciplineApi.update({
  id: 1,
  nom: "Athlétisme Modifié",
});

// Supprimer une discipline
await disciplineApi.delete(1);

// Rechercher des disciplines
const searchResults = await disciplineApi.search("athle");
```

#### 2. Gestion des Lieux

```typescript
import { lieuApi } from "@/lib/api/eventServices";

// Récupérer tous les lieux avec filtres
const lieux = await lieuApi.getAll({
  nom: "Stade",
  page: 1,
  limit: 10,
});

// Vérifier la disponibilité d'un lieu
const isAvailable = await lieuApi.checkAvailability(
  1, // ID du lieu
  "2024-08-15", // Date
  "20:00" // Horaire
);
```

#### 3. Gestion des Événements

```typescript
import { evenementApi } from "@/lib/api/eventServices";

// Récupérer les événements avec détails complets
const evenements = await evenementApi.getAll({
  dateDebut: "2024-08-01",
  dateFin: "2024-08-31",
  sortBy: "date",
  sortOrder: "asc",
});

// Créer un nouvel événement
const newEvenement = await evenementApi.create({
  description: "Finale 100m Hommes",
  lieuId: 1,
  date: "2024-08-15",
  horraire: "20:00",
});

// Vérifier les conflits d'horaires
const hasConflicts = await evenementApi.checkConflicts(
  1, // ID du lieu
  "2024-08-15", // Date
  "20:00" // Horaire
);

// Récupérer les événements d'une période
const eventsPeriod = await evenementApi.getByPeriod("2024-08-01", "2024-08-31");
```

#### 4. Gestion des Épreuves

```typescript
import { epreuveApi } from "@/lib/api/eventServices";

// Récupérer les épreuves avec pagination
const epreuvesPage = await epreuveApi.getPaginated(1, 10, {
  disciplineId: 1,
  sortBy: "libelle",
});

// Récupérer les épreuves d'une discipline
const epreuvesDiscipline = await epreuveApi.getByDiscipline(1);

// Vérifier les doublons
const isDuplicate = await epreuveApi.checkDuplicate(
  1, // ID discipline
  1 // ID événement
);

// Statistiques par discipline
const stats = await epreuveApi.getStatsByDiscipline();
```

## 🏗️ Architecture des Services

### Patterns Utilisés

1. **Classe de Service Statique** - Pour une approche orientée objet
2. **API Fonctionnelle** - Pour une approche fonctionnelle plus simple
3. **Types TypeScript** - Pour la sécurité des types
4. **Gestion des Erreurs** - Propagation des erreurs via fetchApi

### Structure Type d'un Service

```typescript
// Types de requêtes
export interface CreateXRequest { ... }
export interface UpdateXRequest { ... }
export interface XFilters { ... }

// Classe de service
export class XService {
  private static readonly BASE_PATH = '/x';

  static async getAll(): Promise<X[]> { ... }
  static async getById(id: number): Promise<X> { ... }
  static async create(data: CreateXRequest): Promise<X> { ... }
  static async update(data: UpdateXRequest): Promise<X> { ... }
  static async delete(id: number): Promise<void> { ... }
}

// API fonctionnelle
export const xApi = {
  getAll: () => XService.getAll(),
  getById: (id: number) => XService.getById(id),
  // ...
};
```

## 🔧 Configuration

### Variables d'Environnement Requises

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY=refresh_token
```

### Authentification

Tous les appels API utilisent automatiquement le token d'authentification via `fetchApi` qui inclut les headers d'autorisation quand nécessaire.

## 🧪 Tests

Pour tester les services :

```typescript
import { disciplineApi } from "@/lib/api/eventServices";

// Dans vos tests Jest
jest.mock("@/lib/api/eventServices", () => ({
  disciplineApi: {
    getAll: jest.fn(),
    create: jest.fn(),
    // ...
  },
}));
```

## 📝 Bonnes Pratiques

1. **Gestion des Erreurs** - Toujours utiliser try/catch
2. **Types TypeScript** - Utiliser les interfaces fournies
3. **Pagination** - Utiliser les filtres pour de gros datasets
4. **Cache** - Implémenter du caching côté client si nécessaire
5. **Loading States** - Gérer les états de chargement dans l'UI

## 🔄 Migration depuis l'Ancien Code

Si vous avez des appels API existants, remplacez :

```typescript
// Ancien
fetch("/api/disciplines");

// Nouveau
disciplineApi.getAll();
```

## 🚨 Notes Importantes

- Les services utilisent `fetchApi` qui gère automatiquement l'authentification
- Tous les endpoints sont préfixés par `NEXT_PUBLIC_API_URL`
- Les erreurs HTTP sont propagées automatiquement
- Les types TypeScript garantissent la cohérence des données
