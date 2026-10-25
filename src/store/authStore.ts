import { create } from "zustand";
import { useMobileSession } from "@/mobile/session";
import { ROUTES } from "@/utils/routes";
import { authDestination } from "@/mobile/types";
import { authApi } from "@/services/authApi";
import { jwtService } from "@/functions/jwt";
import { RoleEnum } from "@/types";
import type { AuthState, AuthStore } from "@/types/auth/store";
import { TAuthUser } from "@/types/auth";

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

      if (payload && jwtService.getUserData()?.role_name === RoleEnum.INSTITUTION && !useMobileSession.getState().user) {
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
      let response;
      try { response = await authApi.login(credentials); }
      catch {
        await useMobileSession.getState().login(credentials.username, credentials.password);
        jwtService.clearTokens();
        set({ ...initialState, isInitialized: true, success: 'Login berhasil' });
        return true;
      }
      const userData = response.data;
      const destination = authDestination(userData.role_name);
      if (destination === ROUTES.login) throw new Error('Role tidak memiliki izin untuk mengakses aplikasi.');
      if (destination === '/mobile') {
        // Authenticate again against the actual mobile contract; never promote WEB data.
        await useMobileSession.getState().login(credentials.username, credentials.password);
        jwtService.clearTokens();
        set({ ...initialState, isInitialized: true, success: 'Login berhasil' });
        return true;
      }
      useMobileSession.getState().logout();

      // Generate JWT tokens from user data
      const jwtPayload = {
        id_user: String(userData.id),
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
