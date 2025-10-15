# Guide d'Installation - AdminJO Front
## Interface d'Administration des Jeux Olympiques 2024

---

## 📋 Table des Matières

1. [Prérequis système](#1-prérequis-système)
2. [Installation des dépendances](#2-installation-des-dépendances)
3. [Configuration de l'environnement](#3-configuration-de-lenvironnement)
4. [Démarrage de l'application](#4-démarrage-de-lapplication)
5. [Vérification de l'installation](#5-vérification-de-linstallation)
6. [Scripts disponibles](#6-scripts-disponibles)
7. [Déploiement en production](#7-déploiement-en-production)
8. [Dépannage](#8-dépannage)

---

## 1. Prérequis système

### Environnement requis

| Composant | Version minimale | Version recommandée |
|-----------|------------------|---------------------|
| **Node.js** | 18.17.0+ | 20.x LTS |
| **npm** | 9.0.0+ | 10.x |
| **Git** | 2.20+ | Dernière version |

### Système d'exploitation

✅ **Compatibilité testée :**
- Windows 10/11
- macOS 12+  
- Ubuntu 20.04+
- Debian 11+

### Vérification des prérequis

```bash
# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Vérifier Git
git --version
```

> **Note :** Si Node.js n'est pas installé, téléchargez-le depuis [nodejs.org](https://nodejs.org/)

---

## 2. Installation des dépendances

### Clonage du projet

```bash
# Cloner le repository
git clone [URL_DU_REPOSITORY]
cd AdminJO_Front/application
```

### Installation des packages

```bash
# Installation des dépendances
npm install
```

### Vérification de l'installation

```bash
# Vérifier que toutes les dépendances sont installées
npm list --depth=0
```

**Dépendances principales installées :**
- **Next.js 15.3.1** - Framework React
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Jest** - Framework de tests

---

## 3. Configuration de l'environnement

### Création du fichier de configuration

1. **Créer le fichier `.env.local`** dans le dossier `application/` :

```bash
# Créer le fichier de configuration
touch .env.local
```

2. **Ajouter les variables d'environnement** :

```env
# Configuration d'authentification
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY=auth_refresh_token

# Configuration de l'API Backend
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Variables d'environnement production

**Créer `.env.production.local` :**
```env
# API de production
NEXT_PUBLIC_API_URL=https://api.adminjo.fr/api

# Clés d'authentification (identiques)
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY=auth_refresh_token
```


### Variables d'environnement détaillées

| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `NEXT_PUBLIC_AUTH_TOKEN_KEY` | Clé de stockage du token d'auth | `auth_token` | ✅ |
| `NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY` | Clé de stockage du refresh token | `auth_refresh_token` | ✅ |
| `NEXT_PUBLIC_API_URL` | URL de l'API backend Django | `http://127.0.0.1:8000/api` | ✅ |

### Sécurité des variables

⚠️ **Important :**
- Ne jamais committer le fichier `.env.local`
- Utiliser des URL HTTPS en production
- Vérifier que `.env.local` est dans `.gitignore`

---

## 4. Démarrage de l'application

⚠️ **Prérequis indispensable :** L'API backend Django doit être démarrée et accessible avant de lancer l'application frontend.

### Vérification de l'API backend

**Avant de démarrer AdminJO Front, s'assurer que :**

1. **L'API backend est lancée** sur `http://127.0.0.1:8000` (ou l'URL configurée)
2. **Test de connectivité** :
   ```bash
   # Vérifier que l'API répond
   curl http://127.0.0.1:8000/api/
   # ou ouvrir dans un navigateur
   ```
3. **L'API est accessible** depuis votre machine

> **Important :** Sans l'API backend, l'application frontend ne pourra pas :
> - Authentifier les utilisateurs
> - Charger les données (événements, clients, employés, offres)
> - Sauvegarder les modifications

### Mode développement

```bash
# Démarrer le serveur de développement
npm run dev
```

**Résultat attendu :**
```
> application@0.1.0 dev
> next dev

   ▲ Next.js 15.3.1
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.100:3000

 ✓ Ready in 2.1s
 ✓ Compiled successfully
```

### Mode production

```bash
# Construire l'application
npm run build

# Démarrer en production (port 3001)
npm start
```

**URL d'accès :**
- **Développement :** http://localhost:3000
- **Production :** http://localhost:3001

### Vérification de la connexion API

**Une fois l'application démarrée :**

1. **Ouvrir l'application** dans le navigateur
2. **Vérifier dans la console** (F12) qu'il n'y a pas d'erreurs de connexion API
3. **Tenter une connexion** pour valider la communication avec le backend

**Erreurs possibles si l'API est indisponible :**
- Erreurs CORS dans la console
- Messages "Impossible de se connecter au serveur"
- Pages blanches ou erreurs de chargement

---

## 5. Vérification de l'installation

### Tests automatisés

```bash
# Exécuter tous les tests
npm run test

# Tests avec surveillance
npm run test:watch

# Vérification complète (lint + types + tests)
npm run check
```

### Vérification manuelle

1. **Ouvrir l'application** dans le navigateur
2. **Vérifier l'affichage** du tableau de bord
3. **Tester la navigation** entre les sections
4. **Contrôler la console** (F12) pour les erreurs

### Points de contrôle

| Élément | État attendu |
|---------|--------------|
| **Page d'accueil** | ✅ Affichage des 4 cartes principales |
| **Console navigateur** | ✅ Aucune erreur critique |
| **Responsive design** | ✅ Adaptation mobile/desktop |
| **Navigation** | ✅ Liens fonctionnels |

---

## 6. Scripts disponibles

### Scripts de développement

| Commande | Description | Usage |
|----------|-------------|-------|
| `npm run dev` | Serveur de développement | Développement quotidien |
| `npm run build` | Construction production | Avant déploiement |
| `npm start` | Serveur production (port 3001) | Test en local |

### Scripts de qualité

| Commande | Description | Quand l'utiliser |
|----------|-------------|------------------|
| `npm run lint` | Vérification ESLint | Avant commit |
| `npm run test` | Tests unitaires | Avant commit |
| `npm run check` | Vérification complète | Avant push |


## 7. Déploiement en production

### Préparation du build

```bash
# 1. Nettoyer les dépendances
rm -rf node_modules package-lock.json
npm install

# 2. Vérifier la qualité du code
npm run check

# 3. Construire l'application
npm run build
```

## 8. Dépannage

### Problèmes courants

#### **Erreur : "Cannot find module"**
```bash
# Solution
rm -rf node_modules package-lock.json
npm install
```

#### **Port déjà utilisé**
```bash
# Changer le port de développement
npm run dev -- -p 3002
```

#### **Erreurs TypeScript**
```bash
# Vérifier les types
npx tsc --noEmit

# Nettoyer le cache TypeScript
rm -rf .next
```

#### **Problème de connexion API**
1. Vérifier que l'API backend fonctionne
2. Contrôler l'URL dans `.env.local`
3. Vérifier les CORS sur le backend

### Logs et débogage

```bash
# Logs détaillés en développement
DEBUG=* npm run dev

# Vérifier la configuration Next.js
npx next info
```

### Variables d'environnement non reconnues

**Problème :** Variables non chargées
**Solutions :**
1. Vérifier le nom du fichier : `.env.local`
2. Redémarrer le serveur de développement
3. Variables doivent commencer par `NEXT_PUBLIC_`

---

**🎉 Installation terminée avec succès !**

---

*Guide d'installation AdminJO Front - Équipe technique JO 2024*
