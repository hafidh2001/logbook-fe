import axios from "axios";
import type { ApiPaginationResponse, ApiResponse } from "@/types";
import type {
  IRekapPenilaianListParams,
  TRekapPenilaianItem,
  IRekapLogbookListParams,
  TRekapLogbookItem,
} from "@/types/rekap";

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

// ============= Rekap Penilaian API =============
export const rekapApi = {
  async getRekapPenilaianList(
    params: IRekapPenilaianListParams,
  ): Promise<ApiPaginationResponse<TRekapPenilaianItem[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListRekapPenilaian",
        params,
      );

      if (responseData.status === false) {
        throw new Error(
          responseData.message || "Failed to fetch rekap penilaian",
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

  async getAverageRekapPenilaian(
    params: IRekapPenilaianListParams,
  ): Promise<ApiResponse<number>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetAverageRekapPenilaian",
        params,
      );

      if (responseData.status === false) {
        throw new Error(
          responseData.message || "Failed to fetch average rekap penilaian",
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

  async getRekapPenilaianDetail(
    id_logbook: number,
  ): Promise<ApiResponse<TRekapPenilaianItem>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDetailRekapPenilaian",
        { id_logbook },
      );

      if (responseData.status === false) {
        throw new Error(
          responseData.message || "Failed to fetch rekap penilaian detail",
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

  // ============= Rekap Logbook API =============
  async getRekapLogbookList(
    params: IRekapLogbookListParams,
  ): Promise<ApiPaginationResponse<TRekapLogbookItem[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListRekapLogbook",
        params,
      );

      if (responseData.status === false) {
        throw new Error(
          responseData.message || "Failed to fetch rekap logbook",
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

  async getRekapLogbookDetail(
    id: number,
    staff: string | null,
  ): Promise<ApiResponse<TRekapLogbookItem>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDetailRekapLogbook",
        { id, staff: staff == "null" ? "" : staff },
      );

      if (responseData.status === false) {
        throw new Error(
          responseData.message || "Failed to fetch rekap logbook detail",
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
};
