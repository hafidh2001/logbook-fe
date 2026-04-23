import { Nullable } from "@/types";
import type { TPpds, IPpdsListParams } from "./index";

export interface PpdsData {
  list: TPpds[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}

export interface PpdsState {
  ppdsData: PpdsData;
  selectedPpds: TPpds | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: Nullable<string>;
  success: Nullable<string>;
  hasInitialized: boolean;
}

export interface PpdsActions {
  loadPpdsList: (params?: Partial<IPpdsListParams>) => Promise<PpdsData>;
  loadPpdsDetail: (id: string) => Promise<void>;
  createPpds: (data: Partial<TPpds>) => Promise<boolean>;
  updatePpds: (id: string, data: Partial<TPpds>) => Promise<boolean>;
  deletePpds: (id_user: number) => Promise<boolean>;
  reset: () => void;
  resetDetail: () => void;
}

export type PpdsStore = PpdsState & PpdsActions;
