# AdminJO Front - Interface d'Administration

> Interface web moderne pour l'administration des Jeux Olympiques 2024

## Sommaire

- [À propos du projet](#à-propos-du-projet)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Technologies](#technologies)
- [Sécurité](#sécurité)
- [Architecture du projet](#architecture-du-projet)
- [Axes d'évolution futures](#axes-dévolution-futures)

## À propos du projet

AdminJO Front est l'interface d'administration officielle pour la gestion des Jeux Olympiques 2024. Cette application web permet aux administrateurs de gérer l'ensemble de l'écosystème olympique : événements sportifs, infrastructures, personnel et services commerciaux.

## Fonctionnalités principales

### Gestion des événements sportifs
- Administration complète des événements olympiques
- Planification des compétitions et des horaires
- Gestion des lieux et des infrastructures sportives
- Organisation des disciplines et épreuves

### Gestion des utilisateurs
- Administration du personnel (employés)
- Gestion des clients

### Gestion commerciale
- Administration des offres de billetterie

## Technologies

**Frontend moderne**
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Développement type-safe
- **Tailwind CSS** - Design system moderne

**Architecture & Qualité**
- **Hooks personnalisés** - Logique métier réutilisable
- **Services API** - Intégration backend structurée
- **Tests automatisés** - Jest & Testing Library
- **Documentation** - TypeDoc intégrée

## Sécurité

### Authentification JWT

Le système d'authentification repose sur des **tokens JWT (JSON Web Tokens)** avec une architecture à double token :

- **Token d'accès** : JWT courte durée pour les requêtes API authentifiées
- **Token de rafraîchissement** : Token longue durée pour renouveler automatiquement l'accès

### Gestion sécurisée des tokens

**Stockage local sécurisé**
- Stockage des tokens dans le `localStorage` avec clés configurables via variables d'environnement
- Nettoyage automatique des tokens en cas d'expiration ou d'erreur
- Protection côté serveur avec vérifications `typeof window === 'undefined'`

**Validation automatique**
- Vérification de l'intégrité des tokens JWT via décodage Base64
- Contrôle de la date d'expiration (`exp`) avant chaque utilisation
- Gestion des erreurs de parsing avec fallback sécurisé

### Protection des routes et API

**Authentification automatique**
- Ajout automatique de l'en-tête `Authorization: Bearer <token>` sur toutes les requêtes authentifiées
- Middleware de protection des pages via le hook `useAuthenticatedPage`
- Redirection automatique vers la page de connexion pour les utilisateurs non authentifiés

**Gestion de l'expiration de session**
- Détection automatique des erreurs 401 (Unauthorized)
- Tentative de rafraîchissement automatique du token d'accès
- Nettoyage de session et notification utilisateur en cas d'échec du refresh
- Modal d'expiration de session pour informer l'utilisateur

### Architecture de sécurité

**Service d'authentification centralisé**
- Module `authService` dédié pour login, logout et refresh token
- Gestion centralisée des erreurs d'authentification
- Interface TypeScript stricte pour les credentials et réponses

**Contexte d'authentification React**
- État global d'authentification avec `AuthContext`
- Gestion du rôle utilisateur (vérification rôle 'admin' requis)
- Persistance sécurisée de l'état entre les rechargements de page

**Wrappers de requêtes sécurisés**
- Fonction `fetchApi` avec gestion automatique de l'authentification
- Retry automatique avec nouveau token en cas de 401
- Gestion des erreurs HTTP avec messages détaillés et logging

### Variables d'environnement

**Configuration sécurisée**
- `NEXT_PUBLIC_API_URL` : URL de base de l'API backend
- `NEXT_PUBLIC_AUTH_TOKEN_KEY` : Clé de stockage du token d'accès
- `NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY` : Clé de stockage du token de rafraîchissement

**Validation au démarrage**
- Vérification obligatoire de la présence des variables d'environnement critiques
- Erreurs explicites en cas de configuration manquante

### Protection côté client

**Hooks de protection**
- `useAuthenticatedPage` : Protection automatique des pages sensibles
- `useSessionExpiry` : Surveillance continue de l'expiration de session
- `useAuth` : Accès sécurisé au contexte d'authentification

**Gestion des événements de sécurité**
- Événement `tokenRefreshed` pour synchroniser les composants
- Callback `sessionExpired` pour notifications utilisateur
- Nettoyage automatique en cas de tokens compromis

## Architecture du projet

```
application/
├── src/
│   ├── app/              # Pages et routing Next.js
│   ├── components/       # Composants UI réutilisables
│   ├── hooks/           # Logique métier (hooks)
│   ├── lib/             # Services API et utilitaires
│   ├── types/           # Définitions TypeScript
│   └── utils/           # Fonctions utilitaires
├── __tests__/           # Tests unitaires et d'intégration
└── public/              # Assets statiques
```

## Axes d'évolution futures

### Améliorations techniques

#### Sécurité renforcée
- **Authentification multi-facteurs (2FA)** : Renforcement de la sécurité pour les comptes administrateurs
- **Audit des actions** : Système de logs détaillés pour tracer toutes les modifications importantes
- **Rate limiting** : Protection contre les attaques par déni de service

### Fonctionnalités métier avancées

#### Analytics et reporting
- **Tableaux de bord temps réel** : Métriques de fréquentation, ventes et performance des événements
- **Prédictions** : Analyse prédictive de la fréquentation et optimisation des ressources
- **Heatmaps** : Visualisation des zones les plus fréquentées par site olympique

#### Gestion événementielle avancée
- **Planning dynamique** : Gestion intelligente des conflits d'horaires et d'infrastructures
- **Notifications push** : Système d'alertes en temps réel pour les changements critiques

### Expérience utilisateur

#### Interface moderne
- **Mode sombre/clair** : Thème adaptatif selon les préférences utilisateur
- **Interface mobile native** : Application mobile dédiée pour la gestion sur le terrain
- **Accessibilité** : Conformité complète aux standards d'accessibilité web

### Intégrations

#### Services externes
- **Géolocalisation avancée** : Intégration avec Google Maps/OpenStreetMap pour la navigation
- **Traduction automatique** : Support multilingue automatique pour l'internationalisation

### Technologies émergentes

#### Infrastructure moderne
- **Architecture microservices** : Migration vers une architecture plus modulaire et scalable
- **Containerisation** : Déploiement avec Docker et Kubernetes pour la haute disponibilité

---

