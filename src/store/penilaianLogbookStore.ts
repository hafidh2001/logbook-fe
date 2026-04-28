import { create } from "zustand";
import type { TPenilaianLogbook, IPenilaianLogbookListParams } from "@/types/penilaianLogbook";
import { penilaianLogbookApi } from "@/services/penilaianLogbookApi";
import { useAuthStore } from "@/store/authStore";

interface PenilaianLogbookState {
  penilaianList: TPenilaianLogbook[];
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface PenilaianLogbookActions {
  loadPenilaianList: (params?: Partial<IPenilaianLogbookListParams>) => Promise<void>;
  reset: () => void;
}

type PenilaianLogbookStore = PenilaianLogbookState & PenilaianLogbookActions;

const initialState: PenilaianLogbookState = {
  penilaianList: [],
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

  reset: () => set(initialState),
}));
