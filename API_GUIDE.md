# Guide API Complet - AdminJO

## 📡 Architecture API Complète

Ce guide présente l'ensemble des services et APIs utilisés dans AdminJO pour l'administration complète de la billeterie des Jeux Olympiques 2024.

## 🏗️ Structure des Services API

```
lib/api/
├── auth/                           # Services d'authentification
│   ├── authService.ts             # Login, logout, refresh token
│   └── tokenHelpers.ts            # Gestion JWT et validation
├── core/                          # Utilitaires API centraux
│   ├── apiClient.ts               # Client HTTP configuré
│   └── errorHandling.ts           # Gestion centralisée des erreurs
└── services/                      # Services métier par domaine
    ├── evenementSports/           # Services événements sportifs
    │   ├── evenementService.ts    # CRUD événements
    │   ├── lieuService.ts         # CRUD lieux de compétition
    │   ├── disciplineService.ts   # CRUD disciplines sportives
    │   └── epreuveService.ts      # CRUD épreuves
    ├── employeService.ts          # CRUD employés
    ├── clientService.ts           # CRUD clients
    └── offreService.ts            # CRUD offres de billeterie
```

## 🔐 Services d'Authentification

### AuthService - Gestion complète des sessions

```typescript
// Login administrateur
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  
  // Stockage sécurisé des tokens
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user_email', response.data.email);
    localStorage.setItem('user_role', response.data.role);
  }
  
  return response.data;
};

// Refresh automatique des tokens
export const refreshToken = async (): Promise<void> => {
  const refreshToken = localStorage.getItem('refresh_token');
  const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
  
  localStorage.setItem('access_token', response.data.access_token);
};

// Déconnexion complète
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    // Nettoyage local même si l'API échoue
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
  }
};
```

### TokenHelpers - Utilitaires JWT

```typescript
// Validation de token en temps réel
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Callback d'expiration de session
export const setSessionExpiredCallback = (callback: () => void): void => {
  window.sessionExpiredCallback = callback;
};
```

## 🏟️ Services Événements Sportifs

### EvenementService - Gestion des événements

```typescript
export const evenementApi = {
  // Récupération avec filtres avancés
  getAll: async (filters?: EvenementFilters): Promise<ExtendEvenement[]> => {
    const params = new URLSearchParams();
    if (filters?.lieu_id) params.append('lieu_id', filters.lieu_id.toString());
    if (filters?.discipline_id) params.append('discipline_id', filters.discipline_id.toString());
    if (filters?.date_debut) params.append('date_debut', filters.date_debut);
    if (filters?.date_fin) params.append('date_fin', filters.date_fin);
    
    const response = await apiClient.get(`/evenements?${params}`);
    return response.data;
  },

  // Création d'événement
  create: async (data: CreateEvenementRequest): Promise<ExtendEvenement> => {
    const response = await apiClient.post('/evenements', {
      description: data.description,
      date_debut: data.date_debut,
      date_fin: data.date_fin,
      lieu_id: data.lieu_id,
      epreuve_id: data.epreuve_id,
      prix_unitaire: data.prix_unitaire,
      nb_places_total: data.nb_places_total
    });
    return response.data;
  },

  // Mise à jour complète
  update: async (id: number, data: UpdateEvenementRequest): Promise<ExtendEvenement> => {
    const response = await apiClient.put(`/evenements/${id}`, data);
    return response.data;
  },

  // Suppression avec vérification
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/evenements/${id}`);
  },

  // Statistiques événement
  getStats: async (id: number): Promise<EvenementStats> => {
    const response = await apiClient.get(`/evenements/${id}/stats`);
    return response.data;
  }
};
```

### LieuService - Gestion des lieux

```typescript
export const lieuApi = {
  getAll: async (): Promise<Lieu[]> => {
    const response = await apiClient.get('/lieux');
    return response.data;
  },

  create: async (data: CreateLieuRequest): Promise<Lieu> => {
    const response = await apiClient.post('/lieux', {
      nom: data.nom,
      adresse: data.adresse,
      capacite: data.capacite,
      ville: data.ville,
      code_postal: data.code_postal
    });
    return response.data;
  },

  update: async (id: number, data: UpdateLieuRequest): Promise<Lieu> => {
    const response = await apiClient.put(`/lieux/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/lieux/${id}`);
  }
};
```

### DisciplineService & EpreuveService

```typescript
// Gestion des disciplines sportives
export const disciplineApi = {
  getAll: async (): Promise<Discipline[]> => {
    const response = await apiClient.get('/disciplines');
    return response.data;
  },

  create: async (data: CreateDisciplineRequest): Promise<Discipline> => {
    const response = await apiClient.post('/disciplines', {
      nom: data.nom,
      description: data.description,
      categorie: data.categorie
    });
    return response.data;
  }
};

