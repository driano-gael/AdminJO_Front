# Documentation TypeDoc - Hooks AdminJO

## Vue d'ensemble du dossier hooks

Le dossier `src/hooks` de l'application AdminJO contient 9 hooks React personnalisés qui centralisent la logique métier et les interactions avec les APIs. Ces hooks suivent les bonnes pratiques React et fournissent des interfaces unifiées pour la gestion des différentes entités de l'application.

## Architecture des hooks

### Hooks d'authentification et sécurité

#### useAuthenticatedPage
**Localisation** : `src/hooks/useAuthenticatedPage.ts`

Hook de protection et d'authentification pour les pages AdminJO qui centralise la logique de protection des pages dans l'application d'administration des JO 2024. Il combine les fonctionnalités d'authentification et de gestion d'expiration de session.

**Fonctionnalités intégrées** :
- **Authentification automatique** : Vérification d'état, redirection automatique, persistance de session, gestion des rôles
- **Gestion d'expiration de session** : Surveillance automatique, alerte préventive, renouvellement transparent, déconnexion propre
- **Sécurité renforcée** : Validation de token, protection CSRF, sauvegarde de route

**Interface** :
```typescript
function useAuthenticatedPage(): AuthContextType
```

**Utilisation** :
```tsx
function ProtectedPage() {
  const { user, isAuthenticated, logout } = useAuthenticatedPage();
  
  if (!isAuthenticated) {
    return null; // Redirection automatique gérée
  }
  
  return <div>Bienvenue, {user?.email}</div>;
}
```

#### useSessionExpiry
**Localisation** : `src/hooks/useSessionExpiry.ts`

Hook de surveillance automatique de l'expiration de session qui fournit un système automatisé de surveillance et de gestion de l'expiration des sessions utilisateur.

**Fonctionnalités principales** :
- **Surveillance d'événements** : Monitoring des événements 'sessionExpired' globaux
- **Gestion de l'expiration** : Vérification d'état, déconnexion forcée, protection continue
- **Intégration système** : Coordination avec tokenHelpers, AuthContext, Services API

**Interface** :
```typescript
function useSessionExpiry(): void
```

**Cycle de fonctionnement** :
1. Enregistrement de l'écouteur d'événements au montage
2. Écoute continue des événements 'sessionExpired'
3. Validation de l'état d'authentification à réception
4. Déclenchement de forceLogout() si utilisateur connecté
5. Nettoyage de l'écouteur au démontage

### Hooks de gestion des entités

#### useClientsManagement
**Localisation** : `src/hooks/useClientsManagement.ts`

Hook de gestion complète des clients qui centralise toute la logique de gestion des clients dans l'application d'administration des JO 2024.

**Fonctionnalités principales** :
- **Gestion des données clients** : Chargement automatique, gestion d'état, mise à jour optimiste, synchronisation
- **Système de filtrage et recherche** : Recherche textuelle, filtrage par statut, filtres combinés, mise à jour temps réel
- **Gestion des statuts d'activation** : Toggle activation, mise à jour optimiste, gestion d'erreurs, feedback visuel

**États gérés** :
```typescript
interface ClientsManagementState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'inactive';
}
```

**Interface de retour** :
```typescript
interface ClientsManagementReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: string;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: 'all' | 'active' | 'inactive') => void;
  loadClients: () => Promise<void>;
  toggleClientActive: (clientId: number) => Promise<void>;
  getFilteredClients: () => Client[];
}
```

#### useEmployesManagement
**Localisation** : `src/hooks/useEmployesManagement.ts`

Hook de gestion complète des employés qui centralise toute la logique de gestion des employés dans l'application d'administration des JO 2024.

**Fonctionnalités principales** :
- **Gestion des données employés** : Chargement automatique, gestion d'état, mise à jour synchrone, synchronisation
- **Système de filtrage et recherche** : Recherche textuelle par nom/prénom/email/téléphone, filtrage par statut, filtres combinés
- **Gestion des opérations CRUD** : Création d'employés, lecture des données, gestion des statuts, états de création

