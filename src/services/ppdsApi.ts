import axios from "axios";
import type {
  TPpds,
  IPpdsListParams,
  TPpdsDetail,
  IPpdsPayload,
  IPpdsCreatePayload,
  IPpdsLogbookListParams,
  TPpdsLogbookData,
  IPpdsChangePasswordPayload,
  TPpdsLogbookDetail,
  IPpdsLogbookDetailParams,
  TPpdsInactive,
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

  async createPpds(data: IPpdsCreatePayload): Promise<ApiResponse<TPpds>> {
    try {
      const { data: responseData } = await apiClient.post("CreatePPDS", data);

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to create PPDS");
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

  async getPpdsLogbookList(
    params: IPpdsLogbookListParams,
  ): Promise<ApiPaginationResponse<TPpdsLogbookData>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListPPDSLogbook",
        params,
      );

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to fetch logbook list");
      }

      // Transform response to match PpdsLogbookData structure
      const result: ApiPaginationResponse<TPpdsLogbookData> = {
        ...responseData,
        data: {
          list: responseData.data,
          pagination: responseData.pagination,
        },
      };

      return result;
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

  async changePassword(data: IPpdsChangePasswordPayload): Promise<ApiResponse<{ id_user: number }>> {
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

  async getPpdsLogbookDetail(
    params: IPpdsLogbookDetailParams,
  ): Promise<ApiResponse<TPpdsLogbookDetail>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDetailPPDSLogbook",
        params,
      );

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to fetch logbook detail");
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

  async getPpdsInactiveList(
    params: IPpdsListParams,
  ): Promise<ApiPaginationResponse<TPpdsInactive[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListPPDSInactive",
        params,
      );

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to fetch inactive PPDS list");
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
