import axios from "axios";
import type { TPpds, IPpdsListParams } from "@/types/ppds";
import type { ApiPaginationResponse } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

if (!API_URL || !API_TOKEN) {
  throw new Error(
    "API configuration is missing. Please check environment variables."
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
    params: IPpdsListParams
  ): Promise<ApiPaginationResponse<TPpds[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListPPDS",
        params
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

  async getPpdsById(id: string): Promise<TPpds | undefined> {
    try {
      const { data: responseData } = await apiClient.post("GetPPDSById", {
        id: Number(id),
      });

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to fetch PPDS detail");
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

  async deletePpds(id: string): Promise<void> {
    try {
      const { data: responseData } = await apiClient.post("DeletePPDS", {
        id: Number(id),
      });

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to delete PPDS");
      }
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
      const { data: responseData } = await apiClient.post(
        "CreatePPDS",
        data
      );

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

  async updatePpds(id: string, data: Partial<TPpds>): Promise<TPpds> {
    try {
      const { data: responseData } = await apiClient.post("UpdatePPDS", {
        id: Number(id),
        ...data,
      });

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to update PPDS");
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
};
