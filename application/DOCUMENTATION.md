# Documentation Technique - AdminJO Frontend

## Vue d'ensemble du projet

Cette application est un système d'administration pour les Jeux Olympiques (JO) développé avec Next.js 14, TypeScript et TailwindCSS. Elle permet la gestion complète des entités olympiques avec un système d'authentification sécurisé.

## Architecture du projet

### 🏗️ Structure des dossiers

```
src/
├── app/                    # Pages et layout Next.js 14 (App Router)
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal de l'application
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
│   ├── auth/             # Composants d'authentification
│   │   └── SessionExpiredModal.tsx
│   ├── connexion/        # Composants de connexion
│   │   ├── authGuard.tsx
│   │   └── loginAdminForm.tsx
│   ├── dashboard/        # Composants du tableau de bord
│   │   └── Dashboard.tsx
│   ├── management/       # Composants de gestion
│   │   ├── AuthGuard.tsx
│   │   ├── DisciplinesManagement.tsx
│   │   ├── EpreuvesManagement.tsx
│   │   ├── EventsManagement.tsx
│   │   ├── LieuxManagement.tsx
│   │   ├── ManagementDashboard.tsx
│   │   └── PlaceholderManagement.tsx
│   ├── notification.tsx  # Composant de notification
│   └── spinner.tsx       # Composant de chargement
├── contexts/             # Contextes React
│   └── authContext.tsx   # Contexte d'authentification
├── hooks/                # Hooks personnalisés
│   ├── useMobile.ts
│   └── useSessionExpiry.ts
├── lib/                  # Utilitaires et services
│   └── api/              # Services API
│       ├── auth/         # Services d'authentification
│       ├── core/         # Services centraux
│       └── eventServices/ # Services des entités
├── types/                # Types TypeScript
│   ├── apiEvenement/     # Types des entités
│   └── dashBoardSections/ # Types du dashboard
└── utils/                # Utilitaires divers
```

## 🔐 Système d'authentification

### Fonctionnalités principales

1. **Authentification JWT** : Utilisation de tokens JWT pour l'authentification
2. **Refresh automatique** : Renouvellement automatique des tokens expirés
3. **Session persistante** : Maintien de la session entre les recharges
4. **Expiration gérée** : Modal d'expiration avec compte à rebours
5. **Protection des routes** : AuthGuard pour protéger les composants

### Flux d'authentification

```
1. Connexion utilisateur → authService.login()
2. Stockage des tokens → localStorage
3. Utilisation des APIs → fetchWrapper (auto-refresh)
4. Expiration détectée → SessionExpiredModal
5. Déconnexion → Nettoyage des tokens
```

### Composants clés

- **`authContext.tsx`** : Contexte global d'authentification
- **`authService.ts`** : Service d'authentification avec l'API
- **`authGuard.tsx`** : Protection des routes
- **`SessionExpiredModal.tsx`** : Modal d'expiration de session
- **`useSessionExpiry.ts`** : Hook de gestion de l'expiration

## 🌐 Services API

### Architecture des services

Tous les services API suivent une architecture cohérente :

```typescript
// Structure type d'un service
export class EntityService {
  private static readonly BASE_PATH = "/endpoint";

  static async getAll(filters?: Filters): Promise<Entity[]>;
  static async getById(id: number): Promise<Entity>;
  static async create(data: CreateRequest): Promise<Entity>;
  static async update(data: UpdateRequest): Promise<Entity>;
  static async delete(id: number): Promise<void>;
}

// API fonctionnelle
export const entityApi = {
  getAll: (filters?) => EntityService.getAll(filters),
  getById: (id) => EntityService.getById(id),
  create: (data) => EntityService.create(data),
  update: (data) => EntityService.update(data),
  delete: (id) => EntityService.delete(id),
};
```

### Services disponibles

- **`authService.ts`** : Authentification et gestion des tokens
- **`evenementService.ts`** : Gestion des événements sportifs
- **`lieuService.ts`** : Gestion des lieux
- **`disciplineService.ts`** : Gestion des disciplines
- **`epreuveService.ts`** : Gestion des épreuves

### Gestion des erreurs

Tous les services utilisent `fetchApi` qui gère automatiquement :

