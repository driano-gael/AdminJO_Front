# AdminJO - Documentation Complète du Projet

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du Projet](#architecture-du-projet)
3. [Installation et Configuration](#installation-et-configuration)
4. [Structure Détaillée](#structure-détaillée)
5. [Modules Principaux](#modules-principaux)
6. [Système d'Authentification](#système-dauthentification)
7. [Gestion des Entités Métier](#gestion-des-entités-métier)
8. [Hooks Personnalisés](#hooks-personnalisés)
9. [Services API](#services-api)
10. [Tests et Qualité](#tests-et-qualité)
11. [Déploiement](#déploiement)

---

## 🎯 Vue d'ensemble

**AdminJO** est une application web d'administration complète pour la billeterie des Jeux Olympiques 2024. Cette application front-end Next.js 15 permet aux administrateurs de gérer l'intégralité de l'écosystème événementiel olympique.

### Fonctionnalités principales

- 🔐 **Authentification sécurisée** avec JWT et gestion de sessions
- 📊 **Dashboard** interactif avec statistiques en temps réel
- 🏟️ **Gestion des événements** sportifs (disciplines, épreuves, lieux)
- 👥 **Administration des utilisateurs** (employés et clients)
- 🎫 **Gestion des offres** de billeterie et tarifications
- 📱 **Interface responsive** moderne avec TailwindCSS/DaisyUI
- ✅ **Tests automatisés** complets avec Jest

### Stack technique

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19, TypeScript 5
- **Styling**: TailwindCSS 4, DaisyUI 5
- **Tests**: Jest 29, React Testing Library 16
- **Qualité**: ESLint 9, TypeScript strict
- **Documentation**: TypeDoc

---

## 🏗️ Architecture du Projet

L'application suit une architecture modulaire basée sur Next.js 15 avec séparation claire des responsabilités :

```
src/
├── app/                           # Routes Next.js (App Router)
│   ├── layout.tsx                # Layout global avec providers
│   ├── page.tsx                  # Page d'accueil/connexion
│   ├── dashboard/                # Tableau de bord principal
│   ├── employees/                # Gestion des employés
│   ├── users/                    # Gestion des utilisateurs/clients
│   ├── pagesEvenements/          # Gestion des événements sportifs
│   ├── pageOffre/                # Gestion des offres de billeterie
│   ├── settings/                 # Paramètres système
│   ├── statistics/               # Rapports et statistiques
│   └── api/                      # Routes API internes
├── components/                    # Composants React réutilisables
│   ├── componentClient/          # Composants gestion clients
│   ├── componentEmploye/         # Composants gestion employés
│   ├── componentOffre/           # Composants gestion offres
│   ├── componentsEvenement/      # Composants événements sportifs
│   ├── connexion/                # Composants d'authentification
│   ├── layout/                   # Composants de mise en page
│   ├── navigation/               # Navigation et menus
│   └── shared/                   # Composants partagés
├── contexts/                      # Contexts React globaux
│   └── authContext.tsx           # Context d'authentification
├── hooks/                         # Hooks personnalisés métier
│   ├── useAuthenticatedPage.ts   # Protection des pages
│   ├── useSessionExpiry.ts       # Gestion expiration sessions
│   ├── useEvenementManagement.ts # Gestion événements
│   ├── useDisciplinesManagement.ts # Gestion disciplines
│   ├── useEmployesManagement.ts  # Gestion employés
│   ├── useClientsManagement.ts   # Gestion clients
│   └── useOffreManagement.ts     # Gestion offres
├── lib/                          # Services et utilitaires
│   └── api/                      # Services API
│       ├── auth/                 # Services d'authentification
│       ├── core/                 # Utilitaires API centraux
│       └── services/             # Services métier
├── types/                        # Définitions TypeScript
│   ├── client/                   # Types clients
│   ├── employe/                  # Types employés
│   ├── offre/                    # Types offres
│   ├── sportEvenement/           # Types événements sportifs
│   ├── dashBoardSections/        # Types dashboard
│   └── common/                   # Types communs
└── utils/                        # Fonctions utilitaires
    └── evenement/                # Utilitaires événements
```

### Principes architecturaux

1. **Modularité** : Chaque domaine métier est isolé
2. **Séparation des responsabilités** : Composants, hooks, services séparés
3. **Type Safety** : TypeScript strict pour tous les modules
4. **Réutilisabilité** : Composants et hooks génériques
5. **Performance** : Optimisations Next.js et lazy loading

---

## 🚀 Installation et Configuration

### Prérequis

- Node.js 20+
- npm 10+ ou yarn 1.22+
- Git

### Installation

```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd AdminJO_Front/application

# Installer les dépendances
npm install

# Configuration des variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos configurations

# Lancer en mode développement
npm run dev
```

### Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement (port 3000)

# Production
npm run build            # Build de production optimisé
npm start                # Serveur de production (port 3001)

# Tests et qualité
npm run test             # Tests unitaires (single-run)
npm run test:watch       # Tests en mode watch
npm run lint             # Linting ESLint
npm run check            # Vérification complète (lint + types + tests)

# Documentation
npm run docs             # Génération documentation TypeDoc
npm run docs:serve       # Documentation + serveur local
```

---

## 📁 Structure Détaillée

### Pages principales

| Route | Description | Composants clés |
|-------|-------------|-----------------|
| `/` | Page d'accueil avec connexion | `LoginAdminForm`, `AuthGuard` |
| `/dashboard` | Tableau de bord principal | `DashboardPage`, `PageTemplate` |
| `/pagesEvenements` | Gestion événements sportifs | `EvenementsList`, `EvenementForm` |
| `/employees` | Gestion des employés | `EmployesList`, `EmployeForm` |
| `/users` | Gestion des clients | `ClientsList`, `ClientForm` |
| `/pageOffre` | Gestion des offres | `OffresList`, `OffreForm` |
| `/settings` | Paramètres système | `SettingsPanel` |
| `/statistics` | Rapports et statistiques | `StatsCharts`, `Reports` |

### Composants par domaine

#### Gestion des Événements (`componentsEvenement/`)
- **Disciplines** : Gestion des sports olympiques
- **Épreuves** : Gestion des compétitions
- **Événements** : Planification des événements
- **Lieux** : Gestion des sites de compétition

#### Gestion des Utilisateurs
- **Employés** (`componentEmploye/`) : Administration du personnel
- **Clients** (`componentClient/`) : Gestion de la clientèle

#### Gestion Commerciale
- **Offres** (`componentOffre/`) : Configuration des offres de billeterie

---

## 🔐 Système d'Authentification

L'authentification est centralisée via le `AuthContext` avec gestion JWT complète :

### Architecture d'authentification

```typescript
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forceLogout: () => void;
  currentRoute: string | null;
  saveCurrentRoute: (route: string) => void;
  getAndClearSavedRoute: () => string | null;
}
```

### Fonctionnalités de sécurité

- **Protection des routes** : `AuthGuard` automatique
- **Gestion des sessions** : Expiration et renouvellement automatique
- **Tokens JWT** : Stockage sécurisé et refresh automatique
- **Rôles utilisateurs** : Vérification des permissions admin
- **Sauvegarde de route** : Redirection après reconnexion

---

## 🎯 Gestion des Entités Métier

### Événements Sportifs

Le module événements gère l'intégralité de la programmation olympique :

#### Types principaux
```typescript
interface ExtendEvenement {
  id: number;
  description: string;
  date_debut: string;
  date_fin: string;
  lieu: Lieu;
  epreuve: Epreuve;
  sports: string;
  prix_unitaire: number;
  nb_places_total: number;
  nb_places_vendues: number;
}

interface Lieu {
  id: number;
  nom: string;
  adresse: string;
  capacite: number;
}

interface Epreuve {
  id: number;
  nom: string;
  discipline: Discipline;
}
```

#### Fonctionnalités
- ✅ **CRUD complet** pour événements, lieux, disciplines, épreuves
- ✅ **Filtrage avancé** par lieu, discipline, statut, dates
- ✅ **Recherche en temps réel** 
- ✅ **Gestion des statuts** (planifié, en cours, terminé, annulé)
- ✅ **Statistiques** de vente et occupation

### Gestion des Employés

```typescript
interface Employe {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  departement: string;
  dateEmbauche: Date;
  active: boolean;
}
```

### Gestion des Clients

```typescript
interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateInscription: Date;
  active: boolean;
}
```

### Gestion des Offres

```typescript
interface Offre {
  id: number;
  nom: string;
  description: string;
  prix: number;
  nombrePlaces: number;
  evenement: ExtendEvenement;
  dateDebut: Date;
  dateFin: Date;
  active: boolean;
}
```

---

## 🪝 Hooks Personnalisés

Chaque entité métier dispose de son hook de gestion dédié :

### `useEvenementManagement`
Hook principal pour la gestion des événements sportifs.

```typescript
export function useEventsManagement() {
  // États des données
  const [events, setEvents] = useState<ExtendEvenement[]>([]);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  
  // États de l'interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtres avancés
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLieu, setFilterLieu] = useState<number | undefined>();
  const [filterDiscipline, setFilterDiscipline] = useState<number | undefined>();
  const [filterStatut, setFilterStatut] = useState<string | undefined>();
  
  // Fonctions de gestion
  const getFilteredEvents = () => { /* ... */ };
  const createEvent = async (data: CreateEvenementRequest) => { /* ... */ };
  const updateEvent = async (id: number, data: UpdateEvenementRequest) => { /* ... */ };
  const deleteEvent = async (id: number) => { /* ... */ };
  
  return {
    // États
    events: getFilteredEvents(),
    lieux, epreuves, loading, error,
    // Filtres
    searchTerm, setSearchTerm,
    filterLieu, setFilterLieu,
    // Actions
    createEvent, updateEvent, deleteEvent
  };
}
```

### Autres hooks disponibles

- **`useEmployesManagement`** : Gestion complète des employés
- **`useClientsManagement`** : Gestion de la clientèle
- **`useOffreManagement`** : Gestion des offres commerciales
- **`useDisciplinesManagement`** : Gestion des disciplines sportives
- **`useLieuxManagement`** : Gestion des lieux de compétition
- **`useAuthenticatedPage`** : Protection automatique des pages
- **`useSessionExpiry`** : Gestion de l'expiration des sessions

---

## 🌐 Services API

L'architecture API est organisée par domaine métier avec des services dédiés :

### Structure des services

```
lib/api/
├── auth/                    # Services d'authentification
│   ├── authService.ts      # Login, logout, refresh token
│   └── tokenHelpers.ts     # Utilitaires JWT
├── core/                   # Utilitaires API centraux
│   ├── apiClient.ts        # Client HTTP configuré
│   └── errorHandling.ts    # Gestion centralisée des erreurs
└── services/               # Services métier
    ├── evenementSports/    # Services événements
    │   ├── evenementService.ts
    │   ├── lieuService.ts
    │   ├── disciplineService.ts
    │   └── epreuveService.ts
    ├── employeService.ts   # Service employés
    ├── clientService.ts    # Service clients
    └── offreService.ts     # Service offres
```

### Exemple de service

```typescript
export const evenementApi = {
  // Récupération
  getAll: async (): Promise<ExtendEvenement[]> => {
    const response = await apiClient.get('/evenements');
    return response.data;
  },
  
  // Création
  create: async (data: CreateEvenementRequest): Promise<ExtendEvenement> => {
    const response = await apiClient.post('/evenements', data);
    return response.data;
  },
  
  // Mise à jour
  update: async (id: number, data: UpdateEvenementRequest): Promise<ExtendEvenement> => {
    const response = await apiClient.put(`/evenements/${id}`, data);
    return response.data;
  },
  
  // Suppression
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/evenements/${id}`);
  }
};
```

---

## 🧪 Tests et Qualité

L'application maintient une couverture de tests élevée avec Jest et React Testing Library :

### Structure des tests

```
__tests__/
├── components/              # Tests des composants
│   ├── connexion/          # Tests authentification
│   ├── componentsEvenement/ # Tests événements
│   ├── componentEmploye/    # Tests employés
│   └── shared/             # Tests composants partagés
├── contexts/               # Tests des contexts
├── hooks/                  # Tests des hooks personnalisés
├── lib/api/               # Tests des services API
└── utils/                 # Tests des utilitaires
```

### Configuration des tests

- **Jest 29** avec environnement jsdom
- **React Testing Library 16** pour les tests de composants
- **Mocks** automatiques pour Next.js et les APIs
- **Coverage** reporting avec seuils de qualité
- **CI/CD** intégration pour les tests automatiques

---

## 🚀 Déploiement

### Environnements

```env
# Configuration API
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_TIMEOUT=10000

# Authentification JWT
NEXT_PUBLIC_JWT_SECRET=your-super-secret-key
NEXT_PUBLIC_SESSION_TIMEOUT=3600000

# Configuration app
NEXT_PUBLIC_APP_NAME="AdminJO"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_DEBUG_MODE=false
```

### Build et déploiement

```bash
# Build optimisé
npm run build

# Vérification pré-déploiement
npm run check

# Lancement production
npm start
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 📊 Fonctionnalités du Dashboard

Le tableau de bord principal (`/dashboard`) offre :

### Sections disponibles

1. **🏟️ Gestion des événements sportifs**
   - Événements, lieux, disciplines, épreuves
   - Planification et statistiques

2. **🎫 Gestion des offres**
   - Configuration des offres de billeterie
   - Tarifications et promotions

3. **👥 Gestion des employés**
   - Administration du personnel
   - Rôles et permissions

4. **📊 Statistiques**
   - Rapports de vente
   - Métriques de performance

### Statistiques en temps réel

- **Événements sportifs** : Nombre total et statuts
- **Utilisateurs actifs** : Clients et employés connectés
- **Offres disponibles** : Billeterie active
- **Employés** : Personnel administratif

---

## 🔄 Gestion des États

L'application utilise une approche hybride pour la gestion des états :

### États globaux (Context)
- **Authentification** : `AuthContext` pour l'état utilisateur
- **Notifications** : Système de notifications global

### États locaux (Hooks)
- **Données métier** : Hooks personnalisés par entité
- **Interface utilisateur** : États de formulaires et filtres
- **Performance** : Memoization et optimisations

---

## 🌟 Fonctionnalités Avancées

- **🔍 Recherche temps réel** : Filtrage instantané sur tous les modules
- **🎨 Interface responsive** : Design adaptatif mobile/desktop
- **⚡ Performance optimisée** : Lazy loading et code splitting
- **🛡️ Sécurité renforcée** : Protection CSRF et validation stricte
- **📱 PWA Ready** : Service workers et mise en cache
- **🌍 Internationalisation** : Support multi-langues préparé

---

## 📚 Ressources et Documentation

### Documentation technique
- [TypeDoc généré](./docs/index.html) - Documentation automatique du code
- [Tests Coverage](./coverage/index.html) - Rapport de couverture
- [API Guide](./API_GUIDE.md) - Guide détaillé des services

### Standards du projet
- **TypeScript strict** : Configuration stricte activée
- **ESLint** : Configuration Next.js + règles custom
- **Prettier** : Formatage automatique du code
- **Conventional Commits** : Convention de messages de commit

---

*Documentation générée automatiquement avec TypeDoc - Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}*

*Projet scolaire STUDI - Administration Billeterie JO 2024*
