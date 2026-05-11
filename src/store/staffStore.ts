import { create } from "zustand";
import { staffApi } from "@/services/staffApi";
import { useAuthStore } from "@/store/authStore";
import type {
  StaffData,
  StaffLogbookData,
  StaffState,
  StaffStore,
} from "@/types/staff/store";
import { EXPORT_LIMIT } from "@/constants/export";

const initialState: StaffState = {
  staffData: {
    list: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pageCount: 1,
    },
  },
  staffLogbookData: null,
  staffLogbookDetail: null,
  selectedStaff: null,
  isLoading: false,
  isLoadingDetail: false,
  isExporting: false,
  error: null,
  success: null,
  hasInitialized: false,
};

export const useStaffStore = create<StaffStore>((set) => ({
  ...initialState,

  loadStaffList: async (params) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });
    try {
      const response = await staffApi.getStaffList({
        ...params,
        id_client: user?.id_client ?? 0,
      });
      const data: StaffData = {
        list: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
      };
      set({
        staffData: data,
        isLoading: false,
        hasInitialized: true,
      });
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load staff";
      set({
        error: message,
        isLoading: false,
        hasInitialized: true,
      });
      throw error;
    }
  },

  loadStaffDetail: async (id_user: number) => {
    set({ isLoadingDetail: true, error: null, selectedStaff: null });
    try {
      const response = await staffApi.getStaffById(id_user);
      set({ selectedStaff: response.data || null, isLoadingDetail: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load staff detail",
        isLoadingDetail: false,
      });
    }
  },

  loadStaffLogbookList: async (params) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });
    try {
      const response = await staffApi.getStaffLogbookList({
        ...params,
        id_client: user?.id_client ?? 0,
      });
      const data: StaffLogbookData = {
        list: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
      };
      set({
        staffLogbookData: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load staff logbook list",
        isLoading: false,
      });
    }
  },

  loadStaffLogbookDetail: async (params) => {
    set({ isLoadingDetail: true, error: null, staffLogbookDetail: null });
    try {
      const response = await staffApi.getStaffLogbookDetail(params);
      set({ staffLogbookDetail: response.data || null, isLoadingDetail: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load staff logbook detail",
        isLoadingDetail: false,
      });
    }
  },

  createStaff: async (data) => {
    set({ isLoading: true, error: null, success: null });
    try {
      await staffApi.createStaff(data);
      set({ isLoading: false, success: "Data berhasil dibuat!" });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create staff",
        isLoading: false,
      });
      return false;
    }
  },

  updateStaff: async (data) => {
    set({ isLoading: true, error: null, success: null });
    try {
      await staffApi.updateStaff(data);
      set({ isLoading: false, success: "Data berhasil diupdate!" });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update staff",
        isLoading: false,
      });
      return false;
    }
  },

  deleteStaff: async (id_user: number) => {
    set({ isLoading: true, error: null, success: null });
    try {
      await staffApi.deleteStaff(id_user);
      set({ isLoading: false, success: "Data berhasil dihapus!" });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete staff",
        isLoading: false,
      });
      return false;
    }
  },

  changePassword: async (data) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await staffApi.changePassword(data);
      set({
        isLoading: false,
        success: response.message ?? "Password berhasil diubah!",
      });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to change password",
        isLoading: false,
      });
      return false;
    }
  },

  loadExportStaffList: async ({ filterParams, onProgress, signal }) => {
    const { user } = useAuthStore.getState();

    set({ isExporting: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await staffApi.getStaffList({
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

        const response = await staffApi.getStaffList({
          id_client: user?.id_client ?? 0,
          ...filterParams,
          page: 1,
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

  loadExportStaffLogbookList: async ({ filterParams, onProgress, signal }) => {
    set({ isExporting: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await staffApi.getStaffLogbookList({
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

        const response = await staffApi.getStaffLogbookList({
          ...filterParams,
          page: 1,
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
    set({ selectedStaff: null, isLoadingDetail: false, error: null }),
  resetLogbookDetail: () =>
    set({ staffLogbookDetail: null }),
}));