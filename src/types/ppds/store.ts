import { Nullable } from "@/types";
import type {
  TPpds,
  IPpdsListParams,
  TPpdsDetail,
  IPpdsPayload,
  IPpdsCreatePayload,
  TPpdsLogbook,
  IPpdsLogbookListParams,
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
  selectedPpds: TPpdsDetail | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: Nullable<string>;
  success: Nullable<string>;
  hasInitialized: boolean;
}

export interface PpdsActions {
  loadPpdsList: (params?: Partial<IPpdsListParams>) => Promise<PpdsData>;
  loadPpdsDetail: (id_user: number) => Promise<void>;
  loadPpdsLogbookList: (params: IPpdsLogbookListParams) => Promise<void>;
  createPpds: (data: IPpdsCreatePayload) => Promise<boolean>;
  updatePpds: (data: IPpdsPayload) => Promise<boolean>;
  deletePpds: (id_user: number) => Promise<boolean>;
  reset: () => void;
}

export type PpdsStore = PpdsState & PpdsActions;
