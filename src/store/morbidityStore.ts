import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";
import {
  MorbidityByUserData,
  MorbidityData,
  MorbidityState,
  MorbidityStore,
} from "@/types/morbidity/store";
import { morbidityApi } from "@/services/morbidityApi";

const initialState: MorbidityState = {
  morbidityData: {
    list: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pageCount: 1,
    },
  },
  morbidityByUserData: {
    list: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pageCount: 1,
    },
  },
  selectedMorbidityByUserDetail: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  success: null,
  hasInitialized: false,
};

export const useMorbidityStore = create<MorbidityStore>((set) => ({
  ...initialState,

  loadMorbidityList: async (params) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });
    try {
      const response = await morbidityApi.getMorbidityList({
        id_client: user?.id_client ?? 0,
        ...params,
      });
      const data: MorbidityData = {
        list: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
      };
      set({
        morbidityData: data,
        isLoading: false,
        hasInitialized: true,
      });
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load morbidity";
      set({
        error: message,
        isLoading: false,
        hasInitialized: true,
      });
      throw error;
    }
  },

  loadMorbidityByUserList: async (params) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });
    try {
      const response = await morbidityApi.getMorbidityByUser({
        id_client: user?.id_client ?? 0,
        ...params,
      });
      const data: MorbidityByUserData = {
        list: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
      };
      set({
        morbidityByUserData: data,
        isLoading: false,
        hasInitialized: true,
      });
      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load morbidity by user";
      set({
        error: message,
        isLoading: false,
        hasInitialized: true,
      });
      throw error;
    }
  },

  loadMorbidityByUserDetail: async (id: number) => {
    set({
      isLoadingDetail: true,
      error: null,
      selectedMorbidityByUserDetail: null,
    });
    try {
      const response = await morbidityApi.getMorbidityByUserDetail({ id });
      set({
        selectedMorbidityByUserDetail: response.data || null,
        isLoadingDetail: false,
      });
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

  reset: () => set(initialState),
  resetDetail: () =>
    set({
      selectedMorbidityByUserDetail: null,
      isLoadingDetail: false,
      error: null,
    }),
}));
