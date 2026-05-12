import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate } from "react-router-dom";
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
import { useEffect, useRef, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import { StatusBadge } from "@/components/statusBadge";
import { useDashboardStore } from "@/store/dashboardStore";
import { TUnverifiedLogbook } from "@/types/dashboard";
import { showToast } from "@/utils/toast";
import { ExportModal } from "@/components/exportModal/ExportModal";
import { ExportFormat } from "@/components/exportButton";
import { exportToCSV, exportToExcel, ExportColumn } from "@/functions/export";
import { useUrlParams } from "@/hooks/useUrlParams";

export default function UnverifiedLogbookPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();

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

  // ========== URL PARAMS (using useUrlParams hook) ==========
  const {
    page,
    limit,
    search,
    debouncedSearch,
    filters,
    setLimit,
    setSearch,
    setFilters,
    resetParams,
    getNumberParam,
  } = useUrlParams({
    defaultPage: 1,
    defaultLimit: DEFAULT_PAGE_SIZE,
    filterKeys: ["id_ppds", "id_staff", "id_activity", "id_stase", "start_date", "end_date"],
    searchDebounceMs: 500,
  });

  // Extract filter values from URL
  const id_ppds = getNumberParam("id_ppds");
  const id_staff = getNumberParam("id_staff");
  const id_activity = getNumberParam("id_activity");
  const id_stase = getNumberParam("id_stase");
  const start_date = filters.start_date || undefined;
  const end_date = filters.end_date || undefined;

  // ========== HANDLERS ==========

  const handleFilterChange = (newFilters: {
    id_ppds?: number | null;
    id_staff?: number | null;
    id_activity?: number | null;
    id_stase?: number | null;
    start_date?: string;
    end_date?: string;
  }) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    resetParams(idUser ? ["id_staff"] : []);
    if (idUser) {
      // Re-apply id_staff if from URL param
      setFilters({ id_staff: Number(idUser) });
    }
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
  };

  const handlePaginationChange = (_pageIndex: number, pageSize: number) => {
    // BaseTable handles page changes via URL internally
    setLimit(pageSize, false);
  };

  const handleRowClick = (row: Row<TUnverifiedLogbook>) => {
    navigate(ROUTES.unverifiedLogbookDetail(String(row.original.id)));
  };

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
    return () => {
      reset();
    };
  }, [reset]);

  // ========== EXPORT ==========

  const handleExport = async (format: ExportFormat) => {
    exportControllerRef.current = new AbortController();

    setExportProgress(0);
    setExportOffset(0);
    setIsExportComplete(false);
    setShowExportModal(true);

    try {
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
      setIsExportComplete(true);
    } catch (error) {
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

  // ========== COLUMNS ==========

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

  // ========== RENDER ==========

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
