# AdminJO Front - Interface d'Administration

> Interface web moderne pour l'administration des Jeux Olympiques 2024

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
