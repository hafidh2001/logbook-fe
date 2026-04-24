import { useEffect } from "react";
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
import { ConfirmationModal } from "@/components/confirmationModal";
import { usePpdsStore } from "@/store/ppdsStore";
import usePagination from "@/hooks/usePagination";
import useFilter from "@/hooks/useFilter";
import useModal from "@/hooks/useModal";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import { showToast } from "@/utils/toast";

export default function PpdsListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const navigate = useNavigate();

  const { ppdsData, isLoading, loadPpdsList, deletePpds, reset } =
    usePpdsStore();

  // Pagination - page is always read from URL
  const { page, setPage, limit, setLimit, searchParams } = usePagination({
    defaultPage: 1,
    defaultLimit: DEFAULT_PAGE_SIZE,
  });

  // Filter hook
  const { filterParams, handleFilterSearch, handleFilterReset } = useFilter<
    Omit<IPpdsListParams, "id_client" | "page" | "limit">
  >({
    fields: [{ key: "ppds" }, { key: "stase" }, { key: "nim" }],
    onFilterChange: () => setPage(1),
  });

  useEffect(() => {
    // Runs when URL or filter changes
    loadPpdsList({
      page,
      limit,
      ...filterParams,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filterParams]);

  useEffect(() => {
    // IMPORTANT: This reset() MUST be called on unmount to clean up the store state.
    // This ensures each page starts with a clean default state and must fetch
    return () => {
      reset();
    };
  }, [reset]);

  const handleCreate = () => {
    navigate(ROUTES.ppdsCreate);
  };

  const handleExport = () => {
    // TODO: Implement export
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search
    console.log("Search:", query);
  };

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPage(pageIndex + 1);
    setLimit(pageSize);
  };

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
              loadPpdsList({ page, limit, ...filterParams });
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
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDelete();
                }}
                className="bg-red-600 text-white hover:bg-red-700"
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
      <Topbar
        breadcrumbs={[{ label: "PPDS", to: ROUTES.ppds }]}
        searchPlaceholder="Cari PPDS..."
        onCreate={handleCreate}
        onExport={handleExport}
        onSearch={handleSearch}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          <Filter onSearch={handleFilterSearch} onReset={handleFilterReset} />

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
