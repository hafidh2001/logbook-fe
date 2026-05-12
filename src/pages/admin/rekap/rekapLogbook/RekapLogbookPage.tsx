import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { useRekapStore } from "@/store/rekapStore";
import { useAuthStore } from "@/store/authStore";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import usePagination from "@/hooks/usePagination";
import useFilter from "@/hooks/useFilter";
import { FilterValue } from "@/components/filterPanel";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { showToast } from "@/utils/toast";
import { ExportModal } from "@/components/exportModal/ExportModal";
import { ExportFormat } from "@/components/exportButton";
import { exportToCSV, exportToExcel, ExportColumn } from "@/functions/export";
import { useDebounce } from "@/hooks/useDebounce";
import type { TRekapLogbookItem } from "@/types/rekap";

export default function RekapLogbookPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const {
    rekapLogbook,
    rekapLogbookPagination,
    isLoading,
    isExporting,
    loadRekapLogbook,
    loadExportRekapLogbook,
    cancelExport,
    resetLogbook,
  } = useRekapStore();

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOffset, setExportOffset] = useState(0);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const exportControllerRef = useRef<AbortController | null>(null);

  // Pagination - page is always read from URL
  const { page, setPage, limit, setLimit } = usePagination({
    defaultPage: 1,
    defaultLimit: DEFAULT_PAGE_SIZE,
  });

  // Filter hook
  const { filterParams, handleFilterSearch, handleFilterReset } = useFilter<
    Omit<Record<string, FilterValue>, "start_date" | "end_date"> & {
      start_date?: string;
      end_date?: string;
    }
  >({
    fields: [
      { key: "ppds_name" },
      { key: "staff_name" },
      { key: "activity_name" },
      { key: "stase_name" },
      { key: "start_date" },
      { key: "end_date" },
    ],
    onFilterChange: () => setPage(1),
  });

  // Search state with 500ms debounce
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Reset page when search changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      setPage(1);
    }
  }, [debouncedSearchQuery, setPage]);

  useEffect(() => {
    if (user?.id_client) {
      loadRekapLogbook({
        id_client: user.id_client,
        page,
        limit,
        search: debouncedSearchQuery || undefined,
        ppds_name: (filterParams.ppds_name as string | null) ?? undefined,
        staff_name: (filterParams.staff_name as string | null) ?? undefined,
        activity_name: (filterParams.activity_name as string | null) ?? undefined,
        stase_name: (filterParams.stase_name as string | null) ?? undefined,
        start_date: filterParams.start_date ?? undefined,
        end_date: filterParams.end_date ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filterParams, debouncedSearchQuery]);

  useEffect(() => {
    return () => resetLogbook();
  }, [resetLogbook]);

  const handleExport = async (format: ExportFormat) => {
    // Create new AbortController for this export
    exportControllerRef.current = new AbortController();

    setExportProgress(0);
    setExportOffset(0);
    setIsExportComplete(false);
    setShowExportModal(true);

    try {
      const allData = await loadExportRekapLogbook({
        filterParams: {
          id_client: user?.id_client ?? 0,
          ppds_name: (filterParams.ppds_name as string | null) ?? undefined,
          staff_name: (filterParams.staff_name as string | null) ?? undefined,
          activity_name: (filterParams.activity_name as string | null) ?? undefined,
          stase_name: (filterParams.stase_name as string | null) ?? undefined,
          start_date: filterParams.start_date ?? undefined,
          end_date: filterParams.end_date ?? undefined,
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
      const exportColumns: ExportColumn<TRekapLogbookItem>[] = [
        { header: "No", accessorKey: "no" },
        {
          header: "Tanggal",
          accessorKey: "date",
          formatter: (value) =>
            value ? dayjs(value).locale("id").format("DD MMMM YYYY") : "-",
        },
        { header: "PPDS", accessorKey: "ppds" },
        { header: "NIM", accessorKey: "nim" },
        { header: "Semester", accessorKey: "semester" },
        { header: "Stase", accessorKey: "stase" },
        { header: "PIN", accessorKey: "pin" },
        { header: "Staff Pengajar/DPJP", accessorKey: "staff" },
        { header: "Activity", accessorKey: "action" },
        { header: "Peran", accessorKey: "peran" },
        { header: "Category", accessorKey: "category" },
        { header: "Title", accessorKey: "title" },
        { header: "Patient", accessorKey: "patient" },
        { header: "Diagnosis", accessorKey: "diagnosis" },
        { header: "Treatment", accessorKey: "treatment" },
        { header: "EMR Number", accessorKey: "emr_number" },
        { header: "Status", accessorKey: "status" },
      ];

      // Prepare data with index number
      const dataWithIndex = allData.map((item, index) => ({
        ...item,
        no: index + 1,
      }));

      const filename = `rekap_logbook_${dayjs().format("YYYY-MM-DD")}`;

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
          sheetName: "Rekap Logbook Export",
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
    setSearchQuery(query);
  };

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPage(pageIndex + 1);
    setLimit(pageSize);
  };

  const handleRowClick = (row: Row<TRekapLogbookItem>) => {
    navigate(ROUTES.rekapLogbookDetail(String(row.original.id)));
  };

  const handleView = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(ROUTES.rekapLogbookDetail(String(id)));
  };

  const getStatusBadge = (status: string | null) => {
    if (status === "verified") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
          <icons.Check className="h-3 w-3" />
          Terverifikasi
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md">
          <icons.Clock className="h-3 w-3" />
          Menunggu
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
        -
      </span>
    );
  };

  // Define columns for Rekap Logbook table
  const columns: ColumnDef<TRekapLogbookItem>[] = [
    {
      accessorKey: "date",
      header: "Date",
      size: 150,
      cell: ({ row: { original } }) => original.date ? (
        <span className="whitespace-nowrap">
          {dayjs(original.date).locale("id").format("DD MMM YYYY")}
        </span>
      ) : "-",
    },
    {
      accessorKey: "ppds",
      header: "PPDS",
      size: 120,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.ppds ?? "-"}</span>
      ),
    },
    {
      accessorKey: "nim",
      header: "NIM",
      size: 100,
      cell: ({ row: { original } }) => original.nim ?? "-",
    },
    {
      accessorKey: "semester",
      header: "Semester",
      size: 120,
      cell: ({ row: { original } }) => original.semester ?? "-",
    },
    {
      accessorKey: "stase",
      header: "Stase",
      size: 130,
      cell: ({ row: { original } }) => {
        return original.stase ? (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium whitespace-nowrap">
            {original.stase}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "pin",
      header: "PIN",
      size: 80,
      cell: ({ row: { original } }) => original.pin ?? "-",
    },
    {
      accessorKey: "staff",
      header: "Staff Pengajar/DPJP",
      size: 130,
      cell: ({ row: { original } }) => original.staff ?? "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.status ? getStatusBadge(original.status) : "-";
      },
    },
    {
      accessorKey: "action",
      header: "Activity",
      size: 150,
      cell: ({ row: { original } }) => original.action ?? "-",
    },
    {
      accessorKey: "peran",
      header: "Peran",
      size: 130,
      cell: ({ row: { original } }) => original.peran ?? "-",
    },
    {
      accessorKey: "category",
      header: "Category",
      size: 150,
      cell: ({ row: { original } }) => original.category ?? "-",
    },
    {
      accessorKey: "title",
      header: "Title",
      size: 200,
      cell: ({ row: { original } }) => original.title ?? "-",
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 120 : 80,
      cell: ({ row: { original } }) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleView(e, original.id)}
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
        total={rekapLogbookPagination.total}
        isComplete={isExportComplete}
        onCancel={handleCancelExport}
        onOk={handleOkExport}
      />

      <Topbar
        breadcrumbs={[{ label: "Rekap" }, { label: "Logbook" }]}
        searchPlaceholder="Cari logbook..."
        onExport={handleExport}
        onSearch={handleSearch}
        isLoading={isExporting}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Filter Section */}
          <Filter onSearch={handleFilterSearch} onReset={handleFilterReset} />

          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={rekapLogbook}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: rekapLogbookPagination.pageCount ?? 1,
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
