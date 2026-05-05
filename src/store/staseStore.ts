import { create } from "zustand";
import { staseApi } from "@/services/staseApi";
import { useAuthStore } from "@/store/authStore";
import type { TStaseListItem, IStaseListParams } from "@/types/stase";

export type Stase = TStaseListItem;

interface StaseState {
  staseList: Stase[];
  selectedStase: Stase | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface StaseActions {
  loadStaseList: (params?: Partial<IStaseListParams>) => Promise<void>;
  loadStaseDetail: (id: string) => Promise<void>;
  createStase: (data: Partial<Stase>) => Promise<boolean>;
  updateStase: (id: string, data: Partial<Stase>) => Promise<boolean>;
  deleteStase: (id: string) => Promise<boolean>;
  reset: () => void;
  resetDetail: () => void;
}

type StaseStore = StaseState & StaseActions;

const initialState: StaseState = {
  staseList: [],
  selectedStase: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pageCount: 1,
  },
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  hasInitialized: false,
};

export const useStaseStore = create<StaseStore>((set) => ({
  ...initialState,

  loadStaseList: async (params?: Partial<IStaseListParams>) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });
    try {
      const response = await staseApi.getStaseList({
        id_client: user?.id_client ?? 0,
        ...params,
      });
      set({
        staseList: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
        isLoading: false,
        hasInitialized: true,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load stase",
        isLoading: false,
        hasInitialized: true,
      });
    }
  },

  loadStaseDetail: async (id: string) => {
    set({ isLoadingDetail: true, error: null, selectedStase: null });
    try {
      const data = await staseApi.getStaseById(id);
      set({ selectedStase: data || null, isLoadingDetail: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load stase detail",
        isLoadingDetail: false,
      });
    }
  },

  createStase: async (data: Partial<Stase>) => {
    set({ isLoading: true, error: null });
    try {
      await staseApi.createStase(data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create stase",
        isLoading: false,
      });
      return false;
    }
  },

  updateStase: async (id: string, data: Partial<Stase>) => {
    set({ isLoading: true, error: null });
    try {
      await staseApi.updateStase(id, data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update stase",
        isLoading: false,
      });
      return false;
    }
  },

  deleteStase: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await staseApi.deleteStase(id);
      set((state) => ({
        staseList: state.staseList.filter((s) => s.id !== Number(id)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete stase",
        isLoading: false,
      });
      return false;
    }
  },

  reset: () => set(initialState),
  resetDetail: () => set({ selectedStase: null, isLoadingDetail: false, error: null }),
}));