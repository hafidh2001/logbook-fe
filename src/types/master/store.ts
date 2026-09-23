import { BasicSelectOpt, Nullable } from "@/types";
import { IMasterParams, IMasterUserParams } from "@/types/master";

export interface StaseSelectOpt extends BasicSelectOpt<number> {
  id_stage: number;
}

export interface MasterState {
  ppdsOptions: BasicSelectOpt<number>[];
  ppdsActiveOptions: BasicSelectOpt<number>[];
  ppdsInactiveOptions: BasicSelectOpt<number>[];
  staffOptions: BasicSelectOpt<number>[];
  staseOptions: StaseSelectOpt[];
  stageOptions: BasicSelectOpt<number>[];
  semesterOptions: BasicSelectOpt<number>[];
  activityOptions: BasicSelectOpt<number>[];
  userStatusOptions: BasicSelectOpt<string>[];
  logbookStatusOptions: BasicSelectOpt<string>[];
  hospitalOptions: BasicSelectOpt<number>[];
  isLoading: boolean;
  error: Nullable<string>;
}

export interface MasterActions {
  fetchPPDSOptions: (
    params: Pick<IMasterUserParams, "id_client">,
  ) => Promise<void>;
  fetchPPDSActiveOptions: (
    params: Pick<IMasterUserParams, "id_client">,
  ) => Promise<void>;
  fetchPPDSInactiveOptions: (
    params: Pick<IMasterUserParams, "id_client">,
  ) => Promise<void>;
  fetchStaffOptions: (
    params: Pick<IMasterUserParams, "id_client">,
  ) => Promise<void>;
  fetchStaseOptions: (params: IMasterParams) => Promise<void>;
  fetchStageOptions: (params: IMasterParams) => Promise<void>;
  fetchStageByStase: (params: { id_stase: number }) => Promise<void>;
  fetchSemesterOptions: (params: { id_stage: number }) => Promise<void>;
  fetchActivityOptions: (params: IMasterParams) => Promise<void>;
  fetchUserStatusOptions: () => Promise<void>;
  fetchLogbookStatusOptions: () => Promise<void>;
  fetchHospitalOptions: (params: IMasterParams) => Promise<void>;
  reset: () => void;
}

export type MasterStore = MasterState & MasterActions;
