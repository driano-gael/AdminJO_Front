# AdminJO Frontend - Système d'Administration des Jeux Olympiques

## 🏅 Vue d'ensemble

Application web d'administration pour la gestion des Jeux Olympiques développée avec Next.js 14, TypeScript et TailwindCSS. Cette application offre une interface complète pour gérer les événements, lieux, disciplines et épreuves olympiques avec un système d'authentification sécurisé.

## ✨ Fonctionnalités principales

### 🔐 Authentification sécurisée

- Système JWT avec refresh automatique des tokens
- Protection des routes avec AuthGuard
- Gestion de l'expiration de session avec modal interactif
- Persistance de session entre les recharges

### 🏛️ Gestion complète des entités

- **Événements** : Création, modification et suppression d'événements sportifs
- **Lieux** : Administration des sites et installations olympiques
- **Disciplines** : Gestion des différentes disciplines sportives
- **Épreuves** : Configuration des épreuves et compétitions

### 📊 Interface moderne

- Design responsive et accessible
- Dashboard intuitif avec navigation fluide
- Notifications temps réel pour les actions utilisateur
- Indicateurs de chargement et gestion d'erreurs

## 🚀 Installation et démarrage

### Prérequis

- Node.js 18+
- npm, yarn, pnpm ou bun
- Accès à l'API backend Django

### Installation

```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd AdminJO_Front/application

# Installer les dépendances
npm install
# ou
yarn install
```

### Configuration

Créer un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_ENV=development
```

### Démarrage en développement

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📋 Scripts disponibles

```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm run start        # Démarrage en production
npm run lint         # Vérification du code avec ESLint
npm run test         # Exécution des tests
npm run test:watch   # Tests en mode watch
```

## 🏗️ Architecture

### Structure du projet

```
src/
├── app/                    # Pages Next.js 14 (App Router)
├── components/            # Composants réutilisables
│   ├── auth/             # Authentification
│   ├── connexion/        # Connexion
│   ├── dashboard/        # Tableau de bord
│   └── management/       # Gestion des entités
├── contexts/             # Contextes React
├── hooks/                # Hooks personnalisés
├── lib/                  # Services et utilitaires
│   └── api/              # Services API
├── types/                # Types TypeScript
└── utils/                # Utilitaires
```

### Technologies utilisées

- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique pour plus de robustesse
- **TailwindCSS** : Framework CSS utilitaire
- **React Context** : Gestion d'état global
- **Jest + React Testing Library** : Tests unitaires

## 🔐 Authentification

### Fonctionnement

1. **Connexion** : L'utilisateur se connecte avec ses identifiants
2. **Tokens JWT** : Réception et stockage des tokens d'accès et de refresh
3. **Auto-refresh** : Renouvellement automatique des tokens expirés
4. **Protection** : Vérification automatique sur toutes les routes protégées
5. **Expiration** : Modal d'expiration avec compte à rebours

### Composants clés

- `authContext.tsx` : Contexte global d'authentification
- `authGuard.tsx` : Protection des routes
- `SessionExpiredModal.tsx` : Gestion de l'expiration
- `useSessionExpiry.ts` : Hook de gestion de l'expiration

## 🧪 Tests

### Exécution des tests

```bash
# Tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Tests disponibles

- Tests unitaires des composants
- Tests des services API
- Tests des hooks personnalisés
- Tests du contexte d'authentification

## 📱 Interface utilisateur

### Navigation

```
Dashboard Principal
└── Gestion Complète
    ├── Événements (CRUD complet)
    ├── Lieux (CRUD complet)
    ├── Disciplines (CRUD complet)
    └── Épreuves (CRUD complet)
```

### Fonctionnalités UI

- **Responsive Design** : Interface adaptée mobile et desktop
- **Accessibilité** : Respect des standards WCAG
- **Notifications** : Système de notifications contextuelles
- **Chargement** : Indicateurs de progression
- **Recherche** : Filtrage et recherche côté serveur

## 🔧 Développement

### Bonnes pratiques

1. **TypeScript** : Tous les fichiers sont typés
2. **Commentaires** : JSDoc pour tous les composants
3. **Tests** : Couverture des fonctionnalités critiques
4. **Accessibilité** : Attributs ARIA et navigation clavier
5. **Performance** : Optimisation des rendus React

### Ajout de nouvelles fonctionnalités

1. Créer les types TypeScript dans `src/types/`
2. Développer les services API dans `src/lib/api/`
3. Créer les composants dans `src/components/`
4. Ajouter les tests dans `__test__/`
5. Mettre à jour la documentation

## 📚 Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** : Documentation technique complète
- **JSDoc** : Documentation intégrée dans le code
- **Types TypeScript** : Définitions des interfaces

## 🚢 Déploiement

### Build de production

```bash
npm run build
npm run start
```

### Variables d'environnement

```env
NEXT_PUBLIC_API_URL=https://api.production.com
NEXT_PUBLIC_APP_ENV=production
```

### Déploiement recommandé

- **Vercel** : Déploiement automatique avec Next.js
- **Netlify** : Alternative avec build automatique
- **Docker** : Containerisation avec le Dockerfile fourni

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📞 Support

### Debugging

- Utiliser les React DevTools
- Vérifier les logs de la console
- Tester les endpoints API
- Examiner l'état des contextes

### Logs

En développement, les logs détaillés sont disponibles dans la console du navigateur.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour les Jeux Olympiques**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
