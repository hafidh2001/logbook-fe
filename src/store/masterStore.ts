import { create } from "zustand";
import { masterApi } from "@/services/masterApi";
import type { MasterStore } from "@/types/master/store";
import {
  BasicSelectOpt,
  LogbookStatusEnum,
  RoleEnum,
  UserStatusEnum,
} from "@/types";

const initialState = {
  ppdsOptions: [] as BasicSelectOpt<number>[],
  staffOptions: [] as BasicSelectOpt<number>[],
  staseOptions: [] as BasicSelectOpt<number>[],
  userStatusOptions: [] as BasicSelectOpt<string>[],
  logbookStatusOptions: [] as BasicSelectOpt<string>[],
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

  fetchUserStatusOptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const arr = Object.keys(UserStatusEnum).map((key) => {
        return {
          label: key,
          value: UserStatusEnum[key as keyof typeof UserStatusEnum],
        };
      });
      set({ userStatusOptions: arr, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ error: message, isLoading: false });
    }
  },

  fetchLogbookStatusOptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const arr = Object.keys(LogbookStatusEnum).map((key) => {
        return {
          label: key,
          value: LogbookStatusEnum[key as keyof typeof LogbookStatusEnum],
        };
      });
      set({ logbookStatusOptions: arr, isLoading: false });
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