// Gestion des épreuves
export const epreuveApi = {
  getAll: async (disciplineId?: number): Promise<Epreuve[]> => {
    const url = disciplineId ? `/epreuves?discipline_id=${disciplineId}` : '/epreuves';
    const response = await apiClient.get(url);
    return response.data;
  },

  create: async (data: CreateEpreuveRequest): Promise<Epreuve> => {
    const response = await apiClient.post('/epreuves', {
      nom: data.nom,
      discipline_id: data.discipline_id,
      type: data.type,
      duree_prevue: data.duree_prevue
    });
    return response.data;
  }
};
```

## 👥 Services de Gestion des Utilisateurs

### EmployeService - Administration du personnel

```typescript
export const employeApi = {
  // Liste avec pagination et filtres
  getAll: async (options?: EmployeListOptions): Promise<EmployeListResponse> => {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.search) params.append('search', options.search);
    if (options?.departement) params.append('departement', options.departement);
    if (options?.role) params.append('role', options.role);
    
    const response = await apiClient.get(`/employes?${params}`);
    return response.data;
  },

  // Création d'employé
  create: async (data: CreateEmployeRequest): Promise<Employe> => {
    const response = await apiClient.post('/employes', {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      role: data.role,
      departement: data.departement,
      salaire: data.salaire,
      date_embauche: data.date_embauche
    });
    return response.data;
  },

  // Mise à jour profil employé
  update: async (id: number, data: UpdateEmployeRequest): Promise<Employe> => {
    const response = await apiClient.put(`/employes/${id}`, data);
    return response.data;
  },

  // Désactivation employé
  deactivate: async (id: number): Promise<void> => {
    await apiClient.patch(`/employes/${id}/deactivate`);
  },

  // Activation employé
  activate: async (id: number): Promise<void> => {
    await apiClient.patch(`/employes/${id}/activate`);
  }
};
```

### ClientService - Gestion de la clientèle

```typescript
export const clientApi = {
  // Liste clients avec recherche
  getAll: async (options?: ClientListOptions): Promise<ClientListResponse> => {
    const params = new URLSearchParams();
    if (options?.search) params.append('search', options.search);
    if (options?.page) params.append('page', options.page.toString());
    if (options?.active) params.append('active', options.active.toString());
    
    const response = await apiClient.get(`/clients?${params}`);
    return response.data;
  },

  // Profil client détaillé
  getById: async (id: number): Promise<ClientDetail> => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  // Création client
  create: async (data: CreateClientRequest): Promise<Client> => {
    const response = await apiClient.post('/clients', {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      adresse: data.adresse,
      ville: data.ville,
      code_postal: data.code_postal,
      date_naissance: data.date_naissance
    });
    return response.data;
  },

  // Historique des achats
  getPurchaseHistory: async (id: number): Promise<ClientPurchase[]> => {
    const response = await apiClient.get(`/clients/${id}/purchases`);
    return response.data;
  }
};
```

## 🎫 Service de Gestion des Offres

### OffreService - Billeterie et tarifications

```typescript
export const offreApi = {
  // Liste des offres avec filtres
  getAll: async (filters?: OffreFilters): Promise<Offre[]> => {
    const params = new URLSearchParams();
    if (filters?.evenement_id) params.append('evenement_id', filters.evenement_id.toString());
    if (filters?.active) params.append('active', filters.active.toString());
    if (filters?.type) params.append('type', filters.type);
    
    const response = await apiClient.get(`/offres?${params}`);
    return response.data;
  },

  // Création d'offre
  create: async (data: CreateOffreRequest): Promise<Offre> => {
    const response = await apiClient.post('/offres', {
      nom: data.nom,
      description: data.description,
      evenement_id: data.evenement_id,
      prix: data.prix,
      nombre_places: data.nombre_places,
      type_offre: data.type_offre,
      date_debut_vente: data.date_debut_vente,
      date_fin_vente: data.date_fin_vente,
      conditions_speciales: data.conditions_speciales
    });
    return response.data;
  },

  // Statistiques de vente
  getSalesStats: async (id: number): Promise<OffreSalesStats> => {
    const response = await apiClient.get(`/offres/${id}/stats`);
    return response.data;
  },

  // Activation/Désactivation
  toggleActive: async (id: number): Promise<Offre> => {
    const response = await apiClient.patch(`/offres/${id}/toggle`);
    return response.data;
  }
};
```

## 🪝 Hooks de Gestion Avancés

### useEventsManagement - Hook principal événements

```typescript
export function useEventsManagement() {
  // États des données
  const [events, setEvents] = useState<ExtendEvenement[]>([]);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  
  // États de l'interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  
  // Filtres avancés
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLieu, setFilterLieu] = useState<number | undefined>();
  const [filterDiscipline, setFilterDiscipline] = useState<number | undefined>();
  const [filterEpreuve, setFilterEpreuve] = useState<number | undefined>();
  const [filterStatut, setFilterStatut] = useState<string | undefined>();
  const [filterDateDebut, setFilterDateDebut] = useState<string>('2024-07-01');
  const [filterDateFin, setFilterDateFin] = useState<string>('2024-09-01');

  // Fonction de filtrage intelligent
  const getFilteredEvents = useCallback(() => {
    let filteredEvents = events;

    // Recherche textuelle
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.description.toLowerCase().includes(searchLower) ||
        event.lieu.nom.toLowerCase().includes(searchLower) ||
        (event.sports && event.sports.toLowerCase().includes(searchLower))
      );
    }

    // Filtres spécifiques
    if (filterLieu) {
      filteredEvents = filteredEvents.filter(event => event.lieu.id === filterLieu);
    }

    if (filterDiscipline) {
      filteredEvents = filteredEvents.filter(event => 
        event.epreuve.discipline.id === filterDiscipline
      );
    }

    if (filterEpreuve) {
      filteredEvents = filteredEvents.filter(event => event.epreuve.id === filterEpreuve);
    }

    if (filterStatut) {
      filteredEvents = filteredEvents.filter(event => {
        const status = getEventStatus(event.date_debut, event.date_fin);
        return status === filterStatut;
      });
    }

    // Filtrage par dates
    filteredEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.date_debut);
      const startDate = new Date(filterDateDebut);
      const endDate = new Date(filterDateFin);
      return eventDate >= startDate && eventDate <= endDate;
    });

    return filteredEvents;
  }, [events, searchTerm, filterLieu, filterDiscipline, filterEpreuve, filterStatut, filterDateDebut, filterDateFin]);

  // Actions CRUD
  const createEvent = async (data: CreateEvenementRequest): Promise<void> => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const newEvent = await evenementApi.create(data);
      setEvents(prev => [...prev, newEvent]);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Erreur de création');
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  // Retour des données et fonctions
  return {
    // Données
    events: getFilteredEvents(),
    lieux, epreuves, disciplines,
    
    // États
    loading, error, createLoading,
    
    // Filtres
    searchTerm, setSearchTerm,
    filterLieu, setFilterLieu,
    filterDiscipline, setFilterDiscipline,
    filterEpreuve, setFilterEpreuve,
    filterStatut, setFilterStatut,
    filterDateDebut, setFilterDateDebut,
    filterDateFin, setFilterDateFin,
    
    // Actions
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents
  };
}
```

### Autres hooks spécialisés

```typescript
// Gestion des employés
export function useEmployesManagement() {
  // États et logique similaire pour les employés
  // avec fonctionnalités spécifiques RH
}

