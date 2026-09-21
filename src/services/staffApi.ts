import axios from "axios";
import type { ApiResponse, ApiPaginationResponse } from "@/types";
import type {
  IStaffChangePasswordPayload,
  IStaffListParams,
  IStaffLogbookListParams,
  IStaffCreatePayload,
  IStaffPayload,
  TStaff,
  TStaffDetail,
  TStaffLogbook,
  TStaffLogbookDetail,
} from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

if (!API_URL || !API_TOKEN) {
  throw new Error(
    "API configuration is missing. Please check environment variables.",
  );
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export const staffApi = {
  async getStaffList(params: IStaffListParams): Promise<ApiPaginationResponse<TStaff[]>> {
    try {
      const { data: responseData } = await apiClient.post("GetListStaff", params);

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to get staff list");
      }

      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async getStaffById(id_user: number): Promise<ApiResponse<TStaffDetail>> {
    try {
      const { data: responseData } = await apiClient.post("GetDetailStaff", {
        id_user,
      });

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to get staff detail");
      }

      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async deleteStaff(id_user: number): Promise<ApiResponse<{ id_user: number }>> {
    try {
      const { data: responseData } = await apiClient.post("RemoveStaff", { id_user });

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to delete staff");
      }

      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async changePassword(data: IStaffChangePasswordPayload): Promise<ApiResponse<{ id_user: number }>> {
    try {
      const { data: responseData } = await apiClient.post("ChangePassword", data);

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to change password");
      }

      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async getStaffLogbookList(params: IStaffLogbookListParams): Promise<ApiPaginationResponse<TStaffLogbook[]>> {
    try {
      const { data: responseData } = await apiClient.post("GetListStaffLogbook", params);

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to get staff logbook list");
      }

      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async getStaffLogbookDetail(id_logbook: number): Promise<ApiResponse<TStaffLogbookDetail>> {
    try {
      const { data: responseData } = await apiClient.post("GetDetailStaffLogbook", { id_logbook });

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to get staff logbook detail");
      }

      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async createStaff(data: IStaffCreatePayload): Promise<ApiResponse<TStaff>> {
    try {
      const { data: responseData } = await apiClient.post("CreateStaff", data);

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to create staff");
      }

      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },

  async updateStaff(data: IStaffPayload): Promise<ApiResponse<TStaffDetail>> {
    try {
      const { data: responseData } = await apiClient.post("UpdateStaff", data);

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to update staff");
      }

      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },
};
