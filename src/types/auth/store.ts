import { Nullable } from "@/types";
import type { TAuthUser } from "./login";

export interface AuthState {
  user: TAuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: Nullable<string>;
}

export interface AuthActions {
  init: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  reset: () => void;
}

export type LoginCredentials = {
  username: string;
  password: string;
  rememberMe?: boolean;
};

export type AuthStore = AuthState & AuthActions;
