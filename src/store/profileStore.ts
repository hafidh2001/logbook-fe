import { create } from "zustand";
import { profileApi, Profile } from "@/services/profileApi";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
}

interface ProfileActions {
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
  reset: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  hasInitialized: false,
};

export const useProfileStore = create<ProfileStore>((set) => ({
  ...initialState,

  loadProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await profileApi.getProfile();
      set({ profile: data, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load profile", isLoading: false, hasInitialized: true });
    }
  },

  updateProfile: async (data: Partial<Profile>) => {
    set({ isLoading: true, error: null });
    try {
      const success = await profileApi.updateProfile(data);
      set({ isLoading: false });
      return success;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to update profile", isLoading: false });
      return false;
    }
  },

  reset: () => set(initialState),
}));
