import axios from "axios";
import type { ApiResponse, ApiPaginationResponse } from "@/types";
import { IHospitalCreatePayload, IHospitalListParams, IHospitalUpdatePayload, THospital } from "@/types/hospital";

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

export const hospitalApi = {
  async getHospitalList(
    params: IHospitalListParams,
  ): Promise<ApiPaginationResponse<THospital[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListHospital",
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

  async getHospitalDetail(
    params: { id: number }
  ): Promise<ApiResponse<THospital>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetDetailHospital",
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

  async deleteHospital(id: number): Promise<ApiResponse<null>> {
    try {
      const { data: responseData } = await apiClient.post("RemoveHospital", {
        id,
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

  async createHospital(data: IHospitalCreatePayload): Promise<ApiResponse<null>> {
    try {
      const { data: responseData } = await apiClient.post(
        "CreateHospital",
        data,
      );

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to create");
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

  async updateHospital(data: IHospitalUpdatePayload): Promise<ApiResponse<null>> {
    try {
      const { data: responseData } = await apiClient.post(
        "UpdateHospital",
        data,
      );

      if (responseData.status === false) {
        throw new Error(responseData.message || "Failed to update");
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