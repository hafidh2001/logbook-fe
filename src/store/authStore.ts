import { create } from "zustand";
import { authApi } from "@/services/authApi";
import { jwtService } from "@/functions/jwt";
import { RoleEnum } from "@/types";
import type { AuthState, AuthStore } from "@/types/auth/store";
import { TAuthUser } from "@/types/auth/auth";

const initialState: AuthState = {
  user: {} as TAuthUser,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  success: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  init: async () => {
    set({ isLoading: true });

    try {
      const payload = await jwtService.getCurrentUser();

      if (payload) {
        const userData = jwtService.getUserData();
        set({
          user: userData,
          isAuthenticated: true,
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
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await authApi.login(credentials);
      const userData = response.data;

      // Check if user has INSTITUTION role
      if (userData.role_name !== RoleEnum.INSTITUTION) {
        set({
          isLoading: false,
          error:
            "Akses terbatas, role anda tidak memiliki izin untuk mengakses website",
        });
        return false;
      }

      // Generate JWT tokens from user data
      const jwtPayload = {
        user_id: String(userData.id),
        username: userData.username || "",
        name: userData.display_name,
        role: userData.role_name,
      };

      const { accessToken, refreshToken } =
        await jwtService.generateTokens(jwtPayload);
      jwtService.setTokens(
        accessToken,
        refreshToken,
        userData,
        credentials.rememberMe,
      );

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        success: response.message,
      });

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await authApi.updateProfile(data);

      // Update user data in authStore and JWT cookie
      const currentUser = useAuthStore.getState().user;
      const updatedUser = {
        ...currentUser,
        display_name: data.display_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        date_of_birth: data.date_of_birth,
        code: data.code,
      };

      // Update authStore
      set({ user: updatedUser, isLoading: false, success: response.message });

      // Update JWT cookie with new user data
      const { accessToken, refreshToken } = jwtService.getTokens();
      if (accessToken && refreshToken) {
        jwtService.setTokens(accessToken, refreshToken, updatedUser);
      }

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: async () => {
    jwtService.clearTokens();
    set({
      user: {} as TAuthUser,
      isAuthenticated: false,
      error: null,
      success: null,
    });
  },

  reset: () => {
    jwtService.clearTokens();
    set(initialState);
  },
}));
