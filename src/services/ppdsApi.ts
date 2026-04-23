import axios from "axios";
import type {
  TPpds,
  IPpdsListParams,
  TPpdsDetail,
  IPpdsPayload,
} from "@/types/ppds";
import type { ApiPaginationResponse, ApiResponse } from "@/types";

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

export const ppdsApi = {
  async getPpdsList(
    params: IPpdsListParams,
  ): Promise<ApiPaginationResponse<TPpds[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListPPDS",
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

  async getPpdsById(id_user: number): Promise<ApiResponse<TPpdsDetail>> {
    try {
      const { data: responseData } = await apiClient.post("GetDetailPPDS", {
        id_user,
      });

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

  async deletePpds(id_user: number): Promise<ApiResponse<{ id_user: number }>> {
    try {
      const { data: responseData } = await apiClient.post("DeletePPDS", {
        id_user,
      });

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to delete");
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

  async createPpds(data: Partial<TPpds>): Promise<TPpds> {
    try {
      const { data: responseData } = await apiClient.post("CreatePPDS", data);

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to create PPDS");
      }

      return responseData.data;
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

  async updatePpds(data: IPpdsPayload): Promise<ApiResponse<TPpdsDetail>> {
    try {
      const { data: responseData } = await apiClient.post("UpdatePPDS", data);

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to update PPDS");
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
