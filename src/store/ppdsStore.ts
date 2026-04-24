import { create } from "zustand";
import type { PpdsStore, PpdsData } from "@/types/ppds/store";
import type { TPpds, TPpdsDetail, IPpdsPayload } from "@/types/ppds";
import { ppdsApi } from "@/services/ppdsApi";
import { useAuthStore } from "@/store/authStore";

const initialState = {
  ppdsData: {
    list: [] as TPpds[],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pageCount: 1,
    },
  },
  selectedPpds: null as TPpdsDetail | null,
  isLoading: false,
  isLoadingDetail: false,
  error: null as string | null,
  success: null as string | null,
  hasInitialized: false,
};

export const usePpdsStore = create<PpdsStore>((set) => ({
  ...initialState,

  loadPpdsList: async (params) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });

    try {
      const response = await ppdsApi.getPpdsList({
        id_client: user?.id_client ?? 0,
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        ppds: params?.ppds ?? null,
        stase: params?.stase ?? null,
        nim: params?.nim ?? null,
      });

      const ppdsData: PpdsData = {
        list: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit) || 1,
        },
      };

      set({
        ppdsData,
        isLoading: false,
        hasInitialized: true,
      });

      return ppdsData;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load PPDS list",
        isLoading: false,
        hasInitialized: true,
      });
      throw error;
    }
  },

  loadPpdsDetail: async (id_user: number) => {
    set({ isLoadingDetail: true, error: null, selectedPpds: null });
    try {
      const response = await ppdsApi.getPpdsById(id_user);
      set({ selectedPpds: response.data || null, isLoadingDetail: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load PPDS detail",
        isLoadingDetail: false,
      });
    }
  },

  createPpds: async (data: Partial<TPpds>) => {
    set({ isLoading: true, error: null });
    try {
      await ppdsApi.createPpds(data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create PPDS",
        isLoading: false,
      });
      return false;
    }
  },

  updatePpds: async (data: IPpdsPayload) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await ppdsApi.updatePpds(data);
      set({
        isLoading: false,
        success: response.message ?? "Data berhasil diperbarui",
      });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update PPDS",
        isLoading: false,
      });
      return false;
    }
  },

  deletePpds: async (id_user: number) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await ppdsApi.deletePpds(id_user);
      set({ isLoading: false, success: response.message ?? null });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete PPDS",
        isLoading: false,
      });
      return false;
    }
  },

  reset: () => set(initialState),
}));
