import { mockDashboard, DashboardData } from "@/data/dashboard";

export const dashboardApi = {
  async getDashboard(): Promise<DashboardData> {
    // Simulate API call
    return mockDashboard;
  },
};
