import { create } from "zustand";
import { dashboardApi } from "@/services/dashboardApi";
import {
  TKinerjaDPJPRaw,
  TKinerjaDPJP,
  TKinerjaPPDSRaw,
  TKinerjaPPDS,
  TPpdsBaruRaw,
  TPpdsBaru,
  TWaitingVerificationRaw,
  TWaitingVerification,
  TPPDSPerStage,
  TPPDSPerStase,
  TLogActivity,
  TLogbookByStatusRaw,
  TLogbookByStatus,
  TUnverifiedLogbook,
} from "@/types/dashboard";
import { useAuthStore } from "./authStore";
import {
  DashboardState,
  DashboardStore,
  UnverifiedLogbookData,
} from "@/types/dashboard/store";
import { EXPORT_LIMIT } from "@/constants/export";

const initialState: DashboardState = {
  kinerjaDPJP: [],
  kinerjaPPDS: [],
  ppdsBaru: [],
  waitingVerification: [],
  ppdsPerStage: [],
  ppdsPerStase: [],
  logActivity: [],
  logbookByStatus: [],
  logbookTotal: 0,
  logbookPending: 0,
  ppdsActive: 0,
  ppdsInactive: 0,
  staffCount: 0,
  stageCount: 0,
  actionCount: 0,
  unverifiedLogbookData: null,
  unverifiedLogbookDetail: null,
  isLoading: false,
  isExporting: false,
  error: null,
  hasInitialized: false,
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...initialState,

  // loadDashboard: async () => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const data = await dashboardApi.getDashboard();
  //     set({ dashboardData: data, isLoading: false, hasInitialized: true });
  //   } catch (error) {
  //     set({
  //       error:
  //         error instanceof Error ? error.message : "Failed to load dashboard",
  //       isLoading: false,
  //       hasInitialized: true,
  //     });
  //   }
  // },

  loadKinerjaDPJP: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id_client) return;

    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getDashboardKinerjaDPJP(
        user.id_client,
      );
      const rawData = response.data;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const staffMap = new Map<number, TKinerjaDPJPRaw[]>();

      rawData.forEach((item) => {
        const existing = staffMap.get(item.id) || [];
        existing.push(item);
        staffMap.set(item.id, existing);
      });

      const transformed: TKinerjaDPJP[] = [];

      staffMap.forEach((tlsList, staffId) => {
        const displayName = tlsList[0]?.display_name || "-";

        const currentMonthTls = tlsList.filter((tls) => {
          const dateTime = new Date(tls.date_time);
          return (
            dateTime.getMonth() === currentMonth &&
            dateTime.getFullYear() === currentYear
          );
        });

        const uniqueLogbooks = new Set(
          currentMonthTls.map((tls) => tls.id_logbook),
        );
        const totalLogbook = uniqueLogbooks.size;

        const verified = currentMonthTls.filter(
          (tls) => tls.status === "verified",
        ).length;
        const pending = currentMonthTls.filter(
          (tls) => tls.status === "pending",
        ).length;

        transformed.push({
          id: staffId,
          name: displayName,
          total_logbook: totalLogbook,
          pending,
          verified,
        });
      });

      transformed.sort((a, b) => {
        const rankA = a.total_logbook > 0 ? a.verified / a.total_logbook : 0;
        const rankB = b.total_logbook > 0 ? b.verified / b.total_logbook : 0;

        if (rankB === rankA) {
          return b.verified - a.verified;
        }
        return rankB - rankA;
      });
      set({ kinerjaDPJP: transformed, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load Kinerja DPJP",
        isLoading: false,
      });
    }
  },

  loadKinerjaPPDS: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id_client) return;

    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getDashboardKinerjaPPDS(
        user.id_client,
      );
      const rawData = response.data;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const ppdsMap = new Map<number, TKinerjaPPDSRaw[]>();

      rawData.forEach((item) => {
        const existing = ppdsMap.get(item.id) || [];
        existing.push(item);
        ppdsMap.set(item.id, existing);
      });

      const transformed: TKinerjaPPDS[] = [];

      ppdsMap.forEach((logbookList) => {
        const displayName = logbookList[0]?.display_name || "-";
        const staseName = logbookList[0]?.stase_name || "-";

        const verifiedLogbooks = logbookList.filter((lb) => {
          const logbookDate = new Date(lb.date);
          const isCurrentMonth =
            logbookDate.getMonth() === currentMonth &&
            logbookDate.getFullYear() === currentYear;
          const isVerified = lb.verified_status === "verified";
          const isNotStase = lb.identifier !== "stase";

          return isCurrentMonth && isVerified && isNotStase;
        });

        const uniqueLogbooks = new Set(
          verifiedLogbooks.map((lb) => lb.logbook_id),
        );
        const verifiedCount = uniqueLogbooks.size;

        transformed.push({
          name: displayName,
          stase: staseName,
          verified_count: verifiedCount,
        });
      });

      transformed.sort((a, b) => b.verified_count - a.verified_count);
      set({ kinerjaPPDS: transformed, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load Kinerja PPDS",
        isLoading: false,
      });
    }
  },

  loadPpdsBaru: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id_client) return;

    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getDashboardPpdsBaru(user.id_client);
      const rawData = response.data;

      // Group by year
      const yearMap = new Map<number, TPpdsBaruRaw[]>();

      rawData.forEach((item) => {
        const year = new Date(item.created_date).getFullYear();
        const existing = yearMap.get(year) || [];
        existing.push(item);
        yearMap.set(year, existing);
      });

      // Transform to { year, count }
      const transformed: TPpdsBaru[] = [];

      yearMap.forEach((items, year) => {
        transformed.push({
          year: String(year),
          count: items.length,
        });
      });

      // Sort by year ascending
      transformed.sort((a, b) => Number(a.year) - Number(b.year));

      set({ ppdsBaru: transformed, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load PPDS Baru",
        isLoading: false,
      });
    }
  },

  loadWaitingVerification: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id_client) return;

    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getDashboardWaitingVerification(
        user.id_client,
      );
      const rawData = response.data;

      // Group by logbook id to get unique entries
      const logbookMap = new Map<number, TWaitingVerificationRaw>();

      rawData.forEach((item) => {
        if (!logbookMap.has(item.id)) {
          logbookMap.set(item.id, item);
        }
      });

      // Transform to { activity, staff, date }
      const transformed: TWaitingVerification[] = [];

      logbookMap.forEach((item) => {
        const dateObj = new Date(item.date);
        const formattedDate = dateObj.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        transformed.push({
          activity: item.action_name || "-",
          staff: item.staff_name || "-",
          date: formattedDate,
        });
      });

      set({ waitingVerification: transformed, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load Waiting Verification",
        isLoading: false,
      });
    }
  },

  loadPPDSPerStageStase: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id_client) return;

    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getDashboardPPDS(user.id_client);
      const rawData = response.data;
      console.log(rawData);

      // Calculate ppds active/inactive and staff count
      // Note: PostgreSQL returns boolean as 't'/'f' strings, not JS booleans
      const isShowTrue = (val: unknown) =>
        val === true || val === "t" || val === 1;

      const ppdsActive = rawData.filter(
        (item) =>
          item.role_name === "ppds" &&
          item.status === "Active" &&
          isShowTrue(item.is_show),
      ).length;
      const ppdsInactive = rawData.filter(
        (item) => item.role_name === "ppds" && ( item.status === "Inactive" || item.status === "Lulus"),
      ).length;
      const staffCount = rawData.filter(
        (item) =>
          item.role_name === "staff" &&
          item.status === "Active" &&
          isShowTrue(item.is_show),
      ).length;

      // Group by stage (filter out null)
      const stageMap = new Map<string, number>();
      rawData.forEach((item) => {
        if (item.stage_name !== null && item.status === "Active") {
          stageMap.set(
            item.stage_name,
            (stageMap.get(item.stage_name) || 0) + 1,
          );
        }
      });

      const transformedStage: TPPDSPerStage[] = [];
      stageMap.forEach((count, stage) => {
        transformedStage.push({ stage, count });
      });

      // Group by stase (filter out null)
      const staseMap = new Map<string, number>();
      rawData.forEach((item) => {
        if (item.stase_name !== null && item.status === "Active") {
          staseMap.set(
            item.stase_name,
            (staseMap.get(item.stase_name) || 0) + 1,
          );
        }
      });

      const transformedStase: TPPDSPerStase[] = [];
      staseMap.forEach((count, stase) => {
        transformedStase.push({ stase, count });
      });

      set({
        ppdsPerStage: transformedStage,
        ppdsPerStase: transformedStase,
        ppdsActive,
        ppdsInactive,
        staffCount,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load PPDS Per Stage/Stase",
        isLoading: false,
      });
    }
  },

  loadLogActivity: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id_client) return;

    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getDashboardLogActivity(
        user.id_client,
      );
      const rawData = response.data;

      // Transform to { message }
      const transformed: TLogActivity[] = rawData.map((item) => ({
        message: item.message || "-",
      }));

      set({ logActivity: transformed, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load Log Activity",
        isLoading: false,
      });
    }
  },

  loadLogbookByStatus: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id_client) return;

    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getDashboardLogbookByStatus(
        user.id_client,
      );
      const rawData: TLogbookByStatusRaw[] = response.data;

      // Calculate total from all statuses
      const logbookTotal = rawData.reduce((sum, item) => sum + item.count, 0);

      // Get pending count
      const pendingItem = rawData.find((item) => item.status === "pending");
      const logbookPending = pendingItem?.count || 0;

      // Calculate percentages
      const percentage = (value: number) =>
        logbookTotal > 0 ? ((value / logbookTotal) * 100).toFixed(2) : "0.00";

      // Transform dynamically based on whatever statuses the API returns
      const transformed: TLogbookByStatus[] = rawData.map((item) => ({
        status: `${item.status} (${percentage(item.count)}%)`,
        count: item.count,
      }));

      set({
        logbookByStatus: transformed,
        logbookTotal,
        logbookPending,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load Logbook By Status",
        isLoading: false,
      });
    }
  },

  loadStageCount: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id_client) return;

    try {
      const response = await dashboardApi.getDashboardStageCount(
        user.id_client,
      );
      set({ stageCount: response.data.count });
    } catch (error) {
      console.error("Failed to load stage count:", error);
    }
  },

  loadActionCount: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id_client) return;

    try {
      const response = await dashboardApi.getDashboardActionCount(
        user.id_client,
      );
      set({ actionCount: response.data.count });
    } catch (error) {
      console.error("Failed to load action count:", error);
    }
  },

  loadUnverifiedLogbookList: async (params) => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getUnverifiedLogbookList({
        ...params,
        id_client: user?.id_client ?? 0,
      });
      const data: UnverifiedLogbookData = {
        list: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
      };
      set({
        unverifiedLogbookData: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load logbook list",
        isLoading: false,
      });
    }
  },

  loadUnverifiedLogbookDetail: async (params) => {
    set({ isLoading: true, error: null, unverifiedLogbookDetail: null });
    try {
      const response = await dashboardApi.getUnverifiedLogbookDetail(params);
      set({ unverifiedLogbookDetail: response.data || null, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load logbook detail",
        isLoading: false,
      });
    }
  },

  loadExportUnverifiedLogbookList: async ({ filterParams, onProgress, signal }) => {
    set({ isExporting: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await dashboardApi.getUnverifiedLogbookList({
        ...filterParams,
        page: 1,
        limit: 1,
      });

      // Check if cancelled before continuing
      if (signal?.aborted) {
        set({ isExporting: false });
        throw new Error("EXPORT_CANCELLED");
      }

      const total = firstResponse.total;

      if (total === 0) {
        set({ isExporting: false });
        return [];
      }

      // Step 2: Batch export with limit
      const totalBatch = Math.ceil(total / EXPORT_LIMIT);
      let allData: TUnverifiedLogbook[] = [];

      for (let i = 0; i < totalBatch; i++) {
        // Check if cancelled before each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        const response = await dashboardApi.getUnverifiedLogbookList({
          ...filterParams,
          page: i + 1,
          limit: EXPORT_LIMIT,
        });

        // Check if cancelled after each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        allData.push(...response.data);

        // Call progress callback
        if (onProgress) {
          onProgress(Math.round(((i + 1) / totalBatch) * 100), allData.length, total);
        }
      }

      set({ isExporting: false });
      return allData;
    } catch (error) {
      set({ isExporting: false });
      throw error;
    }
  },

  cancelExport: () => {
    set({ isExporting: false });
  },

  reset: () => set(initialState),
}));
