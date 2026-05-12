import { Nullable } from "@/types";

export type TRekapPenilaianItem = {
  id_logbook: number;
  ppds: Nullable<string>;
  nim: Nullable<string>;
  inisial_code: Nullable<string>;
  semester: Nullable<string>;
  stase: Nullable<string>;
  pin: Nullable<string>;
  staff: Nullable<string>;
  action: Nullable<string>;
  date_logbook: Nullable<string>;
  title: Nullable<string>;
  notes: Nullable<string>;
  peran: Nullable<string>;
  category: Nullable<string>;
  psikomotor: Nullable<number>;
  knowledge: Nullable<number>;
  afektif: Nullable<number>;
  total: Nullable<number>;
};

export interface IRekapPenilaianListParams {
  id_client: number;
  page?: number;
  limit?: number;
  search?: Nullable<string>;
  ppds_name?: Nullable<string>;
  staff_name?: Nullable<string>;
  activity_name?: Nullable<string>;
  stase_name?: Nullable<string>;
  start_date?: Nullable<string>;
  end_date?: Nullable<string>;
}

export type TRekapPenilaianData = {
  list: TRekapPenilaianItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
};