- Ajout des headers d'authentification
- Refresh automatique des tokens
- Gestion des erreurs HTTP
- Conversion JSON automatique

## 📱 Interface utilisateur

### Design System

- **Framework CSS** : TailwindCSS pour un design moderne
- **Composants** : Composants réutilisables et accessibles
- **Responsive** : Interface adaptée mobile et desktop
- **Accessibilité** : Attributs ARIA et navigation clavier

### Composants UI principaux

1. **`Dashboard.tsx`** : Tableau de bord principal
2. **`ManagementDashboard.tsx`** : Dashboard de gestion
3. **`EventsManagement.tsx`** : Gestion des événements
4. **`Notification.tsx`** : Système de notifications
5. **`Spinner.tsx`** : Indicateurs de chargement

### Navigation

```
Dashboard Principal
└── Gestion Complète
    ├── Événements
    ├── Lieux
    ├── Disciplines
    └── Épreuves
```

## 🏷️ Types TypeScript

### Entités métier

```typescript
// Discipline sportive
interface Discipline {
  id: number;
  nom: string;
}

// Lieu sportif
interface Lieu {
  id: number;
  nom: string;
}

// Événement sportif
interface Evenement {
  id: number;
  description: string;
  lieu: Lieu;
  date: string;
  horraire: string;
}

// Épreuve sportive
interface Epreuve {
  id: number;
  libelle: string;
  discipline: Discipline;
}
```

### Types d'interface

- **`DashboardSection`** : Configuration des sections du dashboard
- **`AuthState`** : État d'authentification
- **`NotificationProps`** : Props des notifications

## 🔧 Hooks personnalisés

### `useSessionExpiry`

Hook qui écoute les événements d'expiration de session et affiche automatiquement le modal d'expiration.

```typescript
const useSessionExpiry = () => {
  // Écoute les événements d'expiration
  // Déclenche le modal automatiquement
  // Gère la déconnexion forcée
};
```

### `useMobile`

Hook pour détecter les appareils mobiles et adapter l'interface.

## 🧪 Tests

### Structure des tests

```
__test__/
├── authContext.test.tsx
├── authGuard.test.tsx
├── authService.test.ts
├── fetchWrappers.test.ts
├── httpHelpers.test.ts
├── loginAdminForm.test.tsx
├── notification.test.tsx
├── spinner.test.tsx
└── tokenHelpers.test.ts
```

### Configuration

- **Framework** : Jest avec React Testing Library
- **Setup** : Configuration dans `jest.setup.js`
- **Mocks** : Mocks des APIs et du localStorage

## 🚀 Déploiement

### Prérequis

- Node.js 18+
- npm ou yarn
- Variables d'environnement configurées

### Scripts disponibles

```bash
npm run dev          # Démarrage en développement
npm run build        # Build de production
npm run start        # Démarrage en production
npm run lint         # Vérification du code
npm run test         # Exécution des tests
```

### Variables d'environnement

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_ENV=production
```

## 📋 Bonnes pratiques

### Code

1. **TypeScript strict** : Tous les fichiers sont typés
2. **Commentaires détaillés** : JSDoc pour tous les composants
3. **Error handling** : Gestion d'erreurs robuste
4. **Accessibilité** : Respect des standards WCAG
5. **Performance** : Optimisation des rendus React

### Sécurité

1. **Authentification** : Tokens JWT sécurisés
2. **Validation** : Validation côté client et serveur
3. **HTTPS** : Communication chiffrée
4. **CORS** : Configuration appropriée
5. **Sanitization** : Échappement des données utilisateur

### Maintenance

1. **Logs** : Système de logging en développement
2. **Monitoring** : Suivi des erreurs
3. **Documentation** : Code auto-documenté
4. **Tests** : Couverture des fonctionnalités critiques

## 📞 Support et maintenance

### Debugging

- Utiliser les outils de développement React
- Consulter les logs de la console
- Vérifier l'état des contextes React
- Tester les API endpoints

### Évolutions futures

1. **Monitoring** : Intégration d'outils de monitoring
2. **Cache** : Système de cache pour les APIs
3. **Offline** : Support mode hors ligne
4. **Notifications** : Notifications push
5. **Analytics** : Suivi des performances

---

_Cette documentation est maintenue à jour avec chaque évolution du projet._