// Gestion des clients
export function useClientsManagement() {
  // États et logique pour la clientèle
  // avec historique d'achats et segmentation
}

// Gestion des offres
export function useOffreManagement() {
  // États et logique pour les offres
  // avec analytics de vente et performance
}
```

## 🔧 Configuration API Centralisée

### ApiClient - Client HTTP configuré

```typescript
// Configuration du client HTTP avec intercepteurs
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête pour l'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse pour la gestion d'erreurs
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, tentative de refresh
      try {
        await refreshToken();
        // Retry de la requête originale
        return apiClient.request(error.config);
      } catch {
        // Échec du refresh, déconnexion
        if (window.sessionExpiredCallback) {
          window.sessionExpiredCallback();
        }
      }
    }
    return Promise.reject(error);
  }
);
```

## 📊 Types TypeScript Complets

### Types d'événements sportifs

```typescript
export interface ExtendEvenement {
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
  created_at: string;
  updated_at: string;
}

export interface Lieu {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  capacite: number;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
}

export interface Discipline {
  id: number;
  nom: string;
  description: string;
  categorie: 'individuel' | 'equipe' | 'mixte';
  icone?: string;
}

export interface Epreuve {
  id: number;
  nom: string;
  discipline: Discipline;
  type: 'finale' | 'qualification' | 'demi-finale';
  duree_prevue: number; // en minutes
  regles_specifiques?: string;
}
```

### Types de gestion utilisateurs

```typescript
export interface Employe {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'admin' | 'manager' | 'employe';
  departement: string;
  salaire: number;
  date_embauche: string;
  active: boolean;
  permissions: string[];
  photo_url?: string;
}

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  code_postal: string;
  date_naissance: string;
  date_inscription: string;
  active: boolean;
  total_achats: number;
  derniere_connexion?: string;
}
```

### Types de billeterie

```typescript
export interface Offre {
  id: number;
  nom: string;
  description: string;
  evenement: ExtendEvenement;
  prix: number;
  nombre_places: number;
  places_vendues: number;
  type_offre: 'standard' | 'vip' | 'groupe' | 'early_bird';
  date_debut_vente: string;
  date_fin_vente: string;
  conditions_speciales?: string;
  active: boolean;
  created_at: string;
}

