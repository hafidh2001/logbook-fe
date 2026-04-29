import { PenilaianLogbookStatusEnum } from "@/types";

export type TPenilaianLogbook = {
  id: number;
  name: string;
  unscored: number;
  scored: number;
};

export interface IPenilaianLogbookListParams {
  id_client: number;
}

export interface IPenilaianLogbookDetailParams {
  id_action: number;
}

export type TPenilaianLogbookStatusListItem = {
  id: number;
  title: string | null;
  date: string;
  ppds_name: string;
  code: string | null;
  inisial_code: string | null;
  semester_name: string | null;
  stase_name: string | null;
  stage_name: string | null;
  action_name: string;
  role_name: string | null;
  category: string | null;
  staff_names: string | null;
  psikomotor: number | null;
  knowledge: number | null;
  afektif: number | null;
  total: number | null;
};

export interface IPenilaianLogbookStatusListParams {
  id_action: number;
  type: PenilaianLogbookStatusEnum;
  page?: number;
  limit?: number;
  id_ppds?: number | null;
  id_staff?: number | null;
  id_stase?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}
