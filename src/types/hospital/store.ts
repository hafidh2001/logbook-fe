import { Nullable } from "@/types";
import {
  IHospitalCreatePayload,
  IHospitalListParams,
  IHospitalUpdatePayload,
  THospital,
} from "@/types/hospital";

export interface HospitalData {
  list: THospital[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}

export interface HospitalState {
  hospitalData: HospitalData;
  selectedHospital: THospital | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: Nullable<string>;
  success: Nullable<string>;
  hasInitialized: boolean;
}

export interface HospitalActions {
  loadHospitalList: (
    params?: Partial<IHospitalListParams>,
  ) => Promise<HospitalData>;
  loadHospitalDetail: (id: number) => Promise<void>;
  createHospital: (data: IHospitalCreatePayload) => Promise<boolean>;
  updateHospital: (data: IHospitalUpdatePayload) => Promise<boolean>;
  deleteHospital: (id: number) => Promise<boolean>;
  reset: () => void;
  resetDetail: () => void;
}

export type HospitalStore = HospitalState & HospitalActions;
