import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";
import { HospitalData, HospitalState, HospitalStore } from "@/types/hospital/store";
import { hospitalApi } from "@/services/hospitalApi";

const initialState: HospitalState = {
  hospitalData: {
    list: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pageCount: 1,
    },
  },
  selectedHospital: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  success: null,
  hasInitialized: false,
};

export const useHospitalStore = create<HospitalStore>((set) => ({
  ...initialState,

  loadHospitalList: async (params) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });
    try {
      const response = await hospitalApi.getHospitalList({
        id_client: user?.id_client ?? 0,
        ...params,
      });
      const data: HospitalData = {
        list: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
      };
      set({
        hospitalData: data,
        isLoading: false,
        hasInitialized: true,
      });
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load hospital";
      set({
        error: message,
        isLoading: false,
        hasInitialized: true,
      });
      throw error;
    }
  },

  loadHospitalDetail: async (id: number) => {
    set({ isLoadingDetail: true, error: null, selectedHospital: null });
    try {
      const response = await hospitalApi.getHospitalDetail({ id });
      set({ selectedHospital: response.data || null, isLoadingDetail: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load hospital detail",
        isLoadingDetail: false,
      });
    }
  },

  createHospital: async (data) => {
    set({ isLoading: true, error: null, success: null });
    try {
      await hospitalApi.createHospital(data);
      set({ isLoading: false, success: "Data berhasil dibuat!" });
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create hospital",
        isLoading: false,
      });
      return false;
    }
  },

  updateHospital: async (data) => {
    set({ isLoading: true, error: null, success: null });
    try {
      await hospitalApi.updateHospital(data);
      set({ isLoading: false, success: "Data berhasil diupdate!" });
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update hospital",
        isLoading: false,
      });
      return false;
    }
  },

  deleteHospital: async (id: number) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await hospitalApi.deleteHospital(id);
      set({ isLoading: false, success: response.message ?? "Data berhasil dihapus!" });
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete hospital",
        isLoading: false,
      });
      return false;
    }
  },

  reset: () => set(initialState),
  resetDetail: () =>
    set({ selectedHospital: null, isLoadingDetail: false, error: null }),
}));
