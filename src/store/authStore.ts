import { create } from "zustand";
import { authApi } from "@/services/authApi";
import { jwtService } from "@/functions/jwt";
import { RoleEnum } from "@/types";
import type { AuthStore } from "@/types/auth/store";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  init: async () => {
    set({ isLoading: true });

    try {
      const payload = await jwtService.getCurrentUser();

      if (payload) {
        set({
          isLoading: false,
          isInitialized: true,
        });
      } else {
        set({
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch {
      set({
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const userData = await authApi.login(credentials);

      // Check if user has INSTITUTION role
      if (userData.role_name !== RoleEnum.INSTITUTION) {
        set({
          isLoading: false,
          error: "Akses terbatas, role anda tidak memiliki izin untuk mengakses website",
        });
        return false;
      }

      // Generate JWT tokens from user data
      const jwtPayload = {
        user_id: String(userData.id),
        username: userData.username || "",
        name: userData.displayName,
        role: userData.role_name,
      };

      const { accessToken, refreshToken } = await jwtService.generateTokens(jwtPayload);
      jwtService.setTokens(accessToken, refreshToken, credentials.rememberMe);

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: async () => {
    jwtService.clearTokens();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  reset: () => {
    jwtService.clearTokens();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  },
}));
