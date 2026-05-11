import { create } from "zustand";
import type {
  PpdsStore,
  PpdsData,
  PpdsLogbookData,
  PpdsInactiveData,
} from "@/types/ppds/store";
import type {
  TPpds,
  TPpdsDetail,
  TPpdsLogbook,
  IPpdsPayload,
  IPpdsCreatePayload,
  IPpdsChangePasswordPayload,
  TPpdsLogbookDetail,
  IPpdsLogbookDetailParams,
  IPpdsListParams,
} from "@/types/ppds";
import { ppdsApi } from "@/services/ppdsApi";
import { useAuthStore } from "@/store/authStore";
import { EXPORT_LIMIT } from "@/constants/export";

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
  ppdsInactiveData: null as PpdsInactiveData | null,
  ppdsLogbookData: null as PpdsLogbookData | null,
  ppdsLogbookDetail: null as TPpdsLogbookDetail | null,
  selectedPpds: null as TPpdsDetail | null,
  isLoading: false,
  isExporting: false,
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
        search: params?.search ?? null,
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
    set({ isLoading: true, error: null, selectedPpds: null });
    try {
      const response = await ppdsApi.getPpdsById(id_user);
      set({ selectedPpds: response.data || null, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load PPDS detail",
        isLoading: false,
      });
    }
  },

  loadPpdsInactiveList: async (params?: Partial<IPpdsListParams>) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });
    try {
      const response = await ppdsApi.getPpdsInactiveList({
        id_client: user?.id_client ?? 0,
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search ?? null,
        ppds: params?.ppds ?? null,
        stase: params?.stase ?? null,
        nim: params?.nim ?? null,
        status: params?.status ?? null,
      });

      const inactiveData: PpdsInactiveData = {
        list: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit) || 1,
        },
      };

      set({
        ppdsInactiveData: inactiveData,
        isLoading: false,
        hasInitialized: true,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load inactive PPDS list",
        isLoading: false,
        hasInitialized: true,
      });
    }
  },

  loadPpdsLogbookList: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ppdsApi.getPpdsLogbookList(params);
      const logbookData: PpdsLogbookData = {
        list: response.data.list,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit) || 1,
        },
      };
      set({
        ppdsLogbookData: logbookData,
        isLoading: false,
        hasInitialized: true,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load logbook list",
        isLoading: false,
        hasInitialized: true,
      });
    }
  },

  createPpds: async (data: IPpdsCreatePayload) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await ppdsApi.createPpds(data);
      set({
        isLoading: false,
        success: response.message ?? "Data berhasil dibuat!",
      });
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

  changePassword: async (data: IPpdsChangePasswordPayload) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await ppdsApi.changePassword(data);
      set({
        isLoading: false,
        success: response.message ?? "Password berhasil diubah!",
      });
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to change password",
        isLoading: false,
      });
      return false;
    }
  },

  loadPpdsLogbookDetail: async (params: IPpdsLogbookDetailParams) => {
    set({ isLoading: true, error: null, ppdsLogbookDetail: null });
    try {
      const response = await ppdsApi.getPpdsLogbookDetail(params);
      set({ ppdsLogbookDetail: response.data || null, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load logbook detail",
        isLoading: false,
      });
    }
  },

  loadExportPpdsList: async ({ filterParams, onProgress, signal }) => {
    const { user } = useAuthStore.getState();

    set({ isExporting: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await ppdsApi.getPpdsList({
        id_client: user?.id_client ?? 0,
        page: 1,
        limit: 1,
        ppds: filterParams.ppds ?? null,
        stase: filterParams.stase ?? null,
        nim: filterParams.nim ?? null,
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
      let allData: TPpds[] = [];

      for (let i = 0; i < totalBatch; i++) {
        // Check if cancelled before each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        const response = await ppdsApi.getPpdsList({
          id_client: user?.id_client ?? 0,
          page: i + 1,
          limit: EXPORT_LIMIT,
          ppds: filterParams.ppds ?? null,
          stase: filterParams.stase ?? null,
          nim: filterParams.nim ?? null,
        });

        // Check if cancelled after each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        allData.push(...response.data);

        // Call progress callback - offset represents what's about to be/has been fetched
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

  loadExportPpdsInactiveList: async ({ filterParams, onProgress, signal }) => {
    const { user } = useAuthStore.getState();

    set({ isExporting: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await ppdsApi.getPpdsInactiveList({
        id_client: user?.id_client ?? 0,
        page: 1,
        limit: 1,
        ppds: filterParams.ppds ?? null,
        stase: filterParams.stase ?? null,
        nim: filterParams.nim ?? null,
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
      let allData: TPpds[] = [];

      for (let i = 0; i < totalBatch; i++) {
        // Check if cancelled before each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        const response = await ppdsApi.getPpdsInactiveList({
          id_client: user?.id_client ?? 0,
          page: i + 1,
          limit: EXPORT_LIMIT,
          ppds: filterParams.ppds ?? null,
          stase: filterParams.stase ?? null,
          nim: filterParams.nim ?? null,
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

  loadExportPpdsLogbookList: async ({ filterParams, onProgress, signal }) => {
    const { user } = useAuthStore.getState();

    set({ isExporting: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await ppdsApi.getPpdsLogbookList({
        id_client: user?.id_client ?? 0,
        page: 1,
        limit: 1,
        id_ppds: filterParams.id_ppds ?? undefined,
        id_staff: filterParams.id_staff ?? undefined,
        id_activity: filterParams.id_activity ?? undefined,
        id_stase: filterParams.id_stase ?? undefined,
        start_date: filterParams.start_date ?? undefined,
        end_date: filterParams.end_date ?? undefined,
        status: filterParams.status ?? undefined,
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
      let allData: TPpdsLogbook[] = [];

      for (let i = 0; i < totalBatch; i++) {
        // Check if cancelled before each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        const response = await ppdsApi.getPpdsLogbookList({
          id_client: user?.id_client ?? 0,
          page: i + 1,
          limit: EXPORT_LIMIT,
          id_ppds: filterParams.id_ppds ?? undefined,
          id_staff: filterParams.id_staff ?? undefined,
          id_activity: filterParams.id_activity ?? undefined,
          id_stase: filterParams.id_stase ?? undefined,
          start_date: filterParams.start_date ?? undefined,
          end_date: filterParams.end_date ?? undefined,
          status: filterParams.status ?? undefined,
        });

        // Check if cancelled after each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        allData.push(...response.data.list);

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

  resetLogbookDetail: () =>
    set({
      ppdsLogbookDetail: null,
      isLoading: false,
      error: null,
    }),

  reset: () => set(initialState),
}));
