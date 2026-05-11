import { useEffect, useRef, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { TPpds, IPpdsListParams } from "@/types/ppds";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { usePpdsStore } from "@/store/ppdsStore";
import usePagination from "@/hooks/usePagination";
import useFilter from "@/hooks/useFilter";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import { showToast } from "@/utils/toast";
import { ExportModal } from "@/components/exportModal/ExportModal";
import { ExportFormat } from "@/components/exportButton";
import { exportToCSV, exportToExcel, ExportColumn } from "@/functions/export";
import { useDebounce } from "@/hooks/useDebounce";

export default function PpdsInactiveListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const navigate = useNavigate();

  const {
    ppdsInactiveData,
    isLoading,
    isExporting,
    loadPpdsInactiveList,
    loadExportPpdsInactiveList,
    cancelExport,
    reset,
  } = usePpdsStore();

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOffset, setExportOffset] = useState(0);
  const [exportTotal, setExportTotal] = useState(0);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const exportControllerRef = useRef<AbortController | null>(null);

  // Search state with 500ms debounce
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Pagination - page is always read from URL
  const { page, setPage, limit, setLimit, searchParams } = usePagination({
    defaultPage: 1,
    defaultLimit: DEFAULT_PAGE_SIZE,
  });

  // Filter hook
  const { filterParams, handleFilterSearch, handleFilterReset } = useFilter<
    Omit<IPpdsListParams, "id_client" | "page" | "limit" | "search">
  >({
    fields: [{ key: "ppds" }, { key: "stase" }, { key: "nim" }],
    onFilterChange: () => setPage(1),
  });

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, setPage]);

  useEffect(() => {
    // Runs when URL, filter, or search changes
    loadPpdsInactiveList({
      page,
      limit,
      search: debouncedSearchQuery || undefined,
      ...filterParams,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filterParams, debouncedSearchQuery]);

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
    setExportTotal(0);
    setIsExportComplete(false);
    setShowExportModal(true);

    try {
      // Use the cloned store method for export - this doesn't affect UI state
      const allData = await loadExportPpdsInactiveList({
        filterParams: {
          ppds: (filterParams.ppds as number | null) ?? null,
          stase: (filterParams.stase as number | null) ?? null,
          nim: (filterParams.nim as string | null) ?? null,
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
      const exportColumns: ExportColumn<TPpds>[] = [
        { header: "No", accessorKey: "no" },
        { header: "Nama", accessorKey: "display_name" },
        { header: "Username", accessorKey: "username" },
        { header: "Email", accessorKey: "email" },
        { header: "No. Telepon", accessorKey: "phone" },
        { header: "Alamat", accessorKey: "address" },
        {
          header: "Tanggal Lahir",
          accessorKey: "date_of_birth",
          formatter: (value) =>
            value ? dayjs(value).locale("id").format("DD MMMM YYYY") : "-",
        },
        { header: "NIM", accessorKey: "nim" },
        { header: "Role", accessorKey: "role_name" },
        { header: "Stase", accessorKey: "stase_name" },
        { header: "Total Logbook", accessorKey: "total_logbook" },
      ];

      // Prepare data with index number
      const dataWithIndex = allData.map((item, index) => ({
        ...item,
        no: index + 1,
      }));

      const filename = `ppds_inactive_export_${dayjs().format("YYYY-MM-DD")}`;

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
          sheetName: "PPDS Nonaktif Export",
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
    // Update search query - will be debounced in useEffect
    setSearchQuery(query);
  };

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPage(pageIndex + 1);
    setLimit(pageSize);
  };

  const handleRowClick = (row: Row<TPpds>) => {
    navigate(ROUTES.ppdsInactiveDetail(String(row.original.id)));
  };

  const columns: ColumnDef<TPpds>[] = [
    {
      accessorKey: "display_name",
      header: "Nama",
      size: 180,
      cell: ({ row: { original } }) => original.display_name ?? "-",
    },
    {
      accessorKey: "username",
      header: "Username",
      size: 180,
      cell: ({ row: { original } }) => original.username ?? "-",
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 180,
      cell: ({ row: { original } }) => original.email ?? "-",
    },
    {
      accessorKey: "phone",
      header: "No. Telepon",
      size: 150,
      cell: ({ row: { original } }) => original.phone ?? "-",
    },
    {
      accessorKey: "address",
      header: "Alamat",
      size: 200,
      cell: ({ row: { original } }) => original.address ?? "-",
    },
    {
      accessorKey: "date_of_birth",
      header: "Tanggal Lahir",
      size: 150,
      cell: ({ row: { original } }) =>
        original.date_of_birth
          ? dayjs(original.date_of_birth).locale("id").format("DD MMMM YYYY")
          : "-",
    },
    {
      accessorKey: "nim",
      header: "NIM",
      size: 150,
      cell: ({ row: { original } }) => original.nim ?? "-",
    },
    {
      accessorKey: "role_name",
      header: "Role",
      size: 120,
      cell: ({ row: { original } }) => original.role_name ?? "-",
    },
    {
      accessorKey: "stase_name",
      header: "Stase",
      size: 130,
      cell: ({ row: { original } }) => original.stase_name ?? "-",
    },
    {
      accessorKey: "total_logbook",
      header: "Logbook",
      size: 100,
      cell: ({ row: { original } }) =>
        original.total_logbook ? `${original.total_logbook} items` : "-",
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 220 : 120,
      cell: ({ row: { original } }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          navigate(ROUTES.ppdsInactiveDetail(String(original.id)));
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
        breadcrumbs={[{ label: "PPDS Nonaktif" }]}
        searchPlaceholder="Cari PPDS..."
        onExport={handleExport}
        onSearch={handleSearch}
        isLoading={isExporting}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          <Filter onSearch={handleFilterSearch} onReset={handleFilterReset} />

          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={ppdsInactiveData?.list ?? []}
              columns={columns}
              isShowNumbering
              isLoading={isLoading}
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: ppdsInactiveData?.pagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data PPDS nonaktif"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
