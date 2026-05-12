import { Nullable } from "@/types";
import type { IRekapPenilaianListParams, TRekapPenilaianItem } from "@/types/rekap";

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
