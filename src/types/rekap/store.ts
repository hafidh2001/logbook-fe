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
  error: Nullable<string>;
}

export interface RekapPenilaianActions {
  loadRekapPenilaian: (params: IRekapPenilaianListParams) => Promise<void>;
  loadRekapPenilaianDetail: (id_logbook: number) => Promise<void>;
  reset: () => void;
  resetDetail: () => void;
}

export type RekapPenilaianStore = RekapPenilaianState & RekapPenilaianActions;
