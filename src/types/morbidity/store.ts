import { Nullable } from "@/types";
import {
  IMorbidityByUserListParams,
  IMorbidityListParams,
  TMorbidity,
  TMorbidityByUser,
  TMorbidityByUserDetail,
} from "@/types/morbidity";

export interface MorbidityData {
  list: TMorbidity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}

export interface MorbidityByUserData {
  list: TMorbidityByUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}

export interface MorbidityState {
  morbidityData: MorbidityData;
  morbidityByUserData: MorbidityByUserData;
  selectedMorbidityByUserDetail: TMorbidityByUserDetail | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: Nullable<string>;
  success: Nullable<string>;
  hasInitialized: boolean;
}

export interface MorbidityActions {
  loadMorbidityList: (
    params?: Partial<IMorbidityListParams>,
  ) => Promise<MorbidityData>;
  loadMorbidityByUserList: (
    params?: Partial<IMorbidityByUserListParams>,
  ) => Promise<MorbidityByUserData>;
  loadMorbidityByUserDetail: (id: number) => Promise<void>;
  updateVerifier: (params: {
    id_logbook: number;
    status_id: number;
    new_id_user: number;
  }) => Promise<void>;
  reset: () => void;
  resetDetail: () => void;
}

export type MorbidityStore = MorbidityState & MorbidityActions;
