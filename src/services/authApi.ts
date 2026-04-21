import axios from "axios";
import type { ILoginRequest, TAuthUser } from "@/types/auth/login";

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
      const response = await apiClient.post<TAuthUser>(
        "Login",
        credentials,
      );

      // Check if API returned an error response
      const responseData = response.data as { success?: boolean; message?: string; role_name?: string };
      if (responseData.success === false) {
        throw new Error(responseData.message || "Login gagal");
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check response data for error message even in HTTP errors
        const responseData = error.response?.data as { message?: string; success?: boolean };
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        throw new Error(error.message);
      }
      throw error;
    }
  },
};
