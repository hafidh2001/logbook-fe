import axios from "axios";
import type { ApiPaginationResponse } from "@/types";
import type {
  IMasterOptions,
  IMasterParams,
  IMasterUserParams,
} from "@/types/master";

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

export const masterApi = {
  async getMasterUser(
    params: IMasterUserParams,
  ): Promise<ApiPaginationResponse<IMasterOptions[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetMasterUser",
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

  async getMasterPPDS(
    params: IMasterUserParams,
  ): Promise<ApiPaginationResponse<IMasterOptions[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetMasterPPDS",
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

  async getMasterPPDSActive(
    params: IMasterUserParams,
  ): Promise<ApiPaginationResponse<IMasterOptions[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetMasterPPDSActive",
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

  async getMasterPPDSInactive(
    params: IMasterUserParams,
  ): Promise<ApiPaginationResponse<IMasterOptions[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetMasterPPDSInactive",
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

  async getMasterStase(
    params: IMasterParams,
  ): Promise<ApiPaginationResponse<IMasterOptions[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetMasterStase",
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

  async getMasterActivity(
    params: IMasterParams,
  ): Promise<ApiPaginationResponse<IMasterOptions[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetMasterActivity",
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

  async getMasterStage(
    params: IMasterParams,
  ): Promise<ApiPaginationResponse<IMasterOptions[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetMasterStage",
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

  async getMasterSemester(
    params: { id_stage: number },
  ): Promise<ApiPaginationResponse<IMasterOptions[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetMasterSemester",
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

  async getStageByStase(
    params: { id_stase: number },
  ): Promise<ApiPaginationResponse<IMasterOptions[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetStageByStase",
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
