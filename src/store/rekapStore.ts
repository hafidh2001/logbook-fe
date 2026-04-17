import { create } from "zustand";
import { rekapApi } from "@/services/rekapApi";

interface RekapState {
  rekapLogbook: any[];
  rekapLogbookDetail: any | null;
  rekapPenilaian: any[];
  rekapPenilaianDetail: any | null;
  rekapReport: any[];
  rekapReportDetail: any | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface RekapActions {
  loadRekapLogbook: () => Promise<void>;
  loadRekapLogbookDetail: (id: string) => Promise<void>;
  loadRekapPenilaian: () => Promise<void>;
  loadRekapPenilaianDetail: (id: string) => Promise<void>;
  loadRekapReport: () => Promise<void>;
  loadRekapReportDetail: (id: string) => Promise<void>;
  reset: () => void;
  resetDetail: () => void;
}

type RekapStore = RekapState & RekapActions;

const initialState: RekapState = {
  rekapLogbook: [],
  rekapLogbookDetail: null,
  rekapPenilaian: [],
  rekapPenilaianDetail: null,
  rekapReport: [],
  rekapReportDetail: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  hasInitialized: false,
};

export const useRekapStore = create<RekapStore>((set) => ({
  ...initialState,

  loadRekapLogbook: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await rekapApi.getRekapLogbook();
      set({ rekapLogbook: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load rekap logbook", isLoading: false, hasInitialized: true });
    }
  },

  loadRekapLogbookDetail: async (id: string) => {
    set({ isLoadingDetail: true, error: null, rekapLogbookDetail: null });
    try {
      const data = await rekapApi.getRekapLogbookById(id);
      set({ rekapLogbookDetail: data, isLoadingDetail: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load rekap logbook detail", isLoadingDetail: false });
    }
  },

  loadRekapPenilaian: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await rekapApi.getRekapPenilaian();
      set({ rekapPenilaian: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load rekap penilaian", isLoading: false, hasInitialized: true });
    }
  },

  loadRekapPenilaianDetail: async (id: string) => {
    set({ isLoadingDetail: true, error: null, rekapPenilaianDetail: null });
    try {
      const data = await rekapApi.getRekapPenilaianById(id);
      set({ rekapPenilaianDetail: data, isLoadingDetail: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load rekap penilaian detail", isLoadingDetail: false });
    }
  },

  loadRekapReport: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await rekapApi.getRekapReport();
      set({ rekapReport: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load rekap report", isLoading: false, hasInitialized: true });
    }
  },

  loadRekapReportDetail: async (id: string) => {
    set({ isLoadingDetail: true, error: null, rekapReportDetail: null });
    try {
      const data = await rekapApi.getRekapReportById(id);
      set({ rekapReportDetail: data, isLoadingDetail: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load rekap report detail", isLoadingDetail: false });
    }
  },

  reset: () => set(initialState),
  resetDetail: () => set({
    rekapLogbookDetail: null,
    rekapPenilaianDetail: null,
    rekapReportDetail: null,
    isLoadingDetail: false,
    error: null,
  }),
}));
