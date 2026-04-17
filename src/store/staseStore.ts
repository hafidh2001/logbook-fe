import { create } from "zustand";
import { staseApi } from "@/services/staseApi";

export type Stase = {
  id: number;
  user: string;
  stase: string;
  date: string;
  notes: string | null;
};

interface StaseState {
  staseList: Stase[];
  selectedStase: Stase | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface StaseActions {
  loadStaseList: () => Promise<void>;
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
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  hasInitialized: false,
};

export const useStaseStore = create<StaseStore>((set) => ({
  ...initialState,

  loadStaseList: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await staseApi.getStaseList();
      set({ staseList: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load stase", isLoading: false, hasInitialized: true });
    }
  },

  loadStaseDetail: async (id: string) => {
    set({ isLoadingDetail: true, error: null, selectedStase: null });
    try {
      const data = await staseApi.getStaseById(id);
      set({ selectedStase: data || null, isLoadingDetail: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load stase detail", isLoadingDetail: false });
    }
  },

  createStase: async (data: Partial<Stase>) => {
    set({ isLoading: true, error: null });
    try {
      await staseApi.createStase(data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to create stase", isLoading: false });
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
      set({ error: error instanceof Error ? error.message : "Failed to update stase", isLoading: false });
      return false;
    }
  },

  deleteStase: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await staseApi.deleteStase(id);
      set((state) => ({ staseList: state.staseList.filter((s) => s.id !== Number(id)), isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to delete stase", isLoading: false });
      return false;
    }
  },

  reset: () => set(initialState),
  resetDetail: () => set({ selectedStase: null, isLoadingDetail: false, error: null }),
}));
