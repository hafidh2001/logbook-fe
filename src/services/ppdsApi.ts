import type { TPpds } from "@/types/ppds";
import { mockPpdsList } from "@/data/ppds";

// For now, using mock data. When API is ready, replace with actual API calls.
export const ppdsApi = {
  async getPpdsList(): Promise<TPpds[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPpdsList;
  },

  async getPpdsById(id: string): Promise<TPpds | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPpdsList.find((ppds) => ppds.id === Number(id));
  },

  async deletePpds(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Deleting PPDS:", id);
  },

  async createPpds(data: Partial<TPpds>): Promise<TPpds> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Creating PPDS:", data);
    return { ...data, id: Date.now() } as TPpds;
  },

  async updatePpds(id: string, data: Partial<TPpds>): Promise<TPpds> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Updating PPDS:", id, data);
    return { ...data, id: Number(id) } as TPpds;
  },
};
