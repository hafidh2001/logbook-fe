import { create } from "zustand";
import { staseApi } from "@/services/staseApi";
import { useAuthStore } from "@/store/authStore";
import type {
  StaseData,
  StaseState,
  StaseStore,
} from "@/types/stase/store";
import { EXPORT_LIMIT } from "@/constants/export";

const initialState: StaseState = {
  staseData: {
    list: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pageCount: 1,
    },
  },
  selectedStase: null,
  isLoading: false,
  isLoadingDetail: false,
  isExporting: false,
  error: null,
  success: null,
  hasInitialized: false,
};

export const useStaseStore = create<StaseStore>((set) => ({
  ...initialState,

  loadStaseList: async (params) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });
    try {
      const response = await staseApi.getStaseList({
        id_client: user?.id_client ?? 0,
        ...params,
      });
      const data: StaseData = {
        list: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
      };
      set({
        staseData: data,
        isLoading: false,
        hasInitialized: true,
      });
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load stase";
      set({
        error: message,
        isLoading: false,
        hasInitialized: true,
      });
      throw error;
    }
  },

  loadStaseDetail: async (id_logbook: number) => {
    set({ isLoadingDetail: true, error: null, selectedStase: null });
    try {
      const response = await staseApi.getStaseDetail({ id_logbook });
      set({ selectedStase: response.data || null, isLoadingDetail: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load stase detail",
        isLoadingDetail: false,
      });
    }
  },

  createStase: async (data) => {
    set({ isLoading: true, error: null, success: null });
    try {
      await staseApi.createStase(data);
      set({ isLoading: false, success: "Data berhasil dibuat!" });
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create stase",
        isLoading: false,
      });
      return false;
    }
  },

  updateStase: async (data) => {
    set({ isLoading: true, error: null, success: null });
    try {
      await staseApi.updateStase(data);
      set({ isLoading: false, success: "Data berhasil diupdate!" });
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update stase",
        isLoading: false,
      });
      return false;
    }
  },

  deleteStase: async (id_logbook) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await staseApi.deleteStase(id_logbook);
      set({ isLoading: false, success: response.message ?? "Data berhasil dihapus!" });
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete stase",
        isLoading: false,
      });
      return false;
    }
  },

  loadExportStaseList: async ({ filterParams, onProgress, signal }) => {
    const { user } = useAuthStore.getState();

    set({ isExporting: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await staseApi.getStaseList({
        id_client: user?.id_client ?? 0,
        ...filterParams,
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

        const response = await staseApi.getStaseList({
          id_client: user?.id_client ?? 0,
          ...filterParams,
          page: i + 1,
          limit: EXPORT_LIMIT,
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
  resetDetail: () =>
    set({ selectedStase: null, isLoadingDetail: false, error: null }),
}));
