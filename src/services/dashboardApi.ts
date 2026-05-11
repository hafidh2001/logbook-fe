import axios from "axios";
import type { ApiPaginationResponse, ApiResponse } from "@/types";
import { TKinerjaDPJPRaw, TKinerjaPPDSRaw, TPpdsBaruRaw, TWaitingVerificationRaw, TPpdsRaw, TLogActivityRaw, TLogbookByStatusRaw, TUnverifiedLogbookDetail, IUnverifiedLogbookListParams, TUnverifiedLogbook } from "@/types/dashboard";

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

export const dashboardApi = {
  // async getDashboard(): Promise<DashboardData> {
  //   return mockDashboard;
  // },

  async getDashboardKinerjaDPJP(
    idClient: number,
  ): Promise<ApiResponse<TKinerjaDPJPRaw[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDashboardKinerjadpjp",
        { id_client: idClient },
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

  async getDashboardKinerjaPPDS(
    idClient: number,
  ): Promise<ApiResponse<TKinerjaPPDSRaw[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDashboardKinerjappds",
        { id_client: idClient },
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

  async getDashboardPpdsBaru(
    idClient: number,
  ): Promise<ApiResponse<TPpdsBaruRaw[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDashboardPpdsBaru",
        { id_client: idClient },
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

  async getDashboardWaitingVerification(
    idClient: number,
  ): Promise<ApiResponse<TWaitingVerificationRaw[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDashboardWaitingVerification",
        { id_client: idClient },
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

  async getDashboardPPDS(
    idClient: number,
  ): Promise<ApiResponse<TPpdsRaw[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDashboardPPDS",
        { id_client: idClient },
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

  async getDashboardLogActivity(
    idClient: number,
  ): Promise<ApiResponse<TLogActivityRaw[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDashboardLogActivity",
        { id_client: idClient },
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

  async getDashboardLogbookByStatus(
    idClient: number,
  ): Promise<ApiResponse<TLogbookByStatusRaw[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDashboardLogbookByStatus",
        { id_client: idClient },
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

  async getDashboardStageCount(
    idClient: number,
  ): Promise<ApiResponse<{ count: number }>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDashboardStageCount",
        { id_client: idClient },
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

  async getDashboardActionCount(
    idClient: number,
  ): Promise<ApiResponse<{ count: number }>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDashboardActionCount",
        { id_client: idClient },
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

  async getUnverifiedLogbookList(params: IUnverifiedLogbookListParams): Promise<ApiPaginationResponse<TUnverifiedLogbook[]>> {
    try {
      const { data: responseData } = await apiClient.post("GetListUnverifiedLogbook", params);

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to get unverified logbook list");
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

  async getUnverifiedLogbookDetail(id_logbook: number): Promise<ApiResponse<TUnverifiedLogbookDetail>> {
    try {
      const { data: responseData } = await apiClient.post("GetDetailUnverifiedLogbook", { id_logbook });

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to get logbook detail");
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