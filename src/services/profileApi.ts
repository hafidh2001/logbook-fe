// Mock profile data - in real app this would come from API
const mockProfileData = {
  displayName: "DIANTI INSTITUSI",
  role: "institution",
  nama: "Dianti Kusuma",
  email: "dianti@email.com",
  telephoneNumber: "08123456789",
  code: "DIANTI001",
  tanggalLahir: null as string | null,
  address: "Jakarta, Indonesia",
};

export type Profile = typeof mockProfileData;

export const profileApi = {
  async getProfile(): Promise<Profile> {
    // Simulate API call
    return mockProfileData;
  },

  async updateProfile(data: Partial<Profile>): Promise<boolean> {
    // Simulate API call
    console.log("Updating profile:", data);
    return true;
  },
};
