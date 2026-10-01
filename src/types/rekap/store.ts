import { Nullable } from "@/types";
import type {
  IRekapPenilaianListParams,
  TRekapPenilaianItem,
  IRekapLogbookListParams,
  TRekapLogbookItem,
  TRekapReportItem,
  IRekapReportListParams,
  TRekapReportData,
  TRekapReportLogbookDetail,
  TRekapReportDetailData,
  IRekapReportDetailParams,
  IMultipleUpdateLogbookPayload,
} from "@/types/rekap";

// ============= Rekap Report Store =============
export interface RekapReportState {
  filterRekapReport: {
    start_date: string;
    end_date: string;
  };
  rekapReport: TRekapReportItem[];
  rekapReportSummary: TRekapReportData["summary"];
  rekapReportPagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
  isLoadingReport: boolean;
  isExportingReport: boolean;

  rekapReportDetail: TRekapReportLogbookDetail[];
  rekapReportDetailPagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
  rekapReportDetailSummary: TRekapReportDetailData["summary"];
  rekapReportDetailActivity: TRekapReportDetailData["activity"];
  isLoadingReportDetail: boolean;
  isExportingReportDetail: boolean;

  errorReport: Nullable<string>;
}

export interface RekapReportActions {
  setFilterRekapReport: (filter: {
    start_date: string;
    end_date: string;
  }) => void;

  loadRekapReport: (params: IRekapReportListParams) => Promise<void>;
  loadExportRekapReport: (params: {
    filterParams: Partial<IRekapReportListParams>;
    onProgress?: (progress: number, offset: number, total: number) => void;
    signal?: AbortSignal;
  }) => Promise<TRekapReportItem[]>;
  cancelExportReport: () => void;
  resetReport: () => void;

  loadRekapReportDetail: (params: IRekapReportDetailParams) => Promise<void>;
  loadExportRekapReportDetail: (params: {
    filterParams: Partial<IRekapReportDetailParams>;
    onProgress?: (progress: number, offset: number, total: number) => void;
    signal?: AbortSignal;
  }) => Promise<TRekapReportLogbookDetail[]>;
  cancelExportReportDetail: () => void;
  resetReportDetail: () => void;
}

export type RekapReportStore = RekapReportState & RekapReportActions;

// ============= Rekap Penilaian Store =============
export interface RekapPenilaianState {
  rekapPenilaian: TRekapPenilaianItem[];
  averageRekapPenilaian: number | null;
  rekapPenilaianPagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
  rekapPenilaianDetail: TRekapPenilaianItem | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  isExporting: boolean;
  error: Nullable<string>;
}

export interface RekapPenilaianActions {
  loadRekapPenilaian: (params: IRekapPenilaianListParams) => Promise<void>;
  loadAverageRekapPenilaian: (
    params: IRekapPenilaianListParams,
  ) => Promise<void>;
  loadRekapPenilaianDetail: (id_logbook: number) => Promise<void>;
  loadExportRekapPenilaian: (params: {
    filterParams: Partial<IRekapPenilaianListParams>;
    onProgress?: (progress: number, offset: number, total: number) => void;
    signal?: AbortSignal;
  }) => Promise<TRekapPenilaianItem[]>;
  cancelExport: () => void;
  reset: () => void;
  resetDetail: () => void;
}

export type RekapPenilaianStore = RekapPenilaianState & RekapPenilaianActions;

// ============= Rekap Logbook Store =============
export interface RekapLogbookState {
  rekapLogbook: TRekapLogbookItem[];
  rekapLogbookPagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
  rekapLogbookDetail: TRekapLogbookItem | null;
  isLoadingLogbook: boolean;
  isLoadingLogbookDetail: boolean;
  isExportingLogbook: boolean;
  errorLogbook: Nullable<string>;
  successLogbook: Nullable<string>;
}

export interface RekapLogbookActions {
  loadRekapLogbook: (params: IRekapLogbookListParams) => Promise<void>;
  loadRekapLogbookDetail: (id: number, staff: string | null) => Promise<void>;
  loadExportRekapLogbook: (params: {
    filterParams: Partial<IRekapLogbookListParams>;
    onProgress?: (progress: number, offset: number) => void;
    signal?: AbortSignal;
  }) => Promise<TRekapLogbookItem[]>;
  cancelExportLogbook: () => void;
  resetLogbook: () => void;
  resetLogbookDetail: () => void;
  updateMultipleLogbook: (
    data: IMultipleUpdateLogbookPayload,
  ) => Promise<boolean>;
}

export type RekapLogbookStore = RekapLogbookState & RekapLogbookActions;
