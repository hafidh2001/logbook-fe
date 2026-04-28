import axios from "axios";
import type { TPenilaianLogbook, IPenilaianLogbookListParams, IPenilaianLogbookDetailParams } from "@/types/penilaianLogbook";
import type { ApiResponse } from "@/types";

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

export const penilaianLogbookApi = {
  async getPenilaianLogbookList(
    params: IPenilaianLogbookListParams,
  ): Promise<ApiResponse<TPenilaianLogbook[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListPenilaianLogbook",
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

  async getPenilaianLogbookDetail(
    params: IPenilaianLogbookDetailParams,
  ): Promise<ApiResponse<TPenilaianLogbook>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDetailPenilaianLogbook",
        params,
      );

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to fetch detail");
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
