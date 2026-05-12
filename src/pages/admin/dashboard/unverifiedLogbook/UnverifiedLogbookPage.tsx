import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { useAuthStore } from "@/store/authStore";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import { StatusBadge } from "@/components/statusBadge";
import { useDashboardStore } from "@/store/dashboardStore";
import { TUnverifiedLogbook } from "@/types/dashboard";
import { showToast } from "@/utils/toast";
import { ExportModal } from "@/components/exportModal/ExportModal";
import { ExportFormat } from "@/components/exportButton";
import { exportToCSV, exportToExcel, ExportColumn } from "@/functions/export";
import { useDebounce } from "@/hooks/useDebounce";

export default function UnverifiedLogbookPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    unverifiedLogbookData,
    isLoading,
    isExporting,
    loadUnverifiedLogbookList,
    loadExportUnverifiedLogbookList,
    cancelExport,
    reset,
  } = useDashboardStore();
  const { user } = useAuthStore();

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOffset, setExportOffset] = useState(0);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const exportControllerRef = useRef<AbortController | null>(null);

  // ========== FULL URL SEARCH PARAMS IMPLEMENTATION ==========

  // Read all params from URL - this is the SINGLE SOURCE OF TRUTH
  const page = useMemo(() => {
    const p = searchParams.get("page");
    return p ? parseInt(p, 10) : 1;
  }, [searchParams]);

  const limit = useMemo(() => {
    const l = searchParams.get("limit");
    return l ? parseInt(l, 10) : DEFAULT_PAGE_SIZE;
  }, [searchParams]);

  const search = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams]);

  const id_ppds = useMemo(() => {
    const val = searchParams.get("id_ppds");
    return val ? parseInt(val, 10) : null;
  }, [searchParams]);

  const id_staff = useMemo(() => {
    const val = searchParams.get("id_staff");
    return val ? parseInt(val, 10) : null;
  }, [searchParams]);

  const id_activity = useMemo(() => {
    const val = searchParams.get("id_activity");
    return val ? parseInt(val, 10) : null;
  }, [searchParams]);

  const id_stase = useMemo(() => {
    const val = searchParams.get("id_stase");
    return val ? parseInt(val, 10) : null;
  }, [searchParams]);

  const start_date = useMemo(() => {
    return searchParams.get("start_date") || undefined;
  }, [searchParams]);

  const end_date = useMemo(() => {
    return searchParams.get("end_date") || undefined;
  }, [searchParams]);

  // Debounced search for API calls
  const debouncedSearch = useDebounce(search, 500);

  // ========== URL SETTERS ==========

  const updateUrlParams = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateUrlParams({ page: newPage });
    },
    [updateUrlParams],
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      updateUrlParams({ limit: newLimit, page: 1 }); // Reset to page 1 when limit changes
    },
    [updateUrlParams],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      updateUrlParams({ search: query, page: 1 }); // Reset to page 1 when searching
    },
    [updateUrlParams],
  );

  const handleFilterChange = useCallback(
    (filters: {
      id_ppds?: number | null;
      id_staff?: number | null;
      id_activity?: number | null;
      id_stase?: number | null;
      start_date?: string;
      end_date?: string;
    }) => {
      updateUrlParams({
        ...filters,
        page: 1, // Always reset to page 1 when filter changes
      });
    },
    [updateUrlParams],
  );

  const handleFilterReset = useCallback(() => {
    // Keep only essential params, reset everything else
    const newParams = new URLSearchParams();
    newParams.set("page", "1");
    newParams.set("limit", String(DEFAULT_PAGE_SIZE));
    if (idUser) {
      newParams.set("id_staff", idUser); // Preserve staff filter if from URL
    }
    setSearchParams(newParams, { replace: true });
  }, [idUser, setSearchParams]);

  // ========== DATA FETCHING ==========

  useEffect(() => {
    if (user?.id_client) {
      loadUnverifiedLogbookList({
        id_client: user.id_client,
        id_staff: id_staff ?? undefined,
        page,
        limit,
        search: debouncedSearch || undefined,
        id_ppds: id_ppds ?? undefined,
        id_activity: id_activity ?? undefined,
        id_stase: id_stase ?? undefined,
        start_date,
        end_date,
      });
    }
  }, [
    user?.id_client,
    page,
    limit,
    debouncedSearch,
    id_ppds,
    id_staff,
    id_activity,
    id_stase,
    start_date,
    end_date,
    loadUnverifiedLogbookList,
  ]);

  useEffect(() => {
    // IMPORTANT: This reset() MUST be called on unmount to clean up the store state.
    return () => {
      reset();
    };
  }, [reset]);

  const handleExport = async (format: ExportFormat) => {
    // Create new AbortController for this export
    exportControllerRef.current = new AbortController();

    setExportProgress(0);
    setExportOffset(0);
    setIsExportComplete(false);
    setShowExportModal(true);

    try {
      // Use the cloned store method for export - this doesn't affect UI state
      const allData = await loadExportUnverifiedLogbookList({
        filterParams: {
          id_client: user?.id_client ?? 0,
          id_staff: id_staff ?? undefined,
          id_ppds: id_ppds ?? undefined,
          id_activity: id_activity ?? undefined,
          id_stase: id_stase ?? undefined,
          start_date,
          end_date,
        },
        onProgress: (progress, offset) => {
          setExportProgress(progress);
          setExportOffset(offset);
        },
        signal: exportControllerRef.current.signal,
      });

      if (allData.length === 0) {
        showToast("Tidak ada data untuk diekspor", "error");
        setShowExportModal(false);
        return;
      }

      // Define columns for export
      const exportColumns: ExportColumn<TUnverifiedLogbook>[] = [
        { header: "No", accessorKey: "no" },
        {
          header: "Tanggal",
          accessorKey: "date",
          formatter: (value) =>
            value ? dayjs(value).locale("id").format("DD MMMM YYYY") : "-",
        },
        { header: "Peserta PPDS", accessorKey: "ppds_name" },
        { header: "NIM", accessorKey: "nim" },
        { header: "Stase", accessorKey: "stase_name" },
        {
          header: "Staff Pengajar/DPJP",
          accessorKey: "staff",
          formatter: (value) => {
            if (!value || !Array.isArray(value) || value.length === 0)
              return "-";
            return value
              .map((s: { name: string | null }) => s.name)
              .filter(Boolean)
              .join(", ");
          },
        },
        { header: "Activity", accessorKey: "action_name" },
        { header: "Hospital", accessorKey: "hospital_name" },
        { header: "Notes", accessorKey: "notes" },
        { header: "Verified Status", accessorKey: "verified_status" },
      ];

      // Prepare data with index number
      const dataWithIndex = allData.map((item, index) => ({
        ...item,
        no: index + 1,
      }));

      const filename = `unverified_logbook_export_${dayjs().format("YYYY-MM-DD")}`;

      if (format === "csv") {
        exportToCSV({
          data: dataWithIndex,
          columns: exportColumns,
          filename: `${filename}.csv`,
        });
      } else if (format === "excel") {
        await exportToExcel({
          data: dataWithIndex,
          columns: exportColumns,
          filename: `${filename}.xlsx`,
          sheetName: "Unverified Logbook Export",
        });
      }

      showToast(`Berhasil mengekspor ${allData.length} data`, "success");

      // Set complete state - modal stays open until user clicks OK
      setIsExportComplete(true);
    } catch (error) {
      // Check if cancelled
      if (error instanceof Error && error.message === "EXPORT_CANCELLED") {
        showToast("Export dibatalkan", "error");
        setShowExportModal(false);
        return;
      }
      console.error("Export error:", error);
      showToast(
        error instanceof Error ? error.message : "Gagal mengekspor data",
        "error",
      );
      setShowExportModal(false);
    } finally {
      exportControllerRef.current = null;
    }
  };

  const handleCancelExport = () => {
    if (exportControllerRef.current) {
      exportControllerRef.current.abort();
      cancelExport();
    }
    setShowExportModal(false);
    setIsExportComplete(false);
    exportControllerRef.current = null;
  };

  const handleOkExport = () => {
    setShowExportModal(false);
    setIsExportComplete(false);
  };

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPage(pageIndex + 1);
    setLimit(pageSize);
  };

  const handleRowClick = (row: Row<TUnverifiedLogbook>) => {
    navigate(ROUTES.unverifiedLogbookDetail(String(row.original.id)));
  };

  // Define columns for Logbook table
  const columns: ColumnDef<TUnverifiedLogbook>[] = [
    {
      accessorKey: "date",
      header: "Date",
      size: 180,
      cell: ({ row: { original } }) => {
        return original.date ? (
          <span className="whitespace-nowrap">
            {dayjs(original.date).locale("id").format("DD MMM YYYY")}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "ppds_name",
      header: "Peserta PPDS",
      size: 180,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.ppds_name ?? "-"}</span>
      ),
    },
    {
      accessorKey: "nim",
      header: "NIM",
      size: 120,
      cell: ({ row: { original } }) => original.nim ?? "-",
    },
    {
      accessorKey: "stase_name",
      header: "Stase",
      size: 150,
      cell: ({ row: { original } }) => original.stase_name ?? "-",
    },
    {
      accessorKey: "staff",
      header: "Staff Pengajar/DPJP",
      size: 150,
      cell: ({ row: { original } }) => {
        const staffList = original.staff;
        if (!staffList || staffList.length === 0) return "-";
        return staffList.map((s) => s.name).join(", ");
      },
    },
    {
      accessorKey: "action_name",
      header: "Activity",
      size: 180,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.action_name ?? "-"}</span>
      ),
    },
    {
      accessorKey: "hospital_name",
      header: "Hospital",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.hospital_name ? (
          <span className="flex items-center gap-1">
            <icons.MapPin className="h-3 w-3 text-gray-400" />
            {original.hospital_name}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      size: 200,
      cell: ({ row: { original } }) => {
        return original.notes ? (
          <span className="truncate block max-w-[180px]" title={original.notes}>
            {original.notes}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "verified_status",
      header: "Verified Status",
      size: 140,
      cell: ({ row: { original } }) =>
        original.verified_status ? (
          <StatusBadge status={original.verified_status} />
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 120 : 80,
      cell: ({ row: { original } }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          navigate(ROUTES.unverifiedLogbookDetail(String(original.id)));
        };

        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <icons.Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <ExportModal
        isShown={showExportModal}
        progress={exportProgress}
        offset={exportOffset}
        total={unverifiedLogbookData?.pagination.total ?? 0}
        isComplete={isExportComplete}
        onCancel={handleCancelExport}
        onOk={handleOkExport}
      />

      <Topbar
        breadcrumbs={[
          { label: "Dashboard", to: ROUTES.dashboard },
          { label: "Unverified Logbook", to: ROUTES.unverifiedLogbook },
        ]}
        searchPlaceholder="Cari logbook..."
        onExport={handleExport}
        onSearch={handleSearchChange}
        isLoading={isExporting}
        initialSearchValue={search}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Filter Section */}
          <Filter
            onChange={handleFilterChange}
            onReset={handleFilterReset}
            initialStaffId={idUser ? Number(idUser) : undefined}
          />

          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={unverifiedLogbookData?.list || []}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering={true}
              pagination={{
                enabled: true,
                mode: "server",
                pageCount: unverifiedLogbookData?.pagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data logbook"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
