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
import { useState, useEffect } from "react";
import { ConfirmationModal } from "@/components/confirmationModal";
import type { TStaseListItem } from "@/types/stase";
import usePagination from "@/hooks/usePagination";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import useFilter from "@/hooks/useFilter";
import dayjs from "dayjs";
import { showToast } from "@/utils/toast";

export default function StaseListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const navigate = useNavigate();

  const {
    staseData,
    isLoading,
    loadStaseList,
    deleteStase,
    reset,
  } = useStaseStore();

  // Pagination - page is always read from URL
  const { page, setPage, limit, setLimit, searchParams } = usePagination({
    defaultPage: 1,
    defaultLimit: DEFAULT_PAGE_SIZE,
  });

  // Filter hook
  const { filterParams, handleFilterSearch, handleFilterReset } = useFilter<{
    id_ppds?: number | null;
    id_stase?: number | null;
    start_date?: string;
    end_date?: string;
  }>({
    fields: [
      { key: "id_ppds" },
      { key: "id_stase" },
      { key: "start_date" },
      { key: "end_date" },
    ],
    onFilterChange: () => setPage(1),
  });

  useEffect(() => {
    loadStaseList({
      page,
      limit,
      id_ppds: filterParams.id_ppds ?? undefined,
      id_stase: filterParams.id_stase ?? undefined,
      start_date: filterParams.start_date ?? undefined,
      end_date: filterParams.end_date ?? undefined,
    });
  }, [searchParams, filterParams, loadStaseList]);

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

  const handleExport = () => {
    // TODO: Implement export
  };

  const handleSearch = (query: string) => {
    console.log("Search:", query);
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
          id_ppds: filterParams.id_ppds ?? undefined,
          id_stase: filterParams.id_stase ?? undefined,
          start_date: filterParams.start_date ?? undefined,
          end_date: filterParams.end_date ?? undefined,
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

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPage(pageIndex + 1);
    setLimit(pageSize);
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
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium whitespace-nowrap">
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
            {dayjs(original.date).locale("id").format("DD MMM YYYY")}
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
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <icons.Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
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
      <Topbar
        breadcrumbs={[{ label: "Stase", to: ROUTES.stase }]}
        searchPlaceholder="Cari stase..."
        onCreate={handleCreate}
        onExport={handleExport}
        onSearch={handleSearch}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Filter Section */}
          <Filter onSearch={handleFilterSearch} onReset={handleFilterReset} />

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
            <span className="font-semibold">{deleteModal.item?.stase_name}</span>{" "}
            untuk user{" "}
            <span className="font-semibold">{deleteModal.item?.user_name}</span>?
            Tindakan ini tidak dapat dibatalkan.
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