// Import des services pour les réexporter
import { disciplineApi } from './disciplineService';
import { lieuApi } from './lieuService';
import { evenementApi } from './evenementService';
import { epreuveApi } from './epreuveService';

// Export des services individuels
export * from './disciplineService';
export * from './lieuService';
export * from './evenementService';
export * from './epreuveService';

// Export des APIs regroupées pour faciliter l'import
export {
  DisciplineService,
  disciplineApi,
  type CreateDisciplineRequest,
  type UpdateDisciplineRequest,
  type DisciplineFilters,
} from './disciplineService';

export {
  LieuService,
  lieuApi,
  type CreateLieuRequest,
  type UpdateLieuRequest,
  type LieuFilters,
} from './lieuService';

export {
  EvenementService,
  evenementApi,
  type CreateEvenementRequest,
  type UpdateEvenementRequest,
  type EvenementFilters,
} from './evenementService';

export {
  EpreuveService,
  epreuveApi,
  type CreateEpreuveRequest,
  type UpdateEpreuveRequest,
  type EpreuveFilters,
} from './epreuveService';

// Objet regroupant tous les services pour un accès unifié
export const eventServices = {
  discipline: disciplineApi,
  lieu: lieuApi,
  evenement: evenementApi,
  epreuve: epreuveApi,
} as const;

// Types utilitaires pour l'ensemble des services
export type EventServiceType = typeof eventServices;
export type ServiceName = keyof EventServiceType;
