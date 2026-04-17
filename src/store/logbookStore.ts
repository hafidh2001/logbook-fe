import { create } from "zustand";
import { logbookApi, StaffLogbookData, PpdsLogbookData, StaffLogbookEntry, PpdsLogbookEntry } from "@/services/logbookApi";

interface LogbookState {
  staffLogbook: StaffLogbookData | null;
  staffLogbookDetail: StaffLogbookEntry | null;
  ppdsLogbook: PpdsLogbookData | null;
  ppdsLogbookDetail: PpdsLogbookEntry | null;
  inactiveList: any[];
  penilaianLogbookDetail: any | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface LogbookActions {
  loadStaffLogbook: (id: string) => Promise<void>;
  loadStaffLogbookDetail: (id: string, logbookId: string) => Promise<void>;
  loadPpdsLogbook: (id: string) => Promise<void>;
  loadPpdsLogbookDetail: (id: string, logbookId: string) => Promise<void>;
  loadInactiveList: () => Promise<void>;
  loadPenilaianLogbookDetail: (id: string) => Promise<void>;
  reset: () => void;
  resetDetail: () => void;
}

type LogbookStore = LogbookState & LogbookActions;

const initialState: LogbookState = {
  staffLogbook: null,
  staffLogbookDetail: null,
  ppdsLogbook: null,
  ppdsLogbookDetail: null,
  inactiveList: [],
  penilaianLogbookDetail: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  hasInitialized: false,
};

export const useLogbookStore = create<LogbookStore>((set) => ({
  ...initialState,

  loadStaffLogbook: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await logbookApi.getStaffLogbook(id);
      set({ staffLogbook: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load staff logbook", isLoading: false, hasInitialized: true });
    }
  },

  loadStaffLogbookDetail: async (id: string, logbookId: string) => {
    set({ isLoadingDetail: true, error: null, staffLogbookDetail: null });
    try {
      const data = await logbookApi.getStaffLogbookById(id, logbookId);
      set({ staffLogbookDetail: data, isLoadingDetail: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load staff logbook detail", isLoadingDetail: false });
    }
  },

  loadPpdsLogbook: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await logbookApi.getPpdsLogbook(id);
      set({ ppdsLogbook: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load ppds logbook", isLoading: false, hasInitialized: true });
    }
  },

  loadPpdsLogbookDetail: async (id: string, logbookId: string) => {
    set({ isLoadingDetail: true, error: null, ppdsLogbookDetail: null });
    try {
      const data = await logbookApi.getPpdsLogbookById(id, logbookId);
      set({ ppdsLogbookDetail: data, isLoadingDetail: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load ppds logbook detail", isLoadingDetail: false });
    }
  },

  loadInactiveList: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await logbookApi.getPpdsInactiveList();
      set({ inactiveList: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load inactive list", isLoading: false, hasInitialized: true });
    }
  },

  loadPenilaianLogbookDetail: async (id: string) => {
    set({ isLoadingDetail: true, error: null, penilaianLogbookDetail: null });
    try {
      const data = await logbookApi.getPenilaianLogbookDetailById(id);
      set({ penilaianLogbookDetail: data, isLoadingDetail: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load penilaian logbook detail", isLoadingDetail: false });
    }
  },

  reset: () => set(initialState),
  resetDetail: () => set({
    staffLogbookDetail: null,
    ppdsLogbookDetail: null,
    penilaianLogbookDetail: null,
    isLoadingDetail: false,
    error: null,
  }),
}));
