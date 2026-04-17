import { create } from "zustand";
import { TPpds } from "@/types/ppds";
import { ppdsApi } from "@/services/ppdsApi";

interface PpdsState {
  ppdsList: TPpds[];
  selectedPpds: TPpds | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface PpdsActions {
  loadPpdsList: () => Promise<void>;
  loadPpdsDetail: (id: string) => Promise<void>;
  createPpds: (data: Partial<TPpds>) => Promise<boolean>;
  updatePpds: (id: string, data: Partial<TPpds>) => Promise<boolean>;
  deletePpds: (id: string) => Promise<boolean>;
  reset: () => void;
  resetDetail: () => void;
}

type PpdsStore = PpdsState & PpdsActions;

const initialState: PpdsState = {
  ppdsList: [],
  selectedPpds: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  hasInitialized: false,
};

export const usePpdsStore = create<PpdsStore>((set) => ({
  ...initialState,

  loadPpdsList: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ppdsApi.getPpdsList();
      set({ ppdsList: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load PPDS list",
        isLoading: false,
        hasInitialized: true,
      });
    }
  },

  loadPpdsDetail: async (id: string) => {
    set({ isLoadingDetail: true, error: null, selectedPpds: null });
    try {
      const data = await ppdsApi.getPpdsById(id);
      set({ selectedPpds: data || null, isLoadingDetail: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load PPDS detail",
        isLoadingDetail: false,
      });
    }
  },

  createPpds: async (data: Partial<TPpds>) => {
    set({ isLoading: true, error: null });
    try {
      await ppdsApi.createPpds(data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create PPDS",
        isLoading: false,
      });
      return false;
    }
  },

  updatePpds: async (id: string, data: Partial<TPpds>) => {
    set({ isLoading: true, error: null });
    try {
      await ppdsApi.updatePpds(id, data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update PPDS",
        isLoading: false,
      });
      return false;
    }
  },

  deletePpds: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await ppdsApi.deletePpds(id);
      // Remove from list locally
      set((state) => ({
        ppdsList: state.ppdsList.filter((ppds) => ppds.id !== Number(id)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete PPDS",
        isLoading: false,
      });
      return false;
    }
  },

  reset: () => set(initialState),

  resetDetail: () => set({ selectedPpds: null, isLoadingDetail: false, error: null }),
}));
