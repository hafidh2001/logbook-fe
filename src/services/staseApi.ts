import { mockStaseList } from "@/data/stase";

export const staseApi = {
  async getStaseList() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockStaseList;
  },

  async getStaseById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockStaseList.find((stase) => stase.id === Number(id));
  },

  async deleteStase(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Deleting stase:", id);
  },

  async createStase(data: Partial<typeof mockStaseList[0]>) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Creating stase:", data);
    return { ...data, id: Date.now() };
  },

  async updateStase(id: string, data: Partial<typeof mockStaseList[0]>) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Updating stase:", id, data);
    return { ...data, id: Number(id) };
  },
};
