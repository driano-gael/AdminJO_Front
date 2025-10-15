# AdminJO Front - Documentation API

Interface d'administration pour les Jeux Olympiques 2024.

## Vue d'ensemble

Cette application Next.js fournit une interface d'administration complète pour la gestion des événements, lieux, disciplines, épreuves et offres des Jeux Olympiques 2024.

## Architecture

### Composants principaux
- **Gestion des événements** : Interface complète CRUD pour les événements olympiques
- **Gestion des lieux** : Administration des sites olympiques
- **Gestion des disciplines** : Organisation des disciplines sportives
- **Gestion des épreuves** : Configuration des épreuves par discipline
- **Système d'authentification** : Connexion sécurisée des administrateurs

### Technologies utilisées
- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique pour la robustesse
- **Tailwind CSS** : Framework CSS utility-first
- **React Hook Form** : Gestion des formulaires
- **Zustand** : Gestion d'état légère

## Documentation

Cette documentation est générée automatiquement avec TypeDoc et couvre :
- Tous les composants React
- Les hooks personnalisés  
- Les types TypeScript
- Les services API
- Les utilitaires

## Développement

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Génération de la documentation
npm run docs
```

## Structure du projet

```
src/
├── app/                    # Pages Next.js App Router
├── components/             # Composants React réutilisables
├── hooks/                  # Hooks personnalisés
├── lib/                    # Services API et utilitaires
├── types/                  # Définitions TypeScript
└── utils/                  # Fonctions utilitaires
```
