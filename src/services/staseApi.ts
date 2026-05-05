import axios from "axios";
import type { ApiPaginationResponse } from "@/types";
import type { TStaseListItem, IStaseListParams } from "@/types/stase";

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

export const staseApi = {
  async getStaseList(
    params: IStaseListParams,
  ): Promise<ApiPaginationResponse<TStaseListItem[]>> {
    try {
      const { data: responseData } = await apiClient.post(
        "GetListStase",
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

  async getStaseById(id: string) {
    // Currently not implemented in backend, using mock
    await new Promise((resolve) => setTimeout(resolve, 300));
    const mockStaseList = [
      { id: 1, user: "Dr. Ahmad", stase: "IGD", date: "2024-01-15", notes: "Observasi" },
      { id: 2, user: "Dr. Budi", stase: "ICU", date: "2024-01-16", notes: " assist" },
    ];
    return mockStaseList.find((stase) => stase.id === Number(id));
  },

  async deleteStase(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Deleting stase:", id);
  },

  async createStase(data: Partial<TStaseListItem>) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Creating stase:", data);
    return { ...data, id: Date.now() };
  },

  async updateStase(id: string, data: Partial<TStaseListItem>) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Updating stase:", id, data);
    return { ...data, id: Number(id) };
  },
};