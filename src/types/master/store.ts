import { BasicSelectOpt, Nullable } from "@/types";
import { IMasterParams, IMasterUserParams } from "@/types/master";

export interface MasterState {
  ppdsOptions: BasicSelectOpt<number>[];
  staffOptions: BasicSelectOpt<number>[];
  staseOptions: BasicSelectOpt<number>[];
  activityOptions: BasicSelectOpt<number>[];
  userStatusOptions: BasicSelectOpt<string>[];
  logbookStatusOptions: BasicSelectOpt<string>[];
  isLoading: boolean;
  error: Nullable<string>;
}

export interface MasterActions {
  fetchPPDSOptions: (
    params: Pick<IMasterUserParams, "id_client">,
  ) => Promise<void>;
  fetchStaffOptions: (
    params: Pick<IMasterUserParams, "id_client">,
  ) => Promise<void>;
  fetchStaseOptions: (params: IMasterParams) => Promise<void>;
  fetchActivityOptions: (params: IMasterParams) => Promise<void>;
  fetchUserStatusOptions: () => Promise<void>;
  fetchLogbookStatusOptions: () => Promise<void>;
  reset: () => void;
}

export type MasterStore = MasterState & MasterActions;
