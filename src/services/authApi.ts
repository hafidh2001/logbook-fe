import axios from "axios";
import type { ILoginRequest, TAuthUser } from "@/types/auth/login";
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
  async login(credentials: ILoginRequest): Promise<TAuthUser> {
    try {
      const { data: responseData } = await apiClient.post<ApiResponse<TAuthUser>>(
        "Login",
        credentials,
      );

      if (responseData.status === false) {
        throw new Error(responseData.message || "Login gagal");
      }

      return responseData.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as ApiResponse<TAuthUser>;
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },
};
