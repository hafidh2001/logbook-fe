import { Nullable } from "@/types";
import type { ILoginRequest, IProfilePayload, TAuthUser } from "./auth";

export interface AuthState {
  user: TAuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: Nullable<string>;
  success: Nullable<string>;
}

export interface AuthActions {
  init: () => Promise<void>;
  login: (credentials: ILoginRequest) => Promise<boolean>;
  updateProfile: (data: IProfilePayload) => Promise<boolean>;
  logout: () => Promise<void>;
  reset: () => void;
}

export type AuthStore = AuthState & AuthActions;
