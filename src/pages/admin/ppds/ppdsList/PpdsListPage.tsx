import { useEffect } from "react";
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
import { useState } from "react";
import { ConfirmationModal } from "@/components/confirmationModal";
import { usePpdsStore } from "@/store/ppdsStore";

export default function PpdsListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const navigate = useNavigate();

  const {
    ppdsList,
    isLoading,
    loadPpdsList,
    deletePpds,
    reset,
  } = usePpdsStore();

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item: TPpds | null;
  }>({ open: false, item: null });

  useEffect(() => {
    loadPpdsList();
    return () => {
      reset();
    };
  }, [loadPpdsList, reset]);

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

  const handleFilterSearch = (data: Record<string, unknown>) => {
    console.log("Filter search:", data);
  };

  const handleFilterReset = () => {
    console.log("Filter reset");
  };

  const handleRowClick = (row: Row<TPpds>) => {
    navigate(ROUTES.ppdsDetail(String(row.original.id)));
  };

  const handleDelete = (item: TPpds) => {
    setDeleteModal({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.item) {
      await deletePpds(String(deleteModal.item.id));
    }
    setDeleteModal({ open: false, item: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, item: null });
  };

  // Define columns for PPDS table
  const columns: ColumnDef<TPpds>[] = [
    {
      accessorKey: "displayName",
      header: "Nama",
      size: 180,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.displayName ?? "-"}</span>
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
      cell: ({ row: { original } }) => original.email ?? "-",
    },
    {
      accessorKey: "nim",
      header: "NIM",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="font-mono text-sm">{original.nim ?? "-"}</span>
      ),
    },
    {
      accessorKey: "stage",
      header: "Stage",
      size: 130,
      cell: ({ row: { original } }) => {
        return original.stage ? (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium whitespace-nowrap">
            {original.stage}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        );
      },
    },
    {
      accessorKey: "logbook",
      header: "Logbook",
      size: 100,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.logbook ?? "-"}</span>
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: "Tanggal Lahir",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.dateOfBirth ? (
          <span className="whitespace-nowrap">
            {dayjs(original.dateOfBirth).locale("id").format("DD MMMM YYYY")}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 350 : 180,
      cell: ({ row: { original } }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          navigate(ROUTES.ppdsDetail(String(original.id)));
        };
        const handleChangePassword = (e: React.MouseEvent) => {
          e.stopPropagation();
          navigate(ROUTES.ppdsChangePassword(String(original.id)));
        };
        const handleDeleteClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          handleDelete(original);
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
      <Topbar
        breadcrumbs={[{ label: "PPDS", to: ROUTES.ppds }]}
        searchPlaceholder="Cari PPDS..."
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
              data={ppdsList}
              columns={columns}
              isShowNumbering
              isLoading={isLoading}
              pagination={{
                enabled: true,
                initialPageIndex: 0,
                initialPageSize: 10,
              }}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data PPDS"
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isShown={deleteModal.open}
        toggle={(open) => setDeleteModal({ open: open ?? !deleteModal.open, item: deleteModal.item })}
        title="Hapus Data"
        description={
          <>
            Apakah Anda yakin ingin menghapus data{" "}
            <span className="font-semibold">{deleteModal.item?.displayName}</span>?
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