**États gérés** :
```typescript
interface EmployesManagementState {
  employes: Employe[];
  loading: boolean;
  error: string | null;
  isCreating: boolean;
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'inactive';
}
```

**Opérations disponibles** :
- `loadEmployes()` : Récupération de tous les employés
- `createEmploye()` : Création de nouveaux employés avec rechargement
- `toggleEmployeActive()` : Basculer l'état actif/inactif avec mise à jour optimiste

### Hooks de gestion des événements sportifs

#### useDisciplinesManagement
**Localisation** : `src/hooks/useDisciplinesManagement.ts`

Hook de gestion complète des disciplines sportives qui centralise la logique de gestion des disciplines sportives des JO 2024.

**Fonctionnalités principales** :
- **Gestion des données disciplines** : Chargement automatique, tri alphabétique, gestion d'état, synchronisation
- **Système de recherche** : Recherche textuelle, recherche API, mise à jour dynamique
- **Opérations CRUD complètes** : Création, lecture, mise à jour, suppression, tri automatique

**Interface de retour** :
```typescript
interface DisciplinesManagementReturn {
  disciplines: Discipline[];
  searchTerm: string;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  setSearchTerm: (term: string) => void;
  setCreateError: (error: string | null) => void;
  loadDisciplines: (searchQuery?: string) => Promise<void>;
  createDiscipline: (data: CreateDisciplineRequest) => Promise<Discipline>;
  updateDiscipline: (id: number, data: CreateDisciplineRequest) => Promise<Discipline>;
  deleteDiscipline: (id: number) => Promise<void>;
  handleSearch: (term: string) => void;
}
```

#### useEpreuvesManagement
**Localisation** : `src/hooks/useEpreuvesManagement.ts`

Hook de gestion complète des épreuves sportives qui centralise la logique de gestion des épreuves sportives des JO 2024.

**Fonctionnalités principales** :
- **Gestion des données épreuves** : Chargement automatique, tri hiérarchique, gestion d'état, synchronisation
- **Système de filtrage avancé** : Recherche textuelle, filtrage par discipline, filtres combinés, recherche API
- **Opérations CRUD complètes** : Création, lecture, mise à jour, suppression, tri automatique

**États gérés** :
```typescript
interface EpreuvesManagementState {
  epreuves: Epreuve[];
  disciplines: Discipline[];
  searchTerm: string;
  selectedDisciplineId: number | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
}
```

**Flux de fonctionnement** :
1. Chargement des épreuves et disciplines avec tri hiérarchique
2. Application des filtres de recherche et discipline côté serveur
3. Opérations CRUD avec mise à jour immédiate et recharge des disciplines
4. Maintien automatique de l'ordre discipline > épreuve
5. Capture et affichage des erreurs pour chaque opération

#### useLieuxManagement
**Localisation** : `src/hooks/useLieuxManagement.ts`

Hook de gestion complète des lieux olympiques qui centralise la logique de gestion des lieux olympiques des JO 2024.

**Fonctionnalités principales** :
- **Gestion des données lieux** : Chargement automatique, tri alphabétique, gestion d'état, synchronisation
- **Système de recherche** : Recherche textuelle, recherche API, mise à jour dynamique
- **Opérations CRUD complètes** : Création, lecture, mise à jour, suppression, tri automatique

**Interface de retour** :
```typescript
interface LieuxManagementReturn {
  lieux: Lieu[];
  searchTerm: string;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  setSearchTerm: (term: string) => void;
  setCreateError: (error: string | null) => void;
  loadLieux: (searchQuery?: string) => Promise<void>;
  createLieu: (data: CreateLieuRequest) => Promise<Lieu>;
  updateLieu: (id: number, data: CreateLieuRequest) => Promise<Lieu>;
  deleteLieu: (id: number) => Promise<void>;
  handleSearch: (term: string) => void;
}
```

#### useEvenementManagement
**Localisation** : `src/hooks/useEvenementManagement.ts`

