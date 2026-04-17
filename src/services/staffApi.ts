import { mockStaffList } from "@/data/staff";

export type Staff = (typeof mockStaffList)[number];

export const staffApi = {
  async getStaffList() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockStaffList;
  },

  async getStaffById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockStaffList.find((staff) => staff.id === Number(id));
  },

  async deleteStaff(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Deleting staff:", id);
  },

  async createStaff(data: Partial<typeof mockStaffList[0]>) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Creating staff:", data);
    return { ...data, id: Date.now() };
  },

  async updateStaff(id: string, data: Partial<typeof mockStaffList[0]>) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Updating staff:", id, data);
    return { ...data, id: Number(id) };
  },
};
