import { create } from "zustand";
import { dashboardApi } from "@/services/dashboardApi";
import type { DashboardData } from "@/data/dashboard";

interface DashboardState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface DashboardActions {
  loadDashboard: () => Promise<void>;
  reset: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
  dashboardData: null,
  isLoading: false,
  error: null,
  hasInitialized: false,
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...initialState,

  loadDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await dashboardApi.getDashboard();
      set({ dashboardData: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load dashboard", isLoading: false, hasInitialized: true });
    }
  },

  reset: () => set(initialState),
}));
