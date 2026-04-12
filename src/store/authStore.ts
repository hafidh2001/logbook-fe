import { create } from "zustand";
import { RoleEnum } from "@/types";
import { mockUsers, type MockUser } from "@/data/auth";
import { jwtService, type JWTPayload } from "@/functions/jwt";

export type AuthUser = {
  userId: string;
  username: string;
  name: string;
  role: RoleEnum;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

type LoginCredentials = {
  username: string;
  password: string;
};

type AuthActions = {
  init: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  reset: () => void;
};

const findMockUser = (username: string, password: string): MockUser | undefined => {
  return mockUsers.find(
    (user) => user.username === username && user.password === password
  );
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  init: async () => {
    set({ isLoading: true });

    const payload = await jwtService.getCurrentUser();

    if (payload) {
      set({
        user: {
          userId: payload.user_id,
          username: payload.username,
          name: payload.name,
          role: payload.role,
        },
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = findMockUser(credentials.username, credentials.password);

    if (!mockUser) {
      set({ isLoading: false, error: "Username atau password salah" });
      return false;
    }

    // Generate JWT tokens
    const payload: JWTPayload = {
      user_id: `user_${Date.now()}`,
      username: mockUser.username,
      name: mockUser.name,
      role: mockUser.role,
    };

    const { accessToken, refreshToken } = await jwtService.generateTokens(payload);
    jwtService.setTokens(accessToken, refreshToken);

    set({
      user: {
        userId: payload.user_id,
        username: payload.username,
        name: payload.name,
        role: payload.role,
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    return true;
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
