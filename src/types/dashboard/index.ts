// Raw data from backend
export interface TKinerjaDPJPRaw {
  id: number;
  display_name: string;
  picture: string | null;
  date_time: string;
  status: string;
  id_logbook: number;
}

export interface TKinerjaPPDSRaw {
  id: number;
  display_name: string;
  picture: string | null;
  stase_name: string | null;
  logbook_id: number;
  date: string;
  verified_status: string;
  identifier: string;
}

export interface TPpdsBaruRaw {
  id: number;
  display_name: string;
  created_date: string;
}

export interface TWaitingVerificationRaw {
  id: number;
  id_action: number;
  action_name: string;
  ppds_name: string;
  date: string;
  tls_id: number;
  tls_status: string;
  staff_name: string;
}

export interface TPpdsRaw {
  id: number;
  display_name: string;
  stase_name: string | null;
  stage_name: string | null;
  status: string;
  role_name: string;
  is_show: boolean;
}

export interface TLogActivityRaw {
  date: string;
  message: string;
}

export interface TLogbookByStatusRaw {
  status: string;
  count: number;
}

// Transformed data for component
export interface TKinerjaDPJP {
  id: number;
  name: string;
  total_logbook: number;
  pending: number;
  verified: number;
}

export interface TKinerjaPPDS {
  name: string;
  stase: string;
  verified_count: number;
}

export interface TPpdsBaru {
  year: string;
  count: number;
}

export interface TWaitingVerification {
  activity: string;
  staff: string;
  date: string;
}

export interface TPPDSPerStage {
  stage: string;
  count: number;
}

export interface TPPDSPerStase {
  stase: string;
  count: number;
}

export interface TLogActivity {
  message: string;
}

export interface TLogbookByStatus {
  status: string;
  count: number;
}

import { Nullable } from "@/types";

export type TUnverifiedLogbook = {
  id: number;
  date: Nullable<string>;
  title: Nullable<string>;
  notes: Nullable<string>;
  verified_status: Nullable<string>;
  ppds_name: Nullable<string>;
  nim: Nullable<string>;
  action_name: Nullable<string>;
  hospital_name: Nullable<string>;
  semester: Nullable<string>;
  stase_name: Nullable<string>;
  staff: Array<{ id: number; name: string | null }>;
};

export interface IUnverifiedLogbookListParams {
  id_client: number;
  page?: number;
  limit?: number;
  id_ppds?: Nullable<number>;
  id_staff?: Nullable<number>;
  id_activity?: Nullable<number>;
  id_stase?: Nullable<number>;
  start_date?: Nullable<string>;
  end_date?: Nullable<string>;
  status?: Nullable<string>;
}

export type TUnverifiedLogbookData = {
  list: TUnverifiedLogbook[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
};

export interface TUnverifiedLogbookDetail {
  id: number;
  // user
  ppds_name: Nullable<string>;
  nim: Nullable<string>;
  inisial_code: Nullable<string>;

  // kegiatan
  date: Nullable<string>;
  action_name: Nullable<string>;
  hospital_name: Nullable<string>;
  notes: Nullable<string>;
  status_logbook: Nullable<string>;

  // staff
  staff: Array<{
    name: string | null;
    role: string | null;
    status: string | null;
  }>;
}
