import { Nullable } from "@/types";
import type {
  TStaseListItem,
  IStaseListParams,
  TStaseDetail,
  IStaseCreatePayload,
  IStaseUpdatePayload,
} from "./index";

export interface StaseData {
  list: TStaseListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}

export interface StaseState {
  staseData: StaseData;
  selectedStase: TStaseDetail | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: Nullable<string>;
  success: Nullable<string>;
  hasInitialized: boolean;
}

export interface StaseActions {
  loadStaseList: (params?: Partial<IStaseListParams>) => Promise<StaseData>;
  loadStaseDetail: (id_logbook: number) => Promise<void>;
  createStase: (data: IStaseCreatePayload) => Promise<boolean>;
  updateStase: (data: IStaseUpdatePayload) => Promise<boolean>;
  deleteStase: (id_logbook: number) => Promise<boolean>;
  reset: () => void;
  resetDetail: () => void;
}

export type StaseStore = StaseState & StaseActions;
