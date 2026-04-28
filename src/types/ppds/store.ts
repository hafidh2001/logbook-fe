import { Nullable } from "@/types";
import type {
  TPpds,
  IPpdsListParams,
  TPpdsDetail,
  IPpdsPayload,
  IPpdsCreatePayload,
  TPpdsLogbook,
  IPpdsLogbookListParams,
  IPpdsChangePasswordPayload,
  TPpdsLogbookDetail,
  IPpdsLogbookDetailParams,
} from "./index";

export interface PpdsData {
  list: TPpds[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}

export interface PpdsLogbookData {
  list: TPpdsLogbook[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}

export interface PpdsState {
  ppdsData: PpdsData;
  ppdsLogbookData: PpdsLogbookData | null;
  ppdsLogbookDetail: TPpdsLogbookDetail | null;
  selectedPpds: TPpdsDetail | null;
  isLoading: boolean;
  error: Nullable<string>;
  success: Nullable<string>;
  hasInitialized: boolean;
}

export interface PpdsActions {
  loadPpdsList: (params?: Partial<IPpdsListParams>) => Promise<PpdsData>;
  loadPpdsDetail: (id_user: number) => Promise<void>;
  loadPpdsLogbookList: (params: IPpdsLogbookListParams) => Promise<void>;
  loadPpdsLogbookDetail: (params: IPpdsLogbookDetailParams) => Promise<void>;
  createPpds: (data: IPpdsCreatePayload) => Promise<boolean>;
  updatePpds: (data: IPpdsPayload) => Promise<boolean>;
  deletePpds: (id_user: number) => Promise<boolean>;
  changePassword: (data: IPpdsChangePasswordPayload) => Promise<boolean>;
  reset: () => void;
  resetLogbookDetail: () => void;
}

export type PpdsStore = PpdsState & PpdsActions;
