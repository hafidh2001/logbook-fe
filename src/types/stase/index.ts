export type TStaseListItem = {
  id: number;
  user_name: string;
  stase_name: string;
  date: string;
  notes: string | null;
  is_retake: boolean;
};

export interface IStaseListParams {
  id_client: number;
  page?: number;
  limit?: number;
  search?: string | null;
  id_ppds?: number | null;
  id_stase?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}

export type TStaseDetail = {
  id: number;
  id_user: number;
  id_stase: number;
  id_stage: number;
  id_semester: number;
  date: string;
  notes: string | null;
  is_retake: boolean;
};

export interface IStaseCreatePayload {
  id_client: number;
  id_user: number;
  id_stase: number;
  id_semester: number;
  date: string;
  notes?: string | null;
  is_retake?: boolean;
  created_by: number;
}

export interface IStaseUpdatePayload extends Omit<
  IStaseCreatePayload,
  "created_by"
> {
  id_logbook: number;
  updated_by: number;
}
