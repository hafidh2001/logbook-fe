import { create } from "zustand";
import type { TPenilaianLogbook, IPenilaianLogbookListParams, IPenilaianLogbookDetailParams } from "@/types/penilaianLogbook";
import { penilaianLogbookApi } from "@/services/penilaianLogbookApi";
import { useAuthStore } from "@/store/authStore";

interface PenilaianLogbookState {
  penilaianList: TPenilaianLogbook[];
  penilaianLogbookDetail: TPenilaianLogbook | null;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface PenilaianLogbookActions {
  loadPenilaianList: (params?: Partial<IPenilaianLogbookListParams>) => Promise<void>;
  loadPenilaianLogbookDetail: (params: IPenilaianLogbookDetailParams) => Promise<void>;
  reset: () => void;
}

type PenilaianLogbookStore = PenilaianLogbookState & PenilaianLogbookActions;

const initialState: PenilaianLogbookState = {
  penilaianList: [],
  penilaianLogbookDetail: null,
  isLoading: false,
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

  reset: () => set(initialState),
}));
