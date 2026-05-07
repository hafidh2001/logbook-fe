import { create } from "zustand";
import { masterApi } from "@/services/masterApi";
import type { MasterStore, StaseSelectOpt } from "@/types/master/store";
import {
  BasicSelectOpt,
  LogbookStatusEnum,
  RoleEnum,
  UserStatusEnum,
} from "@/types";

const initialState = {
  ppdsOptions: [] as BasicSelectOpt<number>[],
  ppdsActiveOptions: [] as BasicSelectOpt<number>[],
  ppdsInactiveOptions: [] as BasicSelectOpt<number>[],
  staffOptions: [] as BasicSelectOpt<number>[],
  staseOptions: [] as StaseSelectOpt[],
  stageOptions: [] as BasicSelectOpt<number>[],
  semesterOptions: [] as BasicSelectOpt<number>[],
  activityOptions: [] as BasicSelectOpt<number>[],
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
      const response = await masterApi.getMasterPPDS({
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

  fetchPPDSActiveOptions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterApi.getMasterPPDSActive({
        role_name: RoleEnum.PPDS,
        ...params,
      });
      const arr = response.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      set({ ppdsActiveOptions: arr, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ error: message, isLoading: false });
    }
  },

  fetchPPDSInactiveOptions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterApi.getMasterPPDSInactive({
        role_name: RoleEnum.PPDS,
        ...params,
      });
      const arr = response.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      set({ ppdsInactiveOptions: arr, isLoading: false });
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
          id_stage: item.id_stage ?? 0,
        };
      });
      set({ staseOptions: arr, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ error: message, isLoading: false });
    }
  },

  fetchStageOptions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterApi.getMasterStage({ ...params });
      const arr = response.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      set({ stageOptions: arr, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ error: message, isLoading: false });
    }
  },

  fetchStageByStase: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterApi.getStageByStase(params);
      const arr = response.data.map((item) => {
        return {
          label: item.name ?? "",
          value: item.id_stage ?? 0,
        };
      });
      set({ stageOptions: arr, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ error: message, isLoading: false });
    }
  },

  fetchSemesterOptions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterApi.getMasterSemester(params);
      const arr = response.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      set({ semesterOptions: arr, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ error: message, isLoading: false });
    }
  },

  fetchActivityOptions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterApi.getMasterActivity({ ...params });
      const arr = response.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      set({ activityOptions: arr, isLoading: false });
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
