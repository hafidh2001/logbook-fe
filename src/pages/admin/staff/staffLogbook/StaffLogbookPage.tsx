import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { useStaffStore } from "@/store/staffStore";
import { useAuthStore } from "@/store/authStore";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import type { TStaffLogbook } from "@/types/staff";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import usePagination from "@/hooks/usePagination";
import useFilter from "@/hooks/useFilter";
import { FilterValue } from "@/components/filterPanel";
import { StatusBadge } from "@/components/statusBadge";
import { showToast } from "@/utils/toast";
import { ExportModal } from "@/components/exportModal/ExportModal";
import { ExportFormat } from "@/components/exportButton";
import { exportToCSV, exportToExcel, ExportColumn } from "@/functions/export";

export default function StaffLogbookPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();

  const {
    staffLogbookData,
    isLoading,
    isExporting,
    loadStaffLogbookList,
    loadExportStaffLogbookList,
    cancelExport,
    reset,
  } = useStaffStore();
  const { user } = useAuthStore();

  // Pagination - page is always read from URL
  const { page, setPage, limit, setLimit, searchParams } = usePagination({
    defaultPage: 1,
    defaultLimit: DEFAULT_PAGE_SIZE,
  });

  // Filter hook - id_staff is controlled by URL (idUser), other filters are optional
  const { filterParams, handleFilterSearch, handleFilterReset } = useFilter<
    Omit<Record<string, FilterValue>, "start_date" | "end_date"> & {
      start_date?: string;
      end_date?: string;
    }
  >({
    fields: [
      { key: "id_ppds" },
      { key: "id_activity" },
      { key: "id_stase" },
      { key: "status" },
      { key: "start_date" },
      { key: "end_date" },
    ],
    onFilterChange: () => setPage(1),
  });

  useEffect(() => {
    // Runs when URL or filter changes
    if (user?.id_client && idUser) {
      loadStaffLogbookList({
        id_client: user.id_client,
        id_staff: Number(idUser), // Staff is controlled by URL
        page,
        limit,
        id_ppds: (filterParams.id_ppds as number | null) ?? undefined,
        id_activity: (filterParams.id_activity as number | null) ?? undefined,
        id_stase: (filterParams.id_stase as number | null) ?? undefined,
        status: (filterParams.status as string | null) ?? undefined,
        start_date: filterParams.start_date ?? undefined,
        end_date: filterParams.end_date ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filterParams]);

  useEffect(() => {
    // IMPORTANT: This reset() MUST be called on unmount to clean up the store state.
    return () => {
      reset();
    };
  }, [reset]);

  // Reset store when sidebar is clicked (URL has no page param)
  useEffect(() => {
    const pageParam = searchParams.get("page");
    // If no page param in URL, reset store
    if (!pageParam) {
      reset();
      // Also force page to 1 in URL if somehow different
      if (page !== 1) {
        setPage(1);
      }
    }
  }, [searchParams, reset, page, setPage]);

  const logbooks = staffLogbookData?.list || [];

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOffset, setExportOffset] = useState(0);
  const [exportTotal, setExportTotal] = useState(0);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const exportControllerRef = useRef<AbortController | null>(null);

  const handleExport = async (format: ExportFormat) => {
    // Create new AbortController for this export
    exportControllerRef.current = new AbortController();

    setExportProgress(0);
    setExportOffset(0);
    setExportTotal(0);
    setIsExportComplete(false);
    setShowExportModal(true);

    try {
      const allData = await loadExportStaffLogbookList({
        filterParams: {
          id_client: user?.id_client ?? 0,
          id_staff: Number(idUser),
          id_ppds: (filterParams.id_ppds as number | null) ?? undefined,
          id_activity: (filterParams.id_activity as number | null) ?? undefined,
          id_stase: (filterParams.id_stase as number | null) ?? undefined,
          status: (filterParams.status as string | null) ?? undefined,
          start_date: filterParams.start_date ?? undefined,
          end_date: filterParams.end_date ?? undefined,
        },
        onProgress: (progress, offset, total) => {
          setExportProgress(progress);
          setExportOffset(offset);
          setExportTotal(total);
        },
        signal: exportControllerRef.current.signal,
      });

      if (allData.length === 0) {
        showToast("Tidak ada data untuk diekspor", "error");
        setShowExportModal(false);
        return;
      }

      // Define columns for export
      const exportColumns: ExportColumn<TStaffLogbook>[] = [
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
        { header: "Staff Pengajar/DPJP", accessorKey: "staff_name" },
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

      const filename = `staff_logbook_export_${dayjs().format("YYYY-MM-DD")}`;

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
          sheetName: "Staff Logbook Export",
        });
      }

      showToast(
        `Berhasil mengekspor ${allData.length} data`,
        "success"
      );

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
        "error"
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

  const handleSearch = (query: string) => {
    // TODO: Implement search
    console.log("Search:", query);
  };

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPage(pageIndex + 1);
    setLimit(pageSize);
  };

  const handleRowClick = (row: Row<TStaffLogbook>) => {
    navigate(
      ROUTES.staffLogbookDetail(String(idUser), String(row.original.id)),
    );
  };

  // Define columns for Logbook table
  const columns: ColumnDef<TStaffLogbook>[] = [
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
      accessorKey: "staff_name",
      header: "Staff Pengajar/DPJP",
      size: 180,
      cell: ({ row: { original } }) => {
        return original.staff_name ? (
          <span>{original.staff_name}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
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
          navigate(
            ROUTES.staffLogbookDetail(String(idUser), String(original.id)),
          );
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
        total={exportTotal}
        isComplete={isExportComplete}
        onCancel={handleCancelExport}
        onOk={handleOkExport}
      />

      <Topbar
        breadcrumbs={[
          { label: "Staff", to: ROUTES.staff },
          { label: "Detail", to: ROUTES.staffDetail(String(idUser)) },
          { label: "Logbook" },
        ]}
        searchPlaceholder="Cari logbook..."
        onExport={handleExport}
        onSearch={handleSearch}
        isLoading={isExporting}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Filter Section */}
          <Filter
            onSearch={handleFilterSearch}
            onReset={handleFilterReset}
            initialStaffId={idUser ? Number(idUser) : undefined}
          />

          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={logbooks}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering={true}
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: staffLogbookData?.pagination.pageCount ?? 1,
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