export interface OffreSalesStats {
  total_ventes: number;
  revenue_total: number;
  taux_occupation: number;
  ventes_par_jour: Array<{
    date: string;
    ventes: number;
    revenue: number;
  }>;
}
```

## 🚦 Gestion d'Erreurs Centralisée

```typescript
// Types d'erreurs personnalisés
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Gestion centralisée des erreurs
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Données invalides. Veuillez vérifier vos informations.';
      case 401:
        return 'Session expirée. Veuillez vous reconnecter.';
      case 403:
        return 'Accès refusé. Permissions insuffisantes.';
      case 404:
        return 'Ressource non trouvée.';
      case 409:
        return 'Conflit de données. Cette ressource existe déjà.';
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.';
      default:
        return error.message || 'Une erreur inattendue s\'est produite.';
    }
  }
  return 'Erreur de connexion. Vérifiez votre connexion internet.';
};
```

## 📈 Optimisations et Performance

### Mise en cache intelligente

```typescript
// Cache pour les données statiques
const cache = new Map<string, { data: unknown; timestamp: number }>();

export const getCachedData = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes par défaut
): Promise<T> => {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T;
  }
  
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  
  return data;
};
```

### Debouncing pour les recherches

```typescript
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

---

*Guide API généré automatiquement - AdminJO 2024*

*Documentation complète des services et intégrations API*
