import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { BaseTable } from "@/components/basetable/BaseTable";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useState, useEffect } from "react";
import { ConfirmationModal } from "@/components/confirmationModal";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import "dayjs/locale/id";
import { showToast } from "@/utils/toast";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useHospitalStore } from "@/store/hospitalStore";
import { THospital } from "@/types/hospital";

export default function HospitalListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const navigate = useNavigate();

  const { hospitalData, isLoading, loadHospitalList, deleteHospital, reset } =
    useHospitalStore();

  // ========== URL PARAMS (using useUrlParams hook) ==========
  const {
    page,
    limit,
    search,
    debouncedSearch,
    setLimit,
    setSearch,
  } = useUrlParams({
    defaultPage: 1,
    defaultLimit: DEFAULT_PAGE_SIZE,
    filterKeys: [],
    searchDebounceMs: 500,
  });

  const handleSearchChange = (query: string) => {
    setSearch(query);
  };

  const handlePaginationChange = (_pageIndex: number, pageSize: number) => {
    setLimit(pageSize, false);
  };

  // ========== DATA FETCHING ==========

  useEffect(() => {
    loadHospitalList({
      page,
      limit,
      search: debouncedSearch || undefined,
    });
  }, [page, limit, debouncedSearch, loadHospitalList]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item: THospital | null;
  }>({ open: false, item: null });

  const handleCreate = () => {
    navigate(ROUTES.hospitalCreate);
  };

  const handleDelete = (item: THospital) => {
    setDeleteModal({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.item?.id) {
      const success = await deleteHospital(deleteModal.item.id);
      if (success) {
        const successMessage = useHospitalStore.getState().success;
        showToast(successMessage ?? "Data berhasil dihapus!", "success", {
          duration: 3000,
        });
        // Re-fetch to get fresh data with correct pagination
        loadHospitalList({
          page,
          limit,
          search: debouncedSearch || undefined,
        });
      } else {
        const errorMessage = useHospitalStore.getState().error;
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

  const handleRowClick = (row: Row<THospital>) => {
    if (row.original.id) {
      navigate(ROUTES.hospitalDetail(String(row.original.id)));
    }
  };

  // Define columns for Hospital table
  const columns: ColumnDef<THospital>[] = [
    {
      accessorKey: "code",
      header: "Code",
      size: 120,
      cell: ({ row: { original } }) => original.code ?? "-",
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 180,
      cell: ({ row: { original } }) => original.name ?? "-",
    },
        {
      accessorKey: "address",
      header: "Address",
      size: 200,
      cell: ({ row: { original } }) => original.address ?? "-",
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 180 : 120,
      cell: ({ row }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (row.original.id) {
            navigate(ROUTES.hospitalDetail(String(row.original.id)));
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
      <Topbar
        breadcrumbs={[{ label: "Rumah Sakit", to: ROUTES.hospital }]}
        searchPlaceholder="Cari rumah sakit..."
        onCreate={handleCreate}
        onSearch={handleSearchChange}
        initialSearchValue={search}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={hospitalData.list}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: hospitalData.pagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data rumah sakit"
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
            Apakah Anda yakin ingin menghapus data rumah sakit{" "}
            <span className="font-semibold">
              {deleteModal.item?.name}
            </span>{" "}
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
