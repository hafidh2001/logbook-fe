import { create } from "zustand";
import type { TPenilaianLogbook, IPenilaianLogbookListParams, IPenilaianLogbookDetailParams, TPenilaianLogbookStatusListItem, IPenilaianLogbookStatusListParams, TPenilaianLogbookDetailByStatus, IPenilaianLogbookDetailByStatusParams } from "@/types/penilaianLogbook";
import { penilaianLogbookApi } from "@/services/penilaianLogbookApi";
import { useAuthStore } from "@/store/authStore";

interface PenilaianLogbookState {
  penilaianList: TPenilaianLogbook[];
  penilaianLogbookDetail: TPenilaianLogbook | null;
  penilaianLogbookDetailByStatus: TPenilaianLogbookDetailByStatus | null;
  penilaianLogbookStatusList: TPenilaianLogbookStatusListItem[];
  penilaianLogbookStatusPagination: {
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

interface PenilaianLogbookActions {
  loadPenilaianList: (params?: Partial<IPenilaianLogbookListParams>) => Promise<void>;
  loadPenilaianLogbookDetail: (params: IPenilaianLogbookDetailParams) => Promise<void>;
  loadPenilaianLogbookDetailByStatus: (params: IPenilaianLogbookDetailByStatusParams) => Promise<void>;
  loadPenilaianLogbookByStatus: (params: IPenilaianLogbookStatusListParams) => Promise<void>;
  reset: () => void;
  resetDetail: () => void;
}

type PenilaianLogbookStore = PenilaianLogbookState & PenilaianLogbookActions;

const initialState: PenilaianLogbookState = {
  penilaianList: [],
  penilaianLogbookDetail: null,
  penilaianLogbookDetailByStatus: null,
  penilaianLogbookStatusList: [],
  penilaianLogbookStatusPagination: {
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

export const usePenilaianLogbookStore = create<PenilaianLogbookStore>((set) => ({
  ...initialState,

  loadPenilaianList: async (params) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });
    try {
      const response = await penilaianLogbookApi.getPenilaianLogbookList({
        id_client: user?.id_client ?? 0,
        ...params,
      });
      set({ penilaianList: response.data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load",
        isLoading: false,
        hasInitialized: true,
      });
    }
  },

  loadPenilaianLogbookDetail: async (params: IPenilaianLogbookDetailParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await penilaianLogbookApi.getPenilaianLogbookDetail(params);
      set({ penilaianLogbookDetail: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load detail",
        isLoading: false,
      });
    }
  },

  loadPenilaianLogbookByStatus: async (params: IPenilaianLogbookStatusListParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await penilaianLogbookApi.getPenilaianLogbookByStatus(params);
      set({
        penilaianLogbookStatusList: response.data,
        penilaianLogbookStatusPagination: {
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
        error: error instanceof Error ? error.message : "Failed to load",
        isLoading: false,
        hasInitialized: true,
      });
    }
  },

  loadPenilaianLogbookDetailByStatus: async (params: IPenilaianLogbookDetailByStatusParams) => {
    set({ isLoadingDetail: true, error: null });
    try {
      const response = await penilaianLogbookApi.getDetailByStatusPenilaianLogbook(params);
      set({ penilaianLogbookDetailByStatus: response.data, isLoadingDetail: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load detail",
        isLoadingDetail: false,
      });
    }
  },

  reset: () => set(initialState),

  resetDetail: () => set({
    penilaianLogbookDetail: null,
    penilaianLogbookDetailByStatus: null,
    isLoadingDetail: false,
  }),
}));
