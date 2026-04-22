import axios from "axios";
import type {
  ILoginRequest,
  IProfilePayload,
  TAuthUser,
} from "@/types/auth";
import type { ApiResponse } from "@/types";

// API Configuration from environment variables
const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

// Validate environment variables
if (!API_URL || !API_TOKEN) {
  throw new Error(
    "API configuration is missing. Please check environment variables.",
  );
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

export const authApi = {
  /**
   * Login user
   */
  async login(credentials: ILoginRequest): Promise<ApiResponse<TAuthUser>> {
    try {
      const { data: responseData } = await apiClient.post("Login", credentials);

      if (responseData.status === false) {
        throw new Error(responseData.message || "Login gagal");
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

  /**
   * Update profile
   */
  async updateProfile(
    data: IProfilePayload,
  ): Promise<ApiResponse<{ id_user: number }>> {
    try {
      const { data: responseData } = await apiClient.post(
        "UpdateProfile",
        data,
      );

      if (responseData.status === false) {
        throw new Error(responseData.message || "Update gagal");
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
