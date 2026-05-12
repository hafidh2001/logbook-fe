import { create } from "zustand";
import { rekapApi } from "@/services/rekapApi";
import type { RekapPenilaianStore } from "@/types/rekap/store";

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

  reset: () => set(initialState),
  resetDetail: () => set({ rekapPenilaianDetail: null, isLoadingDetail: false }),
}));
