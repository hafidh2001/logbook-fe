import { create } from "zustand";
import { masterApi } from "@/services/masterApi";
import type { MasterStore } from "@/types/master/store";
import { BasicSelectOpt, RoleEnum, StatusEnum } from "@/types";

const initialState = {
  ppdsOptions: [] as BasicSelectOpt<number>[],
  staffOptions: [] as BasicSelectOpt<number>[],
  staseOptions: [] as BasicSelectOpt<number>[],
  statusOptions: [] as BasicSelectOpt<string>[],
  isLoading: false,
  error: null,
};

export const useMasterStore = create<MasterStore>((set) => ({
  ...initialState,

  fetchPPDSOptions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterApi.getMasterUser({
        role_name: RoleEnum.PPDS,
        ...params,
      });
      const arr = response.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      set({ ppdsOptions: arr, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ error: message, isLoading: false });
    }
  },

  fetchStaffOptions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterApi.getMasterUser({
        role_name: RoleEnum.STAFF,
        ...params,
      });
      const arr = response.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      set({ staffOptions: arr, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ error: message, isLoading: false });
    }
  },

  fetchStaseOptions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterApi.getMasterStase({ ...params });
      const arr = response.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      set({ staseOptions: arr, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ error: message, isLoading: false });
    }
  },

  fetchStatusOptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const arr = Object.keys(StatusEnum).map((key) => {
        return {
          label: key,
          value: StatusEnum[key as keyof typeof StatusEnum],
        };
      });
      set({ statusOptions: arr, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ error: message, isLoading: false });
    }
  },

  reset: () => {
    set(initialState);
  },
}));
