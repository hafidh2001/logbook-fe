import { Nullable } from "@/types";
import type { IRekapPenilaianListParams, TRekapPenilaianItem, IRekapLogbookListParams, TRekapLogbookItem } from "@/types/rekap";

// ============= Rekap Penilaian Store =============
export interface RekapPenilaianState {
  rekapPenilaian: TRekapPenilaianItem[];
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
}

export interface RekapLogbookActions {
  loadRekapLogbook: (params: IRekapLogbookListParams) => Promise<void>;
  loadRekapLogbookDetail: (id: number) => Promise<void>;
  loadExportRekapLogbook: (params: {
    filterParams: Partial<IRekapLogbookListParams>;
    onProgress?: (progress: number, offset: number) => void;
    signal?: AbortSignal;
  }) => Promise<TRekapLogbookItem[]>;
  cancelExportLogbook: () => void;
  resetLogbook: () => void;
  resetLogbookDetail: () => void;
}

export type RekapLogbookStore = RekapLogbookState & RekapLogbookActions;
