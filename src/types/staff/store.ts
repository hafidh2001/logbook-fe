import { Nullable } from "@/types";
import type {
  TStaff,
  TStaffDetail,
  IStaffListParams,
  IStaffPayload,
  IStaffCreatePayload,
  TStaffLogbook,
  IStaffLogbookListParams,
  IStaffChangePasswordPayload,
  TStaffLogbookDetail,
} from "./index";

export interface StaffData {
  list: TStaff[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}

export interface StaffLogbookData {
  list: TStaffLogbook[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
}

export interface StaffState {
  staffData: StaffData;
  staffLogbookData: StaffLogbookData | null;
  staffLogbookDetail: TStaffLogbookDetail | null;
  selectedStaff: TStaffDetail | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: Nullable<string>;
  success: Nullable<string>;
  hasInitialized: boolean;
}

export interface StaffActions {
  loadStaffList: (params?: Partial<IStaffListParams>) => Promise<StaffData>;
  loadStaffDetail: (id_user: number) => Promise<void>;
  loadStaffLogbookList: (params: IStaffLogbookListParams) => Promise<void>;
  loadStaffLogbookDetail: (id_logbook: number) => Promise<void>;
  createStaff: (data: IStaffCreatePayload) => Promise<boolean>;
  updateStaff: (data: IStaffPayload) => Promise<boolean>;
  deleteStaff: (id_user: number) => Promise<boolean>;
  changePassword: (data: IStaffChangePasswordPayload) => Promise<boolean>;
  reset: () => void;
  resetDetail: () => void;
  resetLogbookDetail: () => void;
}

export type StaffStore = StaffState & StaffActions;