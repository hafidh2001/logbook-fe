import { Nullable } from "@/types";

// ============= Rekap Report Types =============
export type TRekapReportItem = {
  id: number;
  name: Nullable<string>;
  status: Nullable<string>;
  role: Nullable<string>;
  semester: Nullable<string>;
  jaga_igd_emergency: Nullable<number>;
  ilmiah_stase: Nullable<number>;
  poli_klinik: Nullable<number>;
  kamar_operasi: Nullable<number>;
  seminar_hasil: Nullable<number>;
  review_artikel: Nullable<number>;
  proposal_thesis: Nullable<number>;
  exam: Nullable<number>;
  stase: Nullable<number>;
  bimbingan_operasi: Nullable<number>;
  kegiatan_bangsal: Nullable<number>;
  publikasi: Nullable<number>;
  ilmiah_non_stase: Nullable<number>;
  course: Nullable<number>;
  ekstrakulikuler: Nullable<number>;
  pengabdian_masyarakat: Nullable<number>;
  total: Nullable<number>;
};

export interface IRekapReportListParams {
  id_client: number;
  page?: number;
  limit?: number;
  start_date?: Nullable<string>;
  end_date?: Nullable<string>;
}

export type TRekapReportData = {
  list: TRekapReportItem[];
  summary: {
    total_ppds: number;
    total_logbooks: number;
    avg_per_ppds: number;
    total_semesters: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
};

// ============= Rekap Penilaian Types =============
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
  status?: Nullable<string>;
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

// ============= Rekap Logbook Types =============
export type TRekapLogbookItem = {
  id: number;
  date: Nullable<string>;
  ppds: Nullable<string>;
  nim: Nullable<string>;
  action: Nullable<string>;
  semester: Nullable<string>;
  stase: Nullable<string>;
  pin: Nullable<string>;
  peran: Nullable<string>;
  category: Nullable<string>;
  staff: Nullable<string>;
  status: Nullable<string>;
  attachment: Nullable<string>;
  emr_number: Nullable<string>;
  diagnosis: Nullable<string>;
  treatment: Nullable<string>;
  patient: Nullable<string>;
  title: Nullable<string>;
};

export interface IRekapLogbookListParams {
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
  status?: Nullable<string>;
}

export type TRekapLogbookData = {
  list: TRekapLogbookItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
};
