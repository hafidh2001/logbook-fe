import { create } from "zustand";
import { rekapApi } from "@/services/rekapApi";
import type {
  RekapPenilaianStore,
  RekapLogbookStore,
  RekapReportStore,
} from "@/types/rekap/store";
import { EXPORT_LIMIT } from "@/constants/export";

// ============= Rekap Report Store =============
const reportInitialState = {
  rekapReport: [] as any[],
  rekapReportSummary: null as any | null,
  rekapReportPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pageCount: 0,
  },
  // rekapReportDetail: null as any | null,
  isLoadingReport: false,
  // isLoadingDetail: false,
  isExportingReport: false,
  errorReport: null as string | null,
};

// ============= Rekap Penilaian Store =============
const penilaianInitialState = {
  rekapPenilaian: [] as any[],
  averageRekapPenilaian: 0 as number | null,
  rekapPenilaianPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pageCount: 0,
  },
  rekapPenilaianDetail: null as any | null,
  isLoading: false,
  isLoadingDetail: false,
  isExporting: false,
  error: null as string | null,
};

// ============= Rekap Logbook Store =============
const logbookInitialState = {
  rekapLogbook: [] as any[],
  rekapLogbookPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pageCount: 0,
  },
  rekapLogbookDetail: null as any | null,
  isLoadingLogbook: false,
  isLoadingLogbookDetail: false,
  isExportingLogbook: false,
  errorLogbook: null as string | null,
};

export const useRekapStore = create<
  RekapReportStore & RekapPenilaianStore & RekapLogbookStore
