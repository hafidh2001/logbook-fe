import { create } from "zustand";
import { penilaianLogbookApi } from "@/services/penilaianLogbookApi";

interface PenilaianLogbookState {
  penilaianList: any[];
  statusList: any[];
  penilaianLogbookDetail: any | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface PenilaianLogbookActions {
  loadPenilaianList: () => Promise<void>;
  loadStatusList: () => Promise<void>;
  loadPenilaianLogbookDetail: (id: string) => Promise<void>;
  scorePenilaian: (id: string, data: { psikomotor: number; knowledge: number; afektif: number }) => Promise<boolean>;
  reset: () => void;
  resetDetail: () => void;
}

type PenilaianLogbookStore = PenilaianLogbookState & PenilaianLogbookActions;

const initialState: PenilaianLogbookState = {
  penilaianList: [],
  statusList: [],
  penilaianLogbookDetail: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  hasInitialized: false,
};

export const usePenilaianLogbookStore = create<PenilaianLogbookStore>((set) => ({
  ...initialState,

  loadPenilaianList: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await penilaianLogbookApi.getPenilaianLogbookList();
      set({ penilaianList: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load penilaian list", isLoading: false, hasInitialized: true });
    }
  },

  loadStatusList: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await penilaianLogbookApi.getPenilaianLogbookStatusList();
      set({ statusList: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load status list", isLoading: false, hasInitialized: true });
    }
  },

  loadPenilaianLogbookDetail: async (id: string) => {
    set({ isLoadingDetail: true, error: null, penilaianLogbookDetail: null });
    try {
      const data = await penilaianLogbookApi.getPenilaianLogbookDetailById(id);
      set({ penilaianLogbookDetail: data, isLoadingDetail: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load penilaian logbook detail", isLoadingDetail: false });
    }
  },

  scorePenilaian: async (id: string, data: { psikomotor: number; knowledge: number; afektif: number }) => {
    set({ isLoading: true, error: null });
    try {
      await penilaianLogbookApi.scorePenilaianLogbook(id, data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to score penilaian", isLoading: false });
      return false;
    }
  },

  reset: () => set(initialState),
  resetDetail: () => set({
    penilaianLogbookDetail: null,
    isLoadingDetail: false,
    error: null,
  }),
}));
