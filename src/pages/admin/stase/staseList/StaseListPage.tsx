import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { useStaseStore } from "@/store/staseStore";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useState, useEffect, useRef } from "react";
import { ConfirmationModal } from "@/components/confirmationModal";
import type { TStaseListItem } from "@/types/stase";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { showToast } from "@/utils/toast";
import { ExportModal } from "@/components/exportModal/ExportModal";
import { ExportFormat } from "@/components/exportButton";
import { exportToCSV, exportToExcel, ExportColumn } from "@/functions/export";
import { useUrlParams } from "@/hooks/useUrlParams";
import { cn } from "@/lib/utils";

export default function StaseListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const navigate = useNavigate();

  const {
    staseData,
    isLoading,
    isExporting,
    loadStaseList,
    loadExportStaseList,
    deleteStase,
    cancelExport,
    reset,
  } = useStaseStore();

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
    filterKeys: ["id_ppds", "id_stase", "start_date", "end_date"],
    searchDebounceMs: 500,
  });

  // Extract filter values from URL
  const id_ppds = getNumberParam("id_ppds");
  const id_stase = getNumberParam("id_stase");
  const start_date = filters.start_date || undefined;
  const end_date = filters.end_date || undefined;

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOffset, setExportOffset] = useState(0);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const exportControllerRef = useRef<AbortController | null>(null);

  // ========== HANDLERS ==========

  const handleFilterChange = (newFilters: {
    id_ppds?: number | null;
    id_stase?: number | null;
    start_date?: string;
    end_date?: string;
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
    setLimit(pageSize, false);
  };

  // ========== DATA FETCHING ==========

  useEffect(() => {
    loadStaseList({
      page,
      limit,
      search: debouncedSearch || undefined,
      id_ppds: id_ppds ?? undefined,
      id_stase: id_stase ?? undefined,
      start_date,
      end_date,
    });
  }, [
    page,
    limit,
    debouncedSearch,
    id_ppds,
    id_stase,
    start_date,
    end_date,
    loadStaseList,
  ]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item: TStaseListItem | null;
  }>({ open: false, item: null });

  const handleCreate = () => {
    navigate(ROUTES.staseCreate);
  };

  const handleExport = async (format: ExportFormat) => {
    // Create new AbortController for this export
    exportControllerRef.current = new AbortController();

    setExportProgress(0);
    setExportOffset(0);
    setIsExportComplete(false);
    setShowExportModal(true);

    try {
      const allData = await loadExportStaseList({
        filterParams: {
          id_ppds: id_ppds ?? undefined,
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
      const exportColumns: ExportColumn<TStaseListItem>[] = [
        { header: "No", accessorKey: "no" },
        { header: "User", accessorKey: "user_name" },
        { header: "Stase", accessorKey: "stase_name" },
        {
          header: "Tanggal",
          accessorKey: "date",
          formatter: (value) =>
            value ? dayjs(value).locale("id").format("DD MMMM YYYY") : "-",
        },
        { header: "Notes", accessorKey: "notes" },
      ];

      // Prepare data with index number
      const dataWithIndex = allData.map((item, index) => ({
        ...item,
        no: index + 1,
      }));

      const filename = `stase_export_${dayjs().format("YYYY-MM-DD")}`;

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
          sheetName: "Stase Export",
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

  const handleDelete = (item: TStaseListItem) => {
    setDeleteModal({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.item?.id) {
      const success = await deleteStase(deleteModal.item.id);
      if (success) {
        const successMessage = useStaseStore.getState().success;
        showToast(successMessage ?? "Data berhasil dihapus!", "success", {
          duration: 3000,
        });
        // Re-fetch to get fresh data with correct pagination
        loadStaseList({
          page,
          limit,
          id_ppds: id_ppds ?? undefined,
          id_stase: id_stase ?? undefined,
          start_date,
          end_date,
        });
      } else {
        const errorMessage = useStaseStore.getState().error;
        showToast(errorMessage ?? "Gagal menghapus data", "error", {
          duration: 4000,
        });
      }
    }
    setDeleteModal({ open: false, item: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, item: null });
  };

  const handleRowClick = (row: Row<TStaseListItem>) => {
    if (row.original.id) {
      navigate(ROUTES.staseDetail(String(row.original.id)));
    }
  };

  // Define columns for Stase table
  const columns: ColumnDef<TStaseListItem>[] = [
    {
      accessorKey: "user_name",
      header: "User",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.user_name ?? "-"}</span>
      ),
    },
    {
      accessorKey: "stase_name",
      header: "Stase",
      size: 180,
      cell: ({ row: { original } }) => {
        return original.stase_name ? (
          <span
            className={cn(
              "px-2 py-1 bg-[#EAF6EF] text-[#066649] rounded-md text-xs font-medium whitespace-nowrap",
              original.is_retake && "bg-[#FFE5DE] text-[#B84732]",
            )}
          >
            {original.stase_name}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 180,
      cell: ({ row: { original } }) => {
        return original.date ? (
          <span className="whitespace-nowrap">
            {dayjs(original.date).locale("id").format("DD MMM YYYY - HH:mm")}
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
      id: "actions",
      header: "Action",
      size: sm ? 180 : 120,
      cell: ({ row }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (row.original.id) {
            navigate(ROUTES.staseDetail(String(row.original.id)));
          }
        };
        const handleDeleteClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          handleDelete(row.original);
        };

        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="bg-[#087F5B] text-white hover:bg-[#066649]"
            >
              <icons.Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className="bg-[#D95D43] text-white hover:bg-[#B84732]"
            >
              <icons.Trash className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
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
        total={staseData.pagination.total}
        isComplete={isExportComplete}
        onCancel={handleCancelExport}
        onOk={handleOkExport}
      />

      <Topbar
        breadcrumbs={[{ label: "Stase", to: ROUTES.stase }]}
        searchPlaceholder="Cari stase..."
        onCreate={handleCreate}
        onExport={handleExport}
        onSearch={handleSearchChange}
        isLoading={isExporting}
        initialSearchValue={search}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Filter Section */}
          <Filter onChange={handleFilterChange} onReset={handleFilterReset} />

          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={staseData.list}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: staseData.pagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data stase"
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isShown={deleteModal.open}
        toggle={(open) =>
          setDeleteModal({
            open: open ?? !deleteModal.open,
            item: deleteModal.item,
          })
        }
        title="Hapus Data"
        description={
          <>
            Apakah Anda yakin ingin menghapus data stase{" "}
            <span className="font-semibold">
              {deleteModal.item?.stase_name}
            </span>{" "}
            untuk user{" "}
            <span className="font-semibold">{deleteModal.item?.user_name}</span>
            ? Tindakan ini tidak dapat dibatalkan.
          </>
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Hapus"
        cancelText="Batal"
        confirmVariant="destructive"
        cancelVariant="outline"
      />
    </div>
  );
}