Hook de gestion des événements sportifs AdminJO qui centralise la logique de gestion des événements sportifs des JO 2024, incluant les opérations CRUD, le filtrage avancé, la recherche en temps réel et la synchronisation avec les APIs des événements, lieux et épreuves.

**Interface complexe** :
```typescript
interface UseEventsManagementReturn {
  // Données principales
  events: ExtendEvenement[];
  lieux: Lieu[];
  epreuves: Epreuve[];
  searchTerm: string;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;

  // Filtres disponibles
  filterLieu: number | undefined;
  filterDiscipline: number | undefined;
  filterEpreuve: number | undefined;
  filterStatut: string | undefined;
  filterDateDebut: string;
  filterDateFin: string;

  // Actions de filtrage
  setSearchTerm: (term: string) => void;
  setFilterLieu: (lieuId: number | undefined) => void;
  setFilterDiscipline: (disciplineId: number | undefined) => void;
  setFilterEpreuve: (epreuveId: number | undefined) => void;
  setFilterStatut: (statut: string | undefined) => void;
  setFilterDateDebut: (date: string) => void;
  setFilterDateFin: (date: string) => void;
}
```

### Hook de gestion des offres

#### useOffreManagement
**Localisation** : `src/hooks/useOffreManagement.ts`

Hook de gestion des offres pour l'application AdminJO qui centralise la logique de gestion des offres avec opérations CRUD et système de notifications.

**Fonctionnalités principales** :
- **Gestion des données offres** : Chargement automatique, gestion d'état, synchronisation
- **Opérations CRUD complètes** : Création, lecture, mise à jour, suppression
- **Système de notifications** : Feedback utilisateur pour chaque opération

**États gérés** :
```typescript
interface OffreManagementState {
  offres: Offre[];
  loading: boolean;
  error: string | null;
  formLoading: boolean;
  formNotification: Notification | null;
}
```

**Interface de retour** :
```typescript
interface OffreManagementReturn {
  offres: Offre[];
  loading: boolean;
  error: string | null;
  formLoading: boolean;
  formNotification: Notification | null;
  loadOffres: () => Promise<void>;
  createOffre: (data: Offre) => Promise<Offre>;
  updateOffre: (id: number, data: Offre) => Promise<Offre>;
  deleteOffre: (id: number) => Promise<void>;
  setFormNotification: (notification: Notification | null) => void;
}
```

## Patterns et bonnes pratiques

### Gestion d'état uniforme
Tous les hooks suivent un pattern cohérent pour la gestion d'état :
- **loading** : État de chargement principal
- **error** : Gestion centralisée des erreurs
- **createLoading** : États spécifiques aux opérations CRUD
- **createError** : Erreurs spécifiques aux opérations de modification

### Opérations asynchrones
- Gestion des erreurs avec try/catch systématique
- États de chargement pour feedback utilisateur
- Mise à jour optimiste quand approprié
- Rollback automatique en cas d'échec

### Intégrations API
- Services API dédiés pour chaque entité
- Délégation des filtres au backend pour optimisation
- Synchronisation automatique des données
- Validation côté client avant envoi

### Recherche et filtrage
- Filtrage temps réel côté client
- Recherche déléguée au serveur pour performance
- Combinaison de critères multiples
- Maintien de l'état des filtres

## Architecture technique

### Dépendances
- **React** : `useState`, `useEffect`, `useCallback`
- **Services API** : Intégration avec les services métier
- **Types TypeScript** : Interfaces strictes pour tous les retours
- **Contexts** : Intégration avec AuthContext pour la sécurité

### Performance
- Lazy loading des données
- Debouncing des recherches
- Mise en cache locale des résultats
- Tri optimisé côté client

### Sécurité
- Validation des permissions via useAuthenticatedPage
- Gestion automatique de l'expiration de session
- Protection contre les injections
- Nettoyage automatique des écouteurs d'événements

Cette documentation couvre l'ensemble des hooks de l'application AdminJO en se concentrant sur les fonctionnalités réellement implémentées dans le code analysé, sans ajout de spéculations sur les performances ou améliorations futures.
