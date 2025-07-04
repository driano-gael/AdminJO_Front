# 🔐 Gestion de l'Authentification et de l'Expiration de Session

## 📋 Vue d'ensemble

Ce document décrit en détail le fonctionnement de la gestion de l'authentification et de l'expiration de session dans l'application AdminJO Front.

## 🏗️ Architecture de l'Authentification

### 1. Contexte d'Authentification (`authContext.tsx`)

Le contexte d'authentification est le cœur du système d'authentification. Il fournit :

- **État utilisateur** : Stockage des informations de l'utilisateur connecté
- **État de chargement** : Indique si l'authentification est en cours de vérification
- **Fonctions de connexion/déconnexion** : Gestion des actions utilisateur
- **Persistance de session** : Sauvegarde dans localStorage
- **Gestion d'expiration** : Déconnexion forcée et modal automatique

### 2. Protection des Routes (`authGuard.tsx`)

Le composant AuthGuard protège les routes sensibles :

```tsx
<AuthGuard>
  <ComposantProtege />
</AuthGuard>
```

**Fonctionnement :**

- Vérifie l'état d'authentification au rendu
- Affiche un spinner pendant la vérification
- Redirige vers le formulaire de connexion si non authentifié
- Affiche le contenu protégé si authentifié

### 3. Surveillance de Session (`useSessionExpiry.ts`)

Le hook useSessionExpiry surveille l'expiration de session :

```tsx
function MonComposant() {
  useSessionExpiry(); // Ajout de la surveillance
  // ... reste du composant
}
```

## 🔄 Flux de Gestion d'Expiration

### 1. Détection d'Expiration

L'expiration de session peut être détectée de plusieurs façons :

1. **Réponse HTTP 401** : Interceptée par `httpHelpers.ts`
2. **Token expiré** : Vérifié par `tokenHelpers.ts`
3. **Événement personnalisé** : Émis par `emitSessionExpired()`

### 2. Déconnexion Forcée

Quand une expiration est détectée :

```typescript
forceLogout() {
  // 1. Sauvegarder la route actuelle
  const currentPath = window.location.pathname;
  setCurrentRoute(currentPath);

  // 2. Nettoyer les tokens et l'état utilisateur
  logoutService();
  setUser(null);

  // 3. Afficher le modal d'expiration
  setShowSessionExpiredModal(true);
}
```

### 3. Processus de Reconnexion

Après une reconnexion réussie :

```typescript
login(email, password) {
  // 1. Authentification via API
  await loginService({ email, password });

  // 2. Restaurer l'état utilisateur
  setUser({ email });

  // 3. Rediriger vers la route sauvegardée
  if (currentRoute) {
    setTimeout(() => {
      window.location.href = currentRoute;
      setCurrentRoute(null);
    }, 100);
  }
}
```

## 🎯 Fonctionnalités Avancées

### 1. Persistance de Route

**Problème résolu :** L'utilisateur reste sur la même page après reconnexion

**Implémentation :**

- Sauvegarde automatique de la route lors de l'expiration
- Restauration automatique après reconnexion réussie
- Nettoyage de la route sauvegardée après utilisation

### 2. Modal d'Expiration Automatique

**Caractéristiques :**

- Apparition automatique lors de l'expiration
- Compte à rebours de 10 secondes
- Boutons pour fermer ou se reconnecter immédiatement
- Fermeture automatique après reconnexion

### 3. Centralisée de la Protection

**Avant :** Deux AuthGuard redondants

- `connexion/authGuard.tsx` (principal)
- `management/AuthGuard.tsx` (redondant)

**Après :** Un seul AuthGuard centralisé

- Tous les composants utilisent `connexion/authGuard.tsx`
- Logique de protection unifiée
- Maintenance simplifiée

## 🔧 Configuration et Tokens

### 1. Configuration des Tokens

```typescript
// Variables d'environnement
NEXT_PUBLIC_AUTH_TOKEN_KEY = "auth_token";
NEXT_PUBLIC_REFRESH_TOKEN_KEY = "refresh_token";
```

### 2. Stockage des Tokens

- **Token d'authentification** : localStorage
- **Token de rafraîchissement** : localStorage
- **Email utilisateur** : localStorage (pour persistance)

### 3. Callback d'Expiration

```typescript
// Configuration du callback global
setSessionExpiredCallback(forceLogout);
```

## 🧪 Tests et Développement

### 1. Mode Développement

En mode développement, des logs détaillés sont disponibles :

```typescript
if (process.env.NODE_ENV === "development") {
  console.log("🔒 Session expirée, déconnexion forcée");
  console.log("📍 Route sauvegardée:", currentPath);
  console.log("🔄 Redirection vers:", routeToRestore);
}
```

### 2. Test d'Expiration

Un bouton de test est disponible dans le ManagementDashboard :

```typescript
const testSessionExpiry = () => {
  emitSessionExpired();
};
```

## 🚀 Bonnes Pratiques

### 1. Utilisation du Hook

```tsx
function MonComposant() {
  useSessionExpiry(); // Toujours en premier
  const { isAuthenticated, user } = useAuth();

  // ... logique du composant
}
```

### 2. Gestion des Erreurs

```typescript
// Dans les services API
if (response.status === 401) {
  emitSessionExpired();
  throw new Error("Session expirée");
}
```

### 3. Protection des Composants

```tsx
// Toujours envelopper les composants sensibles
<AuthGuard>
  <ComposantSensible />
</AuthGuard>
```

## 🔍 Débogage

### 1. Logs Disponibles

- `🔒 Session expirée` : Déconnexion forcée
- `📍 Route sauvegardée` : Persistance de navigation
- `🔄 Redirection vers` : Restauration de route
- `📢 Émission d'événement` : Événement d'expiration

### 2. Vérification d'État

```typescript
// Depuis les DevTools
console.log("Auth State:", {
  isAuthenticated,
  user,
  currentRoute,
  isLoading,
});
```

## 📝 Maintenance

### 1. Ajout de Nouvelles Routes Protégées

```tsx
// Dans le nouveau composant
function NouveauComposant() {
  useSessionExpiry(); // Ajouter la surveillance

  return <AuthGuard>{/* Contenu protégé */}</AuthGuard>;
}
```

### 2. Modification du Délai d'Expiration

```typescript
// Dans SessionExpiredModal.tsx
const [countdown, setCountdown] = useState(10); // Modifier la valeur
```

### 3. Personnalisation du Modal

Le modal peut être personnalisé en modifiant `SessionExpiredModal.tsx` :

- Texte et messages
- Styles et couleurs
- Durée du compte à rebours
- Actions disponibles

## 🎉 Résumé des Améliorations

1. **✅ Persistance de route** : L'utilisateur reste sur la même page après reconnexion
2. **✅ Modal automatique** : Apparition automatique lors de l'expiration
3. **✅ AuthGuard centralisé** : Suppression de la redondance
4. **✅ Commentaires détaillés** : Documentation complète du code
5. **✅ Gestion robuste** : Traitement des erreurs et cas limites
6. **✅ Logs de débogage** : Traçabilité en mode développement

La gestion de l'authentification est maintenant robuste, bien documentée et maintient une expérience utilisateur fluide même lors de l'expiration de session.
