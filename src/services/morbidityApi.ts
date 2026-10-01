import axios from "axios";
import type { ApiResponse, ApiPaginationResponse } from "@/types";
import {
  IMorbidityByUserListParams,
  IMorbidityListParams,
  TMorbidity,
  TMorbidityByUser,
  TMorbidityByUserDetail,
} from "@/types/morbidity";

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

export const morbidityApi = {
  async getMorbidityList(
    params: IMorbidityListParams,
  ): Promise<ApiPaginationResponse<TMorbidity[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListMorbidity",
        params,
      );

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to get morbidity list");
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

  async getMorbidityByUser(
    params: IMorbidityByUserListParams,
  ): Promise<ApiPaginationResponse<TMorbidityByUser[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListMorbidityByUser",
        params,
      );

      if (responseData.status === false) {
        throw new Error(
          responseData.message || "Failed to get morbidity list by user",
        );
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

  async getMasterStaff(params: {
    id_client: number;
  }): Promise<ApiResponse<Array<{ id: number; name: string }>>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetMasterStaff",
        params,
      );

      if (responseData.status === false) {
        throw new Error(
          responseData.message || "Failed to get master staff",
        );
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

  async updateMorbiditasVerifier(params: {
    id_logbook: number;
    status_id: number;
    new_id_user: number;
  }): Promise<ApiResponse<null>> {
    try {
      const { data: responseData } = await apiClient.post(
        "UpdateMorbiditasVerifier",
        params,
      );

      if (responseData.status === false) {
        throw new Error(
          responseData.message || "Failed to update verifier",
        );
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

  async getMorbidityByUserDetail(params: {
    id: number;
  }): Promise<ApiResponse<TMorbidityByUserDetail>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDetailMorbidityByUser",
        params,
      );

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to fetch");
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
