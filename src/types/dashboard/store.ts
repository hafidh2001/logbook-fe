import { DashboardData } from "@/data/dashboard";
import {
  IUnverifiedLogbookListParams,
  TKinerjaDPJP,
  TKinerjaPPDS,
  TLogActivity,
  TLogbookByStatus,
  TPpdsBaru,
  TPPDSPerStage,
  TPPDSPerStase,
  TUnverifiedLogbook,
  TUnverifiedLogbookData,
  TUnverifiedLogbookDetail,
  TWaitingVerification,
} from "@/types/dashboard";

export interface UnverifiedLogbookData {
  list: TUnverifiedLogbook[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}

export interface DashboardState {
  dashboardData: DashboardData | null;
  kinerjaDPJP: TKinerjaDPJP[];
  kinerjaPPDS: TKinerjaPPDS[];
  ppdsBaru: TPpdsBaru[];
  waitingVerification: TWaitingVerification[];
  ppdsPerStage: TPPDSPerStage[];
  ppdsPerStase: TPPDSPerStase[];
  logActivity: TLogActivity[];
  logbookByStatus: TLogbookByStatus[];
  logbookTotal: number;
  logbookPending: number;
  ppdsActive: number;
  ppdsInactive: number;
  staffCount: number;
  stageCount: number;
  actionCount: number;
  unverifiedLogbookData: TUnverifiedLogbookData | null;
  unverifiedLogbookDetail: TUnverifiedLogbookDetail | null;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
}

export interface DashboardActions {
  loadDashboard: () => Promise<void>;
  loadKinerjaDPJP: () => Promise<void>;
  loadKinerjaPPDS: () => Promise<void>;
  loadPpdsBaru: () => Promise<void>;
  loadWaitingVerification: () => Promise<void>;
  loadPPDSPerStageStase: () => Promise<void>;
  loadLogActivity: () => Promise<void>;
  loadLogbookByStatus: () => Promise<void>;
  loadStageCount: () => Promise<void>;
  loadActionCount: () => Promise<void>;
  loadUnverifiedLogbookList: (
    params: IUnverifiedLogbookListParams,
  ) => Promise<void>;
  loadUnverifiedLogbookDetail: (id_logbook: number) => Promise<void>;
  reset: () => void;
}

export type DashboardStore = DashboardState & DashboardActions;
