import { useEffect, useRef, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { TPpds } from "@/types/ppds";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { ConfirmationModal } from "@/components/confirmationModal";
import { usePpdsStore } from "@/store/ppdsStore";
import useModal from "@/hooks/useModal";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import { showToast } from "@/utils/toast";
import { ExportModal } from "@/components/exportModal/ExportModal";
import { ExportFormat } from "@/components/exportButton";
import { exportToCSV, exportToExcel, ExportColumn } from "@/functions/export";
import { useUrlParams } from "@/hooks/useUrlParams";

export default function PpdsListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const navigate = useNavigate();

  const {
    ppdsData,
    isLoading,
    isExporting,
    loadPpdsList,
    deletePpds,
    reset,
    loadExportPpdsList,
    cancelExport,
  } = usePpdsStore();

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
    filterKeys: ["ppds", "stase", "nim"],
    searchDebounceMs: 500,
  });

  // Extract filter values from URL
  const ppds = getNumberParam("ppds");
  const stase = getNumberParam("stase");
  const nim = filters.nim || undefined;

  // ========== HANDLERS ==========

  const handleFilterChange = (newFilters: {
    ppds?: number | null;
    stase?: number | null;
    nim?: string | null;
  }) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    resetParams();
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
  };

  const handlePaginationChange = (_pageIndex: number, pageSize: number) => {
    // BaseTable handles page changes via URL internally
    setLimit(pageSize, false);
  };

  const handleCreate = () => {
    navigate(ROUTES.ppdsCreate);
  };

  // ========== DATA FETCHING ==========

  useEffect(() => {
    loadPpdsList({
      page,
      limit,
      search: debouncedSearch || undefined,
      ppds: ppds ?? undefined,
      stase: stase ?? undefined,
      nim: nim,
    });
  }, [page, limit, debouncedSearch, ppds, stase, nim, loadPpdsList]);

  useEffect(() => {
    // IMPORTANT: This reset() MUST be called on unmount to clean up the store state.
    return () => {
      reset();
    };
  }, [reset]);

  // ========== EXPORT ==========

  const handleExport = async (format: ExportFormat) => {
    // Create new AbortController for this export
    exportControllerRef.current = new AbortController();

    setExportProgress(0);
    setExportOffset(0);
    setIsExportComplete(false);
    setShowExportModal(true);

    try {
      // Use the cloned store method for export - this doesn't affect UI state
      const allData = await loadExportPpdsList({
        filterParams: {
          ppds: ppds ?? null,
          stase: stase ?? null,
          nim: nim ?? null,
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

      const filename = `ppds_export_${dayjs().format("YYYY-MM-DD")}`;

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
          sheetName: "PPDS Export",
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

  // ========== COLUMNS ==========

  const handleRowClick = (row: Row<TPpds>) => {
    navigate(ROUTES.ppdsDetail(String(row.original.id)));
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
      size: sm ? 350 : 180,
      cell: ({ row: { original } }) => {
        const { isShown: isShowDelete, toggle: toggleDelete } = useModal();

        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          navigate(ROUTES.ppdsDetail(String(original.id)));
        };
        const handleChangePassword = (e: React.MouseEvent) => {
          e.stopPropagation();
          navigate(ROUTES.ppdsChangePassword(String(original.id)));
        };

        const handleDelete = async () => {
          if (original.id) {
            const success = await deletePpds(original.id);
            if (success) {
              const successMessage = usePpdsStore.getState().success;
              showToast(successMessage ?? "Data berhasil dihapus!", "success", {
                duration: 3000,
              });
              // Re-fetch to get fresh data with correct pagination
              loadPpdsList({ page, limit, ppds: ppds ?? undefined, stase: stase ?? undefined, nim: nim });
            } else {
              const errorMessage = usePpdsStore.getState().error;
              showToast(errorMessage ?? "Gagal menghapus data", "error", {
                duration: 4000,
              });
            }
          }
          toggleDelete(false);
        };

        return (
          <>
            <ConfirmationModal
              isShown={isShowDelete}
              toggle={toggleDelete}
              title="Hapus Data"
              description={
                <>
                  Apakah Anda yakin ingin menghapus data{" "}
                  <span className="font-semibold">
                    {original?.display_name}
                  </span>
                  ? Tindakan ini tidak dapat dibatalkan.
                </>
              }
              onConfirm={handleDelete}
              confirmText="Hapus"
              cancelText="Batal"
              confirmVariant="destructive"
              cancelVariant="outline"
            />
            <div className="flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleView}
                disabled={isExporting}
                className="bg-[#087F5B] text-white hover:bg-[#066649]"
              >
                <icons.Eye className="h-4 w-4" />
                <span className="hidden sm:inline">View</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChangePassword}
                disabled={isExporting}
                className="bg-yellow-500 text-white hover:bg-yellow-600"
              >
                <icons.Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Password</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDelete();
                }}
                disabled={isExporting}
                className="bg-[#D95D43] text-white hover:bg-[#B84732]"
              >
                <icons.Trash className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </>
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
        total={ppdsData.pagination.total}
        isComplete={isExportComplete}
        onCancel={handleCancelExport}
        onOk={handleOkExport}
      />

      <Topbar
        breadcrumbs={[{ label: "PPDS", to: ROUTES.ppds }]}
        searchPlaceholder="Cari PPDS..."
        onCreate={handleCreate}
        onExport={handleExport}
        onSearch={handleSearchChange}
        isLoading={isExporting}
        initialSearchValue={search}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          <Filter onChange={handleFilterChange} onReset={handleFilterReset} />

          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={ppdsData.list}
              columns={columns}
              isShowNumbering
              isLoading={isLoading}
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: ppdsData.pagination.pageCount,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data PPDS"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}