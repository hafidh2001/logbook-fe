import { create } from "zustand";
import { rekapApi } from "@/services/rekapApi";
import type { RekapPenilaianStore } from "@/types/rekap/store";
import { EXPORT_LIMIT } from "@/constants/export";

const initialState = {
  rekapPenilaian: [] as any[],
  rekapPenilaianPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pageCount: 0,
  },
  rekapPenilaianDetail: null as any | null,
  isLoading: false,
  isLoadingDetail: false,
  isExporting: false,
  error: null as string | null,
};

export const useRekapStore = create<RekapPenilaianStore>((set) => ({
  ...initialState,

  loadRekapPenilaian: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rekapApi.getRekapPenilaianList(params);
      set({
        rekapPenilaian: response.data,
        rekapPenilaianPagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load rekap penilaian",
        isLoading: false,
      });
    }
  },

  loadRekapPenilaianDetail: async (id_logbook: number) => {
    set({ isLoadingDetail: true, error: null, rekapPenilaianDetail: null });
    try {
      const response = await rekapApi.getRekapPenilaianDetail(id_logbook);
      set({ rekapPenilaianDetail: response.data, isLoadingDetail: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load rekap penilaian detail",
        isLoadingDetail: false,
      });
    }
  },

  loadExportRekapPenilaian: async ({ filterParams, onProgress, signal }) => {
    set({ isExporting: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await rekapApi.getRekapPenilaianList({
        id_client: filterParams.id_client!,
        page: 1,
        limit: 1,
      });

      // Check if cancelled before continuing
      if (signal?.aborted) {
        set({ isExporting: false });
        throw new Error("EXPORT_CANCELLED");
      }

      const total = firstResponse.total;

      if (total === 0) {
        set({ isExporting: false });
        return [];
      }

      // Step 2: Batch export with limit
      const totalBatch = Math.ceil(total / EXPORT_LIMIT);
      let allData: typeof firstResponse.data = [];

      for (let i = 0; i < totalBatch; i++) {
        // Check if cancelled before each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        const response = await rekapApi.getRekapPenilaianList({
          id_client: filterParams.id_client!,
          page: i + 1,
          limit: EXPORT_LIMIT,
          search: filterParams.search,
          ppds_name: filterParams.ppds_name,
          staff_name: filterParams.staff_name,
          activity_name: filterParams.activity_name,
          stase_name: filterParams.stase_name,
          start_date: filterParams.start_date,
          end_date: filterParams.end_date,
        });

        // Check if cancelled after each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        allData.push(...response.data);

        // Call progress callback
        if (onProgress) {
          onProgress(Math.round(((i + 1) / totalBatch) * 100), allData.length, total);
        }
      }

      set({ isExporting: false });
      return allData;
    } catch (error) {
      set({ isExporting: false });
      throw error;
    }
  },

  cancelExport: () => {
    set({ isExporting: false });
  },

  reset: () => set(initialState),
  resetDetail: () => set({ rekapPenilaianDetail: null, isLoadingDetail: false }),
}));