>((set) => ({
  ...reportInitialState,
  ...penilaianInitialState,
  ...logbookInitialState,
  // ============= Rekap Penilaian Actions =============
  loadRekapReport: async (params) => {
    set({ isLoadingReport: true, errorReport: null });
    try {
      const response = await rekapApi.getRekapReportList(params);

      set({
        rekapReport: response.data,
        rekapReportSummary: response.summary,
        rekapReportPagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
        isLoadingReport: false,
      });
    } catch (error) {
      set({
        errorReport:
          error instanceof Error
            ? error.message
            : "Failed to load rekap report",
        isLoadingReport: false,
      });
    }
  },

  loadExportRekapReport: async ({ filterParams, onProgress, signal }) => {
    set({ isExportingReport: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await rekapApi.getRekapReportList({
        id_client: filterParams.id_client!,
        page: 1,
        limit: 1,
      });

      // Check if cancelled before continuing
      if (signal?.aborted) {
        set({ isExportingReport: false });
        throw new Error("EXPORT_CANCELLED");
      }

      const total = firstResponse.total;

      if (total === 0) {
        set({ isExportingReport: false });
        return [];
      }

      // Step 2: Batch export with limit
      const totalBatch = Math.ceil(total / EXPORT_LIMIT);
      let allData: typeof firstResponse.data = [];

      for (let i = 0; i < totalBatch; i++) {
        // Check if cancelled before each batch
        if (signal?.aborted) {
          set({ isExportingReport: false });
          throw new Error("EXPORT_CANCELLED");
        }

        const response = await rekapApi.getRekapReportList({
          id_client: filterParams.id_client!,
          page: i + 1,
          limit: EXPORT_LIMIT,
          start_date: filterParams.start_date,
          end_date: filterParams.end_date,
        });

        // Check if cancelled after each batch
        if (signal?.aborted) {
          set({ isExportingReport: false });
          throw new Error("EXPORT_CANCELLED");
        }

        allData.push(...response.data);

        // Call progress callback
        if (onProgress) {
          onProgress(
            Math.round(((i + 1) / totalBatch) * 100),
            allData.length,
            total,
          );
        }
      }

      set({ isExportingReport: false });
      return allData;
    } catch (error) {
      set({ isExportingReport: false });
      throw error;
    }
  },
  cancelExportReport: () => {
    set({ isExportingReport: false });
  },

  resetReport: () => set(reportInitialState),

  // ============= Rekap Penilaian Actions =============
  loadRekapPenilaian: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rekapApi.getRekapPenilaianList(params);
      set({
        rekapPenilaian: response.data,
        rekapPenilaianPagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load rekap penilaian",
        isLoading: false,
      });
    }
  },

  loadAverageRekapPenilaian: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rekapApi.getAverageRekapPenilaian(params);
      set({
        averageRekapPenilaian: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load average rekap penilaian",
        isLoading: false,
      });
    }
  },

  loadRekapPenilaianDetail: async (id_logbook: number) => {
    set({ isLoadingDetail: true, error: null, rekapPenilaianDetail: null });
    try {
      const response = await rekapApi.getRekapPenilaianDetail(id_logbook);
      set({ rekapPenilaianDetail: response.data, isLoadingDetail: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load rekap penilaian detail",
        isLoadingDetail: false,
      });
    }
  },

  loadExportRekapPenilaian: async ({ filterParams, onProgress, signal }) => {
    set({ isExporting: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await rekapApi.getRekapPenilaianList({
        id_client: filterParams.id_client!,
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
      let allData: typeof firstResponse.data = [];

      for (let i = 0; i < totalBatch; i++) {
        // Check if cancelled before each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        const response = await rekapApi.getRekapPenilaianList({
          id_client: filterParams.id_client!,
          page: i + 1,
          limit: EXPORT_LIMIT,
          search: filterParams.search,
          ppds_name: filterParams.ppds_name,
          staff_name: filterParams.staff_name,
          activity_name: filterParams.activity_name,
          stase_name: filterParams.stase_name,
          start_date: filterParams.start_date,
          end_date: filterParams.end_date,
        });

        // Check if cancelled after each batch
        if (signal?.aborted) {
          set({ isExporting: false });
          throw new Error("EXPORT_CANCELLED");
        }

        allData.push(...response.data);

        // Call progress callback
        if (onProgress) {
          onProgress(
            Math.round(((i + 1) / totalBatch) * 100),
            allData.length,
            total,
          );
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

  reset: () => set(penilaianInitialState),
  resetDetail: () =>
    set({ rekapPenilaianDetail: null, isLoadingDetail: false }),

  // ============= Rekap Logbook Actions =============
  loadRekapLogbook: async (params) => {
    set({ isLoadingLogbook: true, errorLogbook: null });
    try {
      const response = await rekapApi.getRekapLogbookList(params);
      set({
        rekapLogbook: response.data,
        rekapLogbookPagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.total,
          pageCount: Math.ceil(response.total / response.pagination.limit),
        },
        isLoadingLogbook: false,
      });
    } catch (error) {
      set({
        errorLogbook:
          error instanceof Error
            ? error.message
            : "Failed to load rekap logbook",
        isLoadingLogbook: false,
      });
    }
  },

  loadRekapLogbookDetail: async (id: number, staff: string | null) => {
    set({
      isLoadingLogbookDetail: true,
      errorLogbook: null,
      rekapLogbookDetail: null,
    });
    try {
      const response = await rekapApi.getRekapLogbookDetail(id, staff);
      set({
        rekapLogbookDetail: response.data,
        isLoadingLogbookDetail: false,
      });
    } catch (error) {
      set({
        errorLogbook:
          error instanceof Error
            ? error.message
            : "Failed to load rekap logbook detail",
        isLoadingLogbookDetail: false,
      });
    }
  },

  loadExportRekapLogbook: async ({ filterParams, onProgress, signal }) => {
    set({ isExportingLogbook: true });

    try {
      // Step 1: Get total count from first fetch
      const firstResponse = await rekapApi.getRekapLogbookList({
        id_client: filterParams.id_client!,
        page: 1,
        limit: 1,
      });

      // Check if cancelled before continuing
      if (signal?.aborted) {
        set({ isExportingLogbook: false });
        throw new Error("EXPORT_CANCELLED");
      }

      const total = firstResponse.total;

      if (total === 0) {
        set({ isExportingLogbook: false });
        return [];
      }

      // Step 2: Batch export with limit
      const totalBatch = Math.ceil(total / EXPORT_LIMIT);
      let allData: typeof firstResponse.data = [];

      for (let i = 0; i < totalBatch; i++) {
        // Check if cancelled before each batch
        if (signal?.aborted) {
          set({ isExportingLogbook: false });
          throw new Error("EXPORT_CANCELLED");
        }

        const response = await rekapApi.getRekapLogbookList({
          id_client: filterParams.id_client!,
          page: i + 1,
          limit: EXPORT_LIMIT,
          search: filterParams.search,
          ppds_name: filterParams.ppds_name,
          staff_name: filterParams.staff_name,
          activity_name: filterParams.activity_name,
          stase_name: filterParams.stase_name,
          start_date: filterParams.start_date,
          end_date: filterParams.end_date,
          status: filterParams.status,
        });

        // Check if cancelled after each batch
        if (signal?.aborted) {
          set({ isExportingLogbook: false });
          throw new Error("EXPORT_CANCELLED");
        }

        allData.push(...response.data);

        // Call progress callback (without total since we already know it)
        if (onProgress) {
          onProgress(Math.round(((i + 1) / totalBatch) * 100), allData.length);
        }
      }

      set({ isExportingLogbook: false });
      return allData;
    } catch (error) {
      set({ isExportingLogbook: false });
      throw error;
    }
  },

  cancelExportLogbook: () => {
    set({ isExportingLogbook: false });
  },

  resetLogbook: () => set(logbookInitialState),
  resetLogbookDetail: () =>
    set({ rekapLogbookDetail: null, isLoadingLogbookDetail: false }),
}));
