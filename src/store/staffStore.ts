import { create } from "zustand";
import { staffApi } from "@/services/staffApi";

type Staff = Record<string, any>;

interface StaffState {
  staffList: Staff[];
  selectedStaff: Staff | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface StaffActions {
  loadStaffList: () => Promise<void>;
  loadStaffDetail: (id: string) => Promise<void>;
  createStaff: (data: Partial<Staff>) => Promise<boolean>;
  updateStaff: (id: string, data: Partial<Staff>) => Promise<boolean>;
  deleteStaff: (id: string) => Promise<boolean>;
  reset: () => void;
  resetDetail: () => void;
}

type StaffStore = StaffState & StaffActions;

const initialState: StaffState = {
  staffList: [],
  selectedStaff: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  hasInitialized: false,
};

export const useStaffStore = create<StaffStore>((set) => ({
  ...initialState,

  loadStaffList: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await staffApi.getStaffList();
      set({ staffList: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load staff", isLoading: false, hasInitialized: true });
    }
  },

  loadStaffDetail: async (id: string) => {
    set({ isLoadingDetail: true, error: null, selectedStaff: null });
    try {
      const data = await staffApi.getStaffById(id);
      set({ selectedStaff: data || null, isLoadingDetail: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load staff detail", isLoadingDetail: false });
    }
  },

  createStaff: async (data: Partial<Staff>) => {
    set({ isLoading: true, error: null });
    try {
      await staffApi.createStaff(data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to create staff", isLoading: false });
      return false;
    }
  },

  updateStaff: async (id: string, data: Partial<Staff>) => {
    set({ isLoading: true, error: null });
    try {
      await staffApi.updateStaff(id, data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to update staff", isLoading: false });
      return false;
    }
  },

  deleteStaff: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await staffApi.deleteStaff(id);
      set((state) => ({ staffList: state.staffList.filter((s) => s.id !== Number(id)), isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to delete staff", isLoading: false });
      return false;
    }
  },

  reset: () => set(initialState),
  resetDetail: () => set({ selectedStaff: null, isLoadingDetail: false, error: null }),
}));
