import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { useStaffStore } from "@/store/staffStore";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useState, useEffect, useRef } from "react";
import { ConfirmationModal } from "@/components/confirmationModal";
import type { TStaff } from "@/types/staff";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import { showToast } from "@/utils/toast";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { ExportModal } from "@/components/exportModal/ExportModal";
import { ExportFormat } from "@/components/exportButton";
import { exportToCSV, exportToExcel, ExportColumn } from "@/functions/export";
import { useUrlParams } from "@/hooks/useUrlParams";

export default function StaffListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const navigate = useNavigate();

  const {
    staffData,
    isLoading,
    isExporting,
    loadStaffList,
    loadExportStaffList,
    deleteStaff,
    cancelExport,
    reset,
  } = useStaffStore();

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
    filterKeys: ["staff", "nim"],
    searchDebounceMs: 500,
  });

  // Extract filter values from URL
  const staff = getNumberParam("staff");
  const nim = filters.nim || undefined;

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOffset, setExportOffset] = useState(0);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const exportControllerRef = useRef<AbortController | null>(null);

  // ========== HANDLERS ==========

  const handleFilterChange = (newFilters: {
    staff?: number | null;
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
    setLimit(pageSize, false);
  };

  // ========== DATA FETCHING ==========

  useEffect(() => {
    loadStaffList({
      page,
      limit,
      search: debouncedSearch || undefined,
      staff: staff ?? undefined,
      nim: nim ?? undefined,
    });
  }, [page, limit, debouncedSearch, staff, nim, loadStaffList]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item: TStaff | null;
  }>({ open: false, item: null });

  const handleCreate = () => {
    navigate(ROUTES.staffCreate);
  };

  const handleExport = async (format: ExportFormat) => {
    // Create new AbortController for this export
    exportControllerRef.current = new AbortController();

    setExportProgress(0);
    setExportOffset(0);
    setIsExportComplete(false);
    setShowExportModal(true);

    try {
      const allData = await loadExportStaffList({
        filterParams: {
          staff: staff ?? undefined,
          nim: nim ?? undefined,
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
      const exportColumns: ExportColumn<TStaff>[] = [
        { header: "No", accessorKey: "no" },
        { header: "Nama", accessorKey: "display_name" },
        { header: "Username", accessorKey: "username" },
        { header: "Email", accessorKey: "email" },
        { header: "No. Telepon", accessorKey: "phone" },
        { header: "Alamat", accessorKey: "address" },
        { header: "Tanggal Lahir", accessorKey: "date_of_birth" },
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

      const filename = `staff_export_${dayjs().format("YYYY-MM-DD")}`;

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
          sheetName: "Staff Export",
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

  const handleDelete = (item: TStaff) => {
    setDeleteModal({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.item?.id) {
      const success = await deleteStaff(deleteModal.item.id);
      if (success) {
        const successMessage = useStaffStore.getState().success;
        showToast(successMessage ?? "Data berhasil dihapus!", "success", {
          duration: 3000,
        });
        loadStaffList({ page, limit, staff: staff ?? undefined, nim: nim ?? undefined });
      } else {
        const errorMessage = useStaffStore.getState().error;
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

  const handleRowClick = (row: Row<TStaff>) => {
    if (row.original.id) {
      navigate(ROUTES.staffDetail(String(row.original.id)));
    }
  };

  // Define columns for Staff table
  const columns: ColumnDef<TStaff>[] = [
    {
      accessorKey: "display_name",
      header: "Nama",
      size: 180,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.display_name ?? "-"}</span>
      ),
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
      cell: ({ row: { original } }) => {
        return original.email ? (
          <span>{original.email}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.phone ? (
          <span>{original.phone}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "nim",
      header: "NIM",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.nim ? (
          <span className="font-mono text-sm">{original.nim}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "total_logbook",
      header: "Logbook",
      size: 100,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.total_logbook ?? 0}</span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 350 : 180,
      cell: ({ row }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (row.original.id) {
            navigate(ROUTES.staffDetail(String(row.original.id)));
          }
        };
        const handleChangePassword = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (row.original.id) {
            navigate(ROUTES.staffChangePassword(String(row.original.id)));
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
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <icons.Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChangePassword}
              className="bg-yellow-500 text-white hover:bg-yellow-600"
            >
              <icons.Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Password</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className="bg-red-600 text-white hover:bg-red-700"
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
        total={staffData.pagination.total}
        isComplete={isExportComplete}
        onCancel={handleCancelExport}
        onOk={handleOkExport}
      />

      <Topbar
        breadcrumbs={[{ label: "Staff", to: ROUTES.staff }]}
        searchPlaceholder="Cari staff..."
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
              data={staffData.list}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: staffData.pagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data staff"
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
            Apakah Anda yakin ingin menghapus data{" "}
            <span className="font-semibold">
              {deleteModal.item?.display_name}
            </span>
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